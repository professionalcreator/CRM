import React, { useState } from "react";
import { Search, Plus, Mail, MessageSquare, PlusCircle, CheckCircle, RefreshCcw, HelpCircle, User, Award, List } from "lucide-react";

export default function FeedbackHub({
  feedback = [],
  customers = [],
  onAddFeedback,
  onConvertFeedbackToIdea,
  onConvertFeedbackToTask,
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeFeedbackForIdea, setActiveFeedbackForIdea] = useState(null);
  const [activeFeedbackForTask, setActiveFeedbackForTask] = useState(null);

  // Log Feedback Form State
  const [logFormData, setLogFormData] = useState({
    customerId: "",
    source: "Email",
    feedbackText: ""
  });

  // Convert to Idea Form State
  const [ideaFormData, setIdeaFormData] = useState({
    title: "",
    description: "",
    category: "Features",
    impactScore: 5,
    effortScore: 5,
    priority: "Medium"
  });

  // Convert to Task Form State
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    type: "Email",
    dueDate: "",
    priority: "Medium"
  });

  const handleOpenAdd = () => {
    setLogFormData({
      customerId: customers[0]?.id || "",
      source: "Email",
      feedbackText: ""
    });
    setIsAddOpen(true);
  };

  const handleLogFeedbackSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === logFormData.customerId);
    if (!cust) return;
    onAddFeedback({
      customerId: cust.id,
      customerName: cust.name,
      company: cust.company,
      source: logFormData.source,
      feedbackText: logFormData.feedbackText
    });
    setIsAddOpen(false);
  };

  const handleOpenConvertIdea = (item) => {
    setActiveFeedbackForIdea(item);
    setIdeaFormData({
      title: `Product feature based on ${item.customerName}'s feedback`,
      description: `Client Feedback: "${item.feedbackText}"`,
      category: "Features",
      impactScore: 7,
      effortScore: 4,
      priority: "Medium"
    });
  };

  const handleConvertIdeaSubmit = (e) => {
    e.preventDefault();
    if (!activeFeedbackForIdea) return;
    onConvertFeedbackToIdea(activeFeedbackForIdea.id, ideaFormData);
    setActiveFeedbackForIdea(null);
  };

  const handleOpenConvertTask = (item) => {
    setActiveFeedbackForTask(item);
    setTaskFormData({
      title: `Follow up with ${item.customerName} regarding their request`,
      type: "Email",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
      priority: "Medium"
    });
  };

  const handleConvertTaskSubmit = (e) => {
    e.preventDefault();
    if (!activeFeedbackForTask) return;
    onConvertFeedbackToTask(activeFeedbackForTask.id, {
      ...taskFormData,
      relatedTo: {
        type: "customer",
        id: activeFeedbackForTask.customerId,
        name: activeFeedbackForTask.customerName
      }
    });
    setActiveFeedbackForTask(null);
  };

  const isViewer = userRole === "Viewer";

  // Filter feedback
  const filteredFeedback = feedback.filter(item => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedbackText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="feedback-hub-view">
      
      {isViewer && (
        <div className="role-banner read-only">
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> Feedback tickets are read-only. You cannot register feedback or convert tickets to active tasks.</span>
        </div>
      )}

      {/* Filters panel */}
      <div className="filters-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search feedback content or customer name..."
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
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Converted to Idea">Converted to Idea</option>
            <option value="Converted to Task">Converted to Task</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Record Feedback
          </button>
        </div>
      </div>

      {/* Feedback List/Table */}
      <div className="table-container">
        {filteredFeedback.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No customer feedback logs found matching filters.
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer Contact</th>
                <th>Feedback Text</th>
                <th>Source & Date</th>
                <th>Status Mapping</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map(item => (
                <tr key={item.id}>
                  <td style={{ width: "20%" }}>
                    <div className="name-cell">{item.customerName}</div>
                    <div className="subtext-cell">{item.company}</div>
                  </td>
                  <td style={{ width: "45%" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                      "{item.feedbackText}"
                    </p>
                  </td>
                  <td style={{ width: "15%" }}>
                    <span className="badge badge-stage-lead" style={{ fontSize: "0.65rem" }}>
                      {item.source}
                    </span>
                    <div className="subtext-cell">{item.date}</div>
                  </td>
                  <td style={{ width: "10%" }}>
                    <span
                      className={`badge badge-risk-${
                        item.status === "Pending" ? "medium" : "low"
                      }`}
                      style={{ fontSize: "0.6rem" }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", width: "10%" }}>
                    {item.status === "Pending" ? (
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenConvertIdea(item)}
                          disabled={isViewer}
                          title="Convert to Product Idea"
                          style={{ padding: 6, backgroundColor: "#0d9488" }}
                        >
                          <Award size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenConvertTask(item)}
                          disabled={isViewer}
                          title="Convert to Follow-up Task"
                          style={{ padding: 6 }}
                        >
                          <List size={13} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center", color: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>
                        <CheckCircle size={14} /> Linked
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Feedback Modal */}
      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Record Client Feedback</h2>
              <button className="modal-close-btn" onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleLogFeedbackSubmit}>
              <div className="modal-body">
                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Linked Customer *</label>
                    <select
                      className="form-control"
                      value={logFormData.customerId}
                      onChange={(e) => setLogFormData({ ...logFormData, customerId: e.target.value })}
                      required
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.company})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Feedback Source</label>
                    <select
                      className="form-control"
                      value={logFormData.source}
                      onChange={(e) => setLogFormData({ ...logFormData, source: e.target.value })}
                    >
                      <option value="Email">Email Outreach</option>
                      <option value="Call">Phone Call</option>
                      <option value="Support">Support Ticket</option>
                      <option value="Chat">Live Chat</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback Text *</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter exactly what the client requested or complained about..."
                    value={logFormData.feedbackText}
                    onChange={(e) => setLogFormData({ ...logFormData, feedbackText: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isViewer}>
                  Record Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Idea Modal */}
      {activeFeedbackForIdea && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Convert Feedback to Product Idea</h2>
              <button className="modal-close-btn" onClick={() => setActiveFeedbackForIdea(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleConvertIdeaSubmit}>
              <div className="modal-body">
                <div style={{ backgroundColor: "var(--bg-app)", padding: 12, borderRadius: 6, fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
                  <strong>Origin feedback from {activeFeedbackForIdea.customerName}:</strong>
                  <p style={{ marginTop: 4 }}>"{activeFeedbackForIdea.feedbackText}"</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Idea Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ideaFormData.title}
                    onChange={(e) => setIdeaFormData({ ...ideaFormData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Idea Description *</label>
                  <textarea
                    className="form-control"
                    value={ideaFormData.description}
                    onChange={(e) => setIdeaFormData({ ...ideaFormData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={ideaFormData.category}
                      onChange={(e) => setIdeaFormData({ ...ideaFormData, category: e.target.value })}
                    >
                      <option value="Features">Features</option>
                      <option value="Integration">Integration</option>
                      <option value="UX">UX Design</option>
                      <option value="Performance">Performance</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      className="form-control"
                      value={ideaFormData.priority}
                      onChange={(e) => setIdeaFormData({ ...ideaFormData, priority: e.target.value })}
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
                    <label className="form-label">Impact Score (1-10): {ideaFormData.impactScore}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="form-control"
                      style={{ padding: 4 }}
                      value={ideaFormData.impactScore}
                      onChange={(e) => setIdeaFormData({ ...ideaFormData, impactScore: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Effort Score (1-10): {ideaFormData.effortScore}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="form-control"
                      style={{ padding: 4 }}
                      value={ideaFormData.effortScore}
                      onChange={(e) => setIdeaFormData({ ...ideaFormData, effortScore: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveFeedbackForIdea(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#0d9488" }}>
                  Create Product Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Task Modal */}
      {activeFeedbackForTask && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h2>Schedule Follow-up Task</h2>
              <button className="modal-close-btn" onClick={() => setActiveFeedbackForTask(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleConvertTaskSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Outreach Type</label>
                    <select
                      className="form-control"
                      value={taskFormData.type}
                      onChange={(e) => setTaskFormData({ ...taskFormData, type: e.target.value })}
                    >
                      <option value="Call">Phone Call</option>
                      <option value="Email">Email Follow-up</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Reminder">Internal Reminder</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      className="form-control"
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveFeedbackForTask(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
