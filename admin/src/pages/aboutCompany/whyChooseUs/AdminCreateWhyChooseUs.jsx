import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../../FormValidators/formValidator";
import { createWhyChooseUs, getWhyChooseUs } from "../../../Redux/ActionCreators/WhyChoosesUsActionCreators";

const checklist = [
  { dot: "bg-success", title: "Pick an icon", body: "Use a Bootstrap icon class, e.g. bi bi-shield-check." },
  { dot: "bg-primary", title: "Add a badge", body: "Short label shown above the title, e.g. Trusted." },
];

export default function AdminCreateWhyChooseUs() {
  let [data, setData] = useState({
    icon: "",
    badge: "",
    title: "",
    description: "",
    status: true,
  });
  let [error, setError] = useState({
    icon: "Icon Field is Mandatory",
    badge: "Badge Field is Mandatory",
    title: "Title Field is Mandatory",
    description: "Description Field is Mandatory",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let WhyChooseUsStateData = useSelector((state) => state.WhyChooseUsStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name !== "status") {
      setError((old) => ({
        ...old,
        [name]: formValidator(e),
      }));
    }
    setData((old) => ({
      ...old,
      [name]: name === "status" ? (value === "1" ? true : false) : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();

    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
      return;
    }

    let item = WhyChooseUsStateData.find(
      (x) => x.title.toLocaleLowerCase() === data.title.toLocaleLowerCase()
    );
    if (item) {
      setShow(true);
      setError((old) => ({ ...old, title: "Highlight Already Exists" }));
      return;
    }

    const payload = {
      ...data,
    };

    dispatch(createWhyChooseUs(payload));
    navigate("/whychooseus");
  }

  useEffect(() => {
    dispatch(getWhyChooseUs());
  }, [WhyChooseUsStateData.length]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-plus-circle" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add Highlight</h1>
              <p className="text-muted mb-0">
                Create a new "Why Choose Us" highlight with icon, badge, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/whychooseus">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Why Choose Us
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            />
          </div>
        )}

        <section className="row g-3">

          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-patch-check" aria-hidden="true"></i>
                    <span>Highlight Information</span>
                  </h2>
                  <p className="text-muted mb-0">
                    Fill in the details to create a new highlight.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input
                    className={`form-control ${show && error.title ? "is-invalid" : ""}`}
                    id="title"
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={getInputData}
                    placeholder="e.g. Dedicated Support Team"
                  />
                  {show && error.title && (
                    <div className="text-danger small mt-1">{error.title}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="icon">
                    Icon <small className="text-muted">(e.g. bi bi-shield-check)</small>
                  </label>
                  <input
                    className={`form-control ${show && error.icon ? "is-invalid" : ""}`}
                    id="icon"
                    type="text"
                    name="icon"
                    value={data.icon}
                    onChange={getInputData}
                    placeholder="Enter Bootstrap Icon Class"
                  />
                  {show && error.icon && (
                    <div className="text-danger small mt-1">{error.icon}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="badge">
                    Badge <small className="text-muted">(short label above the title)</small>
                  </label>
                  <input
                    className={`form-control ${show && error.badge ? "is-invalid" : ""}`}
                    id="badge"
                    type="text"
                    name="badge"
                    value={data.badge}
                    onChange={getInputData}
                    placeholder="e.g. Trusted"
                  />
                  {show && error.badge && (
                    <div className="text-danger small mt-1">{error.badge}</div>
                  )}
                </div>



                <div className="col-md-6">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={data.status ? "1" : "0"}
                    onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${show && error.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    rows={3}
                    value={data.description}
                    onChange={getInputData}
                    placeholder="Short description shown under the title"
                  />
                  {show && error.description && (
                    <div className="text-danger small mt-1">{error.description}</div>
                  )}
                </div>

              </div>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/whychooseus">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create Highlight
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title">
                <i className="bi bi-list-check" aria-hidden="true"></i>
                <span>Setup Checklist</span>
              </h2>
              <div className="activity-list">
                {checklist.map(({ dot, title, body }) => (
                  <div key={title} className="activity-item">
                    <span className={`activity-dot ${dot}`}></span>
                    <div>
                      <p className="mb-1 fw-semibold">{title}</p>
                      <p className="text-muted small mb-0">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
