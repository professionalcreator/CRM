import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Mail, Phone, UserPlus, Info, Sparkles, Building, RefreshCcw } from "lucide-react";

export default function Leads({
  leads = [],
  onAddLead,
  onEditLead,
  onDeleteLead,
  onConvertLead,
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showConvertConfirm, setShowConvertConfirm] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    interest: "Enterprise License",
    owner: "Sarah Jenkins",
    status: "Lead"
  });

  const sources = ["Website", "Referral", "Cold Outreach", "Event", "Ads"];
  const statuses = ["Lead", "Contacted", "Qualified"];

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "Website",
      interest: "Enterprise License",
      owner: "Sarah Jenkins",
      status: "Lead"
    });
    setEditingLead(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      interest: lead.interest || "Enterprise License",
      owner: lead.owner || "Sarah Jenkins",
      status: lead.status
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingLead) {
      onEditLead({ ...formData, id: editingLead.id });
    } else {
      onAddLead(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  // Helper AI assistant next best actions
  const getAiNextAction = (lead) => {
    if (lead.status === "Lead") {
      return `Schedule initial call. generated via ${lead.source} source.`;
    } else if (lead.status === "Contacted") {
      return `Schedule product demo showing our ${lead.interest || "custom platform"} features.`;
    } else if (lead.status === "Qualified") {
      return `Offer custom enterprise proposal quote. assigned to ${lead.owner}.`;
    }
    return "Schedule follow-up call.";
  };

  // Permissions checks
  const isViewer = userRole === "Viewer";
  const canDelete = userRole === "Admin" || userRole === "Sales Manager";

  // Filtering
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesSource = sourceFilter === "All" || l.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="leads-view">
      {isViewer && (
        <div className="role-banner read-only">
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> You can view lead pipelines, but cannot modify records or trigger conversions.</span>
        </div>
      )}

      {/* Filters panel */}
      <div className="filters-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search leads by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
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

          <select
            className="filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="All">All Sources</option>
            {sources.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        {filteredLeads.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No leads found matching your search.
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Lead & Contact</th>
                <th>Company & Interest</th>
                <th>Source</th>
                <th>Assigned Owner</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="name-cell">{lead.name}</div>
                    <div className="subtext-cell" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <Mail size={11} /> {lead.email}
                    </div>
                    {/* Dynamic AI advice banner */}
                    <div className="lead-ai-advice-banner">
                      <Sparkles size={12} />
                      <span><strong>AI:</strong> {getAiNextAction(lead)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{lead.company}</div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{lead.interest}</span>
                  </td>
                  <td>
                    <span className="badge badge-priority-low" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "0.85rem" }}>{lead.owner}</div>
                    <span className={`badge badge-stage-${lead.status.toLowerCase()}`} style={{ fontSize: "0.6rem", marginTop: 4 }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(lead)}
                        title="Edit Lead"
                        style={{ padding: 6 }}
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowConvertConfirm(lead)}
                        disabled={isViewer}
                        title="Convert to Customer"
                        style={{ padding: 6, backgroundColor: "#10b981" }}
                      >
                        <UserPlus size={13} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteLead(lead.id)}
                        disabled={!canDelete}
                        title={canDelete ? "Delete Lead" : "Insufficient permissions"}
                        style={{ padding: 6 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingLead ? "Edit Lead Details" : "Capture Lead Profile"}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Full Name *</label>
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
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-control"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                      {sources.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Product Interest</label>
                    <select
                      className="form-control"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                      <option value="Enterprise License">Enterprise License</option>
                      <option value="Standard Plan">Standard Plan</option>
                      <option value="Custom Consulting">Custom Consulting</option>
                    </select>
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
                    <label className="form-label">Lead Status</label>
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
                  {editingLead ? "Save Changes" : "Capture Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Confirm Modal */}
      {showConvertConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "450px" }}>
            <div className="modal-header" style={{ borderBottom: "none" }}>
              <h2>Convert to Customer Profile?</h2>
              <button className="modal-close-btn" onClick={() => setShowConvertConfirm(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ padding: "0 24px 24px 24px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  backgroundColor: "#eff6ff",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  color: "#1e3a8a",
                  fontSize: "0.85rem",
                  marginBottom: "16px"
                }}
              >
                <Info size={20} style={{ flexShrink: 0 }} />
                <span>
                  Converting <strong>{showConvertConfirm.name}</strong> from {showConvertConfirm.company} will create a verified customer profile, import notes, and transition their lifecycle.
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                This lead record will be safely resolved and registered under the <strong>Customers</strong> workspace.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: "none" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowConvertConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#10b981" }}
                onClick={() => {
                  onConvertLead(showConvertConfirm.id);
                  setShowConvertConfirm(null);
                }}
              >
                Convert Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
