import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "../../Redux/ActionCreators/PortfolioActionCreators";

export default function AdminPortfolio() {
  let PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  let dispatch = useDispatch();

  let [search, setSearch] = useState("");

  const totalCount = PortfolioStateData.length;
  const activeCount = PortfolioStateData.filter((t) => t.status).length;
  const inactiveCount = PortfolioStateData.filter((t) => !t.status).length;

  let filteredData = PortfolioStateData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deletePortfolio({ _id }));
    }
  }

  function updateRecord(_id) {
    const item = PortfolioStateData.find((t) => t._id === _id);
    if (!item) return;
    let formData = new FormData();
    formData.append("_id", _id);
    formData.append("title", item.title);
    formData.append("category", item.category);
    formData.append("desc", item.desc);
    formData.append("link", item.link ?? "");
    formData.append("status", !item.status);
    formData.append("tech", JSON.stringify(item.tech ?? []));
    formData.append("images", JSON.stringify(item.images ?? []));
    dispatch(updatePortfolio(formData));
  }

  function getAPIData() {
    dispatch(getPortfolio());
  }

  useEffect(() => {
    getAPIData();
  }, []);

  return (
    <>
      <style>{`
        .metric-card { border-radius: 12px; border: 1px solid rgba(0,0,0,.08); padding: 18px 20px 14px; position: relative; overflow: hidden; transition: transform .15s, box-shadow .15s; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.10); }
        .metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .metric-label { font-size: 0.7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .75; }
        .metric-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; background: rgba(255,255,255,.3); }
        .metric-value { font-size: 1.9rem; font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .metric-meta { font-size: 0.75rem; opacity: .75; display: flex; gap: 4px; }

        .act-strip { display: inline-flex; align-items: center; gap: 2px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 3px; }
        .act-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-size: 0.88rem; color: #6c757d; transition: background .13s, color .13s, transform .1s; text-decoration: none; position: relative; }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover   { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover  { background: #fff3cd; color: #856404; }
        .act-btn-del:hover  { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: #dee2e6; flex-shrink: 0; }
        .act-btn::after {
          content: attr(data-tip); position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
          background: #212529; color: #fff; font-size: 0.67rem; font-weight: 600; padding: 3px 7px; border-radius: 4px;
          white-space: nowrap; pointer-events: none; z-index: 20; opacity: 0; transition: opacity .12s;
        }
        .act-btn:hover::after { opacity: 1; }

        .desc-cell { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.82rem; color: #6c757d; }
        .thumb-wrap { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
        .thumb-img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #dee2e6; }
        .thumb-count { position: absolute; bottom: -4px; right: -4px; background: #212529; color: #fff; font-size: 0.62rem; font-weight: 700; border-radius: 8px; padding: 0 4px; line-height: 14px; }
        .tech-badges { display: flex; gap: 4px; align-items: center; }
        .tech-badge { width: 22px; height: 22px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; background: #f8f9fa; border: 1px solid #dee2e6; }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          {/* Page Heading */}
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-kanban" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Portfolio</h1>
                <p className="text-muted mb-0">Review and manage portfolio projects.</p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/portfolio/Create">
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Project
              </Link>
            </div>
          </div>

          {/* Summary metric cards */}
          <section className="row g-3 mt-2 mb-1" aria-label="Portfolio summary">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon"><i className="bi bi-kanban-fill"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>projects</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Active</span>
                  <span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span>
                </div>
                <div className="metric-value">{activeCount}</div>
                <div className="metric-meta"><span>published</span><span>on site</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-label">Inactive</span>
                  <span className="metric-icon"><i className="bi bi-eye-slash-fill"></i></span>
                </div>
                <div className="metric-value">{inactiveCount}</div>
                <div className="metric-meta"><span>hidden</span><span>from site</span></div>
              </article>
            </div>
          </section>

          {/* Table panel */}
          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Project List</span>
                </h2>
                <p className="text-muted mb-0">
                  Search, review, and manage projects.
                  <span className="ms-2 badge text-bg-secondary">{filteredData.length} / {totalCount}</span>
                </p>
              </div>
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                  <input
                    type="text" className="form-control border-start-0" placeholder="Search projects..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")} title="Clear search">
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Preview</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Tech</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td className="text-muted" style={{ fontSize: "0.8rem" }}>{index + 1}</td>

                        <td>
                          <div className="thumb-wrap">
                            {item.images && item.images[0] && (
                              <img src={item.images[0]} alt={item.title} className="thumb-img" onError={(e) => { e.target.style.display = "none"; }} />
                            )}
                            {item.images && item.images.length > 1 && (
                              <span className="thumb-count">+{item.images.length - 1}</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.title}</div>
                          <div className="desc-cell" title={item.desc}>{item.desc}</div>
                        </td>

                        <td className="text-muted small">{item.category}</td>

                        <td>
                          <div className="tech-badges">
                            {(item.tech ?? []).slice(0, 4).map((t, i) => (
                              <span key={i} className="tech-badge" title={t.icon}>
                                <i className={`fab ${t.icon}`} style={{ color: t.color || "#6ea8ff" }}></i>
                              </span>
                            ))}
                            {(item.tech ?? []).length > 4 && (
                              <span className="text-muted small">+{item.tech.length - 4}</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="text-end">
                          <div className="act-strip">
                            <Link className="act-btn act-btn-edit" to={`/portfolio/Update/${item._id}`} data-tip="Edit">
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <span className="act-sep"></span>
                            <button
                              className={`act-btn ${item.status ? "act-btn-off" : "act-btn-on"}`}
                              onClick={() => updateRecord(item._id)}
                              data-tip={item.status ? "Deactivate" : "Activate"}
                            >
                              <i className={`bi ${item.status ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                            </button>
                            <span className="act-sep"></span>
                            <button className="act-btn act-btn-del" onClick={() => deleteRecord(item._id)} data-tip="Delete">
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-5">
                        <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 8 }}>
                          <i className="bi bi-kanban"></i>
                        </div>
                        {search ? `No projects found for "${search}"` : "No projects available."}
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