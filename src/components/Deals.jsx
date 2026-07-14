import React, { useState } from "react";
import { Search, Plus, Calendar, DollarSign, Target, User, Info, Trash2, Lightbulb } from "lucide-react";

export default function Deals({
  deals = [],
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
  onMoveDeal,
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isRefExpanded, setIsRefExpanded] = useState(false);
  
  // Drag states
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    amount: "",
    stage: "Lead",
    priority: "Medium",
    closeDate: "",
    contactName: "",
    contactEmail: "",
    assignedTo: "Sarah Jenkins"
  });

  const stages = ["Lead", "Discovery", "Demo", "Proposal", "Closed Won", "Closed Lost"];

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      amount: "",
      stage: "Lead",
      priority: "Medium",
      closeDate: "",
      contactName: "",
      contactEmail: "",
      assignedTo: "Sarah Jenkins"
    });
    setEditingDeal(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      company: deal.company,
      amount: deal.amount,
      stage: deal.stage,
      priority: deal.priority,
      closeDate: deal.closeDate,
      contactName: deal.contactName || "",
      contactEmail: deal.contactEmail || "",
      assignedTo: deal.assignedTo || "Sarah Jenkins"
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0
    };
    if (editingDeal) {
      onEditDeal({ ...payload, id: editingDeal.id });
    } else {
      onAddDeal(payload);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id, e) => {
    e.preventDefault();
    if (confirm("Delete this pipeline deal opportunity?")) {
      onDeleteDeal(id);
      setIsModalOpen(false);
    }
  };

  // Drag and Drop
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData("text/plain", dealId);
  };

  const handleDragOver = (e, columnStage) => {
    e.preventDefault();
    setDragOverColumn(columnStage);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const dealId = e.dataTransfer.getData("text/plain");
    if (dealId) {
      onMoveDeal(dealId, targetStage);
    }
  };

  const isViewer = userRole === "Viewer";
  const canDelete = userRole === "Admin" || userRole === "Sales Manager";

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === "All" || deal.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="deals-view" style={{ display: "flex", flexDirection: "column", height: "100%", gap: "24px" }}>
      
      {/* UI/UX Reference Mockups Panel */}
      <div className="dashboard-card">
        <div className="card-header-flex" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Lightbulb size={18} style={{ color: "var(--primary-color)" }} />
            Deals Kanban UI/UX Reference Guide
          </h2>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsRefExpanded(!isRefExpanded)}
          >
            {isRefExpanded ? "Hide Reference" : "Show Reference"}
          </button>
        </div>

        {isRefExpanded && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left Side: Mockup Image */}
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center" }}>
              <img src="/kanban_mockup.png" alt="Deals Kanban Design Mockup" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* Right Side: Key points */}
            <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                Kanban Pipeline Specifications
              </h4>
              <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "8px", lineHeight: "1.4", color: "var(--text-muted)" }}>
                <li><strong>Visual Columns</strong>: Standardized headers with column totals and item counts.</li>
                <li><strong>Draggable Deal Cards</strong>: HTML5 grab handlers to move contracts between columns.</li>
                <li><strong>Dashed Target Outlines</strong>: Highlights target columns during active drop states.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {isViewer && (
        <div className="role-banner read-only" style={{ marginBottom: 0 }}>
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> Deal stages are locked. You cannot drag cards or launch new contracts.</span>
        </div>
      )}

      {/* Filter panel */}
      <div className="filters-panel" style={{ marginBottom: 0 }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search deals by contract name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Launch Deal
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-board-wrapper">
        <div className="kanban-container">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            const totalValue = stageDeals.reduce((sum, d) => sum + Number(d.amount), 0);
            const isOver = dragOverColumn === stage;

            return (
              <div
                key={stage}
                className={`kanban-column ${isOver ? "drag-over" : ""}`}
                onDragOver={(e) => !isViewer && handleDragOver(e, stage)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => !isViewer && handleDrop(e, stage)}
              >
                <div className="column-header">
                  <div className="column-title-group">
                    <span className="column-title">{stage}</span>
                    <span className="column-count">{stageDeals.length}</span>
                  </div>
                  <span className="column-total">${totalValue.toLocaleString()}</span>
                </div>

                <div className="kanban-cards-wrapper">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="deal-kanban-card"
                      draggable={!isViewer}
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => handleOpenEdit(deal)}
                      style={{ opacity: isViewer ? 0.95 : 1 }}
                    >
                      <div>
                        <h4 className="deal-title">{deal.name}</h4>
                        <div className="deal-company">
                          <Target size={11} /> {deal.company}
                        </div>
                      </div>

                      <div className="deal-amount">${Number(deal.amount).toLocaleString()}</div>

                      <div className="deal-meta-row">
                        <span className="deal-close-date" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <Calendar size={11} /> {deal.closeDate}
                        </span>
                        <span className={`badge badge-risk-${deal.priority === "Critical" ? "high" : deal.priority === "High" ? "medium" : "low"}`} style={{ fontSize: "0.6rem", padding: "1px 5px" }}>
                          {deal.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--text-light)", fontSize: "0.75rem", border: "1px dashed var(--border-color)", borderRadius: 8 }}>
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Deal Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingDeal ? "Edit Deal Details" : "Launch Deal Opportunity"}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Deal Contract Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Company Account *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Deal Value Amount ($) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Projected Close Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.closeDate}
                      onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Deal Stage</label>
                    <select
                      className="form-control"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    >
                      {stages.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Contract Priority</label>
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
                    <label className="form-label">Client Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Client Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Sales Owner</label>
                  <select
                    className="form-control"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins (Sales Representative)</option>
                    <option value="David Vance">David Vance (Sales Manager)</option>
                    <option value="Admin Team">Admin Team</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer" style={{ justifyContent: editingDeal && canDelete ? "space-between" : "flex-end" }}>
                {editingDeal && canDelete && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(e) => handleDelete(editingDeal.id, e)}
                  >
                    <Trash2 size={16} /> Delete Opportunity
                  </button>
                )}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isViewer}>
                    {editingDeal ? "Save Details" : "Launch Contract"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
