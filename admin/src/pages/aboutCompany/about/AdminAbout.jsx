import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAbout, deleteAbout } from "../../../Redux/ActionCreators/AboutActionCreators";

export default function AdminAbout() {
  const AboutStateData = useSelector((state) => state.AboutStateData);
  const dispatch = useDispatch();

  const about = AboutStateData?.[0] ?? null;
  const hasRecord = Boolean(about);

  function deleteRecord(_id) {
    if (window.confirm("Are you sure you want to delete this About page?")) {
      dispatch(deleteAbout({ _id }));
    }
  }

  useEffect(() => { dispatch(getAbout()); }, []);

  return (
    <>
      <style>{`
        .aa-eyebrow { font-size:11px; font-weight:500; color:var(--admin-muted); letter-spacing:.08em; text-transform:uppercase; margin:0 0 2px; }
        .aa-card { background:var(--admin-surface); border:1px solid var(--admin-border); border-radius:12px; overflow:hidden; margin-top:1rem; box-shadow:var(--admin-shadow-sm); }
        .aa-banner { height:6px; background:linear-gradient(90deg,#7F77DD,#1D9E75); }
        .aa-body { padding:1.5rem; }
        .aa-name    { font-size:18px; font-weight:500; margin:0 0 4px; color:var(--admin-text); }
        .aa-tagline { font-size:13px; color:var(--admin-muted); margin:0; }
        .aa-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; border:1px solid var(--admin-border); background:transparent; font-size:13px; cursor:pointer; color:var(--admin-text); transition:background .15s; }
        .aa-btn:hover { background:var(--admin-surface-soft); }
        .aa-btn-danger { color:var(--admin-danger); border-color:var(--admin-danger); }
        .aa-btn-danger:hover { background:rgba(220,53,69,0.08); }
        .aa-divider { border:none; border-top:1px solid var(--admin-border); margin:1.25rem 0; }
        .aa-section-title { font-size:13px; font-weight:600; color:var(--admin-text); text-transform:uppercase; letter-spacing:.04em; margin:0 0 .75rem; }
        .aa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; }
        .aa-detail { border-radius:8px; padding:10px 12px; display:flex; align-items:flex-start; gap:10px; background:var(--admin-surface-soft); border:1px solid var(--admin-border); }
        .aa-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; background:#E6F1FB; color:#185FA5; }
        .aa-dvalue { font-size:13px; font-weight:500; color:var(--admin-text); }
        .aa-desc-sm { font-size:12px; color:var(--admin-muted); margin-top:2px; }
        .aa-empty { border:1px solid var(--admin-border); border-radius:12px; padding:3rem 1.5rem; text-align:center; margin-top:1rem; background:var(--admin-surface); }
        .aa-empty-inline { font-size:13px; color:var(--admin-muted); }
        .aa-slides-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; }
        .aa-slide { border:1px solid var(--admin-border); border-radius:8px; overflow:hidden; background:var(--admin-surface-soft); }
        .aa-slide img { width:100%; height:100px; object-fit:cover; display:block; }
        .aa-slide p { font-size:12px; color:var(--admin-muted); margin:0; padding:6px 8px; }
        .aa-timeline { position:relative; padding-left:20px; }
        .aa-timeline::before { content:""; position:absolute; left:5px; top:4px; bottom:4px; width:2px; background:var(--admin-border); }
        .aa-timeline-item { position:relative; padding-bottom:16px; }
        .aa-timeline-item::before { content:""; position:absolute; left:-20px; top:3px; width:10px; height:10px; border-radius:50%; background:#534AB7; }
        .aa-timeline-year { font-size:11px; font-weight:600; color:#534AB7; text-transform:uppercase; letter-spacing:.04em; }
        .aa-timeline-title { font-size:13px; font-weight:500; color:var(--admin-text); margin:2px 0; }
        .aa-timeline-desc { font-size:12px; color:var(--admin-muted); line-height:1.5; }
        .aa-richtext { font-size:13px; color:var(--admin-text); line-height:1.6; }
        .aa-richtext ul, .aa-richtext ol { padding-left:1.25rem; margin-bottom:.5rem; }
        .aa-mv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:10px; }
        .aa-mv-card { border-radius:8px; padding:12px; background:var(--admin-surface-soft); border:1px solid var(--admin-border); }
        .aa-mv-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; color:#534AB7; margin-bottom:4px; }
        .aa-story-wrap { display:flex; gap:16px; flex-wrap:wrap; align-items:flex-start; }
        .aa-story-img { width:180px; height:130px; object-fit:cover; border-radius:8px; border:1px solid var(--admin-border); flex-shrink:0; }
        .aa-story-eyebrow { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:#1D9E75; margin:0 0 4px; }
        .aa-story-heading { font-size:16px; font-weight:600; margin:0 0 6px; color:var(--admin-text); }
        .aa-story-heading span { color:#534AB7; }
        .aa-story-sub { font-size:13px; color:var(--admin-muted); margin:0 0 8px; }
        .aa-story-badge { display:inline-flex; gap:6px; align-items:baseline; margin-top:8px; font-size:12px; color:var(--admin-muted); }
        .aa-story-badge strong { font-size:16px; color:var(--admin-text); }
      `}</style>

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-lg-4 py-4">

          <div className="page-heading">
            <div className="page-heading-copy">
              <span className="page-icon"><i className="bi bi-person-lines-fill" aria-hidden="true"></i></span>
              <div>
                <p className="aa-eyebrow">Management</p>
                <h1 className="h3 mb-1">About Page</h1>
                <p className="text-muted mb-0">Company info, features, gallery, values and timeline shown on the site.</p>
              </div>
            </div>
            {!hasRecord && (
              <div className="heading-actions">
                <Link className="btn btn-primary btn-sm" to="/about/create">
                  <i className="bi bi-plus-circle" aria-hidden="true"></i> Create About Page
                </Link>
              </div>
            )}
          </div>

          {!hasRecord && (
            <div className="aa-empty">
              <i className="bi bi-person-circle text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 mb-1 fw-semibold">No About page created yet.</p>
              <p className="text-muted small mb-3">Click "Create About Page" to add company info, features, and more.</p>
              <Link className="btn btn-primary btn-sm" to="/about/create">
                <i className="bi bi-plus-circle me-1"></i> Create About Page
              </Link>
            </div>
          )}

          {hasRecord && (
            <div className="aa-card">
              <div className="aa-banner"></div>
              <div className="aa-body">

                {/* Company Info */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div>
                    <p className="aa-name">{about.companyInfo?.name}</p>
                    <p className="aa-tagline">{about.companyInfo?.heroSubtitle}</p>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Link className="aa-btn" to={`/about/update/${about._id}`}>
                      <i className="bi bi-pencil-square" style={{ fontSize: 13 }}></i> Edit
                    </Link>
                    {localStorage.getItem("role") === "Super Admin" && (
                      <button className="aa-btn aa-btn-danger" onClick={() => deleteRecord(about._id)}>
                        <i className="bi bi-trash3-fill" style={{ fontSize: 13 }}></i> Delete
                      </button>
                    )}
                  </div>
                </div>

                {about.companyInfo?.description && (
                  <div
                    className="aa-richtext mb-3"
                    dangerouslySetInnerHTML={{ __html: about.companyInfo.description }}
                  />
                )}

                {(about.companyInfo?.mission || about.companyInfo?.vision) && (
                  <div className="aa-mv-grid mb-1">
                    {about.companyInfo?.mission && (
                      <div className="aa-mv-card">
                        <p className="aa-mv-label mb-0">Mission</p>
                        <div className="aa-richtext" dangerouslySetInnerHTML={{ __html: about.companyInfo.mission }} />
                      </div>
                    )}
                    {about.companyInfo?.vision && (
                      <div className="aa-mv-card">
                        <p className="aa-mv-label mb-0">Vision</p>
                        <div className="aa-richtext" dangerouslySetInnerHTML={{ __html: about.companyInfo.vision }} />
                      </div>
                    )}
                  </div>
                )}

                <hr className="aa-divider" />

                {/* Storyline */}
                <p className="aa-section-title">Storyline</p>
                {about.storyline ? (
                  <div className="aa-story-wrap">
                    {about.storyline.imageSrc && (
                      <img className="aa-story-img" src={about.storyline.imageSrc} alt={about.storyline.headingHighlight || "Storyline"} />
                    )}
                    <div>
                      {about.storyline.eyebrow && <p className="aa-story-eyebrow">{about.storyline.eyebrow}</p>}
                      <p className="aa-story-heading">
                        {about.storyline.headingPrefix}{" "}
                        <span>{about.storyline.headingHighlight}</span>
                      </p>
                      {about.storyline.subheading && <p className="aa-story-sub">{about.storyline.subheading}</p>}
                      {about.storyline.body && (
                        <div className="aa-richtext" dangerouslySetInnerHTML={{ __html: about.storyline.body }} />
                      )}
                      {(about.storyline.badgeCount || about.storyline.badgeLabel) && (
                        <p className="aa-story-badge">
                          <strong>{about.storyline.badgeCount}</strong> {about.storyline.badgeLabel}
                        </p>
                      )}
                    </div>
                  </div>
                ) : <p className="aa-empty-inline">No storyline added.</p>}

                <hr className="aa-divider" />

                {/* Features */}
                <p className="aa-section-title">Features</p>
                {about.aboutFeatures?.length ? (
                  <div className="aa-grid mb-1">
                    {about.aboutFeatures.map((f, i) => (
                      <div className="aa-detail" key={i}>
                        <div className="aa-icon"><i className={f.icon}></i></div>
                        <div className="aa-dvalue">{f.text}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="aa-empty-inline">No features added.</p>}

                <hr className="aa-divider" />

                {/* Slides */}
                <p className="aa-section-title">Gallery Slides</p>
                {about.aboutSlides?.length ? (
                  <div className="aa-slides-grid">
                    {about.aboutSlides.map((s, i) => (
                      <div className="aa-slide" key={i}>
                        <img src={s.src} alt={s.alt} />
                        <p>{s.alt}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="aa-empty-inline">No slides added.</p>}

                <hr className="aa-divider" />

                {/* Core Values */}
                <p className="aa-section-title">Core Values</p>
                {about.coreValues?.length ? (
                  <div className="aa-grid">
                    {about.coreValues.map((c, i) => (
                      <div className="aa-detail" key={i}>
                        <div className="aa-icon"><i className={c.icon}></i></div>
                        <div>
                          <div className="aa-dvalue">{c.title}</div>
                          <div className="aa-desc-sm">{c.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="aa-empty-inline">No core values added.</p>}

                <hr className="aa-divider" />

                {/* Timeline */}
                <p className="aa-section-title">Timeline</p>
                {about.timeline?.length ? (
                  <div className="aa-timeline">
                    {about.timeline.map((t, i) => (
                      <div className="aa-timeline-item" key={i}>
                        <div className="aa-timeline-year">{t.year}</div>
                        <div className="aa-timeline-title">{t.title}</div>
                        <div className="aa-timeline-desc">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="aa-empty-inline">No timeline events added.</p>}

              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}