import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createNote } from "../../Redux/ActionCreators/NoteActionCreators";

const CATEGORIES = ["Work", "Ideas", "Architecture", "Personal", "Todo", "Other"];
const COLOR_PRESETS = [
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#8b5cf6", // Purple
];

export default function AdminCreateNote() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    title: "",
    content: "",
    category: "Work",
    priority: "Medium",
    color: "#6366f1",
    isPinned: false,
    active: true,
  });

  const [error, setError] = useState({});
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!data.title.trim()) errs.title = "Title is mandatory";
    if (!data.content.trim()) errs.content = "Content is mandatory";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setError(errs);
      setShowError(true);
      return;
    }

    dispatch(createNote(data));
    navigate("/note");
  };

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        {/* Page Heading */}
        <div className="page-heading d-flex justify-content-between align-items-center mb-4">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle text-primary" style={{ fontSize: "1.4rem" }}></i>
            </span>
            <div>
              <p className="eyebrow mb-0 text-muted small text-uppercase">Workspace Notes</p>
              <h1 className="h3 mb-0 fw-bold">Create New Note</h1>
              <p className="text-muted mb-0 small">
                Add a new note, architecture idea, or project checklist to your workspace.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/note">
              <i className="bi bi-arrow-left me-1"></i> Back to Notes
            </Link>
          </div>
        </div>

        {showError && Object.values(error).some(Boolean) && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Please fill in all mandatory fields before submitting.
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowError(false)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Main Note Editor */}
            <div className="col-12 col-xl-8">
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-body">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-pencil text-primary"></i> Note Content
                </h5>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="title">
                    Note Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-control ${error.title ? "is-invalid" : ""}`}
                    placeholder="e.g. System Architecture Roadmap, Deployment Checklist..."
                    value={data.title}
                    onChange={handleChange}
                  />
                  {error.title && <div className="invalid-feedback">{error.title}</div>}
                </div>

                {/* Content */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="content">
                    Note Body / Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={12}
                    className={`form-control ${error.content ? "is-invalid" : ""}`}
                    placeholder="Write your note details, markdown, instructions, credentials or thoughts here..."
                    value={data.content}
                    onChange={handleChange}
                    style={{ lineHeight: 1.6 }}
                  ></textarea>
                  {error.content && <div className="invalid-feedback">{error.content}</div>}
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                  <Link to="/note" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-check-circle me-1"></i> Save Note
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Meta Controls */}
            <div className="col-12 col-xl-4">
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-body mb-3">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-primary"></i> Organization & Tags
                </h5>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="category">
                    Category / Folder
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={data.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase" htmlFor="priority">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select"
                    value={data.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                {/* Color Accent Picker */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase">
                    Color Accent
                  </label>
                  <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                    {COLOR_PRESETS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        className="rounded-circle border-0 p-0"
                        style={{
                          width: 28,
                          height: 28,
                          backgroundColor: hex,
                          outline: data.color === hex ? "3px solid #000" : "none",
                          cursor: "pointer",
                        }}
                        onClick={() => setData((prev) => ({ ...prev, color: hex }))}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Pinned Switch */}
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isPinned"
                    name="isPinned"
                    checked={data.isPinned}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="isPinned">
                    <i className="bi bi-pin-angle-fill text-warning me-1"></i> Pin Note to Top
                  </label>
                </div>

                {/* Active Status */}
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="active"
                    name="active"
                    checked={data.active}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="active">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
