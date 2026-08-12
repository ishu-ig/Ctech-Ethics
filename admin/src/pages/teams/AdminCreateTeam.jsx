import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import { createTeams, getTeams } from "../../Redux/ActionCreators/TeamsActionCreators";

const checklist = [
    { dot: "bg-success", title: "Add a photo", body: "Upload an image file for the member's headshot." },
    { dot: "bg-primary", title: "Fill role & bio", body: "Role shows under the name; bio appears on hover/detail." },
    { dot: "bg-warning", title: "List key skills", body: "Add individual skills using the Add Skill button." },
];

const emptyData = {
    image: "",
    name: "",
    role: "",
    badge: "",
    bio: "",
    skills: [""], // Changed to an array of separate skill strings
    social: { twitter: "", facebook: "", instagram: "", linkedin: "" },
    status: true,
};

export default function AdminCreateTeam() {
    let [data, setData] = useState(emptyData);
    let [error, setError] = useState({
        image: "Image Field is Mandatory",
        name: "Name Field is Mandatory",
        role: "Role Field is Mandatory",
        badge: "Badge Field is Mandatory",
        bio: "Bio Field is Mandatory",
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
            setError((old) => ({ ...old, image: "" })); // Clear error on select
            return;
        }

        // Nested social.* fields
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

        let errorItem = Object.values(relevantErrors)?.find((x) => x !== "");
        if (errorItem) {
            setShow(true);
            return;
        }

        let item = TeamsStateData?.find(
            (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase()
        );
        if (item) {
            setShow(true);
            setError((old) => ({ ...old, name: "Team Member Already Exist" }));
            return;
        }

        // Use FormData to support file uploads
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("name", data.name);
        formData.append("role", data.role);
        formData.append("badge", data.badge);
        formData.append("bio", data.bio);
        formData.append("status", data.status);

        // Arrays & Objects stringified for FormData
        const skillsArray = data.skills.map((s) => s.trim()).filter(Boolean); // Filter out empty skill inputs
        formData.append("skills", JSON.stringify(skillsArray));
        formData.append("social", JSON.stringify(data.social));

        dispatch(createTeams(formData));
        navigate("/team");
    }

    useEffect(() => {
        dispatch(getTeams());
    }, [TeamsStateData?.length]);

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
                            <h1 className="h3 mb-1">Add Team Member</h1>
                            <p className="text-muted mb-0">
                                Create a new team member with photo, role, and social links.
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
                        {Object.values(error)?.find((x) => x !== "")}
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
                                        <i className="bi bi-person-badge" aria-hidden="true"></i>
                                        <span>Team Member Information</span>
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Fill in the details to add a new team member.
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

                                <div className="col-6">
                                    <label className="form-label" htmlFor="image">
                                        Profile Photo <small className="text-muted">(Upload image)</small>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text p-0 d-flex justify-content-center align-items-center bg-light" style={{ width: 42, height: 38, overflow: "hidden" }}>
                                            {data.image ? (
                                                <img
                                                    src={URL.createObjectURL(data.image)}
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
                                    <i className="bi bi-check-circle" aria-hidden="true"></i> Create Team Member
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