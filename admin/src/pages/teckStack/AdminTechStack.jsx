import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTechStack,
  deleteTechStack,
  updateTechStack,
} from "../../Redux/ActionCreators/TechStackActionCreators";

export default function AdminTechStack() {
  // 1. Get raw data from Redux
  let rawData = useSelector((state) => state.TechStackStateData);
  let dispatch = useDispatch();
  let [flag, setFlag] = useState(false);
  let [search, setSearch] = useState("");

  // 2. Ensure we ALWAYS have an array.
  // If Redux initial state is {} or it stores the full API response { data: [...] }, this extracts the array safely.
  let TechStackStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this technology?")) {
      dispatch(deleteTechStack({ _id }));
      setFlag(!flag);
    }
  }

  function updateRecord(_id) {
    const item = TechStackStateData.find((s) => s._id === _id);
    if (!item) return;
    dispatch(updateTechStack({ _id, status: !item.status }));
    setFlag(!flag);
  }

  function getAPIData() {
    dispatch(getTechStack());
  }

  useEffect(() => {
    getAPIData();
  }, [flag]);

  // Because of the safe extraction above, we can now safely use .length and .filter directly
  const totalCount = TechStackStateData.length;
  const activeCount = TechStackStateData.filter((i) => i.status).length;
  const inactiveCount = TechStackStateData.filter((i) => !i.status).length;

  const filteredData = TechStackStateData.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // `item.color` is stored as a Bootstrap text-utility class (e.g. "text-primary"),
  // not a raw CSS color. Swap "text-*" -> "bg-*" for anything that needs a background
  // (the swatch), and apply the text-* class directly wherever the color should tint text/icons.
  function toBgClass(colorClass) {
    if (!colorClass) return "";
    return colorClass.startsWith("text-")
      ? colorClass.replace("text-", "bg-")
      : colorClass;
  }

  return (
    <>
      <style>{`
        .act-strip {
          display: inline-flex; align-items: center; gap: 2px;
          background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 3px;
        }
        .act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px; border: none; background: transparent; 
          cursor: pointer; font-size: 0.88rem; color: #6c757d;
          transition: background .13s, color .13s, transform .1s; text-decoration: none; position: relative;
        }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover   { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover     { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover    { background: #fff3cd; color: #856404; }
        .act-btn-del:hover    { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: #dee2e6; flex-shrink: 0; }
        .color-swatch {
          width: 20px; height: 20px; border-radius: 4px;
          border: 1px solid #dee2e6; display: inline-block;
        }
        .icon-preview {
            width: 36px; height: 36px; border-radius: 8px;
            display: inline-flex; align-items: center; justify-content: center;
            background: #f8f9fa; border: 1px solid #dee2e6; font-size: 1.2rem;
        }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-cpu" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Tech Stack</h1>
                <p className="text-muted mb-0">Review and manage your technology stack.</p>
              </div>
            </div>
            <div className="heading-actions">
              <Link className="btn btn-primary btn-sm" to="/techstack/create">
                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Technology
              </Link>
            </div>
          </div>

          <section className="row g-3 mt-2 mb-1">
            <div className="col-12 col-sm-6 col-xl-4">
              <article className="metric-card text-white ">
                <div className="metric-top">
                  <span className="metric-label">Total</span>
                  <span className="metric-icon"><i className="bi bi-cpu"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>technologies</span></div>
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

          <section className="panel mt-3">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Tech Stack List</span>
                </h2>
              </div>
              <div className="ms-auto" style={{ minWidth: 220 }}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                  <input type="text" className="form-control border-start-0" placeholder="Search technologies..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Icon</th>
                    <th scope="col">Name</th>
                    <th scope="col">Color</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>
                          {/* item.icon is stored as a full class string, e.g.
                              "fab fa-brands fa-node-js" — render it as-is, don't
                              prepend another prefix or it'll never match a real FA class.
                              item.color is a Bootstrap text-* utility class, so it's
                              applied via className, not inline style (inline style
                              only accepts real CSS color values, not class names). */}
                          <div className="icon-preview">
                            <i className={`${item.icon} ${item.color || ""}`}></i>
                          </div>
                        </td>
                        <td className="fw-semibold">{item.name}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className={`color-swatch ${toBgClass(item.color)}`}></span>
                            <span className="small text-muted font-monospace">{item.color}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="act-strip">
                            <Link className="act-btn act-btn-edit" to={`/techstack/update/${item._id}`}>
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <span className="act-sep"></span>
                            <button className={`act-btn ${item.status ? "act-btn-off" : "act-btn-on"}`} onClick={() => updateRecord(item._id)}>
                              <i className={`bi ${item.status ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                            </button>
                            <span className="act-sep"></span>
                            {localStorage.getItem("role") === "Super Admin" && (
                              <button className="act-btn act-btn-del" onClick={() => deleteRecord(item._id)}>
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No technologies found.</td>
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