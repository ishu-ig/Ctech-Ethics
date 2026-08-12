import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getService } from "../../../Redux/ActionCreators/ServiceActionCreators";
import {
    getSubService,
    updateSubService,
    deleteSubService,
} from "../../../Redux/ActionCreators/SubServiceActionCreators";

export default function AdminSubService() {
    const rawSubData = useSelector((state) => state.SubServiceStateData);
    const rawServiceData = useSelector((state) => state.ServiceStateData);
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [serviceFilter, setServiceFilter] = useState("all");

    const SubServiceStateData = Array.isArray(rawSubData) ? rawSubData : (rawSubData?.data || []);
    const ServiceStateData = Array.isArray(rawServiceData) ? rawServiceData : (rawServiceData?.data || []);
    const loading = rawSubData?.loading;

    useEffect(() => {
        dispatch(getSubService());
        dispatch(getService());
    }, [dispatch]);

    const serviceMap = useMemo(
        () => Object.fromEntries(ServiceStateData.map((s) => [s._id, s.title])),
        [ServiceStateData]
    );

    function getServiceTitle(item) {
        if (item.serviceId && typeof item.serviceId === "object") return item.serviceId.title || "—";
        return serviceMap[item.serviceId] || "—";
    }

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this sub-service?")) {
            dispatch(deleteSubService({ _id }));
        }
    }

    // No dedicated toggle action in the saga setup — updateSubService already handles
    // partial field updates, so resubmit the record with status flipped.
    function toggleStatus(item) {
        dispatch(
            updateSubService({
                _id: item._id,
                serviceId: item.serviceId?._id || item.serviceId,
                name: item.name,
                icon: item.icon,
                description: item.description,
                tags: item.tags,
                status: !item.status,
            })
        );
    }

    const totalCount = SubServiceStateData.length;
    const activeCount = SubServiceStateData.filter((i) => i.status).length;
    const inactiveCount = SubServiceStateData.filter((i) => !i.status).length;

    const filteredData = SubServiceStateData.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
        const itemServiceId = item.serviceId?._id || item.serviceId;
        const matchesService = serviceFilter === "all" || itemServiceId === serviceFilter;
        return matchesSearch && matchesService;
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
        .svc-icon-chip { width: 40px; height: 40px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; background: #eef2ff; color: #4f46e5; font-size: 1.05rem; }
      `}</style>

            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4">
                    <div className="page-heading">
                        <div className="page-heading-copy">
                            <span className="page-icon"><i className="bi bi-diagram-3"></i></span>
                            <div>
                                <p className="eyebrow mb-1">Management</p>
                                <h1 className="h3 mb-1">Sub-Services</h1>
                                <p className="text-muted mb-0">Review and manage the sub-services attached to each service.</p>
                            </div>
                        </div>
                        <div className="heading-actions">
                            <Link className="btn btn-primary btn-sm" to="/subservice/create">
                                <i className="bi bi-plus-circle"></i> Add Sub-Service
                            </Link>
                        </div>
                    </div>

                    <section className="row g-3 mt-2 mb-1">
                        <div className="col-12 col-sm-6 col-xl-4">
                            <article className="metric-card text-white">
                                <div className="metric-top"><span className="metric-label">Total</span><span className="metric-icon"><i className="bi bi-diagram-3"></i></span></div>
                                <div className="metric-value">{totalCount}</div>
                                <div className="metric-meta"><span>all</span><span>sub-services</span></div>
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
                                <h2 className="h5 mb-1 section-title"><i className="bi bi-table"></i><span>Sub-Service List</span></h2>
                            </div>
                            <div className="d-flex flex-wrap gap-2 ms-auto">
                                <select className="form-select form-select-sm" style={{ minWidth: 180 }} value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
                                    <option value="all">All Services</option>
                                    {ServiceStateData.map((s) => (
                                        <option key={s._id} value={s._id}>{s.title}</option>
                                    ))}
                                </select>
                                <div className="input-group input-group-sm" style={{ minWidth: 200 }}>
                                    <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                                    <input type="text" className="form-control border-start-0" placeholder="Search name..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                        <th scope="col">Service</th>
                                        <th scope="col">Tags</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center text-muted py-4">Loading…</td></tr>
                                    ) : filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <span className="svc-icon-chip">
                                                        <i className={`bi ${item.icon}`}></i>
                                                    </span>
                                                </td>
                                                <td className="fw-semibold text-truncate" style={{ maxWidth: 200 }} title={item.name}>{item.name}</td>
                                                <td className="text-truncate" style={{ maxWidth: 180 }}>{getServiceTitle(item)}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {(item.tags || []).slice(0, 3).map((t) => (
                                                            <span key={t} className="badge text-bg-light border">{t}</span>
                                                        ))}
                                                        {(item.tags || []).length > 3 && (
                                                            <span className="badge text-bg-light border">+{item.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>
                                                        {item.status ? "Active" : "Draft"}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="act-strip">
                                                        <Link className="act-btn act-btn-edit" to={`/subservice/update/${item._id}`}><i className="bi bi-pencil-square"></i></Link>
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
                                        <tr><td colSpan="7" className="text-center text-muted py-4">No sub-services found.</td></tr>
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