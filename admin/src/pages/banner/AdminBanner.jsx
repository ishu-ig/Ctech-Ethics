import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getBanner,
    deleteBanner,
    updateBanner,
} from "../../Redux/ActionCreators/BannerActionCreators";

export default function AdminBanner() {
    let BannerStateData = useSelector((state) => state.BannerStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);
    let [search, setSearch] = useState("");

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteBanner({ _id }));
            setFlag(!flag);
        }
    }

    function updateRecord(_id) {
        const item = BannerStateData.find((a) => a._id === _id);
        if (!item) return;
        dispatch(updateBanner({ _id, status: !item.status }));
        setFlag(!flag);
    }

    function getAPIData() {
        dispatch(getBanner());
    }

    useEffect(() => {
        getAPIData();
    }, [flag]);

    const totalCount = BannerStateData ? BannerStateData.length : 0;
    const activeCount = BannerStateData ? BannerStateData.filter((i) => i.status).length : 0;
    const inactiveCount = BannerStateData ? BannerStateData.filter((i) => !i.status).length : 0;

    // FIX: Using "headline" instead of "title", and added "?" to prevent crashes
    const filteredData = BannerStateData
        ? BannerStateData.filter((item) =>
            item.headline?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <>
            <style>{`
        .act-strip {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 3px;
        }
        .act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px;
          border: none; background: transparent; cursor: pointer;
          font-size: 0.88rem; color: #6c757d;
          transition: background .13s, color .13s, transform .1s;
          text-decoration: none; position: relative;
        }
        .act-btn:hover { transform: scale(1.1); }
        .act-btn-edit:hover   { background: #cfe2ff; color: #0d6efd; }
        .act-btn-on:hover     { background: #d1e7dd; color: #198754; }
        .act-btn-off:hover    { background: #fff3cd; color: #856404; }
        .act-btn-del:hover    { background: #f8d7da; color: #dc3545; }
        .act-sep {
          width: 1px; height: 16px;
          background: #dee2e6; flex-shrink: 0;
        }
        .act-btn::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          background: #212529; color: #fff;
          font-size: 0.67rem; font-weight: 600;
          padding: 3px 7px; border-radius: 4px; white-space: nowrap;
          pointer-events: none; z-index: 20;
          opacity: 0; transition: opacity .12s;
        }
        .act-btn:hover::after { opacity: 1; }
        .banner-thumb {
          width: 64px; height: 40px; border-radius: 6px;
          object-fit: cover; border: 1px solid #dee2e6;
        }
        .banner-text-clip {
          max-width: 200px; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; display: inline-block; vertical-align: bottom;
        }
        .color-swatch {
          width: 16px; height: 16px; border-radius: 4px;
          border: 1px solid #dee2e6; display: inline-block;
        }
      `}</style>

            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4">
                    <div className="page-heading">
                        <div className="page-heading-copy">
                            <span className="page-icon">
                                <i className="bi bi-images" aria-hidden="true"></i>
                            </span>
                            <div>
                                <p className="eyebrow mb-1">Management</p>
                                <h1 className="h3 mb-1">Banners</h1>
                                <p className="text-muted mb-0">
                                    Review and manage homepage banners.
                                </p>
                            </div>
                        </div>
                        <div className="heading-actions">
                            <Link className="btn btn-primary btn-sm" to="/banner/create">
                                <i className="bi bi-plus-circle" aria-hidden="true"></i> Add Banner
                            </Link>
                        </div>
                    </div>

                    {/* Metric Cards */}
                    <section className="row g-3 mt-2 mb-1" aria-label="Banner summary">
                        <div className="col-12 col-sm-6 col-xl-4">
                            <article className="metric-card text-white">
                                <div className="metric-top">
                                    <span className="metric-label">Total</span>
                                    <span className="metric-icon"><i className="bi bi-collection-fill"></i></span>
                                </div>
                                <div className="metric-value">{totalCount}</div>
                                <div className="metric-meta"><span>all</span><span>banners</span></div>
                            </article>
                        </div>
                        <div className="col-12 col-sm-6 col-xl-4">
                            <article className="metric-card text-white">
                                <div className="metric-top">
                                    <span className="metric-label">Active</span>
                                    <span className="metric-icon"><i className="bi bi-check-circle-fill"></i></span>
                                </div>
                                <div className="metric-value">{activeCount}</div>
                                <div className="metric-meta"><span>published</span><span>on site</span></div>
                            </article>
                        </div>
                        <div className="col-12 col-sm-6 col-xl-4">
                            <article className="metric-card">
                                <div className="metric-top">
                                    <span className="metric-label">Inactive</span>
                                    <span className="metric-icon"><i className="bi bi-eye-slash-fill"></i></span>
                                </div>
                                <div className="metric-value">{inactiveCount}</div>
                                <div className="metric-meta"><span>hidden</span><span>from site</span></div>
                            </article>
                        </div>
                    </section>

                    <section className="panel mt-3">
                        <div className="panel-header">
                            <div>
                                <h2 className="h5 mb-1 section-title">
                                    <i className="bi bi-table" aria-hidden="true"></i>
                                    <span>Banner List</span>
                                </h2>
                                <p className="text-muted mb-0">
                                    Search, review, and manage banners.
                                </p>
                            </div>
                            <div className="ms-auto" style={{ minWidth: 220 }}>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search by headline..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setSearch("")}
                                            title="Clear search"
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle mb-0" id="bannerTable">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Image</th>
                                        <th scope="col">Headline</th>
                                        <th scope="col">Badge</th>
                                        <th scope="col">Tagline</th>
                                        <th scope="col">Accent</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {item.image ? (
                                                        <img className="banner-thumb" src={item.image} alt={item.headline} />
                                                    ) : (
                                                        <span className="banner-thumb d-inline-flex align-items-center justify-content-center bg-light">
                                                            <i className="bi bi-image text-muted"></i>
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="banner-text-clip fw-semibold" title={item.headline}>{item.headline}</span>
                                                </td>
                                                <td>
                                                    <span className="banner-text-clip text-muted small" title={item.badge}>{item.badge}</span>
                                                </td>
                                                <td>
                                                    <span className="banner-text-clip" title={item.tagline}>{item.tagline}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="color-swatch" style={{ backgroundColor: item.accent || '#47b2e4' }}></span>
                                                        <span className="small text-muted font-monospace">{item.accent || '#47b2e4'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}
                                                    >
                                                        {item.status ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="act-strip">
                                                        <Link
                                                            className="act-btn act-btn-edit"
                                                            to={`/banner/update/${item._id}`}
                                                            data-tip="Edit"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>

                                                        <span className="act-sep"></span>

                                                        <button
                                                            className={`act-btn ${item.status ? "act-btn-off" : "act-btn-on"}`}
                                                            onClick={() => updateRecord(item._id)}
                                                            data-tip={item.status ? "Deactivate" : "Activate"}
                                                        >
                                                            <i
                                                                className={`bi ${item.status ? "bi-pause-fill" : "bi-play-fill"}`}
                                                            ></i>
                                                        </button>

                                                        <span className="act-sep"></span>

                                                        {localStorage.getItem("role") === "Admin" && (
                                                            <button
                                                                className="act-btn act-btn-del"
                                                                onClick={() => deleteRecord(item._id)}
                                                                data-tip="Delete"
                                                            >
                                                                <i className="bi bi-trash3-fill"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted py-4">
                                                {search
                                                    ? `No banners found for "${search}"`
                                                    : "No banners available."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}