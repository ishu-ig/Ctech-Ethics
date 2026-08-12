import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

export default function GalleryCard({ item, onOpen }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35 }}
            className={`gal-item ${item.span}`}
            onClick={() => onOpen(item)}
        >
            <img src={item.image} alt={item.title} loading="lazy" />

            <div className="gal-item-overlay">
                <div className="gal-item-text">
                    <span className="gal-item-category">{item.category}</span>
                    <h4 className="gal-item-title">{item.title}</h4>
                </div>
                <div className="gal-zoom-icon">
                    <ZoomIn size={20} />
                </div>
            </div>
        </motion.div>
    );
}