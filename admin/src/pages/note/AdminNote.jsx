import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getNote,
  deleteNote,
  updateNote,
} from "../../Redux/ActionCreators/NoteActionCreators";

const CATEGORIES = ["All", "Work", "Ideas", "Architecture", "Personal", "Todo", "Other"];

export default function AdminNote() {
  const dispatch = useDispatch();
  const NoteStateData = useSelector((state) => state.NoteStateData);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [viewingNote, setViewingNote] = useState(null); // for modal
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    dispatch(getNote());
  }, [dispatch]);

  const notes = Array.isArray(NoteStateData) ? NoteStateData : [];

  const totalCount = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const highPriorityCount = notes.filter((n) => n.priority === "High").length;
  const activeCount = notes.filter((n) => n.active).length;

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchCat =
        selectedCategory === "All" || note.category === selectedCategory;
      const matchPri =
        selectedPriority === "All" || note.priority === selectedPriority;
      const matchSearch =
        !search ||
        note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.content?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchPri && matchSearch;
    });
  }, [notes, selectedCategory, selectedPriority, search]);

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      dispatch(deleteNote({ _id }));
      if (viewingNote?._id === _id) setViewingNote(null);
    }
  };

  const handleTogglePin = (note) => {
    dispatch(updateNote({ _id: note._id, isPinned: !note.isPinned }));
  };

  const handleToggleActive = (note) => {
    dispatch(updateNote({ _id: note._id, active: !note.active }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">
        {/* Heading */}
        <div className="page-heading d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-journal-text text-primary" style={{ fontSize: "1.4rem" }}></i>
            </span>
            <div>
              <p className="eyebrow mb-0 text-muted small text-uppercase">Workspace Notes</p>
              <h1 className="h3 mb-0 fw-bold">Notes & Documentation</h1>
              <p className="text-muted mb-0 small">
                Manage, pin, organize, and inspect all team and personal notes.
              </p>
            </div>
          </div>
          <div className="heading-actions d-flex gap-2">
            <Link className="btn btn-primary btn-sm px-3" to="/note/create">
              <i className="bi bi-plus-lg me-1"></i> New Note
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Total Notes</span>
                  <h4 className="fw-bold m-0 mt-1">{totalCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                  <i className="bi bi-journal-bookmark fs-5"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Pinned</span>
                  <h4 className="fw-bold m-0 mt-1 text-warning">{pinnedCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                  <i className="bi bi-pin-angle-fill fs-5"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">High Priority</span>
                  <h4 className="fw-bold m-0 mt-1 text-danger">{highPriorityCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small">Active</span>
                  <h4 className="fw-bold m-0 mt-1 text-success">{activeCount}</h4>
                </div>
                <div className="p-2 rounded-3 bg-success-subtle text-success">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-body">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search notes by title or content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="col-12 col-md-5">
              <div className="d-flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${
                      selectedCategory === cat
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    style={{ fontSize: "0.78rem", padding: "3px 10px" }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority and View Controls */}
            <div className="col-12 col-md-3 d-flex justify-content-md-end gap-2 align-items-center">
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="All">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <i className="bi bi-grid-fill"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "table" ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("table")}
                  title="Table View"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area: Grid or Table */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-5 card border-0 shadow-sm rounded-3 bg-body">
            <div className="my-4">
              <i className="bi bi-journal-x display-4 text-muted opacity-50 d-block mb-3"></i>
              <h5 className="fw-bold">No notes found</h5>
              <p className="text-muted small">
                {notes.length === 0
                  ? "Start by creating your first note or document."
                  : "No notes matched your search criteria."}
              </p>
              <Link to="/note/create" className="btn btn-primary btn-sm mt-2">
                <i className="bi bi-plus-lg me-1"></i> Create Note
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="row g-3">
            {filteredNotes.map((note) => {
              const priorityClass =
                note.priority === "High"
                  ? "badge bg-danger-subtle text-danger"
                  : note.priority === "Low"
                  ? "badge bg-secondary-subtle text-secondary"
                  : "badge bg-primary-subtle text-primary";

              return (
                <div key={note._id} className="col-12 col-md-6 col-xl-4">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-3 position-relative overflow-hidden bg-body"
                    style={{
                      borderTop: `4px solid ${note.color || "#6366f1"}`,
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <div className="card-body p-3 d-flex flex-column">
                      {/* Top Badges */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex gap-1 align-items-center flex-wrap">
                          <span
                            className="badge bg-body-secondary text-body"
                            style={{ fontSize: "0.72rem" }}
                          >
                            {note.category || "General"}
                          </span>
                          <span
                            className={priorityClass}
                            style={{ fontSize: "0.72rem" }}
                          >
                            {note.priority}
                          </span>
                          {!note.active && (
                            <span
                              className="badge bg-warning-subtle text-warning"
                              style={{ fontSize: "0.72rem" }}
                            >
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Pin Button */}
                        <button
                          type="button"
                          className={`btn btn-link p-0 ${
                            note.isPinned ? "text-warning" : "text-muted"
                          }`}
                          onClick={() => handleTogglePin(note)}
                          title={note.isPinned ? "Unpin note" : "Pin note to top"}
                          style={{ fontSize: "1.1rem" }}
                        >
                          <i
                            className={
                              note.isPinned
                                ? "bi bi-pin-angle-fill"
                                : "bi bi-pin-angle"
                            }
                          ></i>
                        </button>
                      </div>

                      {/* Title */}
                      <h5
                        className="fw-bold mb-2 text-truncate"
                        style={{ cursor: "pointer" }}
                        onClick={() => setViewingNote(note)}
                      >
                        {note.title}
                      </h5>

                      {/* Content Preview */}
                      <p
                        className="text-muted small mb-3 flex-grow-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          cursor: "pointer",
                        }}
                        onClick={() => setViewingNote(note)}
                      >
                        {note.content}
                      </p>

                      {/* Footer Info & Actions */}
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleDateString()
                            : "Recent"}
                        </span>

                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-muted p-1 px-2 rounded"
                            title="Quick View"
                            onClick={() => setViewingNote(note)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-muted p-1 px-2 rounded"
                            title="Copy Content"
                            onClick={() => handleCopy(note.content, note._id)}
                          >
                            <i
                              className={
                                copiedId === note._id
                                  ? "bi bi-check2 text-success"
                                  : "bi bi-clipboard"
                              }
                            ></i>
                          </button>
                          <Link
                            to={`/note/update/${note._id}`}
                            className="btn btn-sm btn-light text-primary p-1 px-2 rounded"
                            title="Edit Note"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-danger p-1 px-2 rounded"
                            title="Delete Note"
                            onClick={() => handleDelete(note._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="card border-0 shadow-sm rounded-3 bg-body overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map((note) => (
                    <tr key={note._id}>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-link p-0 ${
                            note.isPinned ? "text-warning" : "text-muted"
                          }`}
                          onClick={() => handleTogglePin(note)}
                        >
                          <i
                            className={
                              note.isPinned
                                ? "bi bi-pin-angle-fill"
                                : "bi bi-pin-angle"
                            }
                          ></i>
                        </button>
                      </td>
                      <td>
                        <div
                          className="fw-semibold text-truncate"
                          style={{ maxWidth: 280, cursor: "pointer" }}
                          onClick={() => setViewingNote(note)}
                        >
                          <span
                            className="d-inline-block rounded-circle me-2"
                            style={{
                              width: 8,
                              height: 8,
                              background: note.color || "#6366f1",
                            }}
                          ></span>
                          {note.title}
                        </div>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: 280 }}>
                          {note.content?.slice(0, 60)}...
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-body-secondary text-body">
                          {note.category || "General"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            note.priority === "High"
                              ? "badge bg-danger-subtle text-danger"
                              : note.priority === "Low"
                              ? "badge bg-secondary-subtle text-secondary"
                              : "badge bg-primary-subtle text-primary"
                          }
                        >
                          {note.priority}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            note.active
                              ? "btn-outline-success"
                              : "btn-outline-secondary"
                          }`}
                          style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                          onClick={() => handleToggleActive(note)}
                        >
                          {note.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="text-muted small">
                        {note.createdAt
                          ? new Date(note.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-muted"
                            title="Quick View"
                            onClick={() => setViewingNote(note)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-muted"
                            title="Copy Content"
                            onClick={() => handleCopy(note.content, note._id)}
                          >
                            <i
                              className={
                                copiedId === note._id
                                  ? "bi bi-check2 text-success"
                                  : "bi bi-clipboard"
                              }
                            ></i>
                          </button>
                          <Link
                            to={`/note/update/${note._id}`}
                            className="btn btn-sm btn-light text-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-light text-danger"
                            title="Delete"
                            onClick={() => handleDelete(note._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {viewingNote && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingNote(null);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-body">
              <div
                className="modal-header border-bottom py-3 px-4"
                style={{ borderLeft: `6px solid ${viewingNote.color || "#6366f1"}` }}
              >
                <div>
                  <div className="d-flex gap-2 align-items-center mb-1">
                    <span className="badge bg-body-secondary text-body small">
                      {viewingNote.category}
                    </span>
                    <span
                      className={
                        viewingNote.priority === "High"
                          ? "badge bg-danger-subtle text-danger"
                          : viewingNote.priority === "Low"
                          ? "badge bg-secondary-subtle text-secondary"
                          : "badge bg-primary-subtle text-primary"
                      }
                    >
                      {viewingNote.priority} Priority
                    </span>
                    {viewingNote.isPinned && (
                      <span className="badge bg-warning-subtle text-warning">
                        <i className="bi bi-pin-angle-fill me-1"></i> Pinned
                      </span>
                    )}
                  </div>
                  <h4 className="modal-title fw-bold m-0">{viewingNote.title}</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewingNote(null)}
                ></button>
              </div>

              <div className="modal-body p-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
                <div
                  className="p-3 rounded-3 bg-body-secondary text-body"
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    fontFamily: "inherit",
                  }}
                >
                  {viewingNote.content}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
                  <span>
                    Created:{" "}
                    {viewingNote.createdAt
                      ? new Date(viewingNote.createdAt).toLocaleString()
                      : "—"}
                  </span>
                  <span>
                    Last Updated:{" "}
                    {viewingNote.updatedAt
                      ? new Date(viewingNote.updatedAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="modal-footer border-top px-4 py-3 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleCopy(viewingNote.content, viewingNote._id)}
                >
                  <i
                    className={
                      copiedId === viewingNote._id
                        ? "bi bi-check2 text-success me-1"
                        : "bi bi-clipboard me-1"
                    }
                  ></i>
                  {copiedId === viewingNote._id ? "Copied to Clipboard" : "Copy Note"}
                </button>

                <div className="d-flex gap-2">
                  <Link
                    to={`/note/update/${viewingNote._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit Note
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setViewingNote(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
