import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createBlog, getBlog } from "../../Redux/ActionCreators/BlogActionCreators";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Quill Configuration
const QUILL_MODULES = { toolbar: [["bold", "italic", "underline", "strike"], ["blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]] };
const QUILL_FORMATS = ["bold", "italic", "underline", "strike", "blockquote", "code-block", "list", "link", "image"];

const checklist = [
  { dot: "bg-success", title: "Structure the post", body: "Use multiple sections with subheadings and rich-text paragraphs." },
  { dot: "bg-primary", title: "Set meta data", body: "Ensure SEO slug, category, and summary are sharp." },
  { dot: "bg-warning", title: "Add author info", body: "Give credit to the writer with their bio and role." },
];

export default function AdminCreateBlog() {
  const [data, setData] = useState({
    title: "", slug: "", category: "", categoryColor: "#47b2e4", summary: "", readTime: "5 min read", featured: false, status: true,
  });

  // Dynamic Sections State
  const [sections, setSections] = useState([{ subheading: "", paragraphs: [""] }]);

  const [author, setAuthor] = useState({ name: "", role: "", bio: "" });
  const [authorAvatar, setAuthorAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState({ title: "Title Field is Mandatory", summary: "Summary Field is Mandatory", category: "Category is Mandatory", name: "Author name is required", image: "Featured Image is required" });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const BlogStateData = useSelector((state) => state.BlogStateData) || [];
  const dispatch = useDispatch();

  function generateSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }

  function getInputData(e) {
    const { name, value, type, checked } = e.target;
    if (["title", "slug", "category", "summary", "readTime", "categoryColor"].includes(name)) {
      let finalValue = value;
      let newSlug = data.slug;
      if (name === "title") {
        newSlug = generateSlug(value);
      }
      setData({ ...data, [name]: finalValue, ...(name === "title" && { slug: newSlug }) });
      setError({ ...error, [name]: formValidator(e) });
    } else if (["featured", "status"].includes(name)) {
      setData({ ...data, [name]: type === "checkbox" ? checked : value === "1" });
    }
  }

  function getAuthorData(e) {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: value });
    if (name === "name") setError({ ...error, name: formValidator(e) });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
    setError({ ...error, image: file ? "" : "Featured Image is required" });
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    setAuthorAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : "");
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, "");
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setTagInput("");
    }
  }

  // --- Dynamic Section Handlers ---
  const addSection = () => setSections([...sections, { subheading: "", paragraphs: [""] }]);
  const removeSection = (idx) => setSections(sections.filter((_, i) => i !== idx));
  const updateSubheading = (idx, value) => {
    const newSec = [...sections];
    newSec[idx].subheading = value;
    setSections(newSec);
  };
  const addParagraph = (sIdx) => {
    const newSec = [...sections];
    newSec[sIdx].paragraphs.push("");
    setSections(newSec);
  };
  const removeParagraph = (sIdx, pIdx) => {
    const newSec = [...sections];
    newSec[sIdx].paragraphs = newSec[sIdx].paragraphs.filter((_, i) => i !== pIdx);
    setSections(newSec);
  };
  const updateParagraph = (sIdx, pIdx, value) => {
    const newSec = [...sections];
    newSec[sIdx].paragraphs[pIdx] = value;
    setSections(newSec);
  };
  // --------------------------------

  function postSubmit(e) {
    e.preventDefault();

    // Clean sections and check for empty Quill inputs ("<p><br></p>")
    const cleanSections = sections.map(s => ({
      subheading: s.subheading,
      paragraphs: s.paragraphs.filter(p => {
        const textOnly = p.replace(/<[^>]*>/g, "").trim();
        return textOnly !== "";
      })
    })).filter(s => s.subheading.trim() !== "" || s.paragraphs.length > 0);

    if (cleanSections.length === 0) {
      setError({ ...error, sections: "At least one section with content is required." });
      setShow(true);
      return;
    } else {
      setError({ ...error, sections: "" });
    }

    const relevantErrors = { title: error.title, summary: error.summary, category: error.category, name: error.name, image: error.image, sections: error.sections };
    if (Object.values(relevantErrors).some((x) => x !== "")) {
      setShow(true);
      return;
    }

    const isDuplicate = BlogStateData.some(x => x.slug === data.slug);
    if (isDuplicate) {
      setShow(true);
      setError({ ...error, slug: "This URL Slug is already taken by another post." });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("categoryColor", data.categoryColor);
    formData.append("summary", data.summary);
    formData.append("readTime", data.readTime);
    formData.append("featured", data.featured);
    formData.append("active", data.status);

    formData.append("sections", JSON.stringify(cleanSections));

    formData.append("authorName", author.name);
    formData.append("authorRole", author.role);
    formData.append("authorBio", author.bio);

    tags.forEach(t => formData.append("tags[]", t));

    if (image) formData.append("image", image);
    if (authorAvatar) formData.append("authorAvatar", authorAvatar);

    dispatch(createBlog(formData));
    navigate("/blog");
  }

  useEffect(() => { dispatch(getBlog()); }, [dispatch]);

  return (
    <main className="dashboard-content">
      <style>{`
            .rte { --rte-border:#dee2e6; --rte-bg:#fff; --rte-text:#212529; }
            .rte .ql-toolbar { border:1px solid var(--rte-border); border-radius:8px 8px 0 0; background:#f8f9fa; }
            .rte .ql-container { border:1px solid var(--rte-border); border-top:none; border-radius:0 0 8px 8px; background:var(--rte-bg); font-size:15px; }
            .rte .ql-editor { min-height: 120px; }
        `}</style>
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="page-heading">
          <div className="page-heading-copy">
            <span className="page-icon"><i className="bi bi-plus-circle"></i></span>
            <div>
              <p className="eyebrow mb-1">Management</p>
              <h1 className="h3 mb-1">Write Article</h1>
              <p className="text-muted mb-0">Build your blog using structured subheadings and rich-text paragraphs.</p>
            </div>
          </div>
          <div className="heading-actions">
            <Link className="btn btn-outline-secondary btn-sm" to="/blog"><i className="bi bi-arrow-left"></i> Back</Link>
          </div>
        </div>

        {show && (
          <div className="alert alert-danger alert-dismissible fade show">
            {Object.values(error)
              .filter(Boolean)
              .map((err, index) => (
                <div key={index}>{err}</div>
              ))}

            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <section className="row g-3">
          <div className="col-12 col-xl-8">

            {/* META & SUMMARY */}
            <div className="panel mb-3">
              <div className="panel-header">
                <div><h2 className="h5 mb-0 section-title"><i className="bi bi-journal-text"></i> Post Overview</h2></div>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Main Heading (Title)</label>
                  <input className={`form-control ${show && error.title ? "is-invalid" : ""}`} type="text" name="title" value={data.title} onChange={getInputData} placeholder="Article title" />
                </div>

                <div className="col-12">
                  <label className="form-label">URL Slug <small className="text-muted">(auto-generated)</small></label>
                  <div className="input-group">
                    <span className="input-group-text text-muted bg-light">/blog/</span>
                    <input className={`form-control ${show && error.slug ? "is-invalid" : ""}`} type="text" name="slug" value={data.slug} onChange={getInputData} placeholder="my-awesome-post" />
                  </div>
                  {show && error.slug && <div className="text-danger small mt-1">{error.slug}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input className={`form-control ${show && error.category ? "is-invalid" : ""}`} type="text" name="category" value={data.category} onChange={getInputData} placeholder="e.g. Web Development" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category Badge Color</label>
                  <div className="input-group">
                    <input type="color" className="form-control form-control-color p-1" name="categoryColor" value={data.categoryColor} onChange={getInputData} />
                    <input type="text" className="form-control" name="categoryColor" value={data.categoryColor} onChange={getInputData} />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Summary <small className="text-muted">(appears on blog cards)</small></label>
                  <textarea className={`form-control ${show && error.summary ? "is-invalid" : ""}`} name="summary" value={data.summary} onChange={getInputData} rows="2" placeholder="Brief post introduction..." />
                </div>
              </div>
            </div>

            {/* DYNAMIC SECTIONS BUILDER */}
            <div className="panel blog-sections-panel mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h2 className="h5 mb-1"><i className="bi bi-card-text text-primary me-2"></i>Content Sections</h2>
                  <p className="text-muted small mb-0">Add subheadings and separate your text into multiple rich-text paragraphs.</p>
                </div>
                <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill">
                  {sections.length} {sections.length === 1 ? 'Section' : 'Sections'}
                </span>
              </div>

              {sections.map((sec, sIdx) => (
                <div key={sIdx} className="blog-section-card mb-3">
                  <div className="blog-section-card-header d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary d-flex align-items-center gap-2">
                      <i className="bi bi-bookmark-check-fill small"></i> Section {sIdx + 1}
                    </span>
                    {sections.length > 1 && (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSection(sIdx)}>
                        <i className="bi bi-trash me-1"></i> Remove Section
                      </button>
                    )}
                  </div>
                  <div className="blog-section-card-body">
                    <input
                      type="text"
                      className="form-control blog-section-subheading-input mb-3 fw-bold"
                      placeholder="Subheading (Optional)"
                      value={sec.subheading}
                      onChange={(e) => updateSubheading(sIdx, e.target.value)}
                    />

                    {sec.paragraphs.map((para, pIdx) => (
                      <div key={pIdx} className="d-flex gap-2 mb-3 align-items-start">
                        <div className="quill-editor rte flex-grow-1">
                          <ReactQuill
                            theme="snow"
                            value={para}
                            onChange={(html) => updateParagraph(sIdx, pIdx, html)}
                            modules={QUILL_MODULES}
                            formats={QUILL_FORMATS}
                            placeholder={`Paragraph ${pIdx + 1}...`}
                          />
                        </div>

                        {sec.paragraphs.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-1 p-2"
                            onClick={() => removeParagraph(sIdx, pIdx)}
                            title="Remove Paragraph"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addParagraph(sIdx)}>
                      <i className="bi bi-plus-lg me-1"></i> Add Paragraph Block
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-primary w-100 py-2 fw-bold mt-2" onClick={addSection}>
                <i className="bi bi-plus-circle me-2"></i> Add Another Section
              </button>
            </div>

            {/* AUTHOR DETAILS */}
            <div className="panel mb-3">
              <div className="panel-header">
                <div><h2 className="h5 mb-0 section-title"><i className="bi bi-person-badge"></i> Author Information</h2></div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Author Name</label>
                  <input className={`form-control ${show && error.name ? "is-invalid" : ""}`} type="text" name="name" value={author.name} onChange={getAuthorData} placeholder="e.g. John Doe" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <input className="form-control" type="text" name="role" value={author.role} onChange={getAuthorData} placeholder="e.g. Senior Engineer" />
                </div>
                <div className="col-12">
                  <label className="form-label">Bio <small className="text-muted">(optional)</small></label>
                  <textarea className="form-control" name="bio" value={author.bio} onChange={getAuthorData} rows="2" />
                </div>
                <div className="col-12">
                  <label className="form-label">Author Avatar <small className="text-muted">(optional image)</small></label>
                  <div className="d-flex align-items-center gap-3">
                    {avatarPreview && <img src={avatarPreview} alt="Avatar" className="rounded-circle" style={{ width: 48, height: 48, objectFit: 'cover' }} />}
                    <input className="form-control" type="file" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-12 col-xl-4">

            {/* Settings Panel */}
            <div className="panel mb-3">
              <h2 className="h5 mb-3 section-title"><i className="bi bi-gear"></i> Settings</h2>

              <div className="mb-3">
                <label className="form-label">Featured Image</label>
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid rounded mb-2 d-block" style={{ maxHeight: 180, objectFit: 'cover' }} />}
                <input className={`form-control form-control-sm ${show && error.image ? "is-invalid" : ""}`} type="file" accept="image/*" onChange={handleImageChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Read Time</label>
                <input className="form-control form-control-sm" type="text" name="readTime" value={data.readTime} onChange={getInputData} />
              </div>

              <div className="mb-3">
                <label className="form-label">Tags <small className="text-muted">(Press Enter)</small></label>
                <input className="form-control form-control-sm" type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="React, Performance..." />
                {tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {tags.map(t => (
                      <span key={t} className="badge text-bg-light border">{t} <i className="bi bi-x ms-1" style={{ cursor: 'pointer' }} onClick={() => setTags(tags.filter(x => x !== t))}></i></span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-3 form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="featured" name="featured" checked={data.featured} onChange={getInputData} />
                <label className="form-check-label" htmlFor="featured">Feature this post</label>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select form-select-sm" name="status" value={data.status ? "1" : "0"} onChange={getInputData}>
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold" onClick={postSubmit}><i className="bi bi-check2-circle me-1"></i> Publish Post</button>
            </div>

            {/* Checklist Panel */}
            <div className="panel">
              <h2 className="h5 mb-3 section-title"><i className="bi bi-list-check"></i> Checklist</h2>
              <div className="activity-list">
                {checklist.map(({ dot, title, body }) => (
                  <div key={title} className="activity-item">
                    <span className={`activity-dot ${dot}`}></span>
                    <div><p className="mb-1 fw-semibold">{title}</p><p className="text-muted small mb-0">{body}</p></div>
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