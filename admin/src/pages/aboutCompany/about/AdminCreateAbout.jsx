import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createAbout, getAbout } from "../../../Redux/ActionCreators/AboutActionCreators";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};
const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet", "link"];
function isHtmlEmpty(html) {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return text.length === 0;
}

const checklist = [
  { dot: "bg-primary", title: "Company Info", body: "Set the name, hero subtitle, description, mission and vision." },
  { dot: "bg-info", title: "Storyline", body: "Add the story heading, body copy and image." },
  { dot: "bg-success", title: "Features & Slides", body: "Add feature highlights and gallery slides." },
  { dot: "bg-warning", title: "Values & Timeline", body: "Add core values and milestone timeline events." },
];

const emptyFeature = { icon: "", text: "" };
const emptySlide = { src: "", alt: "" };
const emptyCoreValue = { icon: "", title: "", desc: "" };
const emptyTimeline = { year: "", title: "", desc: "" };

export default function AdminCreateAbout() {
  const [data, setData] = useState({
    companyInfo: { name: "", heroSubtitle: "", description: "", mission: "", vision: "" },
    storyline: {
      eyebrow: "Our Story",
      headingPrefix: "",
      headingHighlight: "",
      subheading: "",
      body: "",
      imageSrc: "",
      badgeCount: "200+",
      badgeLabel: "Clients served globally",
    },
    aboutFeatures: [],
    aboutSlides: [],
    coreValues: [],
    timeline: [],
  });

  const [errors, setErrors] = useState([]);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const AboutStateData = useSelector((state) => state.AboutStateData);
  const dispatch = useDispatch();

  function updateCompanyInfo(key, value) {
    setData((old) => ({ ...old, companyInfo: { ...old.companyInfo, [key]: value } }));
  }

  function updateStoryline(key, value) {
    setData((old) => ({ ...old, storyline: { ...old.storyline, [key]: value } }));
  }

  function addArrayItem(field, template) {
    setData((old) => ({ ...old, [field]: [...old[field], { ...template }] }));
  }

  function updateArrayItem(field, index, key, value) {
    setData((old) => {
      const arr = [...old[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...old, [field]: arr };
    });
  }

  function removeArrayItem(field, index) {
    setData((old) => ({ ...old, [field]: old[field].filter((_, i) => i !== index) }));
  }

  function validate() {
    const errs = [];
    if (!data.companyInfo.name.trim()) errs.push("Company name is required.");
    if (!data.companyInfo.heroSubtitle.trim()) errs.push("Hero subtitle is required.");
    if (isHtmlEmpty(data.companyInfo.description)) errs.push("Company description is required.");
    if (isHtmlEmpty(data.companyInfo.mission)) errs.push("Mission statement is required.");
    if (isHtmlEmpty(data.companyInfo.vision)) errs.push("Vision statement is required.");

    if (!data.storyline.headingPrefix.trim()) errs.push("Storyline heading prefix is required.");
    if (!data.storyline.headingHighlight.trim()) errs.push("Storyline heading highlight is required.");
    if (!data.storyline.subheading.trim()) errs.push("Storyline subheading is required.");
    if (isHtmlEmpty(data.storyline.body)) errs.push("Storyline body is required.");
    if (!data.storyline.imageSrc.trim()) errs.push("Storyline image URL is required.");

    data.aboutFeatures.forEach((f, i) => {
      if (!f.icon.trim() || !f.text.trim()) errs.push(`Feature #${i + 1} needs both an icon and text.`);
    });
    data.aboutSlides.forEach((s, i) => {
      if (!s.src.trim() || !s.alt.trim()) errs.push(`Slide #${i + 1} needs both an image URL and alt text.`);
    });
    data.coreValues.forEach((c, i) => {
      if (!c.icon.trim() || !c.title.trim() || !c.desc.trim()) errs.push(`Core value #${i + 1} needs an icon, title, and description.`);
    });
    data.timeline.forEach((t, i) => {
      if (!t.year.trim() || !t.title.trim() || !t.desc.trim()) errs.push(`Timeline event #${i + 1} needs a year, title, and description.`);
    });
    return errs;
  }

  function postSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (errs.length) { setErrors(errs); setShow(true); return; }

    // Nested objects/arrays are sent as JSON strings — backend should JSON.parse each field.
    const formData = new FormData();
    formData.append("companyInfo", JSON.stringify(data.companyInfo));
    formData.append("storyline", JSON.stringify(data.storyline));
    formData.append("aboutFeatures", JSON.stringify(data.aboutFeatures));
    formData.append("aboutSlides", JSON.stringify(data.aboutSlides));
    formData.append("coreValues", JSON.stringify(data.coreValues));
    formData.append("timeline", JSON.stringify(data.timeline));

    dispatch(createAbout(formData));
    navigate("/about");
  }

  useEffect(() => { dispatch(getAbout()); }, [AboutStateData?.length]);

  return (
    <main className="dashboard-content">
      <style>{`
        .rte .ql-toolbar.ql-snow { border:1px solid var(--admin-border, #dee2e6); border-bottom:none; border-radius:8px 8px 0 0; background:var(--admin-surface-soft, #f8f9fa); }
        .rte .ql-container.ql-snow { border:1px solid var(--admin-border, #dee2e6); border-radius:0 0 8px 8px; background:var(--admin-surface, #fff); }
        .rte .ql-editor { min-height:110px; font-size:14px; line-height:1.5; color:var(--admin-text, #212529); }
        .rte .ql-editor.ql-blank::before { color:var(--admin-muted, #6c757d); font-style:normal; }
      `}</style>
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon"><i className="bi bi-person-plus" aria-hidden="true"></i></span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Add About Page</h1>
              <p className="text-muted mb-0">Create the About page content.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/about">
              <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to About
            </Link>
          </div>
        </div>

        {show && errors.length > 0 && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <ul className="mb-0 ps-3">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
            <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
          </div>
        )}

        <section className="row g-3">
          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="h5 mb-1 section-title">
                    <i className="bi bi-building" aria-hidden="true"></i>
                    <span>Company Info</span>
                  </h2>
                  <p className="text-muted mb-0">Shown at the top of the About page.</p>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="companyName">Company Name</label>
                  <input id="companyName" type="text" className="form-control"
                    placeholder="e.g. CTech Ethic Solution"
                    value={data.companyInfo.name}
                    onChange={(e) => updateCompanyInfo("name", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="heroSubtitle">Hero Subtitle</label>
                  <input id="heroSubtitle" type="text" className="form-control"
                    placeholder="A short tagline for the hero section"
                    value={data.companyInfo.heroSubtitle}
                    onChange={(e) => updateCompanyInfo("heroSubtitle", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <div className="rte">
                    <ReactQuill
                      theme="snow"
                      value={data.companyInfo.description}
                      onChange={(html) => updateCompanyInfo("description", html)}
                      modules={QUILL_MODULES}
                      formats={QUILL_FORMATS}
                      placeholder="A longer description of the company shown on the About page." />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Mission</label>
                  <div className="rte">
                    <ReactQuill
                      theme="snow"
                      value={data.companyInfo.mission}
                      onChange={(html) => updateCompanyInfo("mission", html)}
                      modules={QUILL_MODULES}
                      formats={QUILL_FORMATS}
                      placeholder="What the company sets out to do." />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Vision</label>
                  <div className="rte">
                    <ReactQuill
                      theme="snow"
                      value={data.companyInfo.vision}
                      onChange={(html) => updateCompanyInfo("vision", html)}
                      modules={QUILL_MODULES}
                      formats={QUILL_FORMATS}
                      placeholder="Where the company is headed." />
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Storyline */}
              <h2 className="h5 mb-1 section-title">
                <i className="bi bi-journal-text" aria-hidden="true"></i>
                <span>Storyline</span>
              </h2>
              <p className="text-muted mb-3">The "Our Story" section with heading, copy, and image.</p>

              <div className="row g-3 mb-1">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="storyEyebrow">Eyebrow</label>
                  <input id="storyEyebrow" type="text" className="form-control"
                    placeholder="Our Story"
                    value={data.storyline.eyebrow}
                    onChange={(e) => updateStoryline("eyebrow", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="headingPrefix">Heading Prefix</label>
                  <input id="headingPrefix" type="text" className="form-control"
                    placeholder="e.g. Building the future of"
                    value={data.storyline.headingPrefix}
                    onChange={(e) => updateStoryline("headingPrefix", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="headingHighlight">Heading Highlight</label>
                  <input id="headingHighlight" type="text" className="form-control"
                    placeholder="e.g. digital solutions"
                    value={data.storyline.headingHighlight}
                    onChange={(e) => updateStoryline("headingHighlight", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="subheading">Subheading</label>
                  <input id="subheading" type="text" className="form-control"
                    placeholder="A short supporting line under the heading"
                    value={data.storyline.subheading}
                    onChange={(e) => updateStoryline("subheading", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Story Body</label>
                  <div className="rte">
                    <ReactQuill
                      theme="snow"
                      value={data.storyline.body}
                      onChange={(html) => updateStoryline("body", html)}
                      modules={QUILL_MODULES}
                      formats={QUILL_FORMATS}
                      placeholder="Tell the company's story." />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="storyImage">Image URL</label>
                  <input id="storyImage" type="url" className="form-control"
                    placeholder="https://..."
                    value={data.storyline.imageSrc}
                    onChange={(e) => updateStoryline("imageSrc", e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="badgeCount">Badge Count</label>
                  <input id="badgeCount" type="text" className="form-control"
                    placeholder="200+"
                    value={data.storyline.badgeCount}
                    onChange={(e) => updateStoryline("badgeCount", e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="badgeLabel">Badge Label</label>
                  <input id="badgeLabel" type="text" className="form-control"
                    placeholder="Clients served globally"
                    value={data.storyline.badgeLabel}
                    onChange={(e) => updateStoryline("badgeLabel", e.target.value)} />
                </div>
              </div>

              {/* Features */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 mb-0 section-title">
                  <i className="bi bi-stars" aria-hidden="true"></i>
                  <span>Features</span>
                </h2>
                <button type="button" className="btn btn-sm btn-outline-primary"
                  onClick={() => addArrayItem("aboutFeatures", emptyFeature)}>
                  <i className="bi bi-plus-lg"></i> Add Feature
                </button>
              </div>
              {data.aboutFeatures.map((item, i) => (
                <div className="row g-2 align-items-center mb-2" key={i}>
                  <div className="col-4">
                    <input type="text" className="form-control" placeholder="Icon class (e.g. bi bi-rocket)"
                      value={item.icon} onChange={(e) => updateArrayItem("aboutFeatures", i, "icon", e.target.value)} />
                  </div>
                  <div className="col-7">
                    <input type="text" className="form-control" placeholder="Feature text"
                      value={item.text} onChange={(e) => updateArrayItem("aboutFeatures", i, "text", e.target.value)} />
                  </div>
                  <div className="col-1 text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("aboutFeatures", i)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
              {!data.aboutFeatures.length && <p className="text-muted small mb-0">No features yet.</p>}

              <hr className="my-4" />

              {/* Slides */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 mb-0 section-title">
                  <i className="bi bi-images" aria-hidden="true"></i>
                  <span>Gallery Slides</span>
                </h2>
                <button type="button" className="btn btn-sm btn-outline-primary"
                  onClick={() => addArrayItem("aboutSlides", emptySlide)}>
                  <i className="bi bi-plus-lg"></i> Add Slide
                </button>
              </div>
              {data.aboutSlides.map((item, i) => (
                <div className="row g-2 align-items-center mb-2" key={i}>
                  <div className="col-6">
                    <input type="url" className="form-control" placeholder="Image URL"
                      value={item.src} onChange={(e) => updateArrayItem("aboutSlides", i, "src", e.target.value)} />
                  </div>
                  <div className="col-5">
                    <input type="text" className="form-control" placeholder="Alt text"
                      value={item.alt} onChange={(e) => updateArrayItem("aboutSlides", i, "alt", e.target.value)} />
                  </div>
                  <div className="col-1 text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("aboutSlides", i)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
              {!data.aboutSlides.length && <p className="text-muted small mb-0">No slides yet.</p>}

              <hr className="my-4" />

              {/* Core Values */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 mb-0 section-title">
                  <i className="bi bi-shield-check" aria-hidden="true"></i>
                  <span>Core Values</span>
                </h2>
                <button type="button" className="btn btn-sm btn-outline-primary"
                  onClick={() => addArrayItem("coreValues", emptyCoreValue)}>
                  <i className="bi bi-plus-lg"></i> Add Core Value
                </button>
              </div>
              {data.coreValues.map((item, i) => (
                <div className="row g-2 align-items-start mb-2" key={i}>
                  <div className="col-2">
                    <input type="text" className="form-control" placeholder="Icon"
                      value={item.icon} onChange={(e) => updateArrayItem("coreValues", i, "icon", e.target.value)} />
                  </div>
                  <div className="col-3">
                    <input type="text" className="form-control" placeholder="Title"
                      value={item.title} onChange={(e) => updateArrayItem("coreValues", i, "title", e.target.value)} />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control" placeholder="Description"
                      value={item.desc} onChange={(e) => updateArrayItem("coreValues", i, "desc", e.target.value)} />
                  </div>
                  <div className="col-1 text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("coreValues", i)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
              {!data.coreValues.length && <p className="text-muted small mb-0">No core values yet.</p>}

              <hr className="my-4" />

              {/* Timeline */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 mb-0 section-title">
                  <i className="bi bi-signpost-split" aria-hidden="true"></i>
                  <span>Timeline</span>
                </h2>
                <button type="button" className="btn btn-sm btn-outline-primary"
                  onClick={() => addArrayItem("timeline", emptyTimeline)}>
                  <i className="bi bi-plus-lg"></i> Add Event
                </button>
              </div>
              {data.timeline.map((item, i) => (
                <div className="row g-2 align-items-start mb-2" key={i}>
                  <div className="col-2">
                    <input type="text" className="form-control" placeholder="Year"
                      value={item.year} onChange={(e) => updateArrayItem("timeline", i, "year", e.target.value)} />
                  </div>
                  <div className="col-3">
                    <input type="text" className="form-control" placeholder="Title"
                      value={item.title} onChange={(e) => updateArrayItem("timeline", i, "title", e.target.value)} />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control" placeholder="Description"
                      value={item.desc} onChange={(e) => updateArrayItem("timeline", i, "desc", e.target.value)} />
                  </div>
                  <div className="col-1 text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("timeline", i)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
              {!data.timeline.length && <p className="text-muted small mb-0">No timeline events yet.</p>}

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Link className="btn btn-outline-secondary" to="/about">Cancel</Link>
                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                  <i className="bi bi-check-circle" aria-hidden="true"></i> Create About Page
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