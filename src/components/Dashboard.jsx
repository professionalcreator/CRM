import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  CheckSquare,
  Activity,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Flame
} from "lucide-react";

export default function Dashboard({
  leads = [],
  customers = [],
  deals = [],
  ideas = [],
  tasks = [],
  activities = [],
  onToggleTask,
  onNavigate
}) {

  // Counts
  const newLeadsCount = leads.filter(l => l.status === "Lead").length;
  const customersCount = customers.length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  // Monthly Sales (Closed Won deals)
  const wonDeals = deals.filter(d => d.stage === "Closed Won");
  const monthlySalesTotal = wonDeals.reduce((sum, d) => sum + Number(d.amount), 0);

  // Conversion calculations
  const totalLeadsHistorical = leads.length + customers.filter(c => c.tags.includes("Converted")).length;
  const convertedLeads = customers.filter(c => c.tags.includes("Converted")).length;
  const conversionRate = totalLeadsHistorical > 0 ? Math.round((convertedLeads / totalLeadsHistorical) * 100) : 0;

  // Priority follow ups
  const priorityTasks = tasks.filter(t => !t.completed && (t.priority === "Critical" || t.priority === "High")).slice(0, 4);

  // Top ideas based on votes / impact
  const topIdeas = [...ideas].sort((a, b) => (b.votes + b.impactScore) - (a.votes + a.impactScore)).slice(0, 3);

  return (
    <div className="dashboard-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero-banner">
        <div className="hero-overlay">
          <div className="hero-text">
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
              Welcome to ClientFlow CRM
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, maxWidth: '500px' }}>
              Transform customer relationships into revenue. Track leads, manage deals, and turn feedback into your next big product idea.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('leads')} style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}>
                <Target size={14} /> Capture Leads
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('analytics')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <TrendingUp size={14} /> View Analytics
              </button>
            </div>
          </div>
        </div>
        <img src={`${import.meta.env.BASE_URL}crm_hero_banner.png`} alt="CRM Dashboard Overview" className="hero-bg-image" />
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigate("leads")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">New Leads</span>
            <span className="metric-value">{newLeadsCount}</span>
            <span className="metric-trend up">
              <Target size={12} style={{ marginRight: 4 }} />
              Warm leads
            </span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
            <Target size={24} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigate("customers")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Active Customers</span>
            <span className="metric-value">{customersCount}</span>
            <span className="metric-trend up">
              <Users size={12} style={{ marginRight: 4 }} />
              +22% Retention
            </span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigate("activities")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Pending Follow-ups</span>
            <span className="metric-value">{pendingTasksCount}</span>
            <span className="metric-trend" style={{ color: "var(--text-muted)" }}>
              {tasks.filter(t => t.completed).length} Resolved
            </span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#f5f3ff", color: "#6d28d9" }}>
            <CheckSquare size={24} />
          </div>
        </div>

        <div className="metric-card" onClick={() => onNavigate("deals")} style={{ cursor: "pointer" }}>
          <div className="metric-info">
            <span className="metric-label">Monthly Sales</span>
            <span className="metric-value">${monthlySalesTotal.toLocaleString()}</span>
            <span className="metric-trend up" style={{ color: "#059669" }}>
              Won contracts
            </span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#fff7ed", color: "#ea580c" }}>
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="dashboard-sections">
        {/* Sales Funnel Ring Chart */}
        <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header-flex">
              <h2>
                <TrendingUp size={18} style={{ color: "var(--primary-color)" }} />
                Sales Funnel: Lead Conversion
              </h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "160px", position: "relative" }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="var(--primary-color)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - conversionRate / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {conversionRate}%
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Conversion Rate
                </span>
              </div>
            </div>
          </div>
          
          <div className="idea-structured-data" style={{ padding: 12, marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
              <span style={{ color: "var(--text-muted)" }}>Total Leads Tracked:</span>
              <strong style={{ color: "var(--text-main)" }}>{totalLeadsHistorical}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Converted Customers:</span>
              <strong style={{ color: "var(--primary-color)" }}>{convertedLeads}</strong>
            </div>
          </div>
        </div>

        {/* Top Product Ideas */}
        <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header-flex">
              <h2>
                <Lightbulb size={18} style={{ color: "#0d9488" }} />
                Top Voted Business Ideas
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("ideas")}>
                Idea Board
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {topIdeas.map((idea, idx) => (
                <div
                  key={idea.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    backgroundColor: "var(--bg-app)",
                    borderRadius: "8px",
                    borderLeft: `3px solid ${idx === 0 ? "#10b981" : idx === 1 ? "#8b5cf6" : "#4b5563"}`
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{idea.title}</div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{idea.category} Category | owner: {idea.owner}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="badge badge-priority-medium" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                      ⭐ {idea.votes} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist & Recent Activities */}
      <div className="dashboard-sections">
        {/* High Priority Follow-ups */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <CheckSquare size={18} style={{ color: "#ef4444" }} />
              High Priority Task Follow-ups
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("activities")}>
              Planner
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {priorityTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                No high-priority task alerts pending.
              </div>
            ) : (
              priorityTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: "var(--bg-app)",
                    borderRadius: "var(--radius-sm)",
                    borderLeft: "3px solid #ef4444"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1 }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      style={{ cursor: "pointer", width: 15, height: 15 }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-main)" }}>
                        {task.title}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Due: {task.dueDate} | Related: {task.relatedTo?.name || "None"}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-priority-critical" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Interaction activities logs */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <Activity size={18} style={{ color: "#8b5cf6" }} />
              Recent Actions & Audit Feed
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("settings")}>
              Full Log
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "230px", overflowY: "auto", paddingRight: 4 }}>
            {activities.slice(0, 5).map(act => (
              <div key={act.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "var(--bg-app)",
                    color: "var(--text-muted)",
                    padding: "6px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Activity size={14} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexGrow: 1 }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.3 }}>
                    {act.message}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
