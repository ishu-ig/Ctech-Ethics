import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../../FormValidators/formValidator";
import { updatePlacement, getPlacement } from "../../../Redux/ActionCreators/PlacementActionCreators";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Remote", "Hybrid"];

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
    { dot: "bg-success", title: "Review details", body: "Confirm company, title, and category are current." },
    { dot: "bg-primary", title: "Check the deadline", body: "Extend it if the role is still open." },
    { dot: "bg-warning", title: "Save changes", body: "Changes take effect immediately." },
];

// Older records stored these fields as string arrays (one entry per line).
// Convert that shape into HTML so it displays correctly in the rich text editor.
function toRichText(value) {
    if (!value) return "";
    if (Array.isArray(value)) {
        return value.map((line) => `<p>${line}</p>`).join("");
    }
    return value;
}

function toDateInputValue(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
}

export default function AdminUpdatePlacement() {
    let { _id } = useParams();

    let [data, setData] = useState({
        companyName: "",
        jobTitle: "",
        category: "",
        type: "Full-Time",
        experience: "",
        shortDescription: "",
        description: "",
        responsibilities: "",
        eligibility: "",
        benefits: "",
        salary: "",
        companyInfo: "",
        applyLink: "",
        deadline: "",
        vacancies: 1,
        featured: false,
        status: true,
    });
    let [location, setLocation] = useState({
        address: "",
        city: "",
        state: "",
        pin: "",
        lat: "",
        lng: "",
    });
    let [skills, setSkills] = useState([]);
    let [skillInput, setSkillInput] = useState("");
    let [logo, setLogo] = useState(null);
    let [logoPreview, setLogoPreview] = useState("");

    let [error, setError] = useState({
        companyName: "",
        jobTitle: "",
        category: "",
        experience: "",
        shortDescription: "",
        description: "",
        deadline: "",
        city: "",
        state: "",
    });
    let [show, setShow] = useState(false);
    let navigate = useNavigate();

    let PlacementStateData = useSelector((state) => state.PlacementStateData);
    let dispatch = useDispatch();

    function getInputData(e) {
        let name = e.target.name;
        let value = e.target.value;

        if (!["type", "featured", "status"].includes(name)) {
            setError((old) => ({
                ...old,
                [name]: formValidator(e),
            }));
        }

        if (name === "featured" || name === "status") {
            setData((old) => ({ ...old, [name]: value === "1" }));
        } else {
            setData((old) => ({ ...old, [name]: value }));
        }
    }

    function getLocationInput(e) {
        const { name, value } = e.target;

        if (["city", "state"].includes(name)) {
            setError((old) => ({ ...old, [name]: formValidator(e) }));
        }
        setLocation((old) => ({ ...old, [name]: value }));
    }

    function updateDescription(html) {
        setData((old) => ({ ...old, description: html }));
        setError((old) => ({
            ...old,
            description: isHtmlEmpty(html) ? "Description Field is Mandatory" : "",
        }));
    }

    function updateCompanyInfo(html) {
        setData((old) => ({ ...old, companyInfo: html }));
    }

    function updateResponsibilities(html) {
        setData((old) => ({ ...old, responsibilities: html }));
    }

    function updateEligibility(html) {
        setData((old) => ({ ...old, eligibility: html }));
    }

    function updateBenefits(html) {
        setData((old) => ({ ...old, benefits: html }));
    }

    function getLogoInput(e) {
        // Optional on update — leaving it empty keeps the existing logo.
        const file = e.target.files?.[0] || null;
        setLogo(file);
        if (file) setLogoPreview(URL.createObjectURL(file));
    }

    function addSkill(e) {
        if (e.key !== "Enter" && e.key !== ",") return;
        e.preventDefault();
        const value = skillInput.trim().replace(/,$/, "");
        if (value && !skills.includes(value)) {
            setSkills((old) => [...old, value]);
        }
        setSkillInput("");
    }

    function removeSkill(skill) {
        setSkills((old) => old.filter((s) => s !== skill));
    }

    function postSubmit(e) {
        e.preventDefault();

        let errorItem = Object.values(error).find((x) => x !== "");
        if (errorItem) {
            setShow(true);
            return;
        }

        let item = PlacementStateData.find(
            (x) =>
                x._id !== _id &&
                x.jobTitle.toLocaleLowerCase() === data.jobTitle.toLocaleLowerCase() &&
                x.companyName.toLocaleLowerCase() === data.companyName.toLocaleLowerCase()
        );
        if (item) {
            setShow(true);
            setError((old) => ({ ...old, jobTitle: "This Placement Already Exists" }));
            return;
        }

        const formData = new FormData();
        formData.append("companyName", data.companyName);
        formData.append("jobTitle", data.jobTitle);
        formData.append("category", data.category);
        formData.append("type", data.type);
        formData.append("experience", data.experience);
        formData.append("shortDescription", data.shortDescription);
        formData.append("description", data.description);
        formData.append("salary", data.salary);
        formData.append("companyInfo", data.companyInfo);
        formData.append("applyLink", data.applyLink);
        formData.append("deadline", data.deadline);
        formData.append("vacancies", Number(data.vacancies) || 1);
        formData.append("featured", data.featured);
        formData.append("status", data.status);
        if (logo) formData.append("companyLogo", logo); // only send if replaced

        formData.append("location[address]", location.address);
        formData.append("location[city]", location.city);
        formData.append("location[state]", location.state);
        formData.append("location[pin]", location.pin);
        formData.append("location[lat]", location.lat === "" ? "" : Number(location.lat));
        formData.append("location[lng]", location.lng === "" ? "" : Number(location.lng));

        formData.append("responsibilities", data.responsibilities);
        formData.append("eligibility", data.eligibility);
        formData.append("benefits", data.benefits);
        skills.forEach((s) => formData.append("skills[]", s));

        dispatch(updatePlacement({ _id, formData }));
        navigate("/placement");
    }

    useEffect(() => {
        dispatch(getPlacement());
        if (PlacementStateData.length) {
            let item = PlacementStateData.find((x) => x._id === _id);
            if (item) {
                setData({
                    companyName: item.companyName ?? "",
                    jobTitle: item.jobTitle ?? "",
                    category: item.category ?? "",
                    type: item.type ?? "Full-Time",
                    experience: item.experience ?? "",
                    shortDescription: item.shortDescription ?? "",
                    description: item.description ?? "",
                    responsibilities: toRichText(item.responsibilities),
                    eligibility: toRichText(item.eligibility),
                    benefits: toRichText(item.benefits),
                    salary: item.salary ?? "",
                    companyInfo: item.companyInfo ?? "",
                    applyLink: item.applyLink ?? "",
                    deadline: toDateInputValue(item.deadline),
                    vacancies: item.vacancies ?? 1,
                    featured: !!item.featured,
                    status: !!item.status,
                });
                setLocation({
                    address: item.location?.address ?? "",
                    city: item.location?.city ?? "",
                    state: item.location?.state ?? "",
                    pin: item.location?.pin ?? "",
                    lat: item.location?.lat ?? "",
                    lng: item.location?.lng ?? "",
                });
                setSkills(item.skills ?? []);
                setLogoPreview(item.companyLogo ?? "");
            }
        }
    }, [PlacementStateData.length]);

    return (
        <main className="dashboard-content">
            <style>{`
                .rte { --rte-border:#dee2e6; --rte-toolbar-bg:#f8f9fa; --rte-bg:#fff; --rte-text:#212529; --rte-placeholder:#6c757d; --rte-icon:#444; }
                .rte .ql-toolbar.ql-snow { border:1px solid var(--rte-border); border-bottom:none; border-radius:8px 8px 0 0; background:var(--rte-toolbar-bg); }
                .rte .ql-container.ql-snow { border:1px solid var(--rte-border); border-radius:0 0 8px 8px; background:var(--rte-bg); }
                .rte .ql-editor { min-height:110px; font-size:14px; line-height:1.5; color:var(--rte-text); }
                .rte .ql-editor.ql-blank::before { color:var(--rte-placeholder); font-style:normal; }
                .rte .ql-snow .ql-stroke { stroke:var(--rte-icon); }
                .rte .ql-snow .ql-fill { fill:var(--rte-icon); }
                .rte .ql-snow .ql-picker { color:var(--rte-text); }
                .rte .ql-snow .ql-picker-options { background:var(--rte-bg); border-color:var(--rte-border); }
                .rte .ql-snow.ql-toolbar button:hover, .rte .ql-snow .ql-toolbar button:hover { background:var(--rte-toolbar-bg); }
                .rte .ql-snow .ql-tooltip { background:var(--rte-bg); color:var(--rte-text); border-color:var(--rte-border); box-shadow:none; }
                .rte .ql-snow .ql-tooltip input[type="text"] { background:var(--rte-bg); color:var(--rte-text); border-color:var(--rte-border); }
                .rte.rte-invalid .ql-toolbar.ql-snow, .rte.rte-invalid .ql-container.ql-snow { border-color:#dc3545; }
                [data-bs-theme="dark"] .rte, .dark .rte, .dark-mode .rte {
                    --rte-border:#495057; --rte-toolbar-bg:#2b3035; --rte-bg:#212529; --rte-text:#e9ecef; --rte-placeholder:#adb5bd; --rte-icon:#ced4da;
                }
            `}</style>
            <div className="container-fluid px-3 px-lg-4 py-4">

                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon">
                            <i className="bi bi-pencil-square" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Update Placement</h1>
                            <p className="text-muted mb-0">
                                Edit this placement job listing.
                            </p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/placement">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Placements
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

                        {/* Company & Job Info */}
                        <div className="panel mb-3">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-building" aria-hidden="true"></i>
                                        <span>Company & Job Information</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Who's hiring and for what role.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label" htmlFor="companyLogo">
                                        Company Logo <small className="text-muted">(leave empty to keep the current logo)</small>
                                    </label>
                                    <div className="d-flex align-items-center gap-3">
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Preview"
                                                style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", border: "1px solid #dee2e6" }}
                                            />
                                        )}
                                        <input
                                            className="form-control"
                                            id="companyLogo"
                                            type="file"
                                            accept="image/*"
                                            onChange={getLogoInput}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="companyName">Company Name</label>
                                    <input
                                        className={`form-control ${show && error.companyName ? "is-invalid" : ""}`}
                                        id="companyName"
                                        type="text"
                                        name="companyName"
                                        value={data.companyName}
                                        onChange={getInputData}
                                        placeholder="e.g. Apex Digital"
                                    />
                                    {show && error.companyName && <div className="text-danger small mt-1">{error.companyName}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="jobTitle">Job Title</label>
                                    <input
                                        className={`form-control ${show && error.jobTitle ? "is-invalid" : ""}`}
                                        id="jobTitle"
                                        type="text"
                                        name="jobTitle"
                                        value={data.jobTitle}
                                        onChange={getInputData}
                                        placeholder="e.g. Frontend Developer"
                                    />
                                    {show && error.jobTitle && <div className="text-danger small mt-1">{error.jobTitle}</div>}
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="category">
                                        Category <small className="text-muted">(e.g. Software, Design)</small>
                                    </label>
                                    <input
                                        className={`form-control ${show && error.category ? "is-invalid" : ""}`}
                                        id="category"
                                        type="text"
                                        name="category"
                                        value={data.category}
                                        onChange={getInputData}
                                        placeholder="e.g. Software Development"
                                    />
                                    {show && error.category && <div className="text-danger small mt-1">{error.category}</div>}
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="type">Job Type</label>
                                    <select
                                        className="form-select"
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={getInputData}
                                    >
                                        {JOB_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="experience">
                                        Experience <small className="text-muted">(e.g. 0-1 years)</small>
                                    </label>
                                    <input
                                        className={`form-control ${show && error.experience ? "is-invalid" : ""}`}
                                        id="experience"
                                        type="text"
                                        name="experience"
                                        value={data.experience}
                                        onChange={getInputData}
                                        placeholder="e.g. 0-1 years"
                                    />
                                    {show && error.experience && <div className="text-danger small mt-1">{error.experience}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="salary">
                                        Salary <small className="text-muted">(optional)</small>
                                    </label>
                                    <input
                                        className="form-control"
                                        id="salary"
                                        type="text"
                                        name="salary"
                                        value={data.salary}
                                        onChange={getInputData}
                                        placeholder="e.g. ₹4L - ₹6L per annum"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="applyLink">
                                        Apply Link <small className="text-muted">(optional)</small>
                                    </label>
                                    <input
                                        className="form-control"
                                        id="applyLink"
                                        type="url"
                                        name="applyLink"
                                        value={data.applyLink}
                                        onChange={getInputData}
                                        placeholder="https://company.com/careers/apply"
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label" htmlFor="shortDescription">Short Description</label>
                                    <input
                                        className={`form-control ${show && error.shortDescription ? "is-invalid" : ""}`}
                                        id="shortDescription"
                                        type="text"
                                        name="shortDescription"
                                        value={data.shortDescription}
                                        onChange={getInputData}
                                        placeholder="One-line summary shown on the listing card"
                                    />
                                    {show && error.shortDescription && <div className="text-danger small mt-1">{error.shortDescription}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Full Description</label>
                                    <div className={`rte ${show && error.description ? "rte-invalid" : ""}`}>
                                        <ReactQuill
                                            theme="snow"
                                            value={data.description}
                                            onChange={updateDescription}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="Full job description" />
                                    </div>
                                    {show && error.description && <div className="text-danger small mt-1">{error.description}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Company Info <small className="text-muted">(optional)</small>
                                    </label>
                                    <div className="rte">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.companyInfo}
                                            onChange={updateCompanyInfo}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="A short blurb about the company" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="panel mb-3">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-geo-alt" aria-hidden="true"></i>
                                        <span>Location</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        City and state are required; the rest is optional.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label" htmlFor="address">Address</label>
                                    <input
                                        className="form-control"
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={location.address}
                                        onChange={getLocationInput}
                                        placeholder="Street address (optional)"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="city">City</label>
                                    <input
                                        className={`form-control ${show && error.city ? "is-invalid" : ""}`}
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={location.city}
                                        onChange={getLocationInput}
                                        placeholder="e.g. Dehradun"
                                    />
                                    {show && error.city && <div className="text-danger small mt-1">{error.city}</div>}
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="state">State</label>
                                    <input
                                        className={`form-control ${show && error.state ? "is-invalid" : ""}`}
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={location.state}
                                        onChange={getLocationInput}
                                        placeholder="e.g. Uttarakhand"
                                    />
                                    {show && error.state && <div className="text-danger small mt-1">{error.state}</div>}
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="pin">PIN Code</label>
                                    <input
                                        className="form-control"
                                        id="pin"
                                        type="text"
                                        name="pin"
                                        value={location.pin}
                                        onChange={getLocationInput}
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="lat">
                                        Latitude <small className="text-muted">(optional)</small>
                                    </label>
                                    <input
                                        className="form-control"
                                        id="lat"
                                        type="number"
                                        step="any"
                                        name="lat"
                                        value={location.lat}
                                        onChange={getLocationInput}
                                        placeholder="e.g. 30.3165"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="lng">
                                        Longitude <small className="text-muted">(optional)</small>
                                    </label>
                                    <input
                                        className="form-control"
                                        id="lng"
                                        type="number"
                                        step="any"
                                        name="lng"
                                        value={location.lng}
                                        onChange={getLocationInput}
                                        placeholder="e.g. 78.0322"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lists */}
                        <div className="panel mb-3">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-list-ul" aria-hidden="true"></i>
                                        <span>Responsibilities, Skills, Eligibility & Benefits</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Responsibilities, eligibility, and benefits support rich text formatting. Skills: tag input.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Responsibilities</label>
                                    <div className="rte">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.responsibilities}
                                            onChange={updateResponsibilities}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="e.g. Build and maintain client-facing features" />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Eligibility</label>
                                    <div className="rte">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.eligibility}
                                            onChange={updateEligibility}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="e.g. B.Tech/B.E. in CS, IT, or related field" />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label" htmlFor="skills">
                                        Skills <small className="text-muted">(press Enter or comma to add, click the × to remove)</small>
                                    </label>
                                    <input
                                        className="form-control"
                                        id="skills"
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        placeholder="e.g. React, then press Enter"
                                    />
                                    {skills.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {skills.map((skill) => (
                                                <span key={skill} className="badge text-bg-light border d-inline-flex align-items-center gap-1">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-sm"
                                                        style={{ fontSize: "0.55rem" }}
                                                        aria-label={`Remove ${skill}`}
                                                        onClick={() => removeSkill(skill)}
                                                    />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Benefits</label>
                                    <div className="rte">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.benefits}
                                            onChange={updateBenefits}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="e.g. Health insurance" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posting Settings */}
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-gear" aria-hidden="true"></i>
                                        <span>Posting Settings</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Deadline, openings, and visibility.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="deadline">Application Deadline</label>
                                    <input
                                        className={`form-control ${show && error.deadline ? "is-invalid" : ""}`}
                                        id="deadline"
                                        type="date"
                                        name="deadline"
                                        value={data.deadline}
                                        onChange={getInputData}
                                    />
                                    {show && error.deadline && <div className="text-danger small mt-1">{error.deadline}</div>}
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="vacancies">Vacancies</label>
                                    <input
                                        className="form-control"
                                        id="vacancies"
                                        type="number"
                                        min="1"
                                        name="vacancies"
                                        value={data.vacancies}
                                        onChange={getInputData}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="featured">Featured</label>
                                    <select
                                        className="form-select"
                                        id="featured"
                                        name="featured"
                                        value={data.featured ? "1" : "0"}
                                        onChange={getInputData}
                                    >
                                        <option value="0">Standard</option>
                                        <option value="1">Featured</option>
                                    </select>
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
                            </div>

                            <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                                <Link className="btn btn-outline-secondary" to="/placement">Cancel</Link>
                                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                                    <i className="bi bi-check-circle" aria-hidden="true"></i> Update Placement
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