import React, { useState } from "react";
import { Plus, Flame, ThumbsUp, MessageSquare, Tag, User, Info, ArrowUpRight, HelpCircle, Search } from "lucide-react";

export default function IdeaBoard({
  ideas = [],
  feedback = [],
  onAddIdea,
  onUpvoteIdea,
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIdeaId, setExpandedIdeaId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customerProblem: "",
    category: "Features",
    impactScore: 5,
    effortScore: 5,
    priority: "Medium",
    status: "Draft",
    owner: "Sarah Jenkins"
  });

  const categories = ["Features", "Integration", "UX", "Performance"];
  const statuses = ["Draft", "Under Review", "Approved", "In Development", "Completed"];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      customerProblem: "",
      category: "Features",
      impactScore: 5,
      effortScore: 5,
      priority: "Medium",
      status: "Draft",
      owner: "Sarah Jenkins"
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onAddIdea(formData);
    setIsModalOpen(false);
    resetForm();
  };

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.customerProblem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All" || idea.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || idea.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const isViewer = userRole === "Viewer";

  return (
    <div className="idea-board-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {isViewer && (
        <div className="role-banner read-only" style={{ marginBottom: 0 }}>
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> You can review and upvote product ideas, but cannot publish new roadmap cards.</span>
        </div>
      )}

      {/* Filter and action tools */}
      <div className="filters-panel" style={{ marginBottom: 0 }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search ideas, problem descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Propose Idea
          </button>
        </div>
      </div>

      {/* Idea Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {filteredIdeas.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "var(--text-muted)", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            No business ideas found matching filter criteria.
          </div>
        ) : (
          filteredIdeas.map((idea) => {
            // Find linked feedbacks
            const linkedFeeds = feedback.filter(f => f.linkedIdeaId === idea.id || idea.connectedFeedback?.includes(f.id));
            const isExpanded = expandedIdeaId === idea.id;

            return (
              <div
                key={idea.id}
                className="dashboard-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px",
                  border: isExpanded ? "2px solid #8b5cf6" : "1px solid var(--border-color)",
                  transition: "var(--transition)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span className="badge badge-stage-discovery" style={{ fontSize: "0.65rem", padding: "2px 8px", backgroundColor: "#f5f3ff", color: "#6d28d9" }}>
                      {idea.category}
                    </span>
                    <span className="badge badge-priority-medium" style={{ fontSize: "0.65rem", backgroundColor: "var(--bg-app)", color: "var(--text-muted)" }}>
                      {idea.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginTop: "8px", lineHeight: 1.3 }}>
                    {idea.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.4 }}>
                    {idea.description}
                  </p>

                  <div style={{ backgroundColor: "var(--bg-app)", padding: 10, borderRadius: 6, marginTop: 12, fontSize: "0.75rem", borderLeft: "2px solid var(--primary-color)" }}>
                    <strong>Target Problem:</strong> {idea.customerProblem}
                  </div>

                  {/* Impact vs Effort Scores Visual */}
                  <div style={{ display: "flex", gap: "16px", marginTop: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="score-badge-circle score-badge-impact" title="Impact Score">{idea.impactScore}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>Impact</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="score-badge-circle score-badge-effort" title="Effort Score">{idea.effortScore}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>Effort</span>
                    </div>
                  </div>
                </div>

                {/* Card footer details */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-light)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <User size={12} /> {idea.owner}
                  </span>
                  
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setExpandedIdeaId(isExpanded ? null : idea.id)}
                      style={{ padding: "4px 8px", display: "inline-flex", gap: 4, fontSize: "0.7rem" }}
                    >
                      <MessageSquare size={12} />
                      {linkedFeeds.length} Feedback
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onUpvoteIdea(idea.id)}
                      style={{ padding: "4px 8px", display: "inline-flex", gap: 4, fontSize: "0.7rem" }}
                    >
                      <ThumbsUp size={12} />
                      {idea.votes}
                    </button>
                  </div>
                </div>

                {/* Expandable feedbacks section */}
                {isExpanded && (
                  <div style={{ backgroundColor: "#fbfbfe", border: "1px solid var(--border-color)", padding: 10, borderRadius: 6, fontSize: "0.75rem", display: "flex", flexDirection: "column", gap: 8 }}>
                    <strong>Linked Customer Requests:</strong>
                    {linkedFeeds.length === 0 ? (
                      <span style={{ color: "var(--text-muted)" }}>No customer requests linked directly. Created from general backlog.</span>
                    ) : (
                      linkedFeeds.map(f => (
                        <div key={f.id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{f.customerName} ({f.company}):</span>
                          <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: 2 }}>"{f.feedbackText}"</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Propose Idea Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Propose Product Idea</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Idea Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dynamic PDF Export formatting layout"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Feature Specification *</label>
                  <textarea
                    className="form-control"
                    placeholder="Describe how the feature works and what needs to be developed..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Customer Problem *</label>
                  <textarea
                    className="form-control"
                    placeholder="Describe what client problem this idea resolves..."
                    value={formData.customerProblem}
                    onChange={(e) => setFormData({ ...formData, customerProblem: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Impact Score (1-10): {formData.impactScore}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="form-control"
                      style={{ padding: 4 }}
                      value={formData.impactScore}
                      onChange={(e) => setFormData({ ...formData, impactScore: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Effort Score (1-10): {formData.effortScore}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="form-control"
                      style={{ padding: 4 }}
                      value={formData.effortScore}
                      onChange={(e) => setFormData({ ...formData, effortScore: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Assigned Owner</label>
                    <select
                      className="form-control"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins (Sales Rep)</option>
                      <option value="David Vance">David Vance (Sales Manager)</option>
                      <option value="Admin Team">Admin Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isViewer}>
                  Propose Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
