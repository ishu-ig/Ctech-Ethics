import { combineReducers } from "@reduxjs/toolkit"
import ServiceReducer from "./ServiceReducer"
import SkillReducer from "./SkillReducer"
import CertificateReducer from "./CertificateReducer"
import PortfolioReducer from "./PortfolioReducer"
import ContactUsReducer from "./ContactUsReducer"
import TestimonialReducer from "./TestimonialReducer"
import BlogReducer from "./BlogReducer"
import NewsletterReducer from "./NewsletterReducer"
import CommentReducer from "./CommentReducer"
import AchievementReducer from "./AchievementReducer"
import AboutReducer from "./AboutReducer"
import TeamsReducer from "./TeamsReducer"
import BannerReducer from "./BannerReducer"
import WhyChooseUSReducer from "./WhyChooseUsReducer"
import TechStackReducer from "./TechStackReducer"
import PlacementReducer from "./PlacementReducer"
import CareerReducer from "./CareerReducer"
import SubServiceReducer from "./SubServiceReducer"
import PlacedStudentReducer from "./PlacedStudentReducer"
import ApplicationReducer from "./ApplicationReducer"
import PlacementApplicationReducer from "./PlacementApplicationReducer"
import ConsultancyReducer from "./ConsultancyReducer"



export default combineReducers({

    ServiceStateData: ServiceReducer,
    TestimonialStateData: TestimonialReducer,
    SkillStateData: SkillReducer,
    CertificateStateData: CertificateReducer,
    ContactUsStateData: ContactUsReducer,
    PortfolioStateData: PortfolioReducer,
    BlogStateData: BlogReducer,
    NewsletterStateData: NewsletterReducer,
    CommentStateData: CommentReducer,
    AchievementStateData: AchievementReducer,
    AboutStateData: AboutReducer,
    TeamsStateData: TeamsReducer,
    BannerStateData: BannerReducer,
    WhyChooseUsStateData: WhyChooseUSReducer,
    TechStackStateData: TechStackReducer,
    PlacementStateData: PlacementReducer,
    CareerStateData: CareerReducer,
    SubServiceStateData: SubServiceReducer,
    PlacedStudentStateData: PlacedStudentReducer,
    ApplicationStateData: ApplicationReducer,
    PlacementApplicationStateData: PlacementApplicationReducer,
    ConsultancyStateData: ConsultancyReducer,
})