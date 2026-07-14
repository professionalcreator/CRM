import React from "react";
import { TrendingUp, DollarSign, Target, PieChart, BarChart2, Lightbulb, Users } from "lucide-react";

export default function Analytics({
  leads = [],
  customers = [],
  deals = [],
  ideas = [],
  feedback = []
}) {
  // 1. Sales Totals
  const wonDeals = deals.filter(d => d.stage === "Closed Won");
  const revenueTotal = wonDeals.reduce((sum, d) => sum + Number(d.amount), 0);
  const openDeals = deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost");
  const pipelineTotal = openDeals.reduce((sum, d) => sum + Number(d.amount), 0);

  // 2. Lead Source Counts
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  const totalLeads = leads.length || 1;

  // 3. Sales Owner Performance
  const ownerSales = deals.reduce((acc, deal) => {
    if (deal.stage === "Closed Won") {
      acc[deal.assignedTo] = (acc[deal.assignedTo] || 0) + Number(deal.amount);
    }
    return acc;
  }, {});
  const maxSalesVal = Math.max(...Object.values(ownerSales), 1);

  // 4. Feature Request categories (Ideas votes aggregated)
  const categoryVotes = ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + (idea.votes || 0);
    return acc;
  }, {});
  const maxCategoryVotes = Math.max(...Object.values(categoryVotes), 1);

  // 5. Idea Status Breakdown
  const statusCounts = ideas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="analytics-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-illustration-banner banner-analytics">
        <img src={`${import.meta.env.BASE_URL}analytics_performance.png`} alt="" />
        <div className="banner-content">
          <div className="banner-icon">
            <TrendingUp size={28} />
          </div>
          <div className="banner-text">
            <h3>Performance Analytics</h3>
            <p>Data-driven insights to optimize your sales pipeline, revenue forecasting, and team performance metrics.</p>
          </div>
        </div>
      </div>

      {/* Top Total Statistics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Closed Revenue</span>
            <span className="metric-value">${revenueTotal.toLocaleString()}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Won sales deals</span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Pipeline Value</span>
            <span className="metric-value">${pipelineTotal.toLocaleString()}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Active opportunities</span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Structured Feedbacks</span>
            <span className="metric-value">{feedback.length}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Client logs recorded</span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#f0fdfa", color: "#0d9488" }}>
            <PieChart size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Roadmap Ideas</span>
            <span className="metric-value">{ideas.length}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Pending engineering</span>
          </div>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "#f5f3ff", color: "#6d28d9" }}>
            <Lightbulb size={24} />
          </div>
        </div>
      </div>

      {/* SVG Charts Grid */}
      <div className="dashboard-sections">
        
        {/* Sales Owner Performance Horizontal Graph */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <BarChart2 size={18} style={{ color: "var(--primary-color)" }} />
              Closed Won Sales by Owner
            </h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "180px", justifyContent: "center" }}>
            {Object.keys(ownerSales).length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-light)" }}>No Closed Won sales deals registered yet.</p>
            ) : (
              Object.keys(ownerSales).map((owner) => {
                const val = ownerSales[owner];
                const pct = (val / maxSalesVal) * 100;
                return (
                  <div key={owner} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 500 }}>
                      <span>{owner}</span>
                      <strong>${val.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: "12px", width: "100%", backgroundColor: "var(--bg-app)", borderRadius: "6px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          backgroundColor: "var(--primary-color)",
                          borderRadius: "6px",
                          transition: "width 0.5s ease"
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Lead Source Breakdown progress bars */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <Users size={18} style={{ color: "#ea580c" }} />
              Lead Source Distribution
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Website", "Referral", "Cold Outreach", "Event", "Ads"].map(src => {
              const count = sourceCounts[src] || 0;
              const pct = Math.round((count / totalLeads) * 100);
              return (
                <div key={src}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                    <span>{src}</span>
                    <strong style={{ color: "var(--text-muted)" }}>{count} leads ({pct}%)</strong>
                  </div>
                  <div style={{ height: "8px", width: "100%", backgroundColor: "var(--bg-app)", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        backgroundColor: "#ea580c",
                        borderRadius: "4px",
                        transition: "width 0.5s ease"
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        
        {/* Top Product Request Categories by votes */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <Lightbulb size={18} style={{ color: "#0d9488" }} />
              Feature Demand by Category (Votes)
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "180px", justifyContent: "center" }}>
            {Object.keys(categoryVotes).length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-light)" }}>No feature votes logged on Idea Board.</p>
            ) : (
              Object.keys(categoryVotes).map((cat) => {
                const votes = categoryVotes[cat];
                const pct = (votes / maxCategoryVotes) * 100;
                return (
                  <div key={cat} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 500 }}>
                      <span>{cat} Category</span>
                      <strong>{votes} votes</strong>
                    </div>
                    <div style={{ height: "12px", width: "100%", backgroundColor: "var(--bg-app)", borderRadius: "6px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          backgroundColor: "#0d9488",
                          borderRadius: "6px",
                          transition: "width 0.5s ease"
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Idea Status counts */}
        <div className="dashboard-card">
          <div className="card-header-flex">
            <h2>
              <Target size={18} style={{ color: "#8b5cf6" }} />
              Idea Board Roadmap Statuses
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Draft", "Under Review", "Approved", "In Development", "Completed"].map(status => {
              const count = statusCounts[status] || 0;
              return (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "var(--bg-app)", borderRadius: 8 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-main)" }}>{status}</span>
                  <span className="badge badge-stage-demo" style={{ backgroundColor: "#f5f3ff", color: "#6d28d9", fontWeight: 700 }}>
                    {count} items
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
