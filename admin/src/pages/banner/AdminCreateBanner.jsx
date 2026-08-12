import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createBanner, getBanner } from "../../Redux/ActionCreators/BannerActionCreators";

const checklist = [
    { dot: "bg-success", title: "Add an image", body: "Upload a file or paste a URL for the hero image." },
    { dot: "bg-primary", title: "Set the copy", body: "Fill in the badge, headline, tagline, and body text." },
    { dot: "bg-warning", title: "Pick an accent", body: "Choose a brand color to apply the dynamic glow effects." },
];

const emptyData = {
    badge: "",
    headline: "",
    tagline: "",
    body: "",
    accent: "#47b2e4",
    image: "",
    status: true,
};

export default function AdminCreateBanner() {
    let [data, setData] = useState(emptyData);
    let [imageMode, setImageMode] = useState("upload");

    let [error, setError] = useState({
        badge: "Badge Field is Mandatory",
        headline: "Headline Field is Mandatory",
        tagline: "Tagline Field is Mandatory",
        body: "Body Field is Mandatory",
        image: "Image Field is Mandatory",
    });
    let [show, setShow] = useState(false);
    let navigate = useNavigate();

    let BannerStateData = useSelector((state) => state.BannerStateData);
    let dispatch = useDispatch();

    function getInputData(e) {
        let name = e.target.name;
        let value = e.target.value;

        // Handle Image input
        if (name === "image") {
            if (e.target.type === "file") {
                setData((old) => ({ ...old, image: e.target.files[0] }));
            } else {
                setData((old) => ({ ...old, image: value }));
            }
            setError((old) => ({ ...old, image: "" }));
            return;
        }

        if (name === "status") {
            setData((old) => ({ ...old, status: value === "1" }));
            return;
        }

        if (["badge", "headline", "tagline", "body", "accent"].includes(name)) {
            // Accent color doesn't strictly need typical text validation if it's a color picker, but keeping it safe
            if (name !== "accent") {
                setError((old) => ({
                    ...old,
                    [name]: formValidator(e),
                }));
            }
        }

        setData((old) => ({ ...old, [name]: value }));
    }

    function handleModeChange(mode) {
        setImageMode(mode);
        setData((old) => ({ ...old, image: "" }));
        setError((old) => ({ ...old, image: "Image Field is Mandatory" }));
    }

    function postSubmit(e) {
        e.preventDefault();

        const relevantErrors = {
            badge: error.badge,
            headline: error.headline,
            tagline: error.tagline,
            body: error.body,
            image: error.image,
        };

        let errorItem = Object.values(relevantErrors)?.find((x) => x !== "");
        if (errorItem) {
            setShow(true);
            return;
        }

        let item = BannerStateData?.find(
            (x) => x.headline.toLocaleLowerCase() === data.headline.toLocaleLowerCase()
        );
        if (item) {
            setShow(true);
            setError((old) => ({ ...old, headline: "Banner with this Headline Already Exists" }));
            return;
        }

        const formData = new FormData();
        formData.append("badge", data.badge);
        formData.append("headline", data.headline);
        formData.append("tagline", data.tagline);
        formData.append("body", data.body);
        formData.append("accent", data.accent);
        formData.append("image", data.image);
        formData.append("status", data.status);

        dispatch(createBanner(formData));
        navigate("/banner");
    }

    useEffect(() => {
        dispatch(getBanner());
    }, [BannerStateData?.length, dispatch]);

    let imagePreview = null;
    if (data.image) {
        if (typeof data.image === "string") imagePreview = data.image;
        else if (data.image instanceof File) imagePreview = URL.createObjectURL(data.image);
    }

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
                            <h1 className="h3 mb-1">Add Banner</h1>
                            <p className="text-muted mb-0">
                                Create a new banner with dynamic text and accent colors.
                            </p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/banner">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Banners
                        </Link>
                    </div>
                </div>

                {show && (
                    <div className="alert alert-danger alert-dismissible" role="alert">
                        {Object.values(error)?.find((x) => x !== "")}
                        <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
                    </div>
                )}

                <section className="row g-3">

                    <div className="col-12 col-xl-8">
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-images" aria-hidden="true"></i>
                                        <span>Banner Information</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Fill in the details to create a new banner.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">

                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <label className="form-label mb-0" htmlFor="image">Banner Image</label>
                                        <div className="btn-group btn-group-sm" role="group">
                                            <input type="radio" className="btn-check" name="imageMode" id="modeUpload" checked={imageMode === "upload"} onChange={() => handleModeChange("upload")} />
                                            <label className="btn btn-outline-primary" htmlFor="modeUpload"><i className="bi bi-upload"></i> Upload</label>

                                            <input type="radio" className="btn-check" name="imageMode" id="modeUrl" checked={imageMode === "url"} onChange={() => handleModeChange("url")} />
                                            <label className="btn btn-outline-primary" htmlFor="modeUrl"><i className="bi bi-link-45deg"></i> URL</label>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <span className="input-group-text p-0 d-flex justify-content-center align-items-center bg-light" style={{ width: 64, height: 38, overflow: "hidden" }}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <i className="bi bi-image text-muted"></i>
                                            )}
                                        </span>
                                        {imageMode === "upload" ? (
                                            <input className={`form-control ${show && error.image ? "is-invalid" : ""}`} id="image" type="file" accept="image/*" name="image" onChange={getInputData} />
                                        ) : (
                                            <input className={`form-control ${show && error.image ? "is-invalid" : ""}`} id="image" type="url" name="image" value={typeof data.image === "string" ? data.image : ""} onChange={getInputData} placeholder="https://example.com/banner.png" />
                                        )}
                                    </div>
                                    {show && error.image && <div className="text-danger small mt-1">{error.image}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="badge">Badge</label>
                                    <input
                                        className={`form-control ${show && error.badge ? "is-invalid" : ""}`}
                                        id="badge" type="text" name="badge" value={data.badge} onChange={getInputData}
                                        placeholder="e.g. 🚀 Trusted by 200+ Clients"
                                    />
                                    {show && error.badge && <div className="text-danger small mt-1">{error.badge}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="headline">Headline</label>
                                    <input
                                        className={`form-control ${show && error.headline ? "is-invalid" : ""}`}
                                        id="headline" type="text" name="headline" value={data.headline} onChange={getInputData}
                                        placeholder="e.g. Tech Startups"
                                    />
                                    {show && error.headline && <div className="text-danger small mt-1">{error.headline}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label" htmlFor="tagline">Tagline</label>
                                    <input
                                        className={`form-control ${show && error.tagline ? "is-invalid" : ""}`}
                                        id="tagline" type="text" name="tagline" value={data.tagline} onChange={getInputData}
                                        placeholder="e.g. Built for the Future"
                                    />
                                    {show && error.tagline && <div className="text-danger small mt-1">{error.tagline}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label" htmlFor="body">Body Text</label>
                                    <textarea
                                        className={`form-control ${show && error.body ? "is-invalid" : ""}`}
                                        id="body" name="body" rows="3" value={data.body} onChange={getInputData}
                                        placeholder="Main description paragraph shown below the tagline."
                                    />
                                    {show && error.body && <div className="text-danger small mt-1">{error.body}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="accent">Accent Color</label>
                                    <div className="input-group">
                                        <span className="input-group-text p-1">
                                            <input
                                                type="color"
                                                className="form-control form-control-color border-0 p-0"
                                                id="accent"
                                                name="accent"
                                                value={data.accent}
                                                onChange={getInputData}
                                                style={{ width: "24px", height: "24px", cursor: "pointer" }}
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.accent}
                                            name="accent"
                                            onChange={getInputData}
                                            placeholder="#47b2e4"
                                        />
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
                                <Link className="btn btn-outline-secondary" to="/banner">Cancel</Link>
                                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                                    <i className="bi bi-check-circle" aria-hidden="true"></i> Create Banner
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