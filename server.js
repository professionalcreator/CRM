import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const app = express();
app.use(cors());
app.use(express.json());

// INITIAL SEED DATA
const initialLeads = [
  {
    id: "lead-1",
    name: "Arthur Pendragon",
    company: "Camelot Solutions",
    email: "arthur@camelotsolutions.com",
    phone: "+1 (555) 0180",
    source: "Referral",
    interest: "Enterprise License",
    owner: "Sarah Jenkins",
    status: "Lead",
    createdAt: "2026-07-02T10:00:00Z"
  },
  {
    id: "lead-2",
    name: "Bruce Wayne",
    company: "Wayne Enterprises",
    email: "bruce@waynecorp.com",
    phone: "+1 (555) 0127",
    source: "Website",
    interest: "Custom Consulting",
    owner: "David Vance",
    status: "Qualified",
    createdAt: "2026-07-06T14:30:00Z"
  },
  {
    id: "lead-3",
    name: "Clara Oswald",
    company: "TARDIS Logistics",
    email: "clara@tardislogistics.org",
    phone: "+1 (555) 0199",
    source: "Cold Outreach",
    interest: "Standard Plan",
    owner: "Sarah Jenkins",
    status: "Contacted",
    createdAt: "2026-07-11T09:15:00Z"
  },
  {
    id: "lead-4",
    name: "Donald Blake",
    company: "Mjolnir Medicals",
    email: "donald@mjolnirmedical.com",
    phone: "+1 (555) 0133",
    source: "Event",
    interest: "Enterprise License",
    owner: "David Vance",
    status: "Qualified",
    createdAt: "2026-06-25T11:00:00Z"
  },
  {
    id: "lead-5",
    name: "Emma Frost",
    company: "Hellfire Financial",
    email: "emma@hellfirefinancial.com",
    phone: "+1 (555) 0147",
    source: "Ads",
    interest: "Enterprise License",
    owner: "David Vance",
    status: "Lead",
    createdAt: "2026-07-13T16:45:00Z"
  }
];

const initialCustomers = [
  {
    id: "cust-1",
    name: "Clark Kent",
    company: "Daily Planet Publications",
    email: "clark.kent@dailyplanet.com",
    phone: "+1 (555) 0110",
    tags: ["Enterprise", "High Value", "Publishing"],
    purchaseHistory: [
      { id: "p-1", product: "Enterprise License (Annual)", amount: 12000, date: "2026-05-10" },
      { id: "p-2", product: "Consulting Package", amount: 3500, date: "2026-06-15" }
    ],
    notes: [
      { id: "n-1", text: "Client mentioned they need custom PDF layout formatting exports.", date: "2026-07-02T09:00:00Z", author: "Sarah Jenkins" },
      { id: "n-2", text: "Discussed renewal cycle. Very satisfied with our platform performance.", date: "2026-07-12T11:30:00Z", author: "David Vance" }
    ],
    supportRequests: [
      { id: "s-1", title: "API access token key error", description: "Getting 401 when fetching analytical endpoints from their developer client.", priority: "High", status: "Resolved", date: "2026-06-20" },
      { id: "s-2", title: "Export button UI error in Safari browser", description: "Clicking export layout hangs on Safari v17.", priority: "Medium", status: "Open", date: "2026-07-13" }
    ],
    communicationTimeline: [
      { id: "timeline-1", type: "Email", summary: "Sent API developer token refresh guides.", date: "2026-06-20" },
      { id: "timeline-2", type: "Call", summary: "Followed up on Safari browser UI exports error. Informed tech team.", date: "2026-07-13" }
    ],
    createdAt: "2026-05-10T08:00:00Z"
  },
  {
    id: "cust-2",
    name: "Selina Kyle",
    company: "Gotham Antiques",
    email: "selina@gothamantiques.net",
    phone: "+1 (555) 0152",
    tags: ["B2B Partner", "Retail"],
    purchaseHistory: [
      { id: "p-3", product: "Growth Plan (Monthly)", amount: 150, date: "2026-06-01" },
      { id: "p-4", product: "Growth Plan (Monthly)", amount: 150, date: "2026-07-01" }
    ],
    notes: [
      { id: "n-3", text: "Customer complained about dark mode availability. Demands a clean dark UI.", date: "2026-07-05T14:00:00Z", author: "Sarah Jenkins" }
    ],
    supportRequests: [
      { id: "s-3", title: "Antique item image upload size limit", description: "Wants to upload image files up to 25MB for antique catalogs.", priority: "Low", status: "Open", date: "2026-07-10" }
    ],
    communicationTimeline: [
      { id: "timeline-3", type: "Call", summary: "Discussed custom image upload sizing specifications.", date: "2026-07-10" }
    ],
    createdAt: "2026-06-01T12:00:00Z"
  },
  {
    id: "cust-3",
    name: "Hal Jordan",
    company: "Emerald Aviation",
    email: "hal@emeraldaviation.com",
    phone: "+1 (555) 0166",
    tags: ["Aviation", "SME"],
    purchaseHistory: [
      { id: "p-5", product: "Standard Plan (Annual)", amount: 2400, date: "2026-04-12" }
    ],
    notes: [
      { id: "n-4", text: "Wants to integrate third-party flight tracker API dashboard.", date: "2026-07-03T11:00:00Z", author: "David Vance" }
    ],
    supportRequests: [],
    communicationTimeline: [
      { id: "timeline-4", type: "Meeting", summary: "Aviation pipeline API integration review.", date: "2026-07-03" }
    ],
    createdAt: "2026-04-12T10:00:00Z"
  },
  {
    id: "cust-4",
    name: "Barry Allen",
    company: "Keystone Labs",
    email: "barry.allen@keystonelabs.gov",
    phone: "+1 (555) 0173",
    tags: ["Enterprise", "Research"],
    purchaseHistory: [
      { id: "p-6", product: "Enterprise License (Annual)", amount: 15000, date: "2026-06-25" }
    ],
    notes: [
      { id: "n-5", text: "Demands high speed dashboard exports. Very impatient.", date: "2026-07-01T08:30:00Z", author: "Sarah Jenkins" }
    ],
    supportRequests: [
      { id: "s-4", title: "Report generation fails on high volumes", description: "Database timeout when exporting monthly sensor statistics.", priority: "Critical", status: "Open", date: "2026-07-12" }
    ],
    communicationTimeline: [
      { id: "timeline-5", type: "Email", summary: "Technical support escalation notification sent.", date: "2026-07-12" }
    ],
    createdAt: "2026-06-25T09:00:00Z"
  },
  {
    id: "cust-5",
    name: "Diana Prince",
    company: "Themyscira Antiques",
    email: "diana@themyscira.org",
    phone: "+1 (555) 0144",
    tags: ["Loyal", "Global"],
    purchaseHistory: [
      { id: "p-7", product: "Standard Plan (Annual)", amount: 2400, date: "2026-07-10" }
    ],
    notes: [
      { id: "n-6", text: "Onboarding completed smoothly. User seats assigned.", date: "2026-07-11T16:00:00Z", author: "Sarah Jenkins" }
    ],
    supportRequests: [],
    communicationTimeline: [
      { id: "timeline-6", type: "Call", summary: "Onboarding check-in and feature overview.", date: "2026-07-11" }
    ],
    createdAt: "2026-07-10T11:00:00Z"
  }
];

const initialDeals = [
  {
    id: "deal-1",
    name: "Enterprise Software License",
    company: "Camelot Solutions",
    amount: 55000,
    stage: "Proposal",
    priority: "High",
    closeDate: "2026-08-15",
    contactName: "Arthur Pendragon",
    contactEmail: "arthur@camelotsolutions.com",
    assignedTo: "Sarah Jenkins",
    createdAt: "2026-07-02T10:00:00Z"
  },
  {
    id: "deal-2",
    name: "Consulting & Custom Integrations",
    company: "Wayne Enterprises",
    amount: 125000,
    stage: "Discovery",
    priority: "Critical",
    closeDate: "2026-09-01",
    contactName: "Bruce Wayne",
    contactEmail: "bruce@waynecorp.com",
    assignedTo: "David Vance",
    createdAt: "2026-07-06T14:30:00Z"
  },
  {
    id: "deal-3",
    name: "Standard Seat Subscription Bundle",
    company: "TARDIS Logistics",
    amount: 12000,
    stage: "Lead",
    priority: "Medium",
    closeDate: "2026-08-30",
    contactName: "Clara Oswald",
    contactEmail: "clara@tardislogistics.org",
    assignedTo: "Sarah Jenkins",
    createdAt: "2026-07-11T09:15:00Z"
  },
  {
    id: "deal-4",
    name: "Enterprise Seat Rollout Plan",
    company: "Mjolnir Medicals",
    amount: 80000,
    stage: "Demo",
    priority: "High",
    closeDate: "2026-08-20",
    contactName: "Donald Blake",
    contactEmail: "donald@mjolnirmedical.com",
    assignedTo: "David Vance",
    createdAt: "2026-06-25T11:00:00Z"
  },
  {
    id: "deal-5",
    name: "Financial Platform Cloud Integration",
    company: "Hellfire Financial",
    amount: 95000,
    stage: "Closed Won",
    priority: "High",
    closeDate: "2026-07-10",
    contactName: "Emma Frost",
    contactEmail: "emma@hellfirefinancial.com",
    assignedTo: "David Vance",
    createdAt: "2026-07-13T16:45:00Z"
  }
];

const initialIdeas = [
  {
    id: "idea-1",
    title: "Dynamic PDF Layout Exporter",
    description: "Develop a layout engine allowing B2B customers to dynamically customize rows, filters, and logo branding when printing reports.",
    customerProblem: "Clark Kent (Daily Planet) complains that layout exports are too static and they have to manually reformat columns in Excel.",
    category: "Features",
    impactScore: 8,
    effortScore: 4,
    priority: "High",
    status: "Approved",
    votes: 12,
    owner: "Sarah Jenkins",
    connectedFeedback: ["feed-1"],
    createdAt: "2026-07-02T10:15:00Z"
  },
  {
    id: "idea-2",
    title: "Native Application Dark Mode Theme",
    description: "Build a theme controller toggling the dashboard from light white to dark slate for developers and field representatives operating at night.",
    customerProblem: "Selina Kyle (Gotham Antiques) complains about screen strain when reviewing antique entries late at night.",
    category: "UX",
    impactScore: 9,
    effortScore: 2,
    priority: "High",
    status: "In Development",
    votes: 24,
    owner: "Sarah Jenkins",
    connectedFeedback: ["feed-2"],
    createdAt: "2026-07-05T14:30:00Z"
  },
  {
    id: "idea-3",
    title: "Flight Tracker Third-Party Connector",
    description: "Create an external webhook pipeline integrating real-time flight coordinate tracker APIs directly into custom pipeline widgets.",
    customerProblem: "Hal Jordan (Emerald Aviation) wants flight statistics synced directly alongside aviation deals CRM data.",
    category: "Integration",
    impactScore: 6,
    effortScore: 7,
    priority: "Medium",
    status: "Under Review",
    votes: 5,
    owner: "David Vance",
    connectedFeedback: [],
    createdAt: "2026-07-03T12:00:00Z"
  },
  {
    id: "idea-4",
    title: "Batch DB Export Timeout Optimization",
    description: "Optimize reporting queries using indexing and background job queues (Redis/Bull) so that high-volume sensor exports don't crash.",
    customerProblem: "Barry Allen (Keystone Labs) reports that the CRM page times out when exporting monthly device records.",
    category: "Performance",
    impactScore: 9,
    effortScore: 6,
    priority: "Critical",
    status: "Draft",
    votes: 18,
    owner: "David Vance",
    connectedFeedback: ["feed-4"],
    createdAt: "2026-07-12T10:00:00Z"
  },
  {
    id: "idea-5",
    title: "Custom Antique Image Size Sizer",
    description: "Enable large file attachment uploading (up to 30MB) with automatic web compression to handle high-res catalog images.",
    customerProblem: "Selina Kyle antiques support ticket: Fails to upload high-res item catalogs because of 10MB limits.",
    category: "Features",
    impactScore: 5,
    effortScore: 3,
    priority: "Low",
    status: "Under Review",
    votes: 3,
    owner: "Sarah Jenkins",
    connectedFeedback: ["feed-3"],
    createdAt: "2026-07-10T15:00:00Z"
  }
];

