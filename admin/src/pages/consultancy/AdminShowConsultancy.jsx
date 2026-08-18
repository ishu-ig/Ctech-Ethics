import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteConsultancy,
  getConsultancy,
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

export default function AdminShowConsultancy() {
  let { _id } = useParams();
  let [data, setData] = useState({});
  let [status, setStatus] = useState("Pending");

  let rawData = useSelector((state) => state.ConsultancyStateData);
  let ConsultancyStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  function deleteRecord() {
    if (window.confirm("Are you sure you want to delete this consultation request?")) {
      dispatch(deleteConsultancy({ _id }));
      navigate("/consultancy");
    }
  }

  function handleStatusChange(newStatus) {
    if (window.confirm(`Update status to "${newStatus}"?`)) {
      setStatus(newStatus);
      dispatch(updateConsultancy({ ...data, status: newStatus }));
      setData((prev) => ({ ...prev, status: newStatus }));
    }
  }

  function toggleActive() {
    const updatedActive = !data.active;
    dispatch(updateConsultancy({ ...data, active: updatedActive }));
    setData((prev) => ({ ...prev, active: updatedActive }));
  }

  useEffect(() => {
    dispatch(getConsultancy());
  }, [dispatch]);

  useEffect(() => {
    if (ConsultancyStateData.length) {
      let item = ConsultancyStateData.find((x) => x._id === _id);
      if (item) {
        setData({ ...item });
        setStatus(item.status || "Pending");
      }
    }
  }, [ConsultancyStateData, _id]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page Heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-calendar2-check" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Consultation Management</p>
              <h1 className="h3 mb-1">Consultation Details</h1>
              <p className="text-muted mb-0">
                Review complete details of client's consultation booking.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/consultancy">
              <i className="bi bi-arrow-left me-1" aria-hidden="true"></i> Back to Consultancy
            </Link>
          </div>
        </div>

        {/* Details Grid */}
        <section className="row g-4 mt-2">
          {/* Main Info Card */}
          <div className="col-12 col-xl-8">
            <div className="panel h-100">
              <div className="panel-header d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-info-circle-fill me-2" aria-hidden="true"></i>
                    <span>Consultation Request Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Booked by <strong>{data.name || "Client"}</strong>
                  </p>
                </div>
                <span className={`badge ${STATUS_BADGE[data.status] || "text-bg-secondary"} fs-6 px-3 py-2`}>
                  {data.status || "Pending"}
                </span>
              </div>

              <div className="table-responsive mt-3">
                <table className="table align-middle mb-0">
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }} className="text-muted">Full Name</th>
                      <td className="fw-semibold">{data.name || "—"}</td>
                    </tr>
                    <tr>
                      <th className="text-muted">Email Address</th>
                      <td>
                        {data.email ? (
                          <a href={`mailto:${data.email}`} className="text-decoration-none fw-medium">
                            <i className="bi bi-envelope me-1"></i> {data.email}
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-muted">Phone Number</th>
                      <td>
                        {data.phone ? (
                          <a href={`tel:${data.phone}`} className="text-decoration-none fw-medium">
                            <i className="bi bi-telephone me-1"></i> {data.phone}
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-muted">Service Required</th>
                      <td>
                        <span className="badge text-bg-primary fs-6">
                          {data.service || "—"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-muted">Project Budget</th>
                      <td>
                        <span className="badge text-bg-success fs-6">
                          {data.budget || "—"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-muted">Booking Date</th>
                      <td>
                        {data.createdAt
                          ? new Date(data.createdAt).toLocaleString("en-US", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-muted align-top pt-3">Project Description</th>
                      <td className="pt-3">
                        <div className="p-3 bg-light rounded-3 border text-dark" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                          {data.description || "No description provided."}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4 pt-3 border-top">
                <div className="d-flex gap-2">
                  {data.email && (
                    <a
                      href={`mailto:${data.email}?subject=Regarding Your Consultation Request for ${data.service}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-envelope-fill me-1"></i> Send Email
                    </a>
                  )}
                  {data.phone && (
                    <a href={`tel:${data.phone}`} className="btn btn-outline-success btn-sm">
                      <i className="bi bi-telephone-fill me-1"></i> Call Client
                    </a>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${data.active ? "btn-outline-warning" : "btn-outline-info"}`}
                    onClick={toggleActive}
                  >
                    <i className={`bi ${data.active ? "bi-archive" : "bi-arrow-counterclockwise"} me-1`}></i>
                    {data.active ? "Archive Request" : "Unarchive Request"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={deleteRecord}>
                    <i className="bi bi-trash3-fill me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Quick Control Sidebar Card */}
          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <div className="panel-header">
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-gear-fill me-2"></i>
                  <span>Status Management</span>
                </h2>
                <p className="text-muted mb-0">Update consultation progress.</p>
              </div>

              <div className="p-3">
                <label className="form-label fw-semibold text-muted mb-2">Change Consultation Status</label>
                <div className="d-grid gap-2">
                  {STATUS_OPTIONS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`btn d-flex justify-content-between align-items-center ${
                        status === st ? "btn-primary shadow-sm" : "btn-light border"
                      }`}
                    >
                      <span>{st}</span>
                      {status === st && <i className="bi bi-check2-circle fs-5"></i>}
                    </button>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="card bg-light border-0 p-3 rounded-3">
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-lightbulb text-warning me-1"></i> Quick Tips
                  </h6>
                  <p className="small text-muted mb-0">
                    Setting the status to <strong>Completed</strong> will automatically notify the client that their consultation review has concluded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
