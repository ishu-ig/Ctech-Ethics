const mongoose = require('mongoose');
const { Schema } = mongoose;

/* ── 1. Company Info ─────────────────────────────────────────── */
const CompanyInfoSchema = new Schema(
    {
        name: { type: String, trim: true, required: [true, "Company name is required"] },
        heroSubtitle: { type: String, trim: true, required: [true, "Hero subtitle is required"] },
        description: { type: String, required: [true, "Company description is required"] },
        mission: { type: String, required: [true, "Mission statement is required"] },
        vision: { type: String, required: [true, "Vision statement is required"] },
    },
    { _id: false }
);

/* ── 2. Storyline ────────────────────────────────────────────── */
const StorylineSchema = new Schema(
    {
        eyebrow: { type: String, trim: true, default: "Our Story" },
        headingPrefix: { type: String, trim: true, required: [true, "Storyline heading prefix is required"] },
        headingHighlight: { type: String, trim: true, required: [true, "Storyline heading highlight is required"] },
        subheading: { type: String, trim: true, required: [true, "Storyline subheading is required"] },
        body: { type: String, required: [true, "Storyline body is required"] },
        imageSrc: { type: String, trim: true, required: [true, "Storyline image URL is required"] },
        badgeCount: { type: String, trim: true, default: "200+" },
        badgeLabel: { type: String, trim: true, default: "Clients served globally" },
    },
    { _id: false }
);

/* ── 3. Features & Slides ────────────────────────────────────── */
const AboutFeatureSchema = new Schema(
    {
        icon: { type: String, trim: true, required: [true, "Feature icon is required"] },
        text: { type: String, trim: true, required: [true, "Feature text is required"] },
    },
    { _id: false }
);

const AboutSlideSchema = new Schema(
    {
        src: { type: String, trim: true, required: [true, "Slide image URL is required"] },
        alt: { type: String, trim: true, required: [true, "Slide alt text is required"] },
    },
    { _id: false }
);

/* ── 4. Core Values & Timeline ───────────────────────────────── */
const CoreValueSchema = new Schema(
    {
        icon: { type: String, trim: true, required: [true, "Core value icon is required"] },
        title: { type: String, trim: true, required: [true, "Core value title is required"] },
        desc: { type: String, trim: true, required: [true, "Core value description is required"] },
    },
    { _id: false }
);

const TimelineEventSchema = new Schema(
    {
        year: { type: String, trim: true, required: [true, "Timeline year is required"] },
        title: { type: String, trim: true, required: [true, "Timeline title is required"] },
        desc: { type: String, trim: true, required: [true, "Timeline description is required"] },
    },
    { _id: false }
);

/* ── Main Page Schema ────────────────────────────────────────── */
const AboutSchema = new Schema(
    {
        companyInfo: { type: CompanyInfoSchema, required: true },
        storyline: { type: StorylineSchema, required: true },
        aboutFeatures: { type: [AboutFeatureSchema], default: [] },
        aboutSlides: { type: [AboutSlideSchema], default: [] },
        coreValues: { type: [CoreValueSchema], default: [] },
        timeline: { type: [TimelineEventSchema], default: [] },

        // Optional: Assuming you only want one "Active" About Page at a time
        isPublished: { type: Boolean, default: true },
    },
    { timestamps: true }
);

/* Helper to fetch the single active published page */
AboutSchema.statics.getSingleton = function () {
    return this.findOne({ isPublished: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('About', AboutSchema);