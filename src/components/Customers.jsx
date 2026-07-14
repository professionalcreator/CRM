import React, { useState } from "react";
import { Search, Plus, Mail, Phone, Calendar, MessageSquare, Tag, PlusCircle, Trash2, X, Info, Lightbulb, User, Users, ShieldAlert, Award, FileText, CheckCircle } from "lucide-react";

export default function Customers({
  customers = [],
  deals = [],
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onAddNote,
  onLogComm,
  onAddSupport,
  onResolveSupport,
  userRole,
  activeUserId
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isRefExpanded, setIsRefExpanded] = useState(false);

  // Drawer states
  const [activeCustomer, setActiveCustomer] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  
  // Communication logger state
  const [commType, setCommType] = useState("Call");
  const [commSummary, setCommSummary] = useState("");

  // Support ticket form state
  const [supportTitle, setSupportTitle] = useState("");
  const [supportPriority, setSupportPriority] = useState("Low");

  // New Customer Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    tagsInput: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      tagsInput: ""
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const tagsArr = formData.tagsInput ? formData.tagsInput.split(",").map(t => t.trim()) : [];
    onAddCustomer({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      tags: tagsArr
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeCustomer) return;
    onAddNote(activeCustomer.id, newNoteText.trim());
    setNewNoteText("");
    // Sync activeCustomer state from prop
    const updated = customers.find(c => c.id === activeCustomer.id);
    if (updated) {
      setActiveCustomer({
        ...updated,
        notes: [{ id: Date.now(), text: newNoteText.trim(), date: new Date().toISOString(), author: activeUserId }, ...updated.notes]
      });
    }
  };

  const handleLogCommSubmit = (e) => {
    e.preventDefault();
    if (!commSummary.trim() || !activeCustomer) return;
    onLogComm(activeCustomer.id, commType, commSummary.trim());
    setCommSummary("");
    const updated = customers.find(c => c.id === activeCustomer.id);
    if (updated) {
      setActiveCustomer({
        ...updated,
        communicationTimeline: [{ id: Date.now(), type: commType, summary: commSummary.trim(), date: new Date().toISOString().split("T")[0] }, ...updated.communicationTimeline]
      });
    }
  };

  const handleAddSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportTitle.trim() || !activeCustomer) return;
    onAddSupport(activeCustomer.id, supportTitle.trim(), "Created via support logger panel", supportPriority);
    setSupportTitle("");
    const updated = customers.find(c => c.id === activeCustomer.id);
    if (updated) {
      setActiveCustomer({
        ...updated,
        supportRequests: [{ id: Date.now(), title: supportTitle.trim(), description: "Created via support logger panel", priority: supportPriority, status: "Open", date: new Date().toISOString().split("T")[0] }, ...updated.supportRequests]
      });
    }
  };

  const handleResolveTicket = (ticketId) => {
    if (!activeCustomer) return;
    onResolveSupport(activeCustomer.id, ticketId);
    const updated = customers.find(c => c.id === activeCustomer.id);
    if (updated) {
      setActiveCustomer({
        ...updated,
        supportRequests: updated.supportRequests.map(s => s.id === ticketId ? { ...s, status: "Resolved" } : s)
      });
    }
  };

  // Extract all tags for filter list
  const allTags = ["All", ...new Set(customers.flatMap(c => c.tags || []))];

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === "All" || c.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const isViewer = userRole === "Viewer";
  const canDelete = userRole === "Admin" || userRole === "Sales Manager";

  return (
    <div className="customers-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-illustration-banner banner-customers">
        <img src={`${import.meta.env.BASE_URL}customer_relations.png`} alt="" />
        <div className="banner-content">
          <div className="banner-icon">
            <Users size={28} />
          </div>
          <div className="banner-text">
            <h3>Customer Relationship Hub</h3>
            <p>Build stronger relationships with full communication history, support tracking, and customer insights.</p>
          </div>
        </div>
      </div>

      {/* UI/UX Reference Mockups Panel */}
      <div className="dashboard-card">
        <div className="card-header-flex" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Lightbulb size={18} style={{ color: "var(--primary-color)" }} />
            Customer Profile UI/UX Reference Guide
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
              <img src={`${import.meta.env.BASE_URL}customer_drawer_mockup.png`} alt="Customer Profile Design Mockup" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* Right Side: Key points */}
            <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                Client Drawer Specifications
              </h4>
              <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "8px", lineHeight: "1.4", color: "var(--text-muted)" }}>
                <li><strong>Focus Panel Overlay</strong>: Side drawer overlay keeps directory list active in the background.</li>
                <li><strong>Chronological Activity Timeline</strong>: Standardized connecting lines tracking client call, email, and meeting logs.</li>
                <li><strong>Tag Categorization</strong>: Displays pill badge groups representing account status.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {isViewer && (
        <div className="role-banner read-only" style={{ marginBottom: 0 }}>
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> Customer accounts are locked. You cannot register clients, log timelines, or post note responses.</span>
        </div>
      )}

      {/* Filter and action buttons */}
      <div className="filters-panel" style={{ marginBottom: 0 }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search customers by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === "All" ? "All Tags" : tag}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "var(--text-muted)", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            No customers found matching filters.
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="dashboard-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
                cursor: "pointer",
                border: activeCustomer?.id === customer.id ? "2px solid var(--primary-color)" : "1px solid var(--border-color)",
                transition: "all 0.2s ease"
              }}
              onClick={() => setActiveCustomer(customer)}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {customer.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      {customer.company}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete customer ${customer.name}?`)) onDeleteCustomer(customer.id);
                      }}
                      style={{ border: "none", color: "#ef4444", padding: 4 }}
                      title="Delete Customer Profile"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={12} /> {customer.email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={12} /> {customer.phone}
                  </div>
                </div>
              </div>

              {/* Tags Pilling */}
              <div className="tags-list" style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {customer.tags?.map((tag) => (
                  <span key={tag} className="badge badge-stage-discovery" style={{ fontSize: "0.65rem", padding: "2px 8px", backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Profile Side Drawer */}
      {activeCustomer && (
        <>
          <div className="drawer-overlay" onClick={() => setActiveCustomer(null)}></div>
          <div className="drawer">
            <div className="drawer-header">
              <div className="drawer-title-group">
                <h2>{activeCustomer.name}</h2>
                <p>{activeCustomer.company}</p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveCustomer(null)}
                style={{ padding: 6 }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Profile Contact Segment */}
              <div className="drawer-section">
                <div className="drawer-section-title">Contact Information</div>
                <div className="drawer-info-grid">
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{activeCustomer.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{activeCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Purchase History Segment */}
              <div className="drawer-section">
                <div className="drawer-section-title">Purchase History</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {activeCustomer.purchaseHistory?.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No purchase history recorded.</span>
                  ) : (
                    activeCustomer.purchaseHistory?.map(p => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", backgroundColor: "var(--bg-app)", padding: 8, borderRadius: 6 }}>
                        <span>{p.product} ({p.date})</span>
                        <strong style={{ color: "#059669" }}>${p.amount.toLocaleString()}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Support Tickets Section */}
              <div className="drawer-section">
                <div className="drawer-section-title">Support requests</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {activeCustomer.supportRequests?.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No active support requests.</span>
                  ) : (
                    activeCustomer.supportRequests?.map(s => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "8px 12px", borderRadius: 6, fontSize: "0.8rem" }}>
                        <div>
                          <strong>{s.title}</strong>
                          <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)" }}>Priority: {s.priority} | Filed: {s.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className={`badge badge-risk-${s.status === "Open" ? "high" : "low"}`} style={{ fontSize: "0.6rem" }}>
                            {s.status}
                          </span>
                          {s.status === "Open" && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "2px 6px", fontSize: "0.65rem" }}
                              onClick={() => handleResolveTicket(s.id)}
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* File Support ticket */}
                <form onSubmit={handleAddSupportSubmit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="File support ticket summary..."
                    value={supportTitle}
                    onChange={(e) => setSupportTitle(e.target.value)}
                    style={{ fontSize: "0.8rem", padding: 8 }}
                    disabled={isViewer}
                  />
                  <select
                    className="form-control"
                    value={supportPriority}
                    onChange={(e) => setSupportPriority(e.target.value)}
                    style={{ fontSize: "0.8rem", width: 100, padding: 8 }}
                    disabled={isViewer}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isViewer}>
                    File
                  </button>
                </form>
              </div>

              {/* Log Communication Form */}
              <div className="drawer-section">
                <div className="drawer-section-title">Log Communication</div>
                <form onSubmit={handleLogCommSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      className="form-control"
                      value={commType}
                      onChange={(e) => setCommType(e.target.value)}
                      style={{ fontSize: "0.8rem", width: 110, padding: 8 }}
                      disabled={isViewer}
                    >
                      <option value="Call">Call</option>
                      <option value="Email">Email</option>
                      <option value="Meeting">Meeting</option>
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Summary of communication..."
                      value={commSummary}
                      onChange={(e) => setCommSummary(e.target.value)}
                      style={{ fontSize: "0.8rem", padding: 8 }}
                      required
                      disabled={isViewer}
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-end" }} disabled={isViewer}>
                    Log Contact
                  </button>
                </form>
              </div>

              {/* Communication Timeline */}
              <div className="drawer-section">
                <div className="drawer-section-title">Outreach History</div>
                <div className="comm-timeline">
                  {activeCustomer.communicationTimeline?.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No communications logged.</span>
                  ) : (
                    activeCustomer.communicationTimeline?.map(t => (
                      <div key={t.id} className="comm-item">
                        <div className="comm-icon-bullet"></div>
                        <div className="comm-header">
                          <span className="comm-type-title">{t.type} Outreach</span>
                          <span className="comm-date">{t.date}</span>
                        </div>
                        <p className="comm-summary">{t.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Notes */}
              <div className="drawer-section">
                <div className="drawer-section-title">Internal Notes</div>
                <form onSubmit={handleAddNoteSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write private customer notes..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    style={{ fontSize: "0.8rem", padding: 8 }}
                    required
                    disabled={isViewer}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isViewer}>
                    Add Note
                  </button>
                </form>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activeCustomer.notes?.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No notes added.</span>
                  ) : (
                    activeCustomer.notes?.map(note => (
                      <div key={note.id} style={{ backgroundColor: "var(--bg-app)", padding: 10, borderRadius: 6, fontSize: "0.8rem" }}>
                        <p style={{ color: "var(--text-main)" }}>{note.text}</p>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-light)", marginTop: 4 }}>
                          By: {note.author} | {new Date(note.date).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register Customer Profile</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Client Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Company Name *</label>
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
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Enterprise, Aviation, High Value"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isViewer}>
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
