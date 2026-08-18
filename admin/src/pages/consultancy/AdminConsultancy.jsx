import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConsultancy,
  deleteConsultancy,
  updateConsultancy,
} from "../../Redux/ActionCreators/ConsultancyActionCreators";

const STATUS_OPTIONS = ["Pending", "Contacted", "In Progress", "Completed", "Cancelled"];

const STATUS_BADGE = {
  Pending: "text-bg-warning",
  Contacted: "text-bg-info",
  "In Progress": "text-bg-primary",
  Completed: "text-bg-success",
  Cancelled: "text-bg-danger",
};

export default function AdminConsultancy() {
  let rawData = useSelector((state) => state.ConsultancyStateData);
  let ConsultancyStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  let dispatch = useDispatch();
  let [flag, setFlag] = useState(false);
  let [search, setSearch] = useState("");
  let [statusFilter, setStatusFilter] = useState("all");

  const totalCount = ConsultancyStateData.length;
  const pendingCount = ConsultancyStateData.filter((i) => i.status === "Pending").length;
  const inProgressCount = ConsultancyStateData.filter((i) => i.status === "In Progress" || i.status === "Contacted").length;
  const completedCount = ConsultancyStateData.filter((i) => i.status === "Completed").length;

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this consultancy request?")) {
      dispatch(deleteConsultancy({ _id }));
      setFlag(!flag);
    }
  }

  function updateStatus(_id, newStatus) {
    let item = ConsultancyStateData.find((x) => x._id === _id);
    if (!item || item.status === newStatus) return;

    if (window.confirm(`Change consultation status to "${newStatus}"?`)) {
      dispatch(updateConsultancy({ ...item, status: newStatus }));
      setFlag(!flag);
    }
  }

  function toggleActive(_id) {
    let item = ConsultancyStateData.find((x) => x._id === _id);
    if (!item) return;
    dispatch(updateConsultancy({ ...item, active: !item.active }));
    setFlag(!flag);
  }

  function getAPIData() {
    dispatch(getConsultancy());
  }

  useEffect(() => {
    getAPIData();
  }, [flag]);

  const filteredData = ConsultancyStateData.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase()) ||
      item.service?.toLowerCase().includes(search.toLowerCase()) ||
      item.budget?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        .act-btn-toggle:hover { background: #d1e7dd; color: #198754; }
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
        .consultancy-status-select {
          font-size: 0.78rem;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid #dee2e6;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .desc-truncate {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 200px;
        }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          {/* Heading */}
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon">
                <i className="bi bi-calendar2-check-fill" aria-hidden="true"></i>
              </span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Consultancy Bookings</h1>
                <p className="text-muted mb-0">
                  Review and manage client consultation requests and appointments.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <section className="row g-3 mt-2 mb-1" aria-label="Consultancy summary">
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Total Bookings</span>
                  <span className="metric-icon"><i className="bi bi-calendar-event"></i></span>
                </div>
                <div className="metric-value">{totalCount}</div>
                <div className="metric-meta"><span>all</span><span>submissions</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Pending</span>
                  <span className="metric-icon"><i className="bi bi-clock-history"></i></span>
                </div>
                <div className="metric-value">{pendingCount}</div>
                <div className="metric-meta"><span>needs</span><span>attention</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">In Progress</span>
                  <span className="metric-icon"><i className="bi bi-arrow-repeat"></i></span>
                </div>
                <div className="metric-value">{inProgressCount}</div>
                <div className="metric-meta"><span>under</span><span>discussion</span></div>
              </article>
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <article className="metric-card text-white">
                <div className="metric-top">
                  <span className="metric-label">Completed</span>
                  <span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span>
                </div>
                <div className="metric-value">{completedCount}</div>
                <div className="metric-meta"><span>successfully</span><span>resolved</span></div>
              </article>
            </div>
          </section>

          {/* Main Table Panel */}
          <section className="panel mt-3">
            <div className="panel-header flex-wrap gap-2">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-table" aria-hidden="true"></i>
                  <span>Consultancy Requests</span>
                </h2>
                <p className="text-muted mb-0">
                  Search, review, filter, and manage consultation requests.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
                {/* Status filter tabs / dropdown */}
                <select
                  className="form-select form-select-sm"
                  style={{ width: "150px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                {/* Search Bar */}
                <div className="input-group input-group-sm" style={{ minWidth: "220px" }}>
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search client, service..."
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
              <table className="table align-middle mb-0" id="consultancyTable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Client Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Service</th>
                    <th scope="col">Budget</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{item.name}</td>
                        <td>
                          <a href={`mailto:${item.email}`} className="text-decoration-none text-body">
                            {item.email}
                          </a>
                        </td>
                        <td>
                          <a href={`tel:${item.phone}`} className="text-decoration-none text-body">
                            {item.phone}
                          </a>
                        </td>
                        <td>
                          <span className="badge text-bg-light border">
                            {item.service}
                          </span>
                        </td>
                        <td>
                          <span className="badge text-bg-secondary">
                            {item.budget}
                          </span>
                        </td>
                        {/* <td>
                          <div className="desc-truncate text-muted" title={item.description}>
                            {item.description}
                          </div>
                        </td> */}
                        <td>
                          <select
                            className={`consultancy-status-select ${STATUS_BADGE[item.status] || "text-bg-secondary"}`}
                            value={item.status || "Pending"}
                            onChange={(e) => updateStatus(item._id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-end">
                          <div className="act-strip">
                            <Link
                              className="act-btn act-btn-edit"
                              to={`/consultancy/view/${item._id}`}
                              data-tip="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>

                            <span className="act-sep"></span>

                            <button
                              className={`act-btn act-btn-toggle`}
                              onClick={() => toggleActive(item._id)}
                              data-tip={item.active ? "Active" : "Archived"}
                            >
                              <i className={`bi ${item.active ? "bi-check2-circle text-success" : "bi-dash-circle text-muted"}`}></i>
                            </button>

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
                      <td colSpan="9" className="text-center text-muted py-5">
                        <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                        {search
                          ? `No consultation bookings found for "${search}"`
                          : "No consultation bookings available."}
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
