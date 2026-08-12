import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../../FormValidators/formValidator";
import { getService } from "../../../Redux/ActionCreators/ServiceActionCreators";
import { getSubService, updateSubService } from "../../../Redux/ActionCreators/SubServiceActionCreators";

const checklist = [
    { dot: "bg-success", title: "Confirm the Service", body: "Make sure this sub-service still sits under the right parent." },
    { dot: "bg-primary", title: "Review Details", body: "Check the name, icon, description, and tags." },
    { dot: "bg-warning", title: "Save Changes", body: "Changes take effect immediately on the site." },
];

export default function AdminUpdateSubService() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rawSubData = useSelector((state) => state.SubServiceStateData);
    const SubServiceStateData = Array.isArray(rawSubData) ? rawSubData : (rawSubData?.data || []);
    const loading = rawSubData?.loading;

    const rawServiceData = useSelector((state) => state.ServiceStateData);
    const ServiceStateData = Array.isArray(rawServiceData) ? rawServiceData : (rawServiceData?.data || []);

    const [data, setData] = useState({
        serviceId: "",
        name: "",
        icon: "",
        description: "",
        status: true,
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const [error, setError] = useState({ serviceId: "", name: "", description: "" });
    const [show, setShow] = useState(false);
    const [loaded, setLoaded] = useState(false);

    function getInputData(e) {
        const { name, value, type, checked } = e.target;

        if (name === "serviceId") {
            setData((old) => ({ ...old, serviceId: value }));
            setError((old) => ({ ...old, serviceId: value ? "" : "Please select a parent service" }));
        } else if (["name", "icon", "description"].includes(name)) {
            setData((old) => ({ ...old, [name]: value }));
            if (name === "name" || name === "description") {
                setError((old) => ({ ...old, [name]: formValidator(e) }));
            }
        } else if (name === "status") {
            setData((old) => ({ ...old, status: type === "checkbox" ? checked : value === "1" }));
        }
    }

    function addTag(e) {
        if (e.key !== "Enter" && e.key !== ",") return;
        e.preventDefault();
        const val = tagInput.trim().replace(/,$/, "");
        if (val && !tags.includes(val)) {
            setTags((prev) => [...prev, val]);
        }
        setTagInput("");
    }

    function removeTag(tag) {
        setTags((prev) => prev.filter((t) => t !== tag));
    }

    function postSubmit(e) {
        e.preventDefault();

        const relevantErrors = { serviceId: error.serviceId, name: error.name, description: error.description };
        if (Object.values(relevantErrors).some((x) => x !== "")) {
            setShow(true);
            return;
        }

        const isDuplicate = SubServiceStateData.some(
            (x) =>
                x._id !== _id &&
                (x.serviceId?._id || x.serviceId) === data.serviceId &&
                x.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        );
        if (isDuplicate) {
            setShow(true);
            setError((old) => ({ ...old, name: "This service already has a sub-service with that name." }));
            return;
        }

        dispatch(
            updateSubService({
                _id,
                serviceId: data.serviceId,
                name: data.name,
                icon: data.icon,
                description: data.description,
                tags,
                status: data.status,
            })
        );
        navigate("/subservice");
    }

    useEffect(() => {
        dispatch(getSubService());
        dispatch(getService());
    }, [dispatch]);

    // Populate the form once the sub-service list has loaded and contains this record.
    useEffect(() => {
        if (loaded || !SubServiceStateData.length) return;
        const item = SubServiceStateData.find((x) => x._id === _id);
        if (!item) return;

        setData({
            serviceId: item.serviceId?._id || item.serviceId || "",
            name: item.name || "",
            icon: item.icon || "",
            description: item.description || "",
            status: !!item.status,
        });
        setTags(item.tags || []);
        setLoaded(true);
    }, [SubServiceStateData, _id, loaded]);

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">

                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-pencil-square" aria-hidden="true"></i></span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Update Sub-Service</h1>
                            <p className="text-muted mb-0">Edit the sub-service details below.</p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/subservice">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Sub-Services
                        </Link>
                    </div>
                </div>

                {show && (
                    <div className="alert alert-danger alert-dismissible" role="alert">
                        {Object.values(error).find((x) => x !== "") || "Please fix the errors in the form."}
                        <button type="button" className="btn-close" onClick={() => setShow(false)} aria-label="Close" />
                    </div>
                )}

                {loading && !loaded ? (
                    <div className="text-center text-muted py-5">Loading sub-service…</div>
                ) : (
                    <section className="row g-3">
                        <div className="col-12 col-xl-8">
                            <div className="panel">
                                <div className="panel-header">
                                    <div>
                                        <h2 className="h5 mb-1 section-title">
                                            <i className="bi bi-pencil-square" aria-hidden="true"></i>
                                            <span>Sub-Service Information</span>
                                        </h2>
                                        <p className="text-muted mb-0">Update the details for this sub-service.</p>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="serviceId">Parent Service</label>
                                        <select id="serviceId" className={`form-select ${show && error.serviceId ? "is-invalid" : ""}`} name="serviceId" value={data.serviceId} onChange={getInputData}>
                                            <option value="">Select a service…</option>
                                            {ServiceStateData.map((s) => (
                                                <option key={s._id} value={s._id}>{s.title}</option>
                                            ))}
                                        </select>
                                        {show && error.serviceId && <div className="text-danger small mt-1">{error.serviceId}</div>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="name">Name</label>
                                        <input
                                            id="name" type="text" name="name"
                                            className={`form-control ${show && error.name ? "is-invalid" : ""}`} placeholder="Enter sub-service name"
                                            value={data.name} onChange={getInputData}
                                        />
                                        {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="icon">Icon Class <small className="text-muted fw-normal">(e.g. bi-window)</small></label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className={data.icon || "bi bi-star"}></i></span>
                                            <input
                                                id="icon" type="text" name="icon"
                                                className="form-control" placeholder="Enter Bootstrap Icon class"
                                                value={data.icon} onChange={getInputData}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea
                                            id="description" name="description" rows={3}
                                            className={`form-control ${show && error.description ? "is-invalid" : ""}`} placeholder="Short one-line description..."
                                            value={data.description} onChange={getInputData}
                                        />
                                        {show && error.description && <div className="text-danger small mt-1">{error.description}</div>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Tags <small className="text-muted">(Press Enter)</small></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={addTag}
                                            placeholder="React, Next.js..."
                                        />
                                        {tags.length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 mt-2">
                                                {tags.map((t) => (
                                                    <span key={t} className="badge text-bg-light border">
                                                        {t} <i className="bi bi-x ms-1" style={{ cursor: "pointer" }} onClick={() => removeTag(t)}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="status">Status</label>
                                        <select
                                            id="status" name="status"
                                            className="form-select"
                                            value={data.status ? "1" : "0"} onChange={getInputData}
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                                    <Link className="btn btn-outline-secondary" to="/subservice">Cancel</Link>
                                    <button className="btn btn-primary" type="button" onClick={postSubmit}>
                                        <i className="bi bi-check-circle" aria-hidden="true"></i> Update Sub-Service
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
                )}
            </div>
        </main>
    );
}