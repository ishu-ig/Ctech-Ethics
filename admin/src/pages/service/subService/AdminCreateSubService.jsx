import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../../FormValidators/formValidator";
import { getService } from "../../../Redux/ActionCreators/ServiceActionCreators";
import { createSubService, getSubService } from "../../../Redux/ActionCreators/SubServiceActionCreators";

export default function AdminCreateSubService() {
    const [data, setData] = useState({
        serviceId: "",
        name: "",
        icon: "bi-check2",
        description: "",
        status: true,
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const [error, setError] = useState({
        serviceId: "Please select a parent service",
        name: "Name Field is Mandatory",
        description: "Description is Mandatory",
    });
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rawServiceData = useSelector((state) => state.ServiceStateData);
    const ServiceStateData = Array.isArray(rawServiceData) ? rawServiceData : (rawServiceData?.data || []);

    const rawSubData = useSelector((state) => state.SubServiceStateData);
    const SubServiceStateData = Array.isArray(rawSubData) ? rawSubData : (rawSubData?.data || []);

    useEffect(() => {
        dispatch(getService());
        dispatch(getSubService());
    }, [dispatch]);

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
            (x) => (x.serviceId?._id || x.serviceId) === data.serviceId && x.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        );
        if (isDuplicate) {
            setShow(true);
            setError((old) => ({ ...old, name: "This service already has a sub-service with that name." }));
            return;
        }

        dispatch(
            createSubService({
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

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">

                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-plus-circle"></i></span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Add Sub-Service</h1>
                            <p className="text-muted mb-0">Create a new sub-service under an existing service.</p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/subservice"><i className="bi bi-arrow-left"></i> Back</Link>
                    </div>
                </div>

                {show && (
                    <div className="alert alert-danger alert-dismissible">
                        {Object.values(error).find((x) => x !== "") || "Please fix the errors in the form."}
                        <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                    </div>
                )}

                <section className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="panel mb-3">
                            <div className="panel-header">
                                <h2 className="h5 mb-0 section-title"><i className="bi bi-diagram-3"></i> Sub-Service Details</h2>
                            </div>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Parent Service</label>
                                    <select className={`form-select ${show && error.serviceId ? "is-invalid" : ""}`} name="serviceId" value={data.serviceId} onChange={getInputData}>
                                        <option value="">Select a service…</option>
                                        {ServiceStateData.map((s) => (
                                            <option key={s._id} value={s._id}>{s.title}</option>
                                        ))}
                                    </select>
                                    {show && error.serviceId && <div className="text-danger small mt-1">{error.serviceId}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Name</label>
                                    <input className={`form-control ${show && error.name ? "is-invalid" : ""}`} type="text" name="name" value={data.name} onChange={getInputData} placeholder="e.g. Website Development" />
                                    {show && error.name && <div className="text-danger small mt-1">{error.name}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Icon <small className="text-muted">(Bootstrap Icons class)</small></label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className={`bi ${data.icon}`}></i></span>
                                        <input className="form-control" type="text" name="icon" value={data.icon} onChange={getInputData} placeholder="bi-window" />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Description</label>
                                    <textarea className={`form-control ${show && error.description ? "is-invalid" : ""}`} name="description" value={data.description} onChange={getInputData} rows="3" placeholder="Short one-line description..." />
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
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-12 col-xl-4">
                        <div className="panel mb-3">
                            <h2 className="h5 mb-3 section-title"><i className="bi bi-gear"></i> Settings</h2>

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select className="form-select form-select-sm" name="status" value={data.status ? "1" : "0"} onChange={getInputData}>
                                    <option value="1">Active</option>
                                    <option value="0">Draft</option>
                                </select>
                            </div>

                            <button className="btn btn-primary w-100" onClick={postSubmit}><i className="bi bi-check2-circle me-1"></i> Save Sub-Service</button>
                        </div>

                        <div className="panel h-100">
                            <h2 className="h5 mb-3 section-title"><i className="bi bi-info-circle"></i> Tips</h2>
                            <p className="text-muted small mb-0">
                                Sub-services are listed under their parent service on the site. Pick the service first —
                                you can't save a sub-service without one.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}