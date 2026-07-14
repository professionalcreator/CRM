// API Client for ClientFlow CRM - Connected to the Backend with LocalStorage Failover Fallback
import {
  initialLeads,
  initialCustomers,
  initialDeals,
  initialIdeas,
  initialFeedback,
  initialTasks,
  initialActivities
} from "../data/initialData";

const KEYS = {
  LEADS: "cf_leads",
  CUSTOMERS: "cf_customers",
  DEALS: "cf_deals",
  IDEAS: "cf_ideas",
  FEEDBACK: "cf_feedback",
  TASKS: "cf_tasks",
  ACTIVITIES: "cf_activities"
};

export const initDB = () => {
  // Try initializing LocalStorage in case we operate in fallback mode
  if (typeof window !== "undefined") {
    if (!localStorage.getItem(KEYS.LEADS)) localStorage.setItem(KEYS.LEADS, JSON.stringify(initialLeads));
    if (!localStorage.getItem(KEYS.CUSTOMERS)) localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    if (!localStorage.getItem(KEYS.DEALS)) localStorage.setItem(KEYS.DEALS, JSON.stringify(initialDeals));
    if (!localStorage.getItem(KEYS.IDEAS)) localStorage.setItem(KEYS.IDEAS, JSON.stringify(initialIdeas));
    if (!localStorage.getItem(KEYS.FEEDBACK)) localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(initialFeedback));
    if (!localStorage.getItem(KEYS.TASKS)) localStorage.setItem(KEYS.TASKS, JSON.stringify(initialTasks));
    if (!localStorage.getItem(KEYS.ACTIVITIES)) localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(initialActivities));
  }
};

const getLS = (key) => {
  initDB();
  return JSON.parse(localStorage.getItem(key)) || [];
};

const setLS = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const logLSActivity = (message, type = "info") => {
  const activities = getLS(KEYS.ACTIVITIES);
  activities.unshift({
    id: `act-${Date.now()}`,
    message,
    timestamp: new Date().toISOString(),
    type
  });
  setLS(KEYS.ACTIVITIES, activities.slice(0, 50));
};

// Helper to determine if we should fall back to LocalStorage
// We check if fetch throws a connection error or returns a 404 (indicating no API route exists on the host)
let useFallback = false;

const request = async (url, options = {}) => {
  if (useFallback) {
    throw new Error("Using LocalStorage fallback mode");
  }

  try {
    const res = await fetch(url, options);
    // If we get a 404 or similar, it means the API server is not handling this endpoint (static host)
    if (res.status === 404) {
      console.warn("API server returned 404. Falling back to LocalStorage mode.");
      useFallback = true;
      throw new Error("API not found");
    }
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // If it's a network fetch failure (e.g. server is down/not running)
    if (err.message === "Failed to fetch" || err.message === "API not found") {
      console.warn("Express backend offline. Falling back to LocalStorage mode.");
      useFallback = true;
    }
    throw err;
  }
};

export const api = {
  logActivity: async (message, type = "info") => {
    try {
      return await request("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type })
      });
    } catch (err) {
      logLSActivity(message, type);
      return getLS(KEYS.ACTIVITIES);
    }
  },

  getActivities: async () => {
    try {
      return await request("/api/activities");
    } catch (err) {
      return getLS(KEYS.ACTIVITIES);
    }
  },

  // LEADS
  getLeads: async () => {
    try {
      return await request("/api/leads");
    } catch (err) {
      return getLS(KEYS.LEADS);
    }
  },

  saveLead: async (lead) => {
    try {
      return await request("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
    } catch (err) {
      const leads = getLS(KEYS.LEADS);
      let updatedLead;
      let msg = "";

      if (lead.id) {
        const idx = leads.findIndex((l) => l.id === lead.id);
        if (idx !== -1) {
          leads[idx] = { ...leads[idx], ...lead };
          updatedLead = leads[idx];
          msg = `Updated lead profile for '${lead.name}' (${lead.company})`;
        }
      } else {
        updatedLead = {
          ...lead,
          id: `lead-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        leads.unshift(updatedLead);
        msg = `Captured new lead: '${lead.name}' at '${lead.company}' via ${lead.source}`;
      }
      setLS(KEYS.LEADS, leads);
      logLSActivity(msg, "lead_update");
      return { leads, updatedLead };
    }
  },

  deleteLead: async (id) => {
    try {
      return await request(`/api/leads/${id}`, { method: "DELETE" });
    } catch (err) {
      const leads = getLS(KEYS.LEADS);
      const target = leads.find((l) => l.id === id);
      const filtered = leads.filter((l) => l.id !== id);
      setLS(KEYS.LEADS, filtered);
      if (target) {
        logLSActivity(`Removed lead record for '${target.name}'`, "lead_delete");
      }
      return filtered;
    }
  },

  convertLeadToCustomer: async (leadId, authorName) => {
    try {
      return await request(`/api/leads/${leadId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName })
      });
    } catch (err) {
      const leads = getLS(KEYS.LEADS);
      const leadIdx = leads.findIndex((l) => l.id === leadId);
      if (leadIdx === -1) throw new Error("Lead not found");

      const lead = leads[leadIdx];
      const customers = getLS(KEYS.CUSTOMERS);
      const newCustomer = {
        id: `cust-${Date.now()}`,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        tags: ["Converted", lead.interest || "Enterprise License"],
        purchaseHistory: [],
        notes: [
          {
            id: `n-${Date.now()}`,
            text: `Customer profile created. Converted from lead generated via ${lead.source}.`,
            date: new Date().toISOString(),
            author: authorName
          }
        ],
        supportRequests: [],
        communicationTimeline: [
          {
            id: `timeline-${Date.now()}`,
            type: "Call",
            summary: `Lead converted to customer status. Lifecycle progressed.`,
            date: new Date().toISOString().split("T")[0]
          }
        ],
        createdAt: new Date().toISOString()
      };

      customers.unshift(newCustomer);
      setLS(KEYS.CUSTOMERS, customers);

      leads.splice(leadIdx, 1);
      setLS(KEYS.LEADS, leads);

      logLSActivity(`Converted lead '${lead.name}' into verified Customer profile!`, "lead_convert");
      return { leads, customers, newCustomer };
    }
  },

  // CUSTOMERS
  getCustomers: async () => {
    try {
      return await request("/api/customers");
    } catch (err) {
      return getLS(KEYS.CUSTOMERS);
    }
  },

  saveCustomer: async (customer) => {
    try {
      return await request("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      let updatedCustomer;
      let msg = "";

      if (customer.id) {
        const idx = customers.findIndex((c) => c.id === customer.id);
        if (idx !== -1) {
          customers[idx] = { ...customers[idx], ...customer };
          updatedCustomer = customers[idx];
          msg = `Updated customer details for '${customer.name}' (${customer.company})`;
        }
      } else {
        updatedCustomer = {
          ...customer,
          id: `cust-${Date.now()}`,
          tags: customer.tags || [],
          purchaseHistory: customer.purchaseHistory || [],
          notes: customer.notes || [],
          supportRequests: customer.supportRequests || [],
          communicationTimeline: customer.communicationTimeline || [],
          createdAt: new Date().toISOString()
        };
        customers.unshift(updatedCustomer);
        msg = `Registered new customer profile: '${customer.name}' at '${customer.company}'`;
      }

      setLS(KEYS.CUSTOMERS, customers);
      logLSActivity(msg, "customer_update");
      return { customers, updatedCustomer };
    }
  },

  deleteCustomer: async (id) => {
    try {
      return await request(`/api/customers/${id}`, { method: "DELETE" });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      const target = customers.find((c) => c.id === id);
      const filtered = customers.filter((c) => c.id !== id);
      setLS(KEYS.CUSTOMERS, filtered);
      if (target) {
        logLSActivity(`Removed customer account directory for '${target.name}'`, "customer_delete");
      }
      return filtered;
    }
  },

  addCustomerNote: async (customerId, text, author) => {
    try {
      return await request(`/api/customers/${customerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, author })
      });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      const idx = customers.findIndex((c) => c.id === customerId);
      if (idx === -1) throw new Error("Customer not found");

      customers[idx].notes = customers[idx].notes || [];
      customers[idx].notes.unshift({
        id: `n-${Date.now()}`,
        text,
        date: new Date().toISOString(),
        author
      });
      setLS(KEYS.CUSTOMERS, customers);
      logLSActivity(`Logged note comment on customer account '${customers[idx].name}'`, "note_add");
      return customers;
    }
  },

  logCustomerCommunication: async (customerId, type, summary) => {
    try {
      return await request(`/api/customers/${customerId}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, summary })
      });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      const idx = customers.findIndex((c) => c.id === customerId);
      if (idx === -1) throw new Error("Customer not found");

      customers[idx].communicationTimeline = customers[idx].communicationTimeline || [];
      customers[idx].communicationTimeline.unshift({
        id: `timeline-${Date.now()}`,
        type,
        summary,
        date: new Date().toISOString().split("T")[0]
      });
      setLS(KEYS.CUSTOMERS, customers);
      logLSActivity(`Logged ${type} outreach event for client '${customers[idx].name}'`, "customer_contact");
      return customers;
    }
  },

  addCustomerSupportRequest: async (customerId, title, description, priority) => {
    try {
      return await request(`/api/customers/${customerId}/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority })
      });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      const idx = customers.findIndex((c) => c.id === customerId);
      if (idx === -1) throw new Error("Customer not found");

      customers[idx].supportRequests = customers[idx].supportRequests || [];
      customers[idx].supportRequests.unshift({
        id: `s-${Date.now()}`,
        title,
        description,
        priority,
        status: "Open",
        date: new Date().toISOString().split("T")[0]
      });
      setLS(KEYS.CUSTOMERS, customers);
      logLSActivity(`Filed support ticket '${title}' for customer '${customers[idx].name}'`, "support_file");
      return customers;
    }
  },

  resolveSupportTicket: async (customerId, ticketId) => {
    try {
      return await request(`/api/customers/${customerId}/support/${ticketId}/resolve`, { method: "POST" });
    } catch (err) {
      const customers = getLS(KEYS.CUSTOMERS);
      const idx = customers.findIndex((c) => c.id === customerId);
      if (idx === -1) throw new Error("Customer not found");

      const ticketIdx = customers[idx].supportRequests?.findIndex(s => s.id === ticketId);
      if (ticketIdx === -1 || ticketIdx === undefined) throw new Error("Ticket not found");

      customers[idx].supportRequests[ticketIdx].status = "Resolved";
      setLS(KEYS.CUSTOMERS, customers);
      logLSActivity(`Resolved support ticket '${customers[idx].supportRequests[ticketIdx].title}'`, "support_resolve");
      return customers;
    }
  },

  // DEALS
  getDeals: async () => {
    try {
      return await request("/api/deals");
    } catch (err) {
      return getLS(KEYS.DEALS);
    }
  },

  saveDeal: async (deal) => {
    try {
      return await request("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deal)
      });
    } catch (err) {
      const deals = getLS(KEYS.DEALS);
      let updatedDeal;
      let msg = "";

      if (deal.id) {
        const idx = deals.findIndex((d) => d.id === deal.id);
        if (idx !== -1) {
          deals[idx] = { ...deals[idx], ...deal };
          updatedDeal = deals[idx];
          msg = `Updated pipeline details for deal '${deal.name}' ($${Number(deal.amount).toLocaleString()})`;
        }
      } else {
        updatedDeal = {
          ...deal,
          id: `deal-${Date.now()}`,
          amount: Number(deal.amount) || 0,
          createdAt: new Date().toISOString()
        };
        deals.unshift(updatedDeal);
        msg = `Created new sales pipeline contract: '${deal.name}' worth $${Number(deal.amount).toLocaleString()}`;
      }

      setLS(KEYS.DEALS, deals);
      logLSActivity(msg, "deal_update");
      return { deals, updatedDeal };
    }
  },

  updateDealStage: async (dealId, stage, userName) => {
    try {
      return await request(`/api/deals/${dealId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, userName })
      });
    } catch (err) {
      const deals = getLS(KEYS.DEALS);
      const idx = deals.findIndex((d) => d.id === dealId);
      if (idx === -1) throw new Error("Deal not found");

      const oldStage = deals[idx].stage;
      deals[idx].stage = stage;
      setLS(KEYS.DEALS, deals);

      if (oldStage !== stage) {
        logLSActivity(`${userName} advanced deal '${deals[idx].name}' (${deals[idx].company}) to stage '${stage}'`, "deal_stage");
      }
      return deals;
    }
  },

  deleteDeal: async (id) => {
    try {
      return await request(`/api/deals/${id}`, { method: "DELETE" });
    } catch (err) {
      const deals = getLS(KEYS.DEALS);
      const target = deals.find((d) => d.id === id);
      const filtered = deals.filter((d) => d.id !== id);
      setLS(KEYS.DEALS, filtered);
      if (target) {
        logLSActivity(`Removed deal contract '${target.name}'`, "deal_delete");
      }
      return filtered;
    }
  },

  // FEEDBACK
  getFeedback: async () => {
    try {
      return await request("/api/feedback");
    } catch (err) {
      return getLS(KEYS.FEEDBACK);
    }
  },

  saveFeedback: async (ticket) => {
    try {
      return await request("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket)
      });
    } catch (err) {
      const feedback = getLS(KEYS.FEEDBACK);
      let updatedFeedback;

      if (ticket.id) {
        const idx = feedback.findIndex((f) => f.id === ticket.id);
        if (idx !== -1) {
          feedback[idx] = { ...feedback[idx], ...ticket };
          updatedFeedback = feedback[idx];
        }
      } else {
        updatedFeedback = {
          ...ticket,
          id: `feed-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
          linkedIdeaId: null,
          linkedTaskId: null
        };
        feedback.unshift(updatedFeedback);
        logLSActivity(`Logged client feedback ticket from '${ticket.customerName}' (${ticket.company})`, "feedback_log");
      }
      setLS(KEYS.FEEDBACK, feedback);
      return { feedback, updatedFeedback };
    }
  },

  deleteFeedback: async (id) => {
    try {
      return await request(`/api/feedback/${id}`, { method: "DELETE" });
    } catch (err) {
      const feedback = getLS(KEYS.FEEDBACK);
      const filtered = feedback.filter((f) => f.id !== id);
      setLS(KEYS.FEEDBACK, filtered);
      return filtered;
    }
  },

  convertFeedbackToIdea: async (feedbackId, ideaPayload) => {
    try {
      return await request(`/api/feedback/${feedbackId}/convert-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ideaPayload)
      });
    } catch (err) {
      const feedback = getLS(KEYS.FEEDBACK);
      const feedIdx = feedback.findIndex(f => f.id === feedbackId);
      if (feedIdx === -1) throw new Error("Feedback not found");

      const ideas = getLS(KEYS.IDEAS);
      const newIdea = {
        ...ideaPayload,
        id: `idea-${Date.now()}`,
        votes: 1,
        connectedFeedback: [feedbackId],
        createdAt: new Date().toISOString()
      };
      ideas.unshift(newIdea);
      setLS(KEYS.IDEAS, ideas);

      feedback[feedIdx].status = "Converted to Idea";
      feedback[feedIdx].linkedIdeaId = newIdea.id;
      setLS(KEYS.FEEDBACK, feedback);

      logLSActivity(`Converted customer feedback from '${feedback[feedIdx].customerName}' into a product idea: '${newIdea.title}'`, "feedback_convert");
      return { feedback, ideas, newIdea };
    }
  },

  convertFeedbackToTask: async (feedbackId, taskPayload) => {
    try {
      return await request(`/api/feedback/${feedbackId}/convert-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload)
      });
    } catch (err) {
      const feedback = getLS(KEYS.FEEDBACK);
      const feedIdx = feedback.findIndex(f => f.id === feedbackId);
      if (feedIdx === -1) throw new Error("Feedback not found");

      const tasks = getLS(KEYS.TASKS);
      const newTask = {
        ...taskPayload,
        id: `task-${Date.now()}`,
        completed: false
      };
      tasks.unshift(newTask);
      setLS(KEYS.TASKS, tasks);

      feedback[feedIdx].status = "Converted to Task";
      feedback[feedIdx].linkedTaskId = newTask.id;
      setLS(KEYS.FEEDBACK, feedback);

      logLSActivity(`Created scheduled task following feedback from client '${feedback[feedIdx].customerName}'`, "feedback_convert");
      return { feedback, tasks, newTask };
    }
  },

  // IDEAS
  getIdeas: async () => {
    try {
      return await request("/api/ideas");
    } catch (err) {
      return getLS(KEYS.IDEAS);
    }
  },

  saveIdea: async (idea) => {
    try {
      return await request("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea)
      });
    } catch (err) {
      const ideas = getLS(KEYS.IDEAS);
      let updatedIdea;
      let msg = "";

      if (idea.id) {
        const idx = ideas.findIndex((i) => i.id === idea.id);
        if (idx !== -1) {
          ideas[idx] = { ...ideas[idx], ...idea };
          updatedIdea = ideas[idx];
          msg = `Updated product idea details for '${idea.title}'`;
        }
      } else {
        updatedIdea = {
          ...idea,
          id: `idea-${Date.now()}`,
          votes: idea.votes || 0,
          connectedFeedback: idea.connectedFeedback || [],
          createdAt: new Date().toISOString()
        };
        ideas.unshift(updatedIdea);
        msg = `Created product development proposal idea: '${idea.title}'`;
      }

      setLS(KEYS.IDEAS, ideas);
      logLSActivity(msg, "idea_update");
      return { ideas, updatedIdea };
    }
  },

  deleteIdea: async (id) => {
    try {
      return await request(`/api/ideas/${id}`, { method: "DELETE" });
    } catch (err) {
      const ideas = getLS(KEYS.IDEAS);
      const target = ideas.find((i) => i.id === id);
      const filtered = ideas.filter((i) => i.id !== id);
      setLS(KEYS.IDEAS, filtered);
      if (target) {
        logLSActivity(`Deleted product idea: '${target.title}'`, "idea_delete");
      }
      return filtered;
    }
  },

  upvoteIdea: async (ideaId) => {
    try {
      return await request(`/api/ideas/${ideaId}/upvote`, { method: "POST" });
    } catch (err) {
      const ideas = getLS(KEYS.IDEAS);
      const idx = ideas.findIndex(i => i.id === ideaId);
      if (idx !== -1) {
        ideas[idx].votes = (ideas[idx].votes || 0) + 1;
        setLS(KEYS.IDEAS, ideas);
        logLSActivity(`Upvoted product development idea proposal: '${ideas[idx].title}'`, "idea_vote");
      }
      return ideas;
    }
  },

  // TASKS
  getTasks: async () => {
    try {
      return await request("/api/tasks");
    } catch (err) {
      return getLS(KEYS.TASKS);
    }
  },

  saveTask: async (task) => {
    try {
      return await request("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
      });
    } catch (err) {
      const tasks = getLS(KEYS.TASKS);
      let updatedTask;

      if (task.id) {
        const idx = tasks.findIndex((t) => t.id === task.id);
        if (idx !== -1) {
          tasks[idx] = { ...tasks[idx], ...task };
          updatedTask = tasks[idx];
        }
      } else {
        updatedTask = {
          ...task,
          id: `task-${Date.now()}`,
          completed: false
        };
        tasks.unshift(updatedTask);
        logLSActivity(`Scheduled new follow-up reminder task: '${task.title}'`, "task_create");
      }

      setLS(KEYS.TASKS, tasks);
      return { tasks, updatedTask };
    }
  },

  toggleTaskCompletion: async (taskId) => {
    try {
      return await request(`/api/tasks/${taskId}/toggle`, { method: "PATCH" });
    } catch (err) {
      const tasks = getLS(KEYS.TASKS);
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx === -1) throw new Error("Task not found");

      const state = !tasks[idx].completed;
      tasks[idx].completed = state;
      setLS(KEYS.TASKS, tasks);

      logLSActivity(`Marked task '${tasks[idx].title}' as ${state ? "COMPLETED" : "INCOMPLETE"}`, "task_toggle");
      return tasks;
    }
  },

  deleteTask: async (id) => {
    try {
      return await request(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (err) {
      const tasks = getLS(KEYS.TASKS);
      const target = tasks.find(t => t.id === id);
      const filtered = tasks.filter((t) => t.id !== id);
      setLS(KEYS.TASKS, filtered);
      if (target) {
        logLSActivity(`Removed task reminder '${target.title}'`, "task_delete");
      }
      return filtered;
    }
  },

  // AI CHAT
  insightsChat: async (message, userRole) => {
    try {
      return await request("/api/insights/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userRole })
      });
    } catch (err) {
      // Local AI chatbot logic fallback
      const lower = message.toLowerCase();
      let aiText = "";

      const leads = getLS(KEYS.LEADS);
      const customers = getLS(KEYS.CUSTOMERS);
      const deals = getLS(KEYS.DEALS);
      const ideas = getLS(KEYS.IDEAS);
      const feedback = getLS(KEYS.FEEDBACK);
      const tasks = getLS(KEYS.TASKS);

      const atRiskCustomers = customers.map(cust => {
        let riskScore = 15;
        let reasons = [];
        const openTickets = cust.supportRequests?.filter(s => s.status === "Open") || [];
        openTickets.forEach(t => {
          if (t.priority === "Critical") { riskScore += 45; reasons.push(`Open Critical ticket: "${t.title}"`); }
          else if (t.priority === "High") { riskScore += 30; reasons.push(`Open High-priority ticket: "${t.title}"`); }
          else { riskScore += 15; reasons.push(`Open support ticket: "${t.title}"`); }
        });
        const textToScan = cust.notes?.map(n => n.text.toLowerCase()).join(" ") || "";
        if (textToScan.includes("complain") || textToScan.includes("unhappy") || textToScan.includes("frustrated")) {
          riskScore += 25; reasons.push("Negative note keywords detected");
        }
        return { ...cust, riskScore: Math.min(riskScore, 95), reasons };
      }).filter(c => c.riskScore > 20).sort((a, b) => b.riskScore - a.riskScore);

      const salesRecommendations = deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost")
        .map(deal => {
          let probability = 45;
          let highlights = [];
          if (deal.stage === "Proposal") { probability += 25; highlights.push("Proposal Sent"); }
          if (deal.stage === "Demo") { probability += 15; highlights.push("Product Demo complete"); }
          return { ...deal, probability: Math.min(probability, 90), highlights };
        }).sort((a, b) => b.probability - a.probability).slice(0, 3);

      if (lower.includes("risk") || lower.includes("leave") || lower.includes("churn")) {
        if (atRiskCustomers.length === 0) {
          aiText = "Good news! No customer accounts currently flag critical churn risk parameters.";
        } else {
          aiText = `I identified **${atRiskCustomers.length} accounts** showing risk factors:\n\n` +
            atRiskCustomers.map(c => `- **${c.name}** (${c.company}): **${c.riskScore}% risk**. Reason: ${c.reasons.join(", ")}`).join("\n");
        }
      } else if (lower.includes("lead") || lower.includes("opportunity") || lower.includes("sales")) {
        aiText = `Top recommended deal pipelines to follow up immediately:\n\n` +
          salesRecommendations.map(r => `- **${r.name}** for **${r.company}** ($${r.amount.toLocaleString()}): **${r.probability}% close chance**.`).join("\n");
      } else if (lower.includes("task") || lower.includes("todo") || lower.includes("today")) {
        const pending = tasks.filter(t => !t.completed);
        if (pending.length === 0) {
          aiText = "All clear! You have no pending checklist tasks today.";
        } else {
          aiText = `You have **${pending.length} pending follow-up reminders**:\n\n` +
            pending.map(t => `- [ ] **${t.title}** (Due: ${t.dueDate}, Priority: ${t.priority})`).join("\n");
        }
      } else {
        aiText = `[Fallback Offline Mode] ClientFlow CRM Stats:\n- **${leads.length} Leads**\n- **${customers.length} Customers**\n- **${deals.length} Deals**\n- **${ideas.length} Roadmap Ideas**\n\nIs there a specific customer or deal pipeline you'd like me to analyze?`;
      }

      return { response: aiText };
    }
  }
};
