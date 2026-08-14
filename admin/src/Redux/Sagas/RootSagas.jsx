import { all } from "redux-saga/effects"
import serviceSagas from "./ServiceSagas"
import contactUsSagas from "./ContactUsSagas"
import portfolioSagas from "./PortfolioSagas"
import testimonialSagas from "./TestimonialSagas"
import blogSagas from "./BlogSagas"
import newsletterSagas from "./NewsletterSagas"
import commentSagas from "./CommentSagas"
import achievementSagas from "./AchievementSagas"
import aboutSagas from "./AboutSaga"
import teamsSagas from "./TeamsSagas"
import bannerSagas from "./BannerSaga"
import whyChooseUsSagas from "./WhyChooseUsSaga"
import techStackSagas from "./TechStackSagas"
import placementSagas from "./PlacementSagas"
import careerSagas from "./CareerSagas"
import subServiceSagas from "./SubServiceSagas"
import placedStudentSagas from "./PlacedStudentSaga"
import applicationSagas from "./ApplicationSaga"
import placementApplicationSagas from "./PlacementApplicationSaga"



export default function* RootSaga() {
    yield all([
        contactUsSagas(),
        portfolioSagas(),
        testimonialSagas(),
        blogSagas(),
        newsletterSagas(),
        commentSagas(),
        achievementSagas(),
        aboutSagas(),
        teamsSagas(),
        bannerSagas(),
        whyChooseUsSagas(),
        techStackSagas(),
        placementSagas(),
        careerSagas(),
        portfolioSagas(),
        subServiceSagas(),
        serviceSagas(),
        placedStudentSagas(),
        applicationSagas(),
        placementApplicationSagas(),

    ])
}