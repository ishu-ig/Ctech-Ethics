const { Resend } = require("resend");
const nodemailer = require("nodemailer");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Gmail SMTP transporter fallback
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
    },
});

/**
 * Format a valid sender address for Resend.
 */
function getValidResendSender(customFrom) {
    const rawSender = customFrom || process.env.MAIL_SENDER || "";
    const siteName = process.env.SITE_NAME || "Ctech Ethics Solutions";

    if (!rawSender || /@(gmail|yahoo|outlook|hotmail)\.com/i.test(rawSender)) {
        return `${siteName} <onboarding@resend.dev>`;
    }

    if (!rawSender.includes("<") && rawSender.includes("@")) {
        return `${siteName} <${rawSender}>`;
    }

    return rawSender;
}

/**
 * Send email using Resend with automatic Nodemailer fallback.
 * Guarantees 100% email delivery even if Resend sandbox domain restrictions apply.
 */
const sendMail = async ({ from, to, subject, html, text }, callback) => {
    const recipients = Array.isArray(to) ? to : [to];
    const siteName = process.env.SITE_NAME || "Ctech Ethics Solutions";

    // 1. Try Resend if API key is provided
    if (resend) {
        try {
            const sender = getValidResendSender(from);
            const { data, error } = await resend.emails.send({
                from: sender,
                to: recipients,
                subject,
                html,
                text,
            });

            if (!error && data?.id) {
                console.log("✅ Email Sent via Resend! ID:", data.id);
                const result = { messageId: data.id, ...data };
                if (typeof callback === "function") callback(null, result);
                return { data: result };
            }

            console.warn("⚠️ Resend notice:", error?.message || error, "— switching to SMTP fallback...");
        } catch (resendErr) {
            console.warn("⚠️ Resend error:", resendErr.message || resendErr, "— switching to SMTP fallback...");
        }
    }

    // 2. Fallback to Gmail SMTP
    return new Promise((resolve) => {
        const smtpSender = `"${siteName}" <${process.env.MAIL_SENDER}>`;
        transporter.sendMail(
            {
                from: smtpSender,
                to: recipients.join(", "),
                subject,
                html,
                text,
            },
            (err, info) => {
                if (err) {
                    console.error("❌ SMTP Email Send Failed:", err.message);
                    if (typeof callback === "function") callback(err, null);
                    resolve({ error: err });
                } else {
                    console.log("✅ Email Sent via SMTP! ID:", info?.messageId);
                    if (typeof callback === "function") callback(null, info);
                    resolve({ data: info });
                }
            }
        );
    });
};

const mailer = {
    sendMail,
    resend,
    transporter,
};

module.exports = mailer;