const COLORS = {
  primary: "#5B3A8F",
  primaryLight: "#7B5AAF",
  accent: "#7A9E9B",
  accentLight: "#99B5B3",
  background: "#FAFAFA",
  text: "#1a1a1a",
  textSecondary: "#666666",
  border: "#F0F0F0",
};

export function getNotificationEmailHtml({
  formType,
  name,
  email,
  message,
  service,
  fileName,
  downloadUrl,
}) {
  const isQuote = formType === "quote";
  const isReview = formType === "review";
  const serviceLabels = {
    proofreading: "Proofreading",
    editing: "Editing",
    typesetting: "Typesetting",
    "file-conversion": "File Conversion",
    "self-publishing": "Self-Publishing Consulting",
    "source-citation": "Source Citation",
    "copyright-permissions": "Copyright Permissions Request",
    "scripture-proofreading": "Scripture Proofreading",
    other: "Other",
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.background}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.accentLight} 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600;">
                                Nova Sei Press
                            </h1>
                            <p style="color: rgba(255, 255, 255, 0.85); margin: 10px 0 0; font-size: 14px; font-weight: 500;">
                                ${isQuote ? "New Quote Request" : isReview ? "New Review Submission" : "New General Inquiry"}
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <!-- From -->
                                <tr>
                                    <td style="padding-bottom: 20px; border-bottom: 1px solid ${COLORS.border};">
                                        <p style="margin: 0 0 5px; color: ${COLORS.textSecondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                                        <p style="margin: 0; color: ${COLORS.text}; font-size: 16px; font-weight: 600;">${escapeHtml(name)}</p>
                                        <p style="margin: 5px 0 0; color: ${COLORS.primary};">
                                            <a href="mailto:${escapeHtml(email)}" style="color: ${COLORS.primary}; text-decoration: none;">${escapeHtml(email)}</a>
                                        </p>
                                    </td>
                                </tr>

                                ${
                                  isQuote && service
                                    ? `
                                <!-- Service -->
                                <tr>
                                    <td style="padding: 20px 0; border-bottom: 1px solid ${COLORS.border};">
                                        <p style="margin: 0 0 5px; color: ${COLORS.textSecondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service Requested</p>
                                        <p style="margin: 0; color: ${COLORS.text}; font-size: 16px;">${escapeHtml(serviceLabels[service] || service)}</p>
                                    </td>
                                </tr>
                                `
                                    : ""
                                }

                                ${
                                  fileName && downloadUrl
                                    ? `
                                <!-- File Attachment -->
                                <tr>
                                    <td style="padding: 20px 0; border-bottom: 1px solid ${COLORS.border};">
                                        <p style="margin: 0 0 10px; color: ${COLORS.textSecondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Attached File</p>
                                        <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #f5f0ff 0%, #e6faf8 100%); color: ${COLORS.primary}; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px; border: 1px solid rgba(91, 58, 143, 0.15);">
                                            Download: ${escapeHtml(fileName)}
                                        </a>
                                        <p style="margin: 10px 0 0; color: ${COLORS.textSecondary}; font-size: 12px;">This link expires in 30 days</p>
                                    </td>
                                </tr>
                                `
                                    : ""
                                }

                                <!-- Message -->
                                <tr>
                                    <td style="padding: 20px 0;">
                                        <p style="margin: 0 0 10px; color: ${COLORS.textSecondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${isQuote ? "Project Details" : isReview ? "Review" : "Message"}</p>
                                        <p style="margin: 0; color: ${COLORS.text}; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 2px solid ${COLORS.accentLight};">
                            <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 13px;">
                                ${isReview ? "Thank you for this customer review!" : `Expected response time: <strong>${isQuote ? "2-5 business days" : "1-3 business days"}</strong>`}
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

export function getConfirmationEmailHtml({ name, formType }) {
  const isQuote = formType === "quote";
  const isReview = formType === "review";

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.background}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.accentLight} 100%); padding: 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 600;">
                                Nova Sei Press
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: ${COLORS.primary}; font-family: Georgia, 'Times New Roman', serif; font-size: 24px;">
                                Thank you, ${escapeHtml(name)}!
                            </h2>
                            ${
                              isReview
                                ? `
                            <p style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
                                We've received your review and truly appreciate you taking the time to share your experience with us.
                            </p>
                            <p style="margin: 0 0 30px; color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.6;">
                                Your feedback helps us continue to improve our services and means the world to our team.
                            </p>
                            `
                                : `
                            <p style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
                                We've received your ${isQuote ? "quote request" : "message"} and will get back to you within
                                <strong style="color: ${COLORS.primary};">${isQuote ? "2-5 business days" : "1-3 business days"}</strong>.
                            </p>
                            <p style="margin: 0 0 30px; color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.6;">
                                We appreciate your interest in Nova Sei Press and look forward to helping you with your publishing needs.
                            </p>
                            `
                            }
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #f5f0ff 0%, #e6faf8 100%); border-radius: 50px; border: 1px solid rgba(91, 58, 143, 0.15);">
                                        <a href="https://novaseipress.com" style="display: inline-block; padding: 14px 32px; color: ${COLORS.primary}; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            Visit Our Website
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 2px solid ${COLORS.accentLight};">
                            <p style="margin: 0 0 5px; color: ${COLORS.primary}; font-family: Georgia, 'Times New Roman', serif; font-weight: 600; font-size: 16px;">
                                Nova Sei Press
                            </p>
                            <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 13px;">
                                Tennessee-based publishing services
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Unsubscribe note -->
                <p style="margin: 20px 0 0; color: ${COLORS.textSecondary}; font-size: 12px; text-align: center;">
                    This is an automated confirmation of your form submission.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
