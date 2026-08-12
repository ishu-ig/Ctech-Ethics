import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateAchievement, getAchievement } from "../../Redux/ActionCreators/AchievementActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review stats", body: "Ensure the count accurately reflects reality." },
  { dot: "bg-primary", title: "Verify icon", body: "Check that the icon still renders correctly." },
  { dot: "bg-warning", title: "Save changes", body: "Changes take effect immediately upon saving." },
];

const emptyData = {
  icon: "",
  count: "",
  title: "",
  description: "",
  status: true,
};

export default function AdminUpdateAchievement() {
  const { _id } = useParams();

  const [data, setData] = useState(emptyData);
  const [error, setError] = useState({
    icon: "",
    count: "",
    title: "",
    description: "",
  });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const rawData = useSelector((state) => state.AchievementStateData);
  const AchievementStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  const dispatch = useDispatch();

  function getInputData(e) {
    const { name, value } = e.target;

    if (name === "status") {
      setData((old) => ({ ...old, status: value === "1" }));
      return;
    }

    if (["icon", "count", "title", "description"].includes(name)) {
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
      icon: error.icon,
      count: error.count,
      title: error.title,
      description: error.description,
    };

    const errorItem = Object.values(relevantErrors).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
      return;
    }

    const item = AchievementStateData.find(
      (x) => x._id !== _id && x.title?.toLowerCase() === data.title?.toLowerCase()
    );

    if (item) {
      setShow(true);
      setError((old) => ({ ...old, title: "Achievement with this Title Already Exists" }));
      return;
    }

    const payload = {
      _id,
      icon: data.icon,
      count: data.count,
      title: data.title,
      description: data.description,
      status: data.status,
    };

    dispatch(updateAchievement(payload));
    navigate("/achievement");
  }

  useEffect(() => {
    dispatch(getAchievement());
    if (AchievementStateData.length) {
      const item = AchievementStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          icon: item.icon ?? "",
          count: item.count ?? "",
          title: item.title ?? "",
          description: item.description ?? "",
          status: item.status ?? true,
        });
      }
    }
  }, [dispatch, AchievementStateData.length, _id]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon"><i className="bi bi-pencil-square"></i></span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Achievement</h1>
              <p className="text-muted mb-0">Edit the achievement details.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/achievement">
              <i className="bi bi-arrow-left"></i> Back to Achievements
            </Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "")}
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>
        )}

        <section className="row g-3">
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title"><i className="bi bi-trophy"></i> Achievement Information</h2>
                  <p className="text-muted mb-0">Update the details for this stat.</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input className={`form-control ${show && error.title ? "is-invalid" : ""}`} id="title" type="text" name="title" value={data.title} onChange={getInputData} placeholder="e.g. Happy Clients" />
                  {show && error.title && <div className="text-danger small mt-1">{error.title}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="count">Count / Stat</label>
                  <input className={`form-control ${show && error.count ? "is-invalid" : ""}`} id="count" type="text" name="count" value={data.count} onChange={getInputData} placeholder="e.g. 232 or 100+" />
                  {show && error.count && <div className="text-danger small mt-1">{error.count}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="icon">Icon Class</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      {data.icon ? <i className={data.icon}></i> : <i className="bi bi-question-lg text-muted"></i>}
                    </span>
                    <input className={`form-control ${show && error.icon ? "is-invalid" : ""}`} id="icon" type="text" name="icon" value={data.icon} onChange={getInputData} placeholder="e.g. bi bi-emoji-smile" />
                  </div>
                  {show && error.icon && <div className="text-danger small mt-1">{error.icon}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea className={`form-control ${show && error.description ? "is-invalid" : ""}`} id="description" name="description" rows="3" value={data.description} onChange={getInputData} placeholder="A short description of this achievement." />
                  {show && error.description && <div className="text-danger small mt-1">{error.description}</div>}
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
                <Link className="btn btn-outline-secondary" to="/achievement">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle"></i> Update Achievement
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="panel h-100">
              <h2 className="h5 mb-3 section-title"><i className="bi bi-list-check"></i> Update Checklist</h2>
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