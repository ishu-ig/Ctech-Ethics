import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateTechStack, getTechStack } from "../../Redux/ActionCreators/TechStackActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review details", body: "Confirm name and icon are up to date." },
  { dot: "bg-primary", title: "Check the color", body: "Should match the brand's icon color." },
  { dot: "bg-warning", title: "Save changes", body: "Changes take effect immediately." },
];

const emptyData = {
  name: "",
  icon: "",
  color: "#6ea8ff",
  status: true,
};

export default function AdminUpdateTechStack() {
  let { _id } = useParams();

  let [data, setData] = useState(emptyData);
  let [error, setError] = useState({
    name: "",
    icon: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let TechStackStateData = useSelector((state) => state.TechStackStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "status") {
      setData((old) => ({ ...old, status: value === "1" }));
      return;
    }

    if (name === "color") {
      setData((old) => ({ ...old, color: value }));
      return;
    }

    if (["name", "icon"].includes(name)) {
      setError((old) => ({
        ...old,
        [name]: formValidator(e),
      }));
    }

    setData((old) => ({ ...old, [name]: value }));
  }

  function postSubmit(e) {
    e.preventDefault();

    const relevantErrors = {
      name: error.name,
      icon: error.icon,
    };

    let errorItem = Object.values(relevantErrors).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      let item = TechStackStateData.find(
        (x) =>
          x._id !== _id &&
          x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Technology Already Exist" }));
      } else {
        dispatch(
          updateTechStack({
            _id,
            name: data.name,
            icon: data.icon,
            color: data.color || "#6ea8ff",
            status: data.status,
          })
        );
        navigate("/techstack");
      }
    }
  }

  useEffect(() => {
    dispatch(getTechStack());
    if (TechStackStateData.length) {
      let item = TechStackStateData.find((x) => x._id === _id);
      if (item)
        setData({
          name: item.name ?? "",
          icon: item.icon ?? "",
          color: item.color ?? "#6ea8ff",
          status: item.status ?? true,
        });
    }
  }, [TechStackStateData.length, _id, dispatch]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Technology</h1>
              <p className="text-muted mb-0">
                Edit the technology's icon, color, and status.
              </p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/techstack">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Tech Stack
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <section className="row g-3">

          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    <span>Technology Information</span>
                  </h2>
                  <p className="text-muted mb-0">Update the details for this technology.</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input className={`form-control ${show && error.name ? "is-invalid" : ""}`} id="name" type="text" name="name" value={data.name} onChange={getInputData} placeholder="e.g. React" />
                  {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="icon">
                    Icon <small className="text-muted">(e.g. fa-brands fa-react)</small>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: data.color }}>
                      {data.icon ? <i className={data.icon}></i> : <i className="bi bi-question-lg text-muted"></i>}
                    </span>
                    <input className={`form-control ${show && error.icon ? "is-invalid" : ""}`} id="icon" type="text" name="icon" value={data.icon} onChange={getInputData} placeholder="Enter Font Awesome Icon Class" />
                  </div>
                  {show && error.icon && <div className="text-danger small mt-1">{error.icon}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="color">
                    Color <small className="text-muted">(brand/icon color)</small>
                  </label>
                  <div className="input-group">
                    <input className="form-control form-control-color p-1" type="color" value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(data.color) ? data.color : "#6ea8ff"} onChange={(e) => setData((old) => ({ ...old, color: e.target.value }))} title="Choose color" />
                    <input className="form-control" type="text" name="color" value={data.color} onChange={getInputData} placeholder="#6ea8ff" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select className="form-select" id="status" name="status" value={data.status ? "1" : "0"} onChange={getInputData}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/techstack">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Technology
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title">
                <i className="bi bi-list-check" aria-hidden="true"></i>
                <span>Update Checklist</span>
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