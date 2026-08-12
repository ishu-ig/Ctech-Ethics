import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { updateTeams, getTeams } from "../../Redux/ActionCreators/TeamsActionCreators";

const checklist = [
    { dot: "bg-success", title: "Review details", body: "Confirm name, role, and photo are up to date." },
    { dot: "bg-primary", title: "Check skills", body: "Add or remove individual skills using the buttons." },
    { dot: "bg-warning", title: "Save changes", body: "Changes take effect immediately." },
];

const emptyData = {
    image: "",
    name: "",
    role: "",
    badge: "",
    bio: "",
    skills: [""], // Dynamic skills array
    social: { twitter: "", facebook: "", instagram: "", linkedin: "" },
    status: true,
};

export default function AdminUpdateTeam() {
    let { _id } = useParams();

    let [data, setData] = useState(emptyData);
    let [error, setError] = useState({
        image: "",
        name: "",
        role: "",
        badge: "",
        bio: "",
    });
    let [show, setShow] = useState(false);
    let navigate = useNavigate();

    let TeamsStateData = useSelector((state) => state.TeamsStateData);
    let dispatch = useDispatch();

    function getInputData(e) {
        let name = e.target.name;
        let value = e.target.value;

        // Handle File Upload
        if (name === "image") {
            setData((old) => ({ ...old, image: e.target.files[0] }));
            return;
        }

        if (name.startsWith("social.")) {
            const key = name.split(".")[1];
            setData((old) => ({ ...old, social: { ...old.social, [key]: value } }));
            return;
        }

        if (name === "status") {
            setData((old) => ({ ...old, status: value === "1" }));
            return;
        }

        if (["name", "role", "badge", "bio"].includes(name)) {
            setError((old) => ({
                ...old,
                [name]: formValidator(e),
            }));
        }

        setData((old) => ({ ...old, [name]: value }));
    }

    // --- Dynamic Skills Handlers ---
    const handleSkillChange = (index, value) => {
        const newSkills = [...data.skills];
        newSkills[index] = value;
        setData({ ...data, skills: newSkills });
    };

    const addSkillField = () => {
        setData({ ...data, skills: [...data.skills, ""] });
    };

    const removeSkillField = (index) => {
        const newSkills = data.skills.filter((_, i) => i !== index);
        setData({ ...data, skills: newSkills });
    };
    // -------------------------------

    function postSubmit(e) {
        e.preventDefault();

        const relevantErrors = {
            image: error.image,
            name: error.name,
            role: error.role,
            badge: error.badge,
            bio: error.bio,
        };

        let errorItem = Object.values(relevantErrors).find((x) => x !== "");
        if (errorItem) {
            setShow(true);
        } else {
            let item = TeamsStateData.find(
                (x) =>
                    x._id !== _id &&
                    x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
            );
            if (item) {
                setShow(true);
                setError((old) => ({ ...old, name: "Team Member Already Exist" }));
            } else {

                // Use FormData to support file uploads
                const formData = new FormData();
                formData.append("_id", _id);
                formData.append("name", data.name);
                formData.append("role", data.role);
                formData.append("badge", data.badge);
                formData.append("bio", data.bio);
                formData.append("status", data.status);

                // If a new file was uploaded, append it (otherwise backend should keep existing)
                if (data.image && typeof data.image !== "string") {
                    formData.append("image", data.image);
                }

                // Filter out empty inputs and stringify the array
                const skillsArray = data.skills.map((s) => s.trim()).filter(Boolean);
                formData.append("skills", JSON.stringify(skillsArray));
                formData.append("social", JSON.stringify(data.social));

                dispatch(updateTeams(formData));
                navigate("/team");
            }
        }
    }

    useEffect(() => {
        dispatch(getTeams());
        if (TeamsStateData.length) {
            let item = TeamsStateData.find((x) => x._id === _id);
            if (item)
                setData({
                    image: item.image ?? "", // Initial load: URL string from DB
                    name: item.name ?? "",
                    role: item.role ?? "",
                    badge: item.badge ?? "",
                    bio: item.bio ?? "",
                    // If skills exist in DB, map them. Otherwise default to array with one empty string.
                    skills: item.skills && item.skills.length > 0 ? item.skills : [""],
                    social: {
                        twitter: item.social?.twitter ?? "",
                        facebook: item.social?.facebook ?? "",
                        instagram: item.social?.instagram ?? "",
                        linkedin: item.social?.linkedin ?? "",
                    },
                    status: item.status ?? true,
                });
        }
    }, [TeamsStateData.length, _id, dispatch]);

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">

                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon">
                            <i className="bi bi-pencil-square" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p className="eyebrow mb-1">Management</p>
                            <h1 className="h3 mb-1">Update Team Member</h1>
                            <p className="text-muted mb-0">
                                Edit the member's photo, role, bio, skills, and status.
                            </p>
                        </div>
                    </div>
                    <div className="heading-actions">
                        <Link className="btn btn-outline-secondary btn-sm" to="/team">
                            <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Team
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
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2 className="h5 mb-1 section-title">
                                        <i className="bi bi-pencil-square" aria-hidden="true"></i>
                                        <span>Team Member Information</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Update the details for this team member.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        className={`form-control ${show && error.name ? "is-invalid" : ""}`}
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={getInputData}
                                        placeholder="e.g. Jane Doe"
                                    />
                                    {show && error.name && (
                                        <div className="text-danger small mt-1">{error.name}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="role">Role</label>
                                    <input
                                        className={`form-control ${show && error.role ? "is-invalid" : ""}`}
                                        id="role"
                                        type="text"
                                        name="role"
                                        value={data.role}
                                        onChange={getInputData}
                                        placeholder="e.g. Lead Frontend Engineer"
                                    />
                                    {show && error.role && (
                                        <div className="text-danger small mt-1">{error.role}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="badge">
                                        Badge <small className="text-muted">(short tag shown on card)</small>
                                    </label>
                                    <input
                                        className={`form-control ${show && error.badge ? "is-invalid" : ""}`}
                                        id="badge"
                                        type="text"
                                        name="badge"
                                        value={data.badge}
                                        onChange={getInputData}
                                        placeholder="e.g. Core Team"
                                    />
                                    {show && error.badge && (
                                        <div className="text-danger small mt-1">{error.badge}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label" htmlFor="bio">Bio</label>
                                    <textarea
                                        className={`form-control ${show && error.bio ? "is-invalid" : ""}`}
                                        id="bio"
                                        name="bio"
                                        rows="3"
                                        value={data.bio}
                                        onChange={getInputData}
                                        placeholder="A short bio about this team member"
                                    />
                                    {show && error.bio && (
                                        <div className="text-danger small mt-1">{error.bio}</div>
                                    )}
                                </div>

                                {/* Dynamic Skills Section */}
                                <div className="col-12">
                                    <label className="form-label">Skills</label>
                                    {data.skills.map((skill, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Skill ${index + 1} (e.g. React)`}
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                            />
                                            {data.skills.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => removeSkillField(index)}
                                                    title="Remove Skill"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary mt-1"
                                        onClick={addSkillField}
                                    >
                                        <i className="bi bi-plus-circle"></i> Add Another Skill
                                    </button>
                                </div>

                                <div className="col-12">
                                    <label className="form-label mb-2 d-block">Social Links</label>
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text"><i className="bi bi-twitter-x"></i></span>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="social.twitter"
                                                    value={data.social.twitter}
                                                    onChange={getInputData}
                                                    placeholder="Twitter / X URL"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text"><i className="bi bi-facebook"></i></span>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="social.facebook"
                                                    value={data.social.facebook}
                                                    onChange={getInputData}
                                                    placeholder="Facebook URL"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text"><i className="bi bi-instagram"></i></span>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="social.instagram"
                                                    value={data.social.instagram}
                                                    onChange={getInputData}
                                                    placeholder="Instagram URL"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-group input-group-sm">
                                                <span className="input-group-text"><i className="bi bi-linkedin"></i></span>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="social.linkedin"
                                                    value={data.social.linkedin}
                                                    onChange={getInputData}
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor="image">
                                        Profile Photo <small className="text-muted">(Upload new image)</small>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text p-0 d-flex justify-content-center align-items-center bg-light" style={{ width: 42, height: 38, overflow: "hidden" }}>
                                            {data.image ? (
                                                <img
                                                    src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image)}
                                                    alt="Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <i className="bi bi-image text-muted"></i>
                                            )}
                                        </span>
                                        <input
                                            className={`form-control ${show && error.image ? "is-invalid" : ""}`}
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            name="image"
                                            onChange={getInputData}
                                        />
                                    </div>
                                    {show && error.image && (
                                        <div className="text-danger small mt-1">{error.image}</div>
                                    )}
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
                                <Link className="btn btn-outline-secondary" to="/team">Cancel</Link>
                                <button className="btn btn-primary" type="button" onClick={postSubmit}>
                                    <i className="bi bi-check-circle" aria-hidden="true"></i> Update Team Member
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