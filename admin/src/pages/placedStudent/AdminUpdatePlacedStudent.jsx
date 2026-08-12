import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePlacedStudent, getPlacedStudent } from "../../Redux/ActionCreators/PlacedStudentActionCreators";

export default function AdminUpdatePlacedStudent() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rawData = useSelector((state) => state.PlacedStudentStateData);
    const PlacedStudentStateData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    const [data, setData] = useState({
        name: "", role: "", company: "", companyIcon: "", type: "Technical", package: "", status: true
    });

    const [photo, setPhoto] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState("");
    const [photoPreview, setPhotoPreview] = useState("");
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { dispatch(getPlacedStudent()); }, [dispatch]);

    useEffect(() => {
        if (loaded || !PlacedStudentStateData.length) return;
        const item = PlacedStudentStateData.find((x) => x._id === _id);
        if (!item) return;
        setData({
            name: item.name || "", role: item.role || "", company: item.company || "",
            companyIcon: item.companyIcon || "bi-building", type: item.type || "Technical",
            package: item.package || "", status: item.status ?? true
        });
        setExistingPhoto(item.photo || "");
        setLoaded(true);
    }, [PlacedStudentStateData, _id, loaded]);

    function getInputData(e) {
        const { name, value, type, checked } = e.target;
        setData({ ...data, [name]: type === "checkbox" ? checked : (name === "status" ? value === "1" : value) });
        if (error[name]) setError((old) => ({ ...old, [name]: "" }));
    }

    function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    function postSubmit(e) {
        e.preventDefault();

        const nextErrors = {
            name: data.name.trim() ? "" : "Student name is required",
            role: data.role.trim() ? "" : "Job role is required",
            company: data.company.trim() ? "" : "Company name is required",
            package: data.package.trim() ? "" : "Package is required",
        };

        if (Object.values(nextErrors).some((x) => x !== "")) {
            setError(nextErrors);
            setShow(true);
            return;
        }

        const formData = new FormData();
        formData.append("_id", _id);
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (photo) formData.append("photo", photo); // Only append if a NEW photo is uploaded

        dispatch(updatePlacedStudent(formData));
        navigate("/placed-student");
    }

    if (!loaded) {
        return (
            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4 text-center text-muted py-5">
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                    Loading placement record…
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-content">
            <style>{`
        .field-hint { font-size: 0.76rem; color: #94a3b8; margin-top: 4px; }
        .photo-frame {
          width: 132px; height: 132px; border-radius: 50%; margin: 0 auto 12px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          background: #f8f9fa; border: 2px dashed #dee2e6; position: relative;
        }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
        .photo-frame .placeholder-icon { font-size: 2.2rem; color: #cbd5e1; }
        .type-toggle { display: flex; gap: 8px; }
        .type-toggle button {
          flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid #dee2e6;
          background: #fff; font-weight: 600; font-size: 0.85rem; color: #6c757d; cursor: pointer; transition: all .13s;
        }
        .type-toggle button.active.technical { border-color: #0dcaf0; background: #e7f9fc; color: #087990; }
        .type-toggle button.active.non-technical { border-color: #ffc107; background: #fff8e1; color: #856404; }
        .status-pill-row { display: flex; align-items: center; gap: 8px; }
      `}</style>
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-pencil-square"></i></span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Update Placement Record</h1>
                            <p className="text-muted mb-0">Edit this student's placement details.</p>
                        </div>
                    </div>
                    <Link className="btn btn-outline-secondary btn-sm" to="/placed-student"><i className="bi bi-arrow-left"></i> Back</Link>
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
                                <h2 className="h5 mb-0 section-title"><i className="bi bi-person-badge"></i> Student & Job Details</h2>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Student Name</label>
                                    <input className={`form-control ${show && error.name ? "is-invalid" : ""}`} name="name" value={data.name} onChange={getInputData} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Job Role</label>
                                    <input className={`form-control ${show && error.role ? "is-invalid" : ""}`} name="role" value={data.role} onChange={getInputData} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Company Name</label>
                                    <input className={`form-control ${show && error.company ? "is-invalid" : ""}`} name="company" value={data.company} onChange={getInputData} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Company Icon <small className="text-muted fw-normal">(Bootstrap Icons class)</small></label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className={`bi ${data.companyIcon}`}></i></span>
                                        <input className="form-control" name="companyIcon" value={data.companyIcon} onChange={getInputData} />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Placement Type</label>
                                    <div className="type-toggle">
                                        <button
                                            type="button"
                                            className={data.type === "Technical" ? "active technical" : ""}
                                            onClick={() => setData((old) => ({ ...old, type: "Technical" }))}
                                        >
                                            <i className="bi bi-code-slash me-1"></i> Technical
                                        </button>
                                        <button
                                            type="button"
                                            className={data.type === "Non-Technical" ? "active non-technical" : ""}
                                            onClick={() => setData((old) => ({ ...old, type: "Non-Technical" }))}
                                        >
                                            <i className="bi bi-briefcase me-1"></i> Non-Technical
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Package (CTC)</label>
                                    <input className={`form-control ${show && error.package ? "is-invalid" : ""}`} name="package" value={data.package} onChange={getInputData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="panel mb-3" style={{ position: "sticky", top: 16 }}>
                            <h2 className="h5 mb-3 section-title"><i className="bi bi-camera"></i> Media & Status</h2>

                            <div className="mb-3 text-center">
                                <div className="photo-frame">
                                    {(photoPreview || existingPhoto) ? <img src={photoPreview || existingPhoto} alt="Preview" /> : <i className="bi bi-person placeholder-icon"></i>}
                                </div>
                                <label className="form-label small text-muted d-block">Replace photo</label>
                                <input className="form-control form-control-sm" type="file" accept="image/*" onChange={handlePhotoChange} />
                                <div className="field-hint">Leave empty to keep the current photo.</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Status</label>
                                <div className="status-pill-row">
                                    <select className="form-select" name="status" value={data.status ? "1" : "0"} onChange={getInputData}>
                                        <option value="1">Active (Published)</option>
                                        <option value="0">Inactive (Draft)</option>
                                    </select>
                                    <span className={`badge ${data.status ? "text-bg-success" : "text-bg-secondary"}`}>
                                        {data.status ? "Live" : "Hidden"}
                                    </span>
                                </div>
                            </div>

                            <button className="btn btn-primary w-100" onClick={postSubmit}><i className="bi bi-check2-circle me-1"></i> Update Record</button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}