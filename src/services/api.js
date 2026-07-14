// API Client for ClientFlow CRM - Connected to the Node.js/Express Backend

export const initDB = () => {
  // Database initialization is managed on the backend server,
  // which seeds db.json dynamically on start.
  console.log("ClientFlow CRM database client initialized.");
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `HTTP request failed: status ${response.status}`);
  }
  return response.json();
};

export const api = {
  logActivity: async (message, type = "info") => {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type })
    });
    return handleResponse(res);
  },

  getActivities: async () => {
    const res = await fetch("/api/activities");
    return handleResponse(res);
  },

  // LEADS
  getLeads: async () => {
    const res = await fetch("/api/leads");
    return handleResponse(res);
  },

  saveLead: async (lead) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
    return handleResponse(res);
  },

  deleteLead: async (id) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  convertLeadToCustomer: async (leadId, authorName) => {
    const res = await fetch(`/api/leads/${leadId}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName })
    });
    return handleResponse(res);
  },

  // CUSTOMERS
  getCustomers: async () => {
    const res = await fetch("/api/customers");
    return handleResponse(res);
  },

  saveCustomer: async (customer) => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer)
    });
    return handleResponse(res);
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  addCustomerNote: async (customerId, text, author) => {
    const res = await fetch(`/api/customers/${customerId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author })
    });
    return handleResponse(res);
  },

  logCustomerCommunication: async (customerId, type, summary) => {
    const res = await fetch(`/api/customers/${customerId}/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, summary })
    });
    return handleResponse(res);
  },

  addCustomerSupportRequest: async (customerId, title, description, priority) => {
    const res = await fetch(`/api/customers/${customerId}/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority })
    });
    return handleResponse(res);
  },

  resolveSupportTicket: async (customerId, ticketId) => {
    const res = await fetch(`/api/customers/${customerId}/support/${ticketId}/resolve`, {
      method: "POST"
    });
    return handleResponse(res);
  },

  // DEALS
  getDeals: async () => {
    const res = await fetch("/api/deals");
    return handleResponse(res);
  },

  saveDeal: async (deal) => {
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deal)
    });
    return handleResponse(res);
  },

  updateDealStage: async (dealId, stage, userName) => {
    const res = await fetch(`/api/deals/${dealId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, userName })
    });
    return handleResponse(res);
  },

  deleteDeal: async (id) => {
    const res = await fetch(`/api/deals/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  // FEEDBACK
  getFeedback: async () => {
    const res = await fetch("/api/feedback");
    return handleResponse(res);
  },

  saveFeedback: async (ticket) => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket)
    });
    return handleResponse(res);
  },

  deleteFeedback: async (id) => {
    const res = await fetch(`/api/feedback/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  convertFeedbackToIdea: async (feedbackId, ideaPayload) => {
    const res = await fetch(`/api/feedback/${feedbackId}/convert-idea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ideaPayload)
    });
    return handleResponse(res);
  },

  convertFeedbackToTask: async (feedbackId, taskPayload) => {
    const res = await fetch(`/api/feedback/${feedbackId}/convert-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskPayload)
    });
    return handleResponse(res);
  },

  // IDEAS
  getIdeas: async () => {
    const res = await fetch("/api/ideas");
    return handleResponse(res);
  },

  saveIdea: async (idea) => {
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idea)
    });
    return handleResponse(res);
  },

  deleteIdea: async (id) => {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  upvoteIdea: async (ideaId) => {
    const res = await fetch(`/api/ideas/${ideaId}/upvote`, {
      method: "POST"
    });
    return handleResponse(res);
  },

  // TASKS
  getTasks: async () => {
    const res = await fetch("/api/tasks");
    return handleResponse(res);
  },

  saveTask: async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
    return handleResponse(res);
  },

  toggleTaskCompletion: async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}/toggle`, {
      method: "PATCH"
    });
    return handleResponse(res);
  },

  deleteTask: async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE"
    });
    return handleResponse(res);
  },

  // AI CHAT
  insightsChat: async (message, userRole) => {
    const res = await fetch("/api/insights/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userRole })
    });
    return handleResponse(res);
  }
};