const initialFeedback = [
  {
    id: "feed-1",
    customerId: "cust-1",
    customerName: "Clark Kent",
    company: "Daily Planet Publications",
    source: "Email",
    feedbackText: "Our reporters need custom column configurations and branding options when exporting reporting PDF layouts to layout pages.",
    date: "2026-07-02",
    status: "Converted to Idea",
    linkedIdeaId: "idea-1",
    linkedTaskId: null
  },
  {
    id: "feed-2",
    customerId: "cust-2",
    customerName: "Selina Kyle",
    company: "Gotham Antiques",
    source: "Call",
    feedbackText: "I spend hours reviewing inventories at night and the bright white UI is hurting my eyes. We desperately need a dark mode option.",
    date: "2026-07-05",
    status: "Converted to Idea",
    linkedIdeaId: "idea-2",
    linkedTaskId: null
  },
  {
    id: "feed-3",
    customerId: "cust-2",
    customerName: "Selina Kyle",
    company: "Gotham Antiques",
    source: "Support",
    feedbackText: "Our antiquities catalog photographs are high-resolution and exceed 15MB. The image uploads are blocked by your 10MB server size limit.",
    date: "2026-07-10",
    status: "Pending",
    linkedIdeaId: null,
    linkedTaskId: null
  },
  {
    id: "feed-4",
    customerId: "cust-4",
    customerName: "Barry Allen",
    company: "Keystone Labs",
    source: "Email",
    feedbackText: "The export tool is crashing when exporting our large sensor datasets. We need a faster timeout configuration.",
    date: "2026-07-12",
    status: "Converted to Idea",
    linkedIdeaId: "idea-4",
    linkedTaskId: null
  },
  {
    id: "feed-5",
    customerId: "cust-4",
    customerName: "Barry Allen",
    company: "Keystone Labs",
    source: "Chat",
    feedbackText: "Could you send over the technical documentation for webhook security integrations immediately? Our sysadmin is asking for it.",
    date: "2026-07-14",
    status: "Pending",
    linkedIdeaId: null,
    linkedTaskId: null
  }
];

const initialTasks = [
  {
    id: "task-1",
    title: "Send enterprise seat rollout proposal draft to Donald Blake",
    type: "Email",
    dueDate: "2026-07-15",
    priority: "High",
    completed: false,
    relatedTo: { type: "lead", id: "lead-4", name: "Donald Blake" }
  },
  {
    id: "task-2",
    title: "Schedule flight API tracker integration demo with Hal Jordan",
    type: "Meeting",
    dueDate: "2026-07-16",
    priority: "Medium",
    completed: false,
    relatedTo: { type: "customer", id: "cust-3", name: "Hal Jordan" }
  },
  {
    id: "task-3",
    title: "Call Selina Kyle to review custom image upload sizing",
    type: "Call",
    dueDate: "2026-07-14",
    priority: "High",
    completed: false,
    relatedTo: { type: "customer", id: "cust-2", name: "Selina Kyle" }
  },
  {
    id: "task-4",
    title: "Confirm server query optimization with the DevOps team",
    type: "Reminder",
    dueDate: "2026-07-18",
    priority: "Critical",
    completed: false,
    relatedTo: { type: "idea", id: "idea-4", name: "Batch DB Export Timeout Optimization" }
  },
  {
    id: "task-5",
    title: "Resolve Daily Planet API token setup questions",
    type: "Call",
    dueDate: "2026-07-10",
    priority: "Low",
    completed: true,
    relatedTo: { type: "customer", id: "cust-1", name: "Clark Kent" }
  }
];

const initialActivities = [
  {
    id: "act-1",
    message: "David Vance created a deal opportunity 'Wayne Enterprises Consulting' worth $125,000",
    timestamp: "2026-07-06T14:30:00Z",
    type: "deal_stage"
  },
  {
    id: "act-2",
    message: "Sarah Jenkins linked feedback from Selina Kyle to the new 'Native Application Dark Mode' product idea",
    timestamp: "2026-07-05T14:45:00Z",
    type: "idea_connect"
  },
  {
    id: "act-3",
    message: "System logged new lead 'Emma Frost' from hellfirefinancial.com",
    timestamp: "2026-07-13T16:45:00Z",
    type: "lead_create"
  },
  {
    id: "act-4",
    message: "Sarah Jenkins completed the aviation pipeline integration call with Hal Jordan",
    timestamp: "2026-07-03T11:00:00Z",
    type: "customer_contact"
  },
  {
    id: "act-5",
    message: "David Vance moved deal 'Financial Platform Cloud Integration' to stage 'Closed Won'",
    timestamp: "2026-07-10T17:00:00Z",
    type: "deal_stage"
  }
];

// Load database state
let db = {
  leads: initialLeads,
  customers: initialCustomers,
  deals: initialDeals,
  ideas: initialIdeas,
  feedback: initialFeedback,
  tasks: initialTasks,
  activities: initialActivities
};

// Check if db.json exists, if not write initial data
const loadDB = () => {
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch (e) {
      console.error("Error reading database file, using defaults", e);
    }
  } else {
    saveDB();
  }
};

const saveDB = () => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing to database file", e);
  }
};

loadDB();

// Helper to log activities
const logActivity = (message, type = "info") => {
  const newActivity = {
    id: `act-${Date.now()}`,
    message,
    timestamp: new Date().toISOString(),
    type
  };
  db.activities = db.activities || [];
  db.activities.unshift(newActivity);
  // Cap at 100 entries
  db.activities = db.activities.slice(0, 100);
  saveDB();
};

// API ENDPOINTS

// 1. ACTIVITIES
app.get("/api/activities", (req, res) => {
  res.json(db.activities || []);
});

app.post("/api/activities", (req, res) => {
  const { message, type } = req.body;
  logActivity(message, type);
  res.json(db.activities);
});

// 2. LEADS
app.get("/api/leads", (req, res) => {
  res.json(db.leads || []);
});

app.post("/api/leads", (req, res) => {
  const lead = req.body;
  let updatedLead;
  let msg = "";

  if (lead.id) {
    const idx = db.leads.findIndex((l) => l.id === lead.id);
    if (idx !== -1) {
      db.leads[idx] = { ...db.leads[idx], ...lead };
      updatedLead = db.leads[idx];
      msg = `Updated lead profile for '${lead.name}' (${lead.company})`;
    }
  } else {
    updatedLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.leads.unshift(updatedLead);
    msg = `Captured new lead: '${lead.name}' at '${lead.company}' via ${lead.source}`;
  }

  saveDB();
  logActivity(msg, "lead_update");
  res.json({ leads: db.leads, updatedLead });
});

app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const target = db.leads.find((l) => l.id === id);
  db.leads = db.leads.filter((l) => l.id !== id);
  saveDB();
  if (target) {
    logActivity(`Removed lead record for '${target.name}'`, "lead_delete");
  }
  res.json(db.leads);
});

app.post("/api/leads/:id/convert", (req, res) => {
  const { id } = req.params;
  const { authorName } = req.body;

  const leadIndex = db.leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const lead = db.leads[leadIndex];
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
        author: authorName || "Admin"
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

  db.customers.unshift(newCustomer);
  db.leads.splice(leadIndex, 1);
  saveDB();

  logActivity(`Converted lead '${lead.name}' into verified Customer profile!`, "lead_convert");
  res.json({ leads: db.leads, customers: db.customers, newCustomer });
});

// 3. CUSTOMERS
app.get("/api/customers", (req, res) => {
  res.json(db.customers || []);
});

app.post("/api/customers", (req, res) => {
  const customer = req.body;
  let updatedCustomer;
  let msg = "";

  if (customer.id) {
    const idx = db.customers.findIndex((c) => c.id === customer.id);
    if (idx !== -1) {
      db.customers[idx] = { ...db.customers[idx], ...customer };
      updatedCustomer = db.customers[idx];
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
    db.customers.unshift(updatedCustomer);
    msg = `Registered new customer profile: '${customer.name}' at '${customer.company}'`;
  }

  saveDB();
  logActivity(msg, "customer_update");
  res.json({ customers: db.customers, updatedCustomer });
});

app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const target = db.customers.find((c) => c.id === id);
  db.customers = db.customers.filter((c) => c.id !== id);
  saveDB();
  if (target) {
    logActivity(`Removed customer account directory for '${target.name}'`, "customer_delete");
  }
  res.json(db.customers);
});

app.post("/api/customers/:id/notes", (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });

  const newNote = {
    id: `n-${Date.now()}`,
    text,
    date: new Date().toISOString(),
    author
  };

  db.customers[idx].notes = db.customers[idx].notes || [];
  db.customers[idx].notes.unshift(newNote);
  saveDB();

  logActivity(`Logged note comment on customer account '${db.customers[idx].name}'`, "note_add");
  res.json(db.customers);
});

app.post("/api/customers/:id/timeline", (req, res) => {
  const { id } = req.params;
  const { type, summary } = req.body;

  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });

  const newTimeline = {
    id: `timeline-${Date.now()}`,
    type,
    summary,
    date: new Date().toISOString().split("T")[0]
  };

  db.customers[idx].communicationTimeline = db.customers[idx].communicationTimeline || [];
  db.customers[idx].communicationTimeline.unshift(newTimeline);
  saveDB();

  logActivity(`Logged ${type} outreach event for client '${db.customers[idx].name}'`, "customer_contact");
  res.json(db.customers);
});

app.post("/api/customers/:id/support", (req, res) => {
  const { id } = req.params;
  const { title, description, priority } = req.body;

  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });

  const newTicket = {
    id: `s-${Date.now()}`,
    title,
    description,
    priority,
    status: "Open",
    date: new Date().toISOString().split("T")[0]
  };

  db.customers[idx].supportRequests = db.customers[idx].supportRequests || [];
  db.customers[idx].supportRequests.unshift(newTicket);
  saveDB();

  logActivity(`Filed support ticket '${title}' for customer '${db.customers[idx].name}'`, "support_file");
  res.json(db.customers);
});

app.post("/api/customers/:id/support/:ticketId/resolve", (req, res) => {
  const { id, ticketId } = req.params;

  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });

  const ticketIndex = db.customers[idx].supportRequests?.findIndex(s => s.id === ticketId);
  if (ticketIndex === -1 || ticketIndex === undefined) return res.status(404).json({ error: "Ticket not found" });

  db.customers[idx].supportRequests[ticketIndex].status = "Resolved";
  saveDB();

  logActivity(`Resolved support ticket '${db.customers[idx].supportRequests[ticketIndex].title}'`, "support_resolve");
  res.json(db.customers);
});

// 4. DEALS
app.get("/api/deals", (req, res) => {
  res.json(db.deals || []);
});

app.post("/api/deals", (req, res) => {
  const deal = req.body;
  let updatedDeal;
  let msg = "";

  if (deal.id) {
    const idx = db.deals.findIndex((d) => d.id === deal.id);
    if (idx !== -1) {
      db.deals[idx] = { ...db.deals[idx], ...deal };
      updatedDeal = db.deals[idx];
      msg = `Updated pipeline details for deal '${deal.name}' ($${Number(deal.amount).toLocaleString()})`;
    }
  } else {
    updatedDeal = {
      ...deal,
      id: `deal-${Date.now()}`,
      amount: Number(deal.amount) || 0,
      createdAt: new Date().toISOString()
    };
    db.deals.unshift(updatedDeal);
    msg = `Created new sales pipeline contract: '${deal.name}' worth $${Number(deal.amount).toLocaleString()}`;
  }

  saveDB();
  logActivity(msg, "deal_update");
  res.json({ deals: db.deals, updatedDeal });
});

app.patch("/api/deals/:id/stage", (req, res) => {
  const { id } = req.params;
  const { stage, userName } = req.body;

  const index = db.deals.findIndex((d) => d.id === id);
  if (index === -1) return res.status(404).json({ error: "Deal not found" });

  const oldStage = db.deals[index].stage;
  db.deals[index].stage = stage;
  saveDB();

  if (oldStage !== stage) {
    logActivity(
      `${userName || "System"} advanced deal '${db.deals[index].name}' (${db.deals[index].company}) to stage '${stage}'`,
      "deal_stage"
    );
  }
  res.json(db.deals);
});

app.delete("/api/deals/:id", (req, res) => {
  const { id } = req.params;
  const target = db.deals.find((d) => d.id === id);
  db.deals = db.deals.filter((d) => d.id !== id);
  saveDB();
  if (target) {
    logActivity(`Removed deal contract '${target.name}'`, "deal_delete");
  }
  res.json(db.deals);
});

// 5. FEEDBACK HUB
app.get("/api/feedback", (req, res) => {
  res.json(db.feedback || []);
});

app.post("/api/feedback", (req, res) => {
  const ticket = req.body;
  let updatedFeedback;

  if (ticket.id) {
    const idx = db.feedback.findIndex((f) => f.id === ticket.id);
    if (idx !== -1) {
      db.feedback[idx] = { ...db.feedback[idx], ...ticket };
      updatedFeedback = db.feedback[idx];
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
    db.feedback.unshift(updatedFeedback);
    logActivity(`Logged client feedback ticket from '${ticket.customerName}' (${ticket.company})`, "feedback_log");
  }

  saveDB();
  res.json({ feedback: db.feedback, updatedFeedback });
});

app.delete("/api/feedback/:id", (req, res) => {
  const { id } = req.params;
  db.feedback = db.feedback.filter((f) => f.id !== id);
  saveDB();
  res.json(db.feedback);
});

app.post("/api/feedback/:id/convert-idea", (req, res) => {
  const { id } = req.params;
  const ideaPayload = req.body;

  const feedIdx = db.feedback.findIndex(f => f.id === id);
  if (feedIdx === -1) return res.status(404).json({ error: "Feedback not found" });

  const newIdea = {
    ...ideaPayload,
    id: `idea-${Date.now()}`,
    votes: 1,
    connectedFeedback: [id],
    createdAt: new Date().toISOString()
  };

  db.ideas.unshift(newIdea);
  db.feedback[feedIdx].status = "Converted to Idea";
  db.feedback[feedIdx].linkedIdeaId = newIdea.id;
  saveDB();

  logActivity(`Converted customer feedback from '${db.feedback[feedIdx].customerName}' into a product idea: '${newIdea.title}'`, "feedback_convert");
  res.json({ feedback: db.feedback, ideas: db.ideas, newIdea });
});

app.post("/api/feedback/:id/convert-task", (req, res) => {
  const { id } = req.params;
  const taskPayload = req.body;

  const feedIdx = db.feedback.findIndex(f => f.id === id);
  if (feedIdx === -1) return res.status(404).json({ error: "Feedback not found" });

  const newTask = {
    ...taskPayload,
    id: `task-${Date.now()}`,
    completed: false
  };

  db.tasks.unshift(newTask);
  db.feedback[feedIdx].status = "Converted to Task";
  db.feedback[feedIdx].linkedTaskId = newTask.id;
  saveDB();

  logActivity(`Created scheduled task following feedback from client '${db.feedback[feedIdx].customerName}'`, "feedback_convert");
  res.json({ feedback: db.feedback, tasks: db.tasks, newTask });
});

// 6. IDEA BOARD
app.get("/api/ideas", (req, res) => {
  res.json(db.ideas || []);
});

app.post("/api/ideas", (req, res) => {
  const idea = req.body;
  let updatedIdea;
  let msg = "";

  if (idea.id) {
    const idx = db.ideas.findIndex((i) => i.id === idea.id);
    if (idx !== -1) {
      db.ideas[idx] = { ...db.ideas[idx], ...idea };
      updatedIdea = db.ideas[idx];
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
    db.ideas.unshift(updatedIdea);
    msg = `Created product development proposal idea: '${idea.title}'`;
  }

  saveDB();
  logActivity(msg, "idea_update");
  res.json({ ideas: db.ideas, updatedIdea });
});

app.delete("/api/ideas/:id", (req, res) => {
  const { id } = req.params;
  const target = db.ideas.find((i) => i.id === id);
  db.ideas = db.ideas.filter((i) => i.id !== id);
  saveDB();
  if (target) {
    logActivity(`Deleted product idea: '${target.title}'`, "idea_delete");
  }
  res.json(db.ideas);
});

app.post("/api/ideas/:id/upvote", (req, res) => {
  const { id } = req.params;
  const index = db.ideas.findIndex(i => i.id === id);
  if (index !== -1) {
    db.ideas[index].votes = (db.ideas[index].votes || 0) + 1;
    saveDB();
    logActivity(`Upvoted product development idea proposal: '${db.ideas[index].title}'`, "idea_vote");
  }
  res.json(db.ideas);
});

// 7. TASKS
app.get("/api/tasks", (req, res) => {
  res.json(db.tasks || []);
});

app.post("/api/tasks", (req, res) => {
  const task = req.body;
  let updatedTask;

  if (task.id) {
    const idx = db.tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      db.tasks[idx] = { ...db.tasks[idx], ...task };
      updatedTask = db.tasks[idx];
    }
  } else {
    updatedTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    };
    db.tasks.unshift(updatedTask);
    logActivity(`Scheduled new follow-up reminder task: '${task.title}'`, "task_create");
  }

  saveDB();
  res.json({ tasks: db.tasks, updatedTask });
});

app.patch("/api/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const idx = db.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });

  const state = !db.tasks[idx].completed;
  db.tasks[idx].completed = state;
  saveDB();

  logActivity(
    `Marked task '${db.tasks[idx].title}' as ${state ? "COMPLETED" : "INCOMPLETE"}`,
    "task_toggle"
  );
  res.json(db.tasks);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const target = db.tasks.find(t => t.id === id);
  db.tasks = db.tasks.filter((t) => t.id !== id);
  saveDB();
  if (target) {
    logActivity(`Removed task reminder '${target.title}'`, "task_delete");
  }
  res.json(db.tasks);
});

// 8. CRM INSIGHTS AI CHAT ASSISTANT
app.post("/api/insights/chat", (req, res) => {
  const { message, userRole } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const lower = message.toLowerCase();
  let aiText = "";

  // 1. Identify at-risk customers dynamically
  const atRiskCustomers = db.customers.map(cust => {
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
    if (textToScan.includes("delay") || textToScan.includes("slow")) {
      riskScore += 15; reasons.push("Delivery delays mentioned");
    }

    return { ...cust, riskScore: Math.min(riskScore, 95), reasons };
  }).filter(c => c.riskScore > 20).sort((a, b) => b.riskScore - a.riskScore);

  // 2. Recommend Promising Sales Opportunities dynamically
  const salesRecommendations = db.deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost")
    .map(deal => {
      let probability = 45;
      let highlights = [];

      if (deal.stage === "Proposal") { probability += 25; highlights.push("Proposal Sent"); }
      if (deal.stage === "Demo") { probability += 15; highlights.push("Product Demo complete"); }
      if (deal.priority === "Critical" || deal.priority === "High") { probability += 10; highlights.push("High deal urgency"); }
      if (deal.amount >= 75000) { probability += 10; highlights.push("High contract volume"); }

      return { ...deal, probability: Math.min(probability, 90), highlights };
    }).sort((a, b) => b.probability - a.probability).slice(0, 3);

  // Parse response
  if (lower.includes("risk") || lower.includes("leave") || lower.includes("churn")) {
    if (atRiskCustomers.length === 0) {
      aiText = "Good news! No customer accounts currently flag critical churn risk parameters.";
    } else {
      aiText = `I identified **${atRiskCustomers.length} accounts** showing risk factors:\n\n` +
        atRiskCustomers.map(c => `- **${c.name}** (${c.company}): **${c.riskScore}% risk**. Reason: ${c.reasons.join(", ")}`).join("\n");
    }
  } else if (lower.includes("lead") || lower.includes("opportunity") || lower.includes("sales")) {
    aiText = `Top recommended deal pipelines to follow up immediately:\n\n` +
      salesRecommendations.map(r => `- **${r.name}** for **${r.company}** ($${r.amount.toLocaleString()}): **${r.probability}% close chance**. Advised step: ${r.highlights.join(" and ")}.`).join("\n");
  } else if (lower.includes("task") || lower.includes("todo") || lower.includes("today")) {
    const pending = db.tasks.filter(t => !t.completed);
    if (pending.length === 0) {
      aiText = "All clear! You have no pending checklist tasks today.";
    } else {
      aiText = `You have **${pending.length} pending follow-up reminders**:\n\n` +
        pending.map(t => `- [ ] **${t.title}** (Due: ${t.dueDate}, Priority: ${t.priority})`).join("\n");
    }
  } else if (lower.includes("feedback") || lower.includes("feature") || lower.includes("request")) {
    const pendingFeed = db.feedback.filter(f => f.status === "Pending");
    aiText = `I scanned your Feedback Hub and found **${pendingFeed.length} pending requests**. A key cluster was identified requesting **Dark Mode Theme** from Selina Kyle.`;
  } else if (lower.includes("idea") || lower.includes("board")) {
    aiText = `Top voted product proposals on your Idea Board:\n\n` +
      db.ideas.slice(0, 3).map(i => `- **${i.title}** (${i.category}): **${i.votes} votes** (Impact: ${i.impactScore}/10, Status: ${i.status})`).join("\n");
  } else {
    aiText = `I scanned the ClientFlow database. Currently we have:\n- **${db.leads.length} Active Leads**\n- **${db.customers.length} Customers**\n- **${db.deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length} Open Deals** ($${db.deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost").reduce((s,d)=>s+d.amount,0).toLocaleString()} pipeline)\n- **${db.ideas.length} Product Ideas**\n\nIs there a specific customer note or deal pipeline you'd like me to analyze?`;
  }

  res.json({ response: aiText });
});

// START SERVER
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`ClientFlow CRM Backend Server running on port ${PORT}`);
});
