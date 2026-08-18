/**
 * Reusable, responsive, and modern HTML email templates for CTech Ethics Solutions.
 */

const SITE_NAME = process.env.SITE_NAME || "CTech Ethics Solutions";
const SERVER_URL = process.env.SERVER || "https://ctechethic.com";

// Base email wrapper
function baseEmailWrapper({ title, previewText = "", content, ctaText, ctaUrl, headerColor = "#0284c7" }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; -webkit-font-smoothing: antialiased;">
    <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${previewText || title}
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f1f5f9; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                    
                    <!-- Top Gradient Brand Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 36px; text-align: center; border-bottom: 3px solid #38bdf8;">
                            <div style="display: inline-block; padding: 10px 14px; background: rgba(56, 189, 248, 0.15); border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3); margin-bottom: 12px;">
                                <span style="color: #38bdf8; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">⚡ ${SITE_NAME}</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">${title}</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 36px 36px 28px;">
                            ${content}

                            ${ctaText && ctaUrl ? `
                            <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
                                <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 50px; box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35); text-align: center;">
                                    ${ctaText} &rarr;
                                </a>
                            </div>
                            ` : ""}
                        </td>
                    </tr>

                    <!-- Footer Divider & Content -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; font-weight: 500;">
                                Questions or support? Reach out at <a href="mailto:${process.env.MAIL_SENDER || 'support@ctechethic.com'}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${process.env.MAIL_SENDER || 'support@ctechethic.com'}</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                &copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// 1. Contact Us: User Acknowledgment Template
function contactUserTemplate({ name, subject, message }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for reaching out to <strong>${SITE_NAME}</strong>. We have received your query and our team will review it and get back to you shortly.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">
                Summary of Your Message
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #334155; width: 25%; font-size: 14px;">Subject:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${subject}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0 0; font-weight: 600; color: #334155; vertical-align: top; font-size: 14px;">Message:</td>
                    <td style="padding: 8px 0 0; color: #475569; font-size: 14px; line-height: 1.5;">${message}</td>
                </tr>
            </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
            Typical response time is within <strong>24 business hours</strong>. If you have urgent questions, feel free to visit our portal.
        </p>
    `;

    return baseEmailWrapper({
        title: "We've Received Your Query",
        previewText: `Hi ${name}, thank you for reaching out to ${SITE_NAME}. We have received your query.`,
        content,
        ctaText: "Visit Our Website",
        ctaUrl: SERVER_URL
    });
}

// 2. Contact Us: Admin Notification Template
function contactAdminAlertTemplate({ name, email, phone, subject, message }) {
    const content = `
        <div style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px;">
            NEW INQUIRY
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            A new contact inquiry was just submitted on the website:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 30%; font-size: 14px;">Sender Name:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Phone:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${phone}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Subject:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${subject}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0 0; font-weight: 600; color: #64748b; vertical-align: top; font-size: 14px;">Message:</td>
                    <td style="padding: 10px 0 0; color: #334155; font-size: 14px; line-height: 1.5;">${message}</td>
                </tr>
            </table>
        </div>
    `;

    return baseEmailWrapper({
        title: `New Inquiry from ${name}`,
        previewText: `New contact form submission from ${name}: ${subject}`,
        content,
        ctaText: `Reply to ${name}`,
        ctaUrl: `mailto:${email}?subject=Re: ${subject}`
    });
}

// 3. Contact Us: Query Resolved Template
function contactResolvedTemplate({ name, subject }) {
    const content = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 26px; text-align: center;">
                ✓
            </div>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            We are pleased to inform you that your query regarding <strong>"${subject}"</strong> has been resolved by our support team.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            If you have any further questions or if there is anything else we can help you with, please feel free to reach out again.
        </p>
    `;

    return baseEmailWrapper({
        title: "Your Query Has Been Resolved",
        previewText: `Hi ${name}, your query "${subject}" has been marked as resolved.`,
        content,
        ctaText: "Contact Us Again",
        ctaUrl: `${SERVER_URL}/contact`
    });
}

// 4. Consultancy: User Confirmation Template
function consultancyUserTemplate({ name, service, budget, phone, description }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for booking a consultation session with <strong>${SITE_NAME}</strong>. Our technology consultants are reviewing your project scope and will get in touch with you shortly.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">
                Consultation Summary
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 35%; font-size: 14px;">Service:</td>
                    <td style="padding: 8px 0; color: #0284c7; font-size: 14px; font-weight: 700;">${service}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Budget Range:</td>
                    <td style="padding: 8px 0; color: #16a34a; font-size: 14px; font-weight: 700;">${budget}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Contact Phone:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0 0; font-weight: 600; color: #64748b; vertical-align: top; font-size: 14px;">Project Scope:</td>
                    <td style="padding: 10px 0 0; color: #334155; font-size: 14px; line-height: 1.5;">${description}</td>
                </tr>
            </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
            Our advisor will contact you directly via phone or email to schedule your dedicated meeting.
        </p>
    `;

    return baseEmailWrapper({
        title: "Consultation Request Confirmed",
        previewText: `Hi ${name}, your consultation request for ${service} has been received.`,
        content,
        ctaText: "Explore Our Portfolio",
        ctaUrl: `${SERVER_URL}/portfolio`
    });
}

// 5. Consultancy: Admin Alert Template
function consultancyAdminAlertTemplate({ name, email, phone, service, budget, description }) {
    const content = `
        <div style="display: inline-block; background-color: #fef3c7; color: #d97706; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px;">
            NEW CONSULTANCY BOOKING
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            A new client has requested a technical consultation:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 30%; font-size: 14px;">Client Name:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Service:</td>
                    <td style="padding: 8px 0; color: #0284c7; font-size: 14px; font-weight: 700;">${service}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Budget:</td>
                    <td style="padding: 8px 0; color: #16a34a; font-size: 14px; font-weight: 700;">${budget}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Phone:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${phone}</a></td>
                </tr>
                <tr>
                    <td style="padding: 10px 0 0; font-weight: 600; color: #64748b; vertical-align: top; font-size: 14px;">Project Scope:</td>
                    <td style="padding: 10px 0 0; color: #334155; font-size: 14px; line-height: 1.5;">${description}</td>
                </tr>
            </table>
        </div>
    `;

    return baseEmailWrapper({
        title: `Consultancy Booking: ${name}`,
        previewText: `New consultation booking from ${name} for ${service}`,
        content,
        ctaText: `Email Client (${name})`,
        ctaUrl: `mailto:${email}?subject=Regarding Your Consultation for ${service}`
    });
}

// 6. Consultancy: Completed Template
function consultancyCompletedTemplate({ name, service }) {
    const content = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 26px; text-align: center;">
                ★
            </div>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your consultation request regarding <strong>${service}</strong> has been marked as <strong>Completed</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for consulting with us. If you would like to move forward with project implementation, our engineering team is ready to assist.
        </p>
    `;

    return baseEmailWrapper({
        title: "Consultation Process Completed",
        previewText: `Hi ${name}, your consultation for ${service} has concluded.`,
        content,
        ctaText: "Discover Services",
        ctaUrl: `${SERVER_URL}/service`
    });
}

// 7. Job Application: Candidate Confirmation
function jobApplicationCandidateTemplate({ name, jobTitle }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>${SITE_NAME}</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            We have successfully received your application details and resume. Our talent acquisition team will review your profile and contact you if your skills match the position requirements.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 600;">
                Next Steps in the Hiring Process:
            </p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                1. Application Review &bull; 2. Technical Assessment / Interview &bull; 3. Final Discussion
            </p>
        </div>
    `;

    return baseEmailWrapper({
        title: "Application Received",
        previewText: `Hi ${name}, we have received your application for ${jobTitle}.`,
        content,
        ctaText: "View More Openings",
        ctaUrl: `${SERVER_URL}/career`
    });
}

// 8. Job Application: Status Update
function jobApplicationStatusUpdateTemplate({ name, jobTitle, status }) {
    const statusColors = {
        Shortlisted: { bg: "#dcfce7", text: "#15803d" },
        Reviewed: { bg: "#dbeafe", text: "#1d4ed8" },
        Rejected: { bg: "#fee2e2", text: "#b91c1c" },
        Pending: { bg: "#fef3c7", text: "#b45309" }
    };
    const currentStyle = statusColors[status] || { bg: "#f1f5f9", text: "#475569" };

    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            There is an update regarding your job application for <strong>${jobTitle}</strong>.
        </p>

        <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px;">CURRENT APPLICATION STATUS</div>
            <div style="display: inline-block; background-color: ${currentStyle.bg}; color: ${currentStyle.text}; font-size: 18px; font-weight: 800; padding: 8px 24px; border-radius: 50px;">
                ${status}
            </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
            Our recruitment coordinator will keep you informed of any further steps or schedule changes.
        </p>
    `;

    return baseEmailWrapper({
        title: `Application Status: ${jobTitle}`,
        previewText: `Hi ${name}, your application status for ${jobTitle} is now ${status}.`,
        content,
        ctaText: "Visit Careers Portal",
        ctaUrl: `${SERVER_URL}/career`
    });
}

// 9. Placement Application: Candidate Confirmation
function placementCandidateTemplate({ name, jobTitle }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for registering for the <strong>${jobTitle}</strong> Placement Drive through <strong>${SITE_NAME}</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your registration and resume have been logged into our placement cell. You will receive drive updates, interview schedules, and test links prior to the drive date.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46; font-weight: 700;">
                Placement Tip:
            </p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #047857; line-height: 1.5;">
                Keep your technical portfolio and projects ready. Review the core tech stack required for this drive.
            </p>
        </div>
    `;

    return baseEmailWrapper({
        title: "Placement Drive Registration Confirmed",
        previewText: `Hi ${name}, your placement drive application for ${jobTitle} is confirmed.`,
        content,
        ctaText: "View Placed Students",
        ctaUrl: `${SERVER_URL}/placement`
    });
}

// 10. Placement Application: Status Update
function placementStatusUpdateTemplate({ name, jobTitle, status }) {
    const statusColors = {
        Shortlisted: { bg: "#dcfce7", text: "#15803d" },
        Reviewed: { bg: "#dbeafe", text: "#1d4ed8" },
        Rejected: { bg: "#fee2e2", text: "#b91c1c" },
        Pending: { bg: "#fef3c7", text: "#b45309" }
    };
    const currentStyle = statusColors[status] || { bg: "#f1f5f9", text: "#475569" };

    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your placement drive application status for <strong>${jobTitle}</strong> has been updated.
        </p>

        <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px;">PLACEMENT DRIVE STATUS</div>
            <div style="display: inline-block; background-color: ${currentStyle.bg}; color: ${currentStyle.text}; font-size: 18px; font-weight: 800; padding: 8px 24px; border-radius: 50px;">
                ${status}
            </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
            If you have been shortlisted, our placement officer will reach out with interview time slots.
        </p>
    `;

    return baseEmailWrapper({
        title: `Placement Drive Update: ${jobTitle}`,
        previewText: `Hi ${name}, your placement application status is now ${status}.`,
        content,
        ctaText: "Placement Drives",
        ctaUrl: `${SERVER_URL}/placement`
    });
}

// 11. Newsletter Subscription Welcome
function newsletterWelcomeTemplate({ email }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Welcome to the <strong>${SITE_NAME}</strong> community!
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for subscribing to our newsletter with <strong>${email}</strong>.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 12px;">What you can look forward to:</div>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                <li>Latest Technology Insights & AI Engineering Trends</li>
                <li>Exclusive Job & Placement Drive Opportunities</li>
                <li>Case Studies & Software Architecture Best Practices</li>
            </ul>
        </div>
    `;

    return baseEmailWrapper({
        title: "Welcome to Our Newsletter",
        previewText: `Welcome to ${SITE_NAME} Newsletter! Stay updated with tech insights and placement drives.`,
        content,
        ctaText: "Read Our Latest Blogs",
        ctaUrl: `${SERVER_URL}/blog`
    });
}

// 12. User Auth: Welcome Template
function userWelcomeTemplate({ name, username }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Welcome aboard, <strong>${name}</strong>!
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your account with <strong>${SITE_NAME}</strong> has been successfully created.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 24px 0; text-align: center;">
            <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Registered Username</div>
            <div style="font-size: 18px; font-weight: 800; color: #0284c7;">${username}</div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
            You can now log in to update your profile, track applications, and access exclusive resources.
        </p>
    `;

    return baseEmailWrapper({
        title: `Welcome to ${SITE_NAME}`,
        previewText: `Hi ${name}, welcome to ${SITE_NAME}! Your account is ready.`,
        content,
        ctaText: "Log In to Your Account",
        ctaUrl: `${SERVER_URL}/login`
    });
}

// 13. User Auth: Password Reset OTP
function userOtpTemplate({ name, otp }) {
    const content = `
        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            We received a request to reset your account password. Use the verification code below to proceed:
        </p>

        <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #0284c7; border-radius: 12px; padding: 16px 36px;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #e11d48; font-weight: 600; margin-top: 8px;">
                This code will expire in 10 minutes. Do not share it with anyone.
            </p>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 0;">
            If you did not request a password reset, please ignore this email or contact our security team immediately.
        </p>
    `;

    return baseEmailWrapper({
        title: "Password Reset OTP Code",
        previewText: `Your OTP verification code for ${SITE_NAME} is ${otp}.`,
        content
    });
}

// 14. Newsletter: New Blog Published Alert
function newBlogNewsletterTemplate({ title, category, categoryColor, summary, image, slug, readTime, authorName }) {
    const badgeColor = categoryColor || "#0284c7";
    const blogUrl = `${SERVER_URL}/blog/${slug}`;

    const content = `
        <div style="margin-bottom: 20px;">
            <span style="display: inline-block; background-color: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                ${category || "Technology"}
            </span>
            ${readTime ? `<span style="font-size: 13px; color: #64748b; margin-left: 10px; font-weight: 500;">⏳ ${readTime}</span>` : ""}
        </div>

        <h2 style="font-size: 20px; font-weight: 800; line-height: 1.4; color: #0f172a; margin: 0 0 16px;">
            ${title}
        </h2>

        ${image ? `
        <div style="margin: 16px 0 24px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <img src="${image}" alt="${title}" style="width: 100%; height: auto; max-height: 280px; object-fit: cover; display: block;" />
        </div>
        ` : ""}

        <p style="font-size: 15px; line-height: 1.7; color: #475569; margin: 0 0 20px;">
            ${summary}
        </p>

        ${authorName ? `
        <p style="font-size: 13px; color: #64748b; margin: 0 0 24px; font-style: italic;">
            Written by <strong>${authorName}</strong> &bull; ${SITE_NAME}
        </p>
        ` : ""}
    `;

    return baseEmailWrapper({
        title: "New Post Published",
        previewText: `New Article: ${title} - Read now on ${SITE_NAME}`,
        content,
        ctaText: "Read Full Article",
        ctaUrl: blogUrl
    });
}

module.exports = {
    baseEmailWrapper,
    contactUserTemplate,
    contactAdminAlertTemplate,
    contactResolvedTemplate,
    consultancyUserTemplate,
    consultancyAdminAlertTemplate,
    consultancyCompletedTemplate,
    jobApplicationCandidateTemplate,
    jobApplicationStatusUpdateTemplate,
    placementCandidateTemplate,
    placementStatusUpdateTemplate,
    newsletterWelcomeTemplate,
    userWelcomeTemplate,
    userOtpTemplate,
    newBlogNewsletterTemplate
};

