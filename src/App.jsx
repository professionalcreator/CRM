import React, { useState, useEffect } from "react";
import { api, initDB } from "./services/api";
import {
  Sparkles,
  LayoutDashboard,
  Target,
  Users,
  Kanban,
  MessageSquare,
  Lightbulb,
  CheckSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Image
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import Leads from "./components/Leads";
import Customers from "./components/Customers";
import Deals from "./components/Deals";
import FeedbackHub from "./components/FeedbackHub";
import IdeaBoard from "./components/IdeaBoard";
import Activities from "./components/Activities";
import CRMInsights from "./components/CRMInsights";
import Analytics from "./components/Analytics";
import DesignBlueprint from "./components/DesignBlueprint";

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [userRole, setUserRole] = useState("Admin"); // default role
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Database States
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Toast notifications State
  const [toasts, setToasts] = useState([]);

  // Setup Database
  useEffect(() => {
    initDB();
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const l = await api.getLeads();
      const c = await api.getCustomers();
      const d = await api.getDeals();
      const i = await api.getIdeas();
      const f = await api.getFeedback();
      const t = await api.getTasks();
      const act = await api.getActivities();

      setLeads(l);
      setCustomers(c);
      setDeals(d);
      setIdeas(i);
      setFeedback(f);
      setTasks(t);
      setActivities(act);
    } catch (err) {
      showToast("Failed to fetch database data", "error");
    }
  };

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // LEADS ACTIONS
  const handleAddLead = async (lead) => {
    const { leads: updated } = await api.saveLead({ ...lead, owner: userRole === "Sales Representative" ? "Sarah Jenkins" : lead.owner });
    setLeads(updated);
    showToast("Captured new lead opportunity successfully");
    refreshData();
  };

  const handleEditLead = async (lead) => {
    const { leads: updated } = await api.saveLead(lead);
    setLeads(updated);
    showToast("Updated lead parameters");
    refreshData();
  };

  const handleDeleteLead = async (id) => {
    const updated = await api.deleteLead(id);
    setLeads(updated);
    showToast("Removed lead entry");
    refreshData();
  };

  const handleConvertLead = async (leadId) => {
    const { leads: ul, customers: uc } = await api.convertLeadToCustomer(leadId, userRole);
    setLeads(ul);
    setCustomers(uc);
    showToast("Lead profile advanced to active customer!", "success");
    refreshData();
  };

  // CUSTOMERS ACTIONS
  const handleAddCustomer = async (cust) => {
    const { customers: updated } = await api.saveCustomer(cust);
    setCustomers(updated);
    showToast("Registered new customer account");
    refreshData();
  };

  const handleDeleteCustomer = async (id) => {
    const updated = await api.deleteCustomer(id);
    setCustomers(updated);
    showToast("Removed customer folder");
    refreshData();
  };

  const handleAddCustomerNote = async (custId, text) => {
    const updated = await api.addCustomerNote(custId, text, userRole);
    setCustomers(updated);
    showToast("Logged internal customer notes");
    refreshData();
  };

  const handleLogCustomerComm = async (custId, type, summary) => {
    const updated = await api.logCustomerCommunication(custId, type, summary);
    setCustomers(updated);
    showToast(`Logged outreach ${type} contact`);
    refreshData();
  };

  const handleAddCustomerSupport = async (custId, title, description, priority) => {
    const updated = await api.addCustomerSupportRequest(custId, title, description, priority);
    setCustomers(updated);
    showToast("Support ticket registered");
    refreshData();
  };

  const handleResolveCustomerSupport = async (custId, ticketId) => {
    const updated = await api.resolveSupportTicket(custId, ticketId);
    setCustomers(updated);
    showToast("Support ticket resolved successfully!");
    refreshData();
  };

  // DEALS ACTIONS
  const handleAddDeal = async (deal) => {
    const { deals: updated } = await api.saveDeal(deal);
    setDeals(updated);
    showToast("Created deal pipeline entry");
    refreshData();
  };

  const handleEditDeal = async (deal) => {
    const { deals: updated } = await api.saveDeal(deal);
    setDeals(updated);
    showToast("Updated contract opportunity details");
    refreshData();
  };

  const handleDeleteDeal = async (id) => {
    const updated = await api.deleteDeal(id);
    setDeals(updated);
    showToast("Contract deal deleted");
    refreshData();
  };

  const handleMoveDeal = async (dealId, stage) => {
    const updated = await api.updateDealStage(dealId, stage, userRole);
    setDeals(updated);
    showToast(`Opportunity progressed to ${stage}`);
    refreshData();
  };

  // FEEDBACK HUB ACTIONS
  const handleAddFeedback = async (ticket) => {
    const { feedback: updated } = await api.saveFeedback(ticket);
    setFeedback(updated);
    showToast("Client feedback captured in database");
    refreshData();
  };

  const handleConvertFeedbackToIdea = async (feedbackId, ideaPayload) => {
    const { feedback: uf, ideas: ui } = await api.convertFeedbackToIdea(feedbackId, {
      ...ideaPayload,
      owner: userRole === "Sales Representative" ? "Sarah Jenkins" : "David Vance"
    });
    setFeedback(uf);
    setIdeas(ui);
    showToast("Feedback converted to Product Idea!", "success");
    refreshData();
  };

  const handleConvertFeedbackToTask = async (feedbackId, taskPayload) => {
    const { feedback: uf, tasks: ut } = await api.convertFeedbackToTask(feedbackId, taskPayload);
    setFeedback(uf);
    setTasks(ut);
    showToast("Follow-up task scheduled from feedback", "success");
    refreshData();
  };

  // IDEA BOARD ACTIONS
  const handleAddIdea = async (idea) => {
    const { ideas: updated } = await api.saveIdea({
      ...idea,
      owner: userRole === "Sales Representative" ? "Sarah Jenkins" : "David Vance"
    });
    setIdeas(updated);
    showToast("Product roadmap idea proposed");
    refreshData();
  };

  const handleUpvoteIdea = async (id) => {
    const updated = await api.upvoteIdea(id);
    setIdeas(updated);
    showToast("Upvoted proposal idea");
    refreshData();
  };

  // ACTIVITIES ACTIONS
  const handleAddTask = async (task) => {
    const { tasks: updated } = await api.saveTask(task);
    setTasks(updated);
    showToast("Task checklist scheduled");
    refreshData();
  };

  const handleToggleTask = async (id) => {
    const updated = await api.toggleTaskCompletion(id);
    setTasks(updated);
    showToast("Task completion updated");
    refreshData();
  };

  const handleDeleteTask = async (id) => {
    const updated = await api.deleteTask(id);
    setTasks(updated);
    showToast("Removed task log");
    refreshData();
  };

  // Sidebar Menu Config
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "leads", label: "Leads Pipeline", icon: <Target size={18} /> },
    { id: "customers", label: "Customers", icon: <Users size={18} /> },
    { id: "deals", label: "Deals Kanban", icon: <Kanban size={18} /> },
    { id: "feedback", label: "Feedback Hub", icon: <MessageSquare size={18} /> },
    { id: "ideas", label: "Idea Board", icon: <Lightbulb size={18} /> },
    { id: "activities", label: "Activities Planner", icon: <CheckSquare size={18} /> },
    { id: "insights", label: "CRM Insights (AI)", icon: <Sparkles size={18} /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp size={18} /> },
    { id: "blueprint", label: "Design Blueprint", icon: <Image size={18} /> }
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Sparkles size={20} style={{ color: "#fff" }} />
            </div>
            <span className="logo-title" style={{ fontSize: "1.1rem" }}>ClientFlow CRM</span>
          </div>
          <button
            type="button"
            className="toggle-sidebar-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                className={`menu-item-link ${activeNav === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileOpen(false);
                }}
              >
                {item.icon}
                <span className="menu-item-text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Footer Role Switcher */}
        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="avatar">
              {userRole === "Admin" ? "AD" : userRole === "Sales Manager" ? "SM" : userRole === "Sales Representative" ? "SR" : "VI"}
            </div>
            <div className="user-meta">
              <span className="username">
                {userRole === "Admin" ? "David Vance" : userRole === "Sales Manager" ? "Sales Manager" : userRole === "Sales Representative" ? "Sarah Jenkins" : "Demo Guest"}
              </span>
              <span className="user-role-badge">{userRole} Profile</span>
            </div>
          </div>

          <div className="role-switcher-container">
            <span className="role-switcher-label">Switch Role Sandbox</span>
            <select
              className="role-select"
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                showToast(`Switched active sandbox role profile to ${e.target.value}`, "warning");
              }}
            >
              <option value="Admin">Administrator (David Vance)</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Representative">Sales Rep (Sarah Jenkins)</option>
              <option value="Viewer">Viewer (Read-Only Demo)</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        
        {/* Sticky Mobile Nav Header */}
        <div className="nav-header">
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Database Connection: Online
            </span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981" }}></div>
          </div>
        </div>

        {/* Current View Header Title */}
        <div className="page-header">
          <div className="page-title-group">
            <h1>
              {activeNav === "dashboard" && "ClientFlow CRM Dashboard"}
              {activeNav === "leads" && "Leads Management Pipeline"}
              {activeNav === "customers" && "Customer Directories"}
              {activeNav === "deals" && "Sales Opportunities Board"}
              {activeNav === "feedback" && "Customer Feedback Hub"}
              {activeNav === "ideas" && "Product Roadmap Idea Board"}
              {activeNav === "activities" && "Tasks & Schedule Planner"}
              {activeNav === "insights" && "CRM Insights (AI Assistant)"}
              {activeNav === "analytics" && "Analytical Insights"}
              {activeNav === "blueprint" && "Design Blueprint & UI Reference"}
            </h1>
            <p>
              {activeNav === "dashboard" && "Overview of leads conversion, top development features, and scheduled outreach activities."}
              {activeNav === "leads" && "Capture name, email, interest, and track system next best actions."}
              {activeNav === "customers" && "Manage customer folders, support requests logs, note updates, and timeline history."}
              {activeNav === "deals" && "Drag deal contract opportunities along custom Discovery, Demo, and Closed stages."}
              {activeNav === "feedback" && "File customer suggestions and convert them into engineering tasks or ideas."}
              {activeNav === "ideas" && "Upvote product development proposals and review target customer demand comments."}
              {activeNav === "activities" && "Complete pending client phone calls, outreach emails, or meetings."}
              {activeNav === "insights" && "AI-suggested churn warnings, deal recommenders, and database querying chatbot."}
              {activeNav === "analytics" && "Revenue closed performance metrics, lead distributions, and feature request totals."}
              {activeNav === "blueprint" && "High-fidelity conceptual mockups and specifications representing the visual aesthetic guidelines of ClientFlow CRM."}
            </p>
          </div>
        </div>

        {/* Content Tab router */}
        <div style={{ flexGrow: 1 }}>
          {activeNav === "dashboard" && (
            <Dashboard
              leads={leads}
              customers={customers}
              deals={deals}
              ideas={ideas}
              tasks={tasks}
              activities={activities}
              onToggleTask={handleToggleTask}
              onNavigate={(nav) => setActiveNav(nav)}
            />
          )}

          {activeNav === "leads" && (
            <Leads
              leads={leads}
              onAddLead={handleAddLead}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              onConvertLead={handleConvertLead}
              userRole={userRole}
            />
          )}

          {activeNav === "customers" && (
            <Customers
              customers={customers}
              deals={deals}
              onAddCustomer={handleAddCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onAddNote={handleAddCustomerNote}
              onLogComm={handleLogCustomerComm}
              onAddSupport={handleAddCustomerSupport}
              onResolveSupport={handleResolveCustomerSupport}
              userRole={userRole}
              activeUserId={userRole === "Admin" ? "David Vance" : userRole === "Sales Representative" ? "Sarah Jenkins" : "Admin Team"}
            />
          )}

          {activeNav === "deals" && (
            <Deals
              deals={deals}
              onAddDeal={handleAddDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              onMoveDeal={handleMoveDeal}
              userRole={userRole}
            />
          )}

          {activeNav === "feedback" && (
            <FeedbackHub
              feedback={feedback}
              customers={customers}
              onAddFeedback={handleAddFeedback}
              onConvertFeedbackToIdea={handleConvertFeedbackToIdea}
              onConvertFeedbackToTask={handleConvertFeedbackToTask}
              userRole={userRole}
            />
          )}

          {activeNav === "ideas" && (
            <IdeaBoard
              ideas={ideas}
              feedback={feedback}
              onAddIdea={handleAddIdea}
              onUpvoteIdea={handleUpvoteIdea}
              userRole={userRole}
            />
          )}

          {activeNav === "activities" && (
            <Activities
              tasks={tasks}
              leads={leads}
              customers={customers}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              userRole={userRole}
            />
          )}

          {activeNav === "insights" && (
            <CRMInsights
              leads={leads}
              customers={customers}
              deals={deals}
              ideas={ideas}
              feedback={feedback}
              tasks={tasks}
              onAddIdea={handleAddIdea}
              onAddTask={handleAddTask}
              onRefreshData={refreshData}
            />
          )}

          {activeNav === "analytics" && (
            <Analytics
              leads={leads}
              customers={customers}
              deals={deals}
              ideas={ideas}
              feedback={feedback}
            />
          )}

          {activeNav === "blueprint" && (
            <DesignBlueprint />
          )}
        </div>
      </main>

      {/* Floating Alert Toast notifications container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
