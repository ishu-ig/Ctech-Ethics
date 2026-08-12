import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getService,
  updateService,
  deleteService,
} from "../../../Redux/ActionCreators/ServiceActionCreators";

export default function ShowService() {
  const rawData = useSelector((state) => state.ServiceStateData);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const ServiceStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  const loading = rawData?.loading;

  useEffect(() => {
    dispatch(getService());
  }, [dispatch]);

  function deleteRecord(_id) {
    if (window.confirm("Delete this service? Its features and overview will be removed too.")) {
      dispatch(deleteService({ _id }));
    }
  }

  // No dedicated toggle action in the saga setup — updateService already handles
  // partial field updates server-side, so resubmit the record with status flipped.
  // No new image file is attached, so the backend keeps whatever image is already saved.
  function toggleStatus(item) {
    const formData = new FormData();
    formData.append("_id", item._id);
    formData.append("title", item.title);
    formData.append("slug", item.slug);
    formData.append("icon", item.icon);
    formData.append("gradient", item.gradient);
    formData.append("description", item.description);
    formData.append("tagline", item.tagline || "");
    formData.append("status", !item.status);
    formData.append(
      "overview",
      JSON.stringify({
        heading: item.overview?.heading || "",
        paragraphs: item.overview?.paragraphs || [],
        stats: (item.overview?.stats || []).map((s) => ({ value: s.value, label: s.label })),
      })
    );
    formData.append(
      "features",
      JSON.stringify(
        (item.features || []).map((f) => ({
          icon: f.icon,
          title: f.title,
          desc: f.desc,
        }))
      )
    );
    dispatch(updateService(formData));
  }

  const totalCount = ServiceStateData.length;
  const activeCount = ServiceStateData.filter((i) => i.status).length;
  const inactiveCount = ServiceStateData.filter((i) => !i.status).length;

  const filteredData = ServiceStateData.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && item.status) ||
      (statusFilter === "draft" && !item.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{`
        .act-strip { display: inline-flex; align-items: center; gap: 2px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 3px; }
        .act-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-size: 0.88rem; color: #6c757d; transition: background .13s, color .13s, transform .1s; text-decoration: none; position: relative; }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover   { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover     { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover    { background: #fff3cd; color: #856404; }
        .act-btn-del:hover    { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: #dee2e6; flex-shrink: 0; }

        /* Icon chip now carries the service's own gradient with a soft matching glow,
           so the gradient choice is legible at a glance instead of hidden behind a click. */
        .svc-icon-chip {
          width: 44px; height: 44px; border-radius: 12px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1.1rem; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
          transition: transform .15s ease;
        }
        tr:hover .svc-icon-chip { transform: scale(1.06); }

        .svc-title-cell { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .svc-title { font-weight: 600; font-size: 0.9rem; }
        .svc-slug { font-size: 0.72rem; color: #94a3b8; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

        /* Feature preview: small stacked bootstrap-icon chips instead of a bare count,
           so an admin can tell what a service offers without opening it. */
        .feature-chips { display: flex; align-items: center; gap: 4px; }
        .feature-chip {
          width: 24px; height: 24px; border-radius: 6px;
          display: inline-flex; align-items: center; justify-content: center;
          background: #eef2ff; color: #4f46e5; font-size: 0.78rem;
          border: 1px solid #e0e7ff;
        }
        .feature-more { font-size: 0.75rem; color: #94a3b8; margin-left: 2px; }
        .feature-empty { font-size: 0.78rem; color: #cbd5e1; font-style: italic; }

        .segmented { display: inline-flex; background: #f1f3f5; border-radius: 8px; padding: 3px; gap: 2px; }
        .segmented button {
          border: none; background: transparent; font-size: 0.78rem; font-weight: 600;
          padding: 5px 12px; border-radius: 6px; color: #6c757d; cursor: pointer; transition: all .13s;
        }
        .segmented button.active { background: #fff; color: #212529; box-shadow: 0 1px 3px rgba(0,0,0,.1); }

        .empty-state { text-align: center; padding: 48px 16px; }
        .empty-state i { font-size: 2rem; color: #cbd5e1; margin-bottom: 10px; display: block; }
        .empty-state p { color: #94a3b8; margin: 0; font-size: 0.88rem; }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon"><i className="bi bi-grid-1x2-fill"></i></span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Services</h1>
                <p className="text-muted mb-0">Review and manage the services shown on the site.</p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/service/create">
                <i className="bi bi-plus-circle"></i> Add Service
              </Link>
            </div>
          </div>

          <section className="row g-3 mt-2 mb-1">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top"><span className="metric-label">Total</span><span className="metric-icon"><i className="bi bi-grid-1x2-fill"></i></span></div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>services</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top"><span className="metric-label">Active</span><span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span></div>
                <div className="metric-value">{activeCount}</div>
                <div className="metric-meta"><span>published</span><span>on site</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card">
                <div className="metric-top"><span className="metric-label">Inactive</span><span className="metric-icon"><i className="bi bi-eye-slash-fill"></i></span></div>
                <div className="metric-value">{inactiveCount}</div>
                <div className="metric-meta"><span>hidden</span><span>from site</span></div>
              </article>
            </div>
          </section>

          <section className="panel mt-3">
            <div className="panel-header flex-wrap gap-2">
              <div>
                <h2 className="h5 mb-0 section-title"><i className="bi bi-table"></i><span>Service List</span></h2>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                <div className="segmented">
                  <button className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}>All</button>
                  <button className={statusFilter === "published" ? "active" : ""} onClick={() => setStatusFilter("published")}>Published</button>
                  <button className={statusFilter === "draft" ? "active" : ""} onClick={() => setStatusFilter("draft")}>Draft</button>
                </div>
                <div className="input-group input-group-sm" style={{ minWidth: 200 }}>
                  <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                  <input type="text" className="form-control border-start-0" placeholder="Search title or slug..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Service</th>
                    <th scope="col">Features</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center text-muted py-4">Loading…</td></tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-muted" style={{ fontSize: "0.8rem" }}>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <span className="svc-icon-chip" style={{ background: item.gradient }}>
                              <i className={`bi ${item.icon}`}></i>
                            </span>
                            <div className="svc-title-cell">
                              <span className="svc-title text-truncate" style={{ maxWidth: 220 }} title={item.title}>{item.title}</span>
                              <span className="svc-slug">/{item.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {item.features?.length ? (
                            <div className="feature-chips">
                              {item.features.slice(0, 3).map((f, i) => (
                                <span key={i} className="feature-chip" title={f.title}>
                                  <i className={`bi ${f.icon || "bi-check2"}`}></i>
                                </span>
                              ))}
                              {item.features.length > 3 && (
                                <span className="feature-more">+{item.features.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="feature-empty">No features yet</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>
                            {item.status ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="act-strip">
                            <Link className="act-btn act-btn-edit" to={`/service/update/${item._id}`}><i className="bi bi-pencil-square"></i></Link>
                            <span className="act-sep"></span>
                            <button className={`act-btn ${item.status ? "act-btn-off" : "act-btn-on"}`} onClick={() => toggleStatus(item)}>
                              <i className={`bi ${item.status ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                            </button>
                            <span className="act-sep"></span>
                            {localStorage.getItem("role") === "Super Admin" && (
                              <button className="act-btn act-btn-del" onClick={() => deleteRecord(item._id)}><i className="bi bi-trash3-fill"></i></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <i className="bi bi-grid-1x2"></i>
                          <p>{search || statusFilter !== "all" ? "No services match your filters." : "No services yet — add one to get started."}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}