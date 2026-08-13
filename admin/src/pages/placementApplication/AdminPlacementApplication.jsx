import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getPlacementApplication,
    deletePlacementApplication,
    updatePlacementApplication,
} from "../../Redux/ActionCreators/PlacementAppicationActionCreators";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

const STATUS_BADGE = {
    Pending: "text-bg-secondary",
    Reviewed: "text-bg-info",
    Shortlisted: "text-bg-primary",
    Rejected: "text-bg-danger",
};

export default function AdminPlacementApplications() {
    let PlacementApplicationStateData = useSelector(
        (state) => state.PlacementApplicationStateData
    );
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);
    let [search, setSearch] = useState("");

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this application?")) {
            dispatch(deletePlacementApplication({ _id: _id }));
            setFlag(!flag);
        }
    }

    function updateStatus(_id, newStatus) {
        let item = PlacementApplicationStateData.find((x) => x._id === _id);
        if (!item) return;
        if (item.status === newStatus) return;

        if (window.confirm(`Change status to "${newStatus}"?`)) {
            dispatch(updatePlacementApplication({ ...item, status: newStatus }));
            setFlag(!flag);
        }
    }

    function getAPIData() {
        dispatch(getPlacementApplication());
    }

    useEffect(() => {
        getAPIData();
    }, [flag]);

    const filteredData = PlacementApplicationStateData
        ? PlacementApplicationStateData.filter(
            (item) =>
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.email?.toLowerCase().includes(search.toLowerCase()) ||
                item.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
                item.jobId?.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
                item.jobId?.title?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <>
            <style>{`
        .act-strip {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 3px;
        }
        .act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px;
          border: none; background: transparent; cursor: pointer;
          font-size: 0.88rem; color: #6c757d;
          transition: background .13s, color .13s, transform .1s;
          text-decoration: none; position: relative;
        }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover   { background: #cfe2ff; color: #0d6efd; }
        .act-btn-del:hover    { background: #f8d7da; color: #dc3545; }
        .act-btn-resume:hover { background: #d1e7dd; color: #198754; }
        .act-sep {
          width: 1px; height: 16px;
          background: #dee2e6; flex-shrink: 0;
        }
        .act-btn::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          background: #212529; color: #fff;
          font-size: 0.67rem; font-weight: 600;
          padding: 3px 7px; border-radius: 4px; white-space: nowrap;
          pointer-events: none; z-index: 20;
          opacity: 0; transition: opacity .12s;
        }
        .act-btn:hover::after { opacity: 1; }
        .pa-status-select {
          font-size: 0.75rem;
          padding: 2px 22px 2px 8px;
          border-radius: 20px;
          border: 1px solid #dee2e6;
          font-weight: 600;
          cursor: pointer;
        }
        .pa-message {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 220px;
        }
      `}</style>

            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4">
                    <div className="page-heading">
                        <div className="page-heading-copy">
                            <span className="page-icon">
                                <i className="bi bi-mortarboard" aria-hidden="true"></i>
                            </span>
                            <div>
                                <p className="eyebrow mb-1">Management</p>
                                <h1 className="h3 mb-1">Placement Applications</h1>
                                <p className="text-muted mb-0">
                                    Review and manage candidate placement applications.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section className="panel mt-3">
                        <div className="panel-header">
                            <div>
                                <h2 className="h5 mb-1 section-title">
                                    <i className="bi bi-table" aria-hidden="true"></i>
                                    <span>Application List</span>
                                </h2>
                                <p className="text-muted mb-0">
                                    Search, review, and manage placement applications.
                                </p>
                            </div>
                            <div className="ms-auto" style={{ minWidth: 220 }}>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search applications..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setSearch("")}
                                            title="Clear search"
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle mb-0" id="placementApplicationTable">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Applied For</th>
                                        {/* <th scope="col">Message</th> */}
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.jobId?.jobTitle || item.jobId?.title || item.jobTitle}</td>
                                                {/* <td>
                                                    <div className="pa-message text-muted">{item.message}</div>
                                                </td> */}
                                                <td>
                                                    <select
                                                        className={`pa-status-select ${STATUS_BADGE[item.status] || "text-bg-secondary"}`}
                                                        value={item.status}
                                                        onChange={(e) => updateStatus(item._id, e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="text-end">
                                                    <div className="act-strip">
                                                        <Link
                                                            className="act-btn act-btn-edit"
                                                            to={`/placementApplication/view/${item._id}`}
                                                            data-tip="View"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link>

                                                        <span className="act-sep"></span>

                                                        <a
                                                            className="act-btn act-btn-resume"
                                                            href={item.resume}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            data-tip="Resume"
                                                        >
                                                            <i className="bi bi-file-earmark-arrow-down"></i>
                                                        </a>

                                                        <span className="act-sep"></span>

                                                        <button
                                                            className="act-btn act-btn-del"
                                                            onClick={() => deleteRecord(item._id)}
                                                            data-tip="Delete"
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted py-4">
                                                {search
                                                    ? `No applications found for "${search}"`
                                                    : "No placement applications available."}
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