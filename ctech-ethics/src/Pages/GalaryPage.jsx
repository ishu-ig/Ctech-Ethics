import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import HeroSection from '../Components/HeroSection';
import GalleryCard from '../Components/GalleryCard';

const GALLERY_CATEGORIES = ["All", "Office", "Events", "Team Outings", "Awards"];

const GALLERY_IMAGES = [
    { id: 1, category: "Office", title: "Brainstorming Session", image: "https://picsum.photos/seed/g1/800/600", span: "row" },
    { id: 2, category: "Events", title: "Annual Tech Conference", image: "https://picsum.photos/seed/g2/600/800", span: "col" },
    { id: 3, category: "Team Outings", title: "Company Retreat 2025", image: "https://picsum.photos/seed/g3/800/800", span: "square" },
    { id: 4, category: "Awards", title: "Best IT Agency Award", image: "https://picsum.photos/seed/g4/800/600", span: "row" },
    { id: 5, category: "Office", title: "New Workspace Setup", image: "https://picsum.photos/seed/g5/600/800", span: "col" },
    { id: 6, category: "Team Outings", title: "Hiking Trip", image: "https://picsum.photos/seed/g6/800/600", span: "row" },
    { id: 7, category: "Events", title: "Hackathon Winners", image: "https://picsum.photos/seed/g7/800/800", span: "square" },
    { id: 8, category: "Office", title: "Casual Fridays", image: "https://picsum.photos/seed/g8/800/600", span: "row" },
];

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredImages = useMemo(() => {
        if (activeFilter === "All") return GALLERY_IMAGES;
        return GALLERY_IMAGES.filter(img => img.category === activeFilter);
    }, [activeFilter]);

    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selectedImage]);

    return (
        <div className="gallery-page">
            <HeroSection
                title="Life at CTech Ethic"
                subtitle="Take a peek behind the scenes at our workspace, events, and the amazing people who make it all happen."
                eyebrow="Our Culture · Gallery"
                breadcrumb="Gallery"
                size="md"
            />

            <section className="gal-section">
                <div className="gal-filters">
                    {GALLERY_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`gal-filter-btn ${activeFilter === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <motion.div layout className="gal-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((item) => (
                            <GalleryCard
                                key={item.id}
                                item={item}
                                onOpen={setSelectedImage}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <div className="gal-empty">
                        <p>No photos found in this category.</p>
                    </div>
                )}
            </section>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="gal-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="gal-lightbox-close" onClick={() => setSelectedImage(null)}>
                            <X size={24} />
                        </button>
                        <motion.div
                            className="gal-lightbox-content"
                            initial={{ y: 50, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 20, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={selectedImage.image} alt={selectedImage.title} />
                            <div className="gal-lightbox-caption">
                                <h5>{selectedImage.title}</h5>
                                <span>{selectedImage.category}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}