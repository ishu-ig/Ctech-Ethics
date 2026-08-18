const { Resend } = require("resend");
const nodemailer = require("nodemailer");

const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const brevoApiKey = (process.env.BREVO_API_KEY || "").trim();

/**
 * Build a robust nodemailer transporter.
 * Uses clean credentials and explicit SMTP parameters for cloud hosting compatibility.
 */
function createSmtpTransporter(port = 465, secure = true) {
    const user = (process.env.MAIL_SENDER || "").trim();
    const pass = (process.env.MAIL_PASSWORD || "").replace(/\s+/g, "");

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port,
        secure,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
    });
}

const primaryTransporter = createSmtpTransporter(465, true);
const fallbackTransporter = createSmtpTransporter(587, false);

/**
 * Send email via Brevo REST API (HTTPS port 443).
 * Works 100% FREE (300 emails/day) with @gmail.com without ANY custom domain.
 */
async function sendViaBrevo({ to, subject, html, text }) {
    if (!brevoApiKey) return null;

    const siteName = process.env.SITE_NAME || "Ctech Ethics Solutions";
    const senderEmail = (process.env.MAIL_SENDER || "").trim() || "ishaangupta124@gmail.com";
    const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email: String(email).trim() }));

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": brevoApiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: { name: siteName, email: senderEmail },
                to: recipients,
                subject,
                htmlContent: html,
                textContent: text,
            }),
        });

        const resData = await response.json();
        if (response.ok && resData?.messageId) {
            return { success: true, messageId: resData.messageId };
        }
        console.warn("⚠️ [Brevo API Notice]:", resData);
        return null;
    } catch (err) {
        console.warn("⚠️ [Brevo API Error]:", err.message);
        return null;
    }
}

/**
 * Format a valid sender address for Resend.
 */
function getValidResendSender(customFrom) {
    const siteName = process.env.SITE_NAME || "Ctech Ethics Solutions";

    if (customFrom && customFrom.includes("@")) {
        return customFrom.includes("<") ? customFrom : `${siteName} <${customFrom}>`;
    }

    if (process.env.RESEND_FROM_EMAIL && process.env.RESEND_FROM_EMAIL.includes("@")) {
        const email = process.env.RESEND_FROM_EMAIL.trim();
        return `${siteName} <${email}>`;
    }

    return `${siteName} <onboarding@resend.dev>`;
}

/**
 * Send email using intelligent multi-engine dispatch:
 * 1. Brevo HTTP API (Port 443 HTTPS - Free 300/day to ANY recipient, NO domain required)
 * 2. Resend HTTP API (If custom verified domain is available)
 * 3. Gmail SMTP Fallback (Port 465 SSL & Port 587 TLS)
 */
const sendMail = async ({ from, to, subject, html, text }, callback) => {
    const recipients = Array.isArray(to) ? to.map((t) => String(t).trim()) : [String(to).trim()];
    const siteName = process.env.SITE_NAME || "Ctech Ethics Solutions";
    const smtpSender = `"${siteName}" <${(process.env.MAIL_SENDER || "").trim()}>`;

    // ── 1. Try Brevo HTTP API (Port 443 - 100% Free with Gmail & No Domain) ──
    if (brevoApiKey) {
        const brevoRes = await sendViaBrevo({ to: recipients, subject, html, text });
        if (brevoRes?.success) {
            console.log("✅ [Brevo API] Email Sent to:", recipients.join(", "), "ID:", brevoRes.messageId);
            const result = { messageId: brevoRes.messageId };
            if (typeof callback === "function") callback(null, result);
            return { data: result };
        }
    }

    // ── 2. Try Resend HTTP API (If custom verified domain is present) ──
    const hasCustomDomain = Boolean(process.env.RESEND_FROM_EMAIL && process.env.RESEND_FROM_EMAIL.includes("@"));
    if (resend && (hasCustomDomain || recipients.every(r => r.toLowerCase().includes("amrinderkaur816")))) {
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
                console.log("✅ [Resend] Email Sent Successfully! ID:", data.id);
                const result = { messageId: data.id, ...data };
                if (typeof callback === "function") callback(null, result);
                return { data: result };
            }
            console.warn("⚠️ [Resend Notice]:", error?.message || error);
        } catch (resendErr) {
            console.warn("⚠️ [Resend Error]:", resendErr.message || resendErr);
        }
    }

    // ── 3. Gmail SMTP Transporter (Port 465 SSL) ──
    return new Promise((resolve) => {
        primaryTransporter.sendMail(
            {
                from: smtpSender,
                to: recipients.join(", "),
                subject,
                html,
                text,
            },
            (err, info) => {
                if (!err) {
                    console.log("✅ [SMTP SSL] Email Sent to:", recipients.join(", "), "ID:", info?.messageId);
                    if (typeof callback === "function") callback(null, info);
                    return resolve({ data: info });
                }

                console.warn("⚠️ [SMTP 465]:", err.message, "— trying Port 587 TLS...");

                // ── 4. Fallback to Gmail SMTP (Port 587 TLS) ──
                fallbackTransporter.sendMail(
                    {
                        from: smtpSender,
                        to: recipients.join(", "),
                        subject,
                        html,
                        text,
                    },
                    (err587, info587) => {
                        if (!err587) {
                            console.log("✅ [SMTP TLS 587] Email Sent! ID:", info587?.messageId);
                            if (typeof callback === "function") callback(null, info587);
                            return resolve({ data: info587 });
                        }

                        console.error("❌ [All Email Engines Failed]:", err587.message);
                        if (typeof callback === "function") callback(err587, null);
                        resolve({ error: err587 });
                    }
                );
            }
        );
    });
};

const mailer = {
    sendMail,
    resend,
    primaryTransporter,
    fallbackTransporter,
};

module.exports = mailer;