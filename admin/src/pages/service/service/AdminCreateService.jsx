import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formValidator from "../../../FormValidators/formValidator";
import { createService, getService } from "../../../Redux/ActionCreators/ServiceActionCreators";

const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #47b2e4, #2563eb)", "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #a855f7, #ec4899)", "linear-gradient(135deg, #22d3ee, #10b981)",
  "linear-gradient(135deg, #f97316, #eab308)", "linear-gradient(135deg, #6366f1, #8b5cf6)",
];

const emptyFeature = () => ({ icon: "bi-check2", title: "", desc: "" });
const emptyStat = () => ({ value: "", label: "" });

export default function AdminCreateService() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rawData = useSelector((state) => state.ServiceStateData);
  const ServiceStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  const [data, setData] = useState({ title: "", slug: "", icon: "bi-window", gradient: GRADIENT_PRESETS[0], description: "", tagline: "", status: true });
  const [overview, setOverview] = useState({ heading: "", paragraphs: [""], stats: [emptyStat()] });
  const [features, setFeatures] = useState([emptyFeature()]);

  // --- IMAGE STATE --- (required by the schema, so Create must always end up with one)
  const [imageSource, setImageSource] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState({
    title: "Title is mandatory",
    description: "Description is mandatory",
    image: "Please add a card image",
  });
  const [show, setShow] = useState(false);

  useEffect(() => { dispatch(getService()); }, [dispatch]);

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function getInputData(e) {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      setData(old => ({ ...old, title: value, slug: old.slugTouched ? old.slug : slugify(value) }));
      setError(old => ({ ...old, title: formValidator(e) }));
    } else if (name === "slug") {
      setData(old => ({ ...old, slug: value, slugTouched: true }));
    } else if (["icon", "gradient", "description", "tagline"].includes(name)) {
      setData(old => ({ ...old, [name]: value }));
      if (name === "description") setError(old => ({ ...old, description: formValidator(e) }));
    } else if (name === "status") {
      setData(old => ({ ...old, status: type === "checkbox" ? checked : value === "1" }));
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError(old => ({ ...old, image: "" }));
  }

  function handleImageUrl(value) {
    setImageUrl(value);
    setImagePreview(value);
    setError(old => ({ ...old, image: value.trim() ? "" : "Please add a card image" }));
  }

  // Array Handlers
  const updateOverviewField = (field, value) => setOverview(prev => ({ ...prev, [field]: value }));
  const updateParagraph = (idx, value) => setOverview(prev => ({ ...prev, paragraphs: prev.paragraphs.map((p, i) => i === idx ? value : p) }));
  const addParagraph = () => setOverview(prev => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  const removeParagraph = (idx) => setOverview(prev => ({ ...prev, paragraphs: prev.paragraphs.filter((_, i) => i !== idx) }));
  const updateStat = (idx, field, value) => setOverview(prev => ({ ...prev, stats: prev.stats.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  const addStat = () => setOverview(prev => ({ ...prev, stats: [...prev.stats, emptyStat()] }));
  const removeStat = (idx) => setOverview(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }));
  const updateFeature = (idx, field, value) => setFeatures(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  const addFeatureRow = () => setFeatures(prev => [...prev, emptyFeature()]);
  const removeFeatureRow = (idx) => setFeatures(prev => prev.filter((_, i) => i !== idx));

  function postSubmit(e) {
    e.preventDefault();

    const hasImage = (imageSource === "upload" && image) || (imageSource === "url" && imageUrl.trim() !== "");
    const relevantErrors = { title: error.title, description: error.description, image: hasImage ? "" : "Please add a card image" };
    if (Object.values(relevantErrors).some(x => x !== "")) {
      setError(old => ({ ...old, ...relevantErrors }));
      setShow(true);
      return;
    }

    const slug = data.slug || slugify(data.title);
    if (ServiceStateData.some(x => x.slug === slug)) {
      setError(old => ({ ...old, slug: "That slug is already used by another service." }));
      setShow(true);
      return;
    }

    const cleanFeatures = features.filter(f => f.title.trim());
    const cleanOverview = { heading: overview.heading, paragraphs: overview.paragraphs.filter(p => p.trim()), stats: overview.stats.filter(s => s.value.trim() || s.label.trim()) };

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", slug);
    formData.append("icon", data.icon);
    formData.append("gradient", data.gradient);
    formData.append("description", data.description);
    formData.append("tagline", data.tagline);
    formData.append("status", data.status);
    formData.append("overview", JSON.stringify(cleanOverview));
    formData.append("features", JSON.stringify(cleanFeatures));

    if (imageSource === "upload" && image) formData.append("image", image);
    else if (imageSource === "url" && imageUrl.trim() !== "") formData.append("image", imageUrl.trim());

    dispatch(createService(formData));
    navigate("/service");
  }

  return (
    <>
      <style>{`
        .icon-live-preview {
          width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 1.1rem; color: #fff; transition: background .2s ease;
        }
        .field-hint { font-size: 0.76rem; color: #94a3b8; margin-top: 4px; }
        .repeater-card {
          border: 1px solid #e9ecef; border-radius: 10px; padding: 14px 16px;
          margin-bottom: 12px; background: #fff; transition: border-color .15s;
        }
        .repeater-card:hover { border-color: #cbd5e1; }
        .repeater-card-head {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
        }
        .repeater-index {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; border-radius: 6px; background: #eef2ff; color: #4f46e5;
          font-size: 0.72rem; font-weight: 700; margin-right: 8px;
        }
        .repeater-add {
          border: 1.5px dashed #cbd5e1; border-radius: 10px; width: 100%;
          background: #fafbfc; color: #6c757d; font-weight: 600; font-size: 0.84rem;
          padding: 10px; transition: all .15s;
        }
        .repeater-add:hover { border-color: #0d6efd; color: #0d6efd; background: #f4f8ff; }
        .icon-remove { color: #adb5bd; }
        .icon-remove:hover { color: #dc3545; }

        .image-drop {
          border-radius: 12px; overflow: hidden; border: 1px solid #dee2e6;
          background: #f8f9fa; position: relative; margin-bottom: 12px;
          aspect-ratio: 16 / 10; display: flex; align-items: center; justify-content: center;
        }
        .image-drop.is-invalid { border-color: #dc3545; }
        .image-drop img { width: 100%; height: 100%; object-fit: cover; }
        .image-drop .placeholder { color: #cbd5e1; font-size: 2rem; }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon"><i className="bi bi-plus-circle"></i></span>
              <div>
                <p className="eyebrow mb-1">Management</p>
                <h1 className="h3 mb-1">Add Service</h1>
                <p className="text-muted mb-0">Create a new service with its overview and features.</p>
              </div>
            </div>
            <Link className="btn btn-outline-secondary btn-sm" to="/service"><i className="bi bi-arrow-left"></i> Back</Link>
          </div>

          {show && (
            <div className="alert alert-danger alert-dismissible">
              {Object.values(error).find(x => x !== "") || "Please fix the errors in the form."}
              <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
            </div>
          )}

          <section className="row g-3">
            <div className="col-12 col-xl-8">
              {/* CORE DETAILS */}
              <div className="panel mb-3">
                <div className="panel-header">
                  <h2 className="h5 mb-0 section-title"><i className="bi bi-grid-1x2-fill"></i> Core Details</h2>
                </div>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Title</label>
                    <input className={`form-control ${show && error.title ? "is-invalid" : ""}`} type="text" name="title" value={data.title} onChange={getInputData} placeholder="e.g. Website Development" />
                    {show && error.title && <div className="text-danger small mt-1">{error.title}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">URL Slug</label>
                    <div className="input-group">
                      <span className="input-group-text">/</span>
                      <input className={`form-control ${show && error.slug ? "is-invalid" : ""}`} type="text" name="slug" value={data.slug} onChange={getInputData} placeholder="website-development" />
                    </div>
                    <div className="field-hint">Generated from the title automatically — edit it if you'd like something different.</div>
                    {show && error.slug && <div className="text-danger small mt-1">{error.slug}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Tagline <small className="text-muted fw-normal">(optional)</small></label>
                    <input className="form-control" type="text" name="tagline" value={data.tagline} onChange={getInputData} placeholder="A short line shown under the title" />
                  </div>

                  <div className="col-md-7">
                    <label className="form-label">Icon <small className="text-muted fw-normal">(Bootstrap Icons class)</small></label>
                    <div className="d-flex align-items-center gap-2">
                      <span className="icon-live-preview" style={{ background: data.gradient }}>
                        <i className={`bi ${data.icon || "bi-question-lg"}`}></i>
                      </span>
                      <input className="form-control" type="text" name="icon" value={data.icon} onChange={getInputData} placeholder="bi-window" />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label">Gradient</label>
                    <div className="d-flex flex-wrap gap-2 pt-1">
                      {GRADIENT_PRESETS.map((g) => (
                        <button
                          key={g} type="button" onClick={() => setData(old => ({ ...old, gradient: g }))}
                          aria-label="Select gradient"
                          style={{ background: g, width: 32, height: 32, borderRadius: 8, border: data.gradient === g ? "2px solid #212529" : "2px solid transparent", cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className={`form-control ${show && error.description ? "is-invalid" : ""}`} name="description" value={data.description} onChange={getInputData} rows="3" placeholder="A short summary shown on the services list" />
                    {show && error.description && <div className="text-danger small mt-1">{error.description}</div>}
                  </div>
                </div>
              </div>

              {/* OVERVIEW */}
              <div className="panel mb-3">
                <div className="panel-header">
                  <h2 className="h5 mb-0 section-title"><i className="bi bi-file-text"></i> Overview <small className="text-muted fw-normal">(optional)</small></h2>
                </div>
                <label className="form-label">Heading</label>
                <input className="form-control mb-3" type="text" value={overview.heading} onChange={e => updateOverviewField("heading", e.target.value)} placeholder="Overview heading shown on the service page" />

                <label className="form-label small text-uppercase text-muted" style={{ letterSpacing: "0.04em", fontSize: "0.72rem" }}>Paragraphs</label>
                {overview.paragraphs.map((p, idx) => (
                  <div className="repeater-card" key={idx}>
                    <div className="repeater-card-head">
                      <span><span className="repeater-index">{idx + 1}</span>Paragraph</span>
                      <button type="button" className="btn btn-sm btn-link icon-remove p-0" onClick={() => removeParagraph(idx)}><i className="bi bi-trash3"></i></button>
                    </div>
                    <textarea className="form-control form-control-sm" rows="2" value={p} onChange={e => updateParagraph(idx, e.target.value)} placeholder="Write a paragraph of body copy..." />
                  </div>
                ))}
                <button type="button" className="repeater-add mb-4" onClick={addParagraph}><i className="bi bi-plus-lg me-1"></i> Add paragraph</button>

                <label className="form-label small text-uppercase text-muted" style={{ letterSpacing: "0.04em", fontSize: "0.72rem" }}>Stats</label>
                {overview.stats.map((s, idx) => (
                  <div className="repeater-card" key={idx}>
                    <div className="repeater-card-head">
                      <span><span className="repeater-index">{idx + 1}</span>Stat</span>
                      <button type="button" className="btn btn-sm btn-link icon-remove p-0" onClick={() => removeStat(idx)}><i className="bi bi-trash3"></i></button>
                    </div>
                    <div className="row g-2">
                      <div className="col-5"><input className="form-control form-control-sm" value={s.value} onChange={e => updateStat(idx, "value", e.target.value)} placeholder="e.g. 200+" /></div>
                      <div className="col-7"><input className="form-control form-control-sm" value={s.label} onChange={e => updateStat(idx, "label", e.target.value)} placeholder="e.g. Projects delivered" /></div>
                    </div>
                  </div>
                ))}
                <button type="button" className="repeater-add" onClick={addStat}><i className="bi bi-plus-lg me-1"></i> Add stat</button>
              </div>

              {/* FEATURES */}
              <div className="panel mb-3">
                <div className="panel-header">
                  <h2 className="h5 mb-0 section-title"><i className="bi bi-diagram-3"></i> Features <small className="text-muted fw-normal">(optional)</small></h2>
                </div>
                {features.map((f, idx) => (
                  <div className="repeater-card" key={idx}>
                    <div className="repeater-card-head">
                      <span><span className="repeater-index">{idx + 1}</span>Feature</span>
                      <button type="button" className="btn btn-sm btn-link icon-remove p-0" onClick={() => removeFeatureRow(idx)}><i className="bi bi-trash3"></i></button>
                    </div>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input className="form-control form-control-sm" value={f.title} onChange={e => updateFeature(idx, "title", e.target.value)} placeholder="Feature title" />
                      </div>
                      <div className="col-md-6">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text"><i className={`bi ${f.icon || "bi-check2"}`}></i></span>
                          <input className="form-control" value={f.icon} onChange={e => updateFeature(idx, "icon", e.target.value)} placeholder="bi-check2" />
                        </div>
                      </div>
                      <div className="col-12">
                        <textarea className="form-control form-control-sm" rows="2" value={f.desc} onChange={e => updateFeature(idx, "desc", e.target.value)} placeholder="Short description of this feature" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="repeater-add" onClick={addFeatureRow}><i className="bi bi-plus-lg me-1"></i> Add feature</button>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="col-12 col-xl-4">
              <div className="panel mb-3" style={{ position: "sticky", top: 16 }}>
                <h2 className="h5 mb-3 section-title"><i className="bi bi-gear"></i> Settings</h2>

                <div className="mb-3">
                  <label className="form-label">Card Image</label>
                  <div className={`image-drop ${show && error.image ? "is-invalid" : ""}`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Service preview" />
                    ) : (
                      <i className="bi bi-image placeholder"></i>
                    )}
                  </div>

                  <select className="form-select form-select-sm mb-2" value={imageSource} onChange={e => { setImageSource(e.target.value); setImagePreview(""); setImageUrl(""); setImage(null); }}>
                    <option value="upload">Upload a file</option>
                    <option value="url">Use an image URL</option>
                  </select>

                  {imageSource === "upload" ? (
                    <input className="form-control form-control-sm" type="file" accept="image/*" onChange={handleImageChange} />
                  ) : (
                    <input className="form-control form-control-sm" type="url" placeholder="https://..." value={imageUrl} onChange={(e) => handleImageUrl(e.target.value)} />
                  )}
                  {show && error.image && <div className="text-danger small mt-1">{error.image}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select form-select-sm" name="status" value={data.status ? "1" : "0"} onChange={getInputData}>
                    <option value="1">Published</option>
                    <option value="0">Draft</option>
                  </select>
                </div>

                <button className="btn btn-primary w-100" onClick={postSubmit}><i className="bi bi-check2-circle me-1"></i> Save Service</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}