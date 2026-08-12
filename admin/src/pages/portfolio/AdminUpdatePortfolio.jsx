import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import { updatePortfolio, getPortfolio } from "../../Redux/ActionCreators/PortfolioActionCreators";

const checklist = [
  { dot: "bg-success", title: "Review Details", body: "Confirm the title, category, and description." },
  { dot: "bg-primary", title: "Manage Images", body: "Remove outdated images or add new ones." },
  { dot: "bg-warning", title: "Save Changes", body: "Changes take effect immediately on the site." },
];

const DEFAULT_COLOR = "#6ea8ff";

export default function AdminUpdatePortfolio() {
  let { _id } = useParams();
  let navigate = useNavigate();
  let PortfolioStateData = useSelector((state) => state.PortfolioStateData);
  let dispatch = useDispatch();

  let [data, setData] = useState({ title: "", category: "", desc: "", link: "", status: true });
  let [error, setError] = useState({ title: "", category: "", desc: "" });
  let [existingImages, setExistingImages] = useState([]);
  let [newImages, setNewImages] = useState([]);
  let [newPreviews, setNewPreviews] = useState([]);
  let [imageError, setImageError] = useState("");
  let [tech, setTech] = useState([{ icon: "", color: DEFAULT_COLOR }]);
  let [show, setShow] = useState(false);

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name !== "status" && name !== "link") {
      setError((old) => ({ ...old, [name]: formValidator(e) }));
    }
    setData((old) => ({
      ...old,
      [name]: name === "status" ? value === "1" : value,
    }));
  }

  function handleImagesChange(e) {
    let files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewImages((old) => [...old, ...files]);
    setNewPreviews((old) => [...old, ...files.map((f) => URL.createObjectURL(f))]);
    setImageError("");
    e.target.value = "";
  }

  function removeExistingImage(index) {
    setExistingImages((old) => old.filter((_, i) => i !== index));
  }

  function removeNewImage(index) {
    setNewImages((old) => old.filter((_, i) => i !== index));
    setNewPreviews((old) => old.filter((_, i) => i !== index));
  }

  function updateTechRow(index, field, value) {
    setTech((old) => old.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addTechRow() {
    setTech((old) => [...old, { icon: "", color: DEFAULT_COLOR }]);
  }

  function removeTechRow(index) {
    setTech((old) => old.filter((_, i) => i !== index));
  }

  function postSubmit(e) {
    e.preventDefault();

    let totalImages = existingImages.length + newImages.length;
    let currentImageError = totalImages === 0 ? "At least one image is mandatory" : "";
    setImageError(currentImageError);

    let errorItem = Object.values(error).find((x) => x !== "") || currentImageError;
    if (errorItem) {
      setShow(true);
      return;
    }

    let item = PortfolioStateData.find(
      (x) => x._id !== _id && x.title.toLocaleLowerCase() === data.title.toLocaleLowerCase()
    );
    if (item) {
      setShow(true);
      setError((old) => ({ ...old, title: "A project with this title already exists" }));
      return;
    }

    let cleanTech = tech.filter((t) => t.icon && t.icon.trim() !== "");

    let formData = new FormData();
    formData.append("_id", _id);
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("desc", data.desc);
    formData.append("link", data.link);
    formData.append("status", data.status);
    formData.append("tech", JSON.stringify(cleanTech));
    // URLs of existing images the user chose to keep
    formData.append("images", JSON.stringify(existingImages));
    // any newly-added files
    newImages.forEach((file) => formData.append("images", file));

    dispatch(updatePortfolio(formData));
    navigate("/portfolio");
  }

  useEffect(() => {
    dispatch(getPortfolio());
  }, []);

  useEffect(() => {
    if (PortfolioStateData.length) {
      let item = PortfolioStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          title: item.title ?? "",
          category: item.category ?? "",
          desc: item.desc ?? "",
          link: item.link ?? "",
          status: item.status ?? true,
        });
        setExistingImages(item.images ?? []);
        setTech(item.tech && item.tech.length ? item.tech : [{ icon: "", color: DEFAULT_COLOR }]);
      }
    }
  }, [PortfolioStateData, _id]);

  return (
    <main className="dashboard-content">
      <div className="container-fluid px-3 px-lg-4 py-4">

        {/* Page Heading */}
        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon">
              <i className="bi bi-pencil-square" aria-hidden="true"></i>
            </span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Update Portfolio Project</h1>
              <p className="text-muted mb-0">Edit the project details below.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/portfolio">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Portfolio
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {show && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {Object.values(error).find((x) => x !== "") || imageError}
            <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <section className="row g-3">

          {/* Form Panel */}
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-kanban" aria-hidden="true"></i>
                    <span>Project Information</span>
                  </h2>
                  <p className="text-muted mb-0">Update the details for this project.</p>
                </div>
              </div>

              <div className="row g-3">

                {/* Title */}
                <div className="col-12">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input
                    id="title" type="text" name="title"
                    className="form-control" placeholder="Enter project title"
                    value={data.title} onChange={getInputData}
                  />
                  {show && error.title && <div className="text-danger small mt-1">{error.title}</div>}
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="category">Category</label>
                  <input
                    id="category" type="text" name="category"
                    className="form-control" placeholder="e.g. Web App"
                    value={data.category} onChange={getInputData}
                  />
                  {show && error.category && <div className="text-danger small mt-1">{error.category}</div>}
                </div>

                {/* Link */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="link">Project Link <span className="text-muted fw-normal">(optional)</span></label>
                  <input
                    id="link" type="text" name="link"
                    className="form-control" placeholder="https://..."
                    value={data.link} onChange={getInputData}
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label" htmlFor="desc">Description</label>
                  <textarea
                    id="desc" name="desc" rows={4}
                    className="form-control" placeholder="Describe the project..."
                    value={data.desc} onChange={getInputData}
                  />
                  {show && error.desc && <div className="text-danger small mt-1">{error.desc}</div>}
                </div>

                {/* Images */}
                <div className="col-12">
                  <label className="form-label" htmlFor="images">Project Images</label>

                  {existingImages.length > 0 && (
                    <>
                      <p className="text-muted small mb-1">Current images</p>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {existingImages.map((src, i) => (
                          <div key={`existing-${i}`} className="img-thumb-wrap">
                            <img src={src} alt={`Image ${i + 1}`} className="img-thumb" />
                            <button type="button" className="img-thumb-remove" onClick={() => removeExistingImage(i)} aria-label="Remove image">
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <input
                    id="images" type="file" multiple
                    className="form-control" onChange={handleImagesChange}
                    accept="image/jpeg,image/png,image/webp"
                  />
                  {show && imageError && <div className="text-danger small mt-1">{imageError}</div>}

                  {newPreviews.length > 0 && (
                    <>
                      <p className="text-muted small mb-1 mt-2">New images to add</p>
                      <div className="d-flex flex-wrap gap-2">
                        {newPreviews.map((src, i) => (
                          <div key={`new-${i}`} className="img-thumb-wrap">
                            <img src={src} alt={`New image ${i + 1}`} className="img-thumb" />
                            <button type="button" className="img-thumb-remove" onClick={() => removeNewImage(i)} aria-label="Remove image">
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="col-12">
                  <label className="form-label">Tech Stack</label>
                  <div className="d-flex flex-column gap-2">
                    {tech.map((row, i) => (
                      <div key={i} className="d-flex gap-2 align-items-center">
                        <input
                          type="text" className="form-control" placeholder="e.g. bi bi-filetype-html"
                          value={row.icon} onChange={(e) => updateTechRow(i, "icon", e.target.value)}
                        />
                        <input
                          type="color" className="form-control form-control-color" title="Icon color"
                          value={row.color || DEFAULT_COLOR} onChange={(e) => updateTechRow(i, "color", e.target.value)}
                        />
                        <button
                          type="button" className="btn btn-outline-danger btn-sm"
                          onClick={() => removeTechRow(i)} disabled={tech.length === 1}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={addTechRow}>
                    <i className="bi bi-plus-lg"></i> Add Tech
                  </button>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    id="status" name="status"
                    className="form-select"
                    value={data.status ? "1" : "0"} onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/portfolio">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Update Project
                </button>
              </div>
            </div>
          </div>

          {/* Checklist */}
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

      <style>{`
        .img-thumb-wrap { position: relative; width: 70px; height: 70px; }
        .img-thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #dee2e6; }
        .img-thumb-remove {
          position: absolute; top: -6px; right: -6px; width: 20px; height: 20px;
          border-radius: 50%; border: none; background: #dc3545; color: #fff;
          font-size: 0.7rem; line-height: 1; display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}