export const initialLeads = [
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

export const initialCustomers = [
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

export const initialDeals = [
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

export const initialIdeas = [
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

export const initialFeedback = [
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

export const initialTasks = [
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

export const initialActivities = [
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
