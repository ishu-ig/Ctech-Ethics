import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getPlacedStudent,
    deletePlacedStudent,
    updatePlacedStudent,
} from "../../Redux/ActionCreators/PlacedStudentActionCreators";

export default function AdminPlacedStudent() {
    const rawData = useSelector((state) => state.PlacedStudentStateData);
    const dispatch = useDispatch();
    const [flag, setFlag] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const PlacedStudentStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    useEffect(() => {
        dispatch(getPlacedStudent());
    }, [flag, dispatch]);

    function deleteRecord(_id) {
        if (window.confirm("Delete this placement record? This can't be undone.")) {
            dispatch(deletePlacedStudent({ _id }));
            setFlag(!flag);
        }
    }

    function toggleStatus(item) {
        const formData = new FormData();
        formData.append("_id", item._id);
        formData.append("status", !item.status);
        dispatch(updatePlacedStudent(formData));
        setFlag(!flag);
    }

    const totalCount = PlacedStudentStateData.length;
    const activeCount = PlacedStudentStateData.filter((i) => i.status).length;
    const technicalCount = PlacedStudentStateData.filter((i) => i.type === "Technical").length;

    const filteredData = PlacedStudentStateData.filter((item) => {
        const matchesSearch =
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.company?.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <main className="dashboard-content">
            <style>{`
        .act-strip { display: inline-flex; align-items: center; gap: 2px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 3px; }
        .act-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: none; background: transparent; cursor: pointer; font-size: 0.88rem; color: #6c757d; transition: background .13s, color .13s, transform .1s; text-decoration: none; }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover   { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover  { background: #fff3cd; color: #856404; }
        .act-btn-del:hover  { background: #f8d7da; color: #dc3545; }
        .act-sep { width: 1px; height: 16px; background: #dee2e6; flex-shrink: 0; }

        .student-avatar {
          width: 46px; height: 46px; border-radius: 50%; object-fit: cover;
          border: 2px solid #fff; box-shadow: 0 0 0 1px #e9ecef;
        }
        .student-avatar-fallback {
          width: 46px; height: 46px; border-radius: 50%; display: inline-flex;
          align-items: center; justify-content: center; background: #eef2ff; color: #4f46e5;
          font-weight: 700; font-size: 0.95rem; border: 2px solid #fff; box-shadow: 0 0 0 1px #e9ecef;
        }
        .company-row { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #212529; }
        .company-icon-chip {
          width: 22px; height: 22px; border-radius: 6px; display: inline-flex;
          align-items: center; justify-content: center; background: #f1f3f5; font-size: 0.75rem; flex-shrink: 0;
        }
        .package-pill {
          display: inline-flex; align-items: center; gap: 4px; font-weight: 700; color: #15803d;
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 3px 10px; font-size: 0.82rem;
        }

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
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-mortarboard-fill"></i></span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Placed Students</h1>
                            <p className="text-muted mb-0">Manage placement records shown on the site.</p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-primary btn-sm" to="/placedstudent/create">
                            <i className="bi bi-plus-circle me-1"></i> Add Record
                        </Link>
                    </div>
                </div>

                <section className="row g-3 mt-2 mb-1">
                    <div className="col-12 col-sm-6 col-xl-4">
                        <article className="metric-card text-white">
                            <div className="metric-top"><span className="metric-label">Total</span><span className="metric-icon"><i className="bi bi-mortarboard-fill"></i></span></div>
                            <div className="metric-value">{totalCount}</div>
                            <div className="metric-meta"><span>all</span><span>records</span></div>
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
                            <div className="metric-top"><span className="metric-label">Technical</span><span className="metric-icon"><i className="bi bi-code-slash"></i></span></div>
                            <div className="metric-value">{technicalCount}</div>
                            <div className="metric-meta"><span>technical</span><span>track</span></div>
                        </article>
                    </div>
                </section>

                <section className="panel mt-3">
                    <div className="panel-header flex-wrap gap-2">
                        <h2 className="h5 mb-0 section-title"><i className="bi bi-table"></i><span>Placement List</span></h2>
                        <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                            <div className="segmented">
                                <button className={typeFilter === "all" ? "active" : ""} onClick={() => setTypeFilter("all")}>All</button>
                                <button className={typeFilter === "Technical" ? "active" : ""} onClick={() => setTypeFilter("Technical")}>Technical</button>
                                <button className={typeFilter === "Non-Technical" ? "active" : ""} onClick={() => setTypeFilter("Non-Technical")}>Non-Technical</button>
                            </div>
                            <div className="input-group input-group-sm" style={{ minWidth: 200 }}>
                                <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                                <input type="text" className="form-control border-start-0" placeholder="Search name or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>#</th><th>Student</th><th>Company & Role</th><th>Track</th><th>Package</th><th>Status</th><th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="text-muted" style={{ fontSize: "0.8rem" }}>{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.photo ? (
                                                    <img
                                                        src={item.photo}
                                                        className="student-avatar"
                                                        alt={item.name}
                                                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "inline-flex"; }}
                                                    />
                                                ) : null}
                                                <span className="student-avatar-fallback" style={{ display: item.photo ? "none" : "inline-flex" }}>
                                                    {item.name?.charAt(0)?.toUpperCase() || "?"}
                                                </span>
                                                <span className="fw-semibold">{item.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="company-row">
                                                <span className="company-icon-chip"><i className={`bi ${item.companyIcon || "bi-building"}`}></i></span>
                                                {item.company}
                                            </div>
                                            <div className="small text-muted mt-1">{item.role}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.type === "Technical" ? "text-bg-info" : "text-bg-warning"}`}>{item.type}</span>
                                        </td>
                                        <td>
                                            <span className="package-pill"><i className="bi bi-cash-stack"></i>{item.package}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>{item.status ? "Active" : "Inactive"}</span>
                                        </td>
                                        <td className="text-end">
                                            <div className="act-strip">
                                                <Link className="act-btn act-btn-edit" to={`/placed-student/update/${item._id}`}><i className="bi bi-pencil-square"></i></Link>
                                                <span className="act-sep"></span>
                                                <button className={`act-btn ${item.status ? "act-btn-off" : "act-btn-on"}`} onClick={() => toggleStatus(item)}>
                                                    <i className={`bi ${item.status ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                                                </button>
                                                <span className="act-sep"></span>
                                                <button className="act-btn act-btn-del" onClick={() => deleteRecord(item._id)}><i className="bi bi-trash3-fill"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty-state">
                                                <i className="bi bi-mortarboard"></i>
                                                <p>{search || typeFilter !== "all" ? "No records match your filters." : "No placement records yet — add one to get started."}</p>
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
    );
}