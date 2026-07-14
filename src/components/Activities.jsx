import React, { useState } from "react";
import { Search, Plus, Calendar, Mail, Phone, Clock, CheckSquare, Trash2, Info, RefreshCw } from "lucide-react";

export default function Activities({
  tasks = [],
  leads = [],
  customers = [],
  onAddTask,
  onToggleTask,
  onDeleteTask,
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Pending"); // Default to pending

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "Call",
    dueDate: "",
    priority: "Medium",
    relatedType: "none",
    relatedId: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Call",
      dueDate: "",
      priority: "Medium",
      relatedType: "none",
      relatedId: ""
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    let relatedTo = null;
    if (formData.relatedType === "lead" && formData.relatedId) {
      const match = leads.find(l => l.id === formData.relatedId);
      if (match) relatedTo = { type: "lead", id: match.id, name: match.name };
    } else if (formData.relatedType === "customer" && formData.relatedId) {
      const match = customers.find(c => c.id === formData.relatedId);
      if (match) relatedTo = { type: "customer", id: match.id, name: match.name };
    }

    onAddTask({
      title: formData.title,
      type: formData.type,
      dueDate: formData.dueDate,
      priority: formData.priority,
      relatedTo
    });

    setIsModalOpen(false);
    resetForm();
  };

  const isViewer = userRole === "Viewer";
  const canDelete = userRole === "Admin" || userRole === "Sales Manager";

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || task.type === typeFilter;
    
    let matchesStatus = true;
    if (statusFilter === "Pending") matchesStatus = !task.completed;
    if (statusFilter === "Completed") matchesStatus = task.completed;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="activities-view">
      {isViewer && (
        <div className="role-banner read-only">
          <Info size={16} />
          <span><strong>Read-Only Mode:</strong> Task reminders are read-only. You cannot schedule follow-ups or check task checklist items.</span>
        </div>
      )}

      {/* Filter panel */}
      <div className="filters-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-pos" />
          <input
            type="text"
            placeholder="Search task follow-ups..."
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
            <option value="Completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Reminder">Reminder</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            disabled={isViewer}
          >
            <Plus size={16} />
            Schedule Task
          </button>
        </div>
      </div>

      {/* Task Checklist Table */}
      <div className="table-container">
        {filteredTasks.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No task checklists found matching filters.
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Done</th>
                <th>Task Title</th>
                <th>Task Type</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Related Account</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} style={{ opacity: task.completed ? 0.6 : 1 }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      disabled={isViewer}
                      style={{ cursor: "pointer", width: 16, height: 16 }}
                    />
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, textDecoration: task.completed ? "line-through" : "none" }}>
                      {task.title}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-stage-discovery" style={{ fontSize: "0.65rem" }}>
                      {task.type}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.85rem" }}>
                      <Calendar size={12} /> {task.dueDate}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-risk-${task.priority === "Critical" ? "high" : task.priority === "High" ? "medium" : "low"}`} style={{ fontSize: "0.65rem" }}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {task.relatedTo ? (
                      <div>
                        <strong style={{ fontSize: "0.8rem", color: "var(--text-main)" }}>{task.relatedTo.name}</strong>
                        <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-light)" }}>({task.relatedTo.type})</span>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>General</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteTask(task.id)}
                      disabled={!canDelete}
                      title={canDelete ? "Delete Task" : "Insufficient permissions"}
                      style={{ padding: 6 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h2>Schedule Task</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Action Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Email follow-up integration draft"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Task Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Call">Call</option>
                      <option value="Email">Email</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Reminder">Reminder</option>
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

                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row-flex">
                  <div>
                    <label className="form-label">Link Related Entity</label>
                    <select
                      className="form-control"
                      value={formData.relatedType}
                      onChange={(e) => setFormData({ ...formData, relatedType: e.target.value, relatedId: "" })}
                    >
                      <option value="none">None (General)</option>
                      <option value="lead">Active Lead</option>
                      <option value="customer">Customer Directory</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Select Entity</label>
                    <select
                      className="form-control"
                      value={formData.relatedId}
                      onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                      disabled={formData.relatedType === "none"}
                      required={formData.relatedType !== "none"}
                    >
                      <option value="">-- Choose target --</option>
                      {formData.relatedType === "lead" && leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.company})</option>
                      ))}
                      {formData.relatedType === "customer" && customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
