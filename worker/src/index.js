import {
  getNotificationEmailHtml,
  getConfirmationEmailHtml,
} from "./email-templates.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["pdf", "docx", "pages"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request, env);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (url.pathname === "/api/get-upload-url" && request.method === "POST") {
        return await handleGetUploadUrl(request, env, corsHeaders);
      }

      if (url.pathname === "/api/upload" && request.method === "PUT") {
        return await handleUpload(request, env, corsHeaders);
      }

      if (url.pathname === "/api/submit" && request.method === "POST") {
        return await handleSubmit(request, env, corsHeaders);
      }

      if (url.pathname === "/api/download" && request.method === "GET") {
        return await handleDownload(request, env, corsHeaders);
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim());

  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Generate a unique file key
function generateFileKey(filename) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `uploads/${timestamp}-${random}-${sanitizedName}`;
}

// Handler: Get upload URL (returns key for direct upload)
async function handleGetUploadUrl(request, env, corsHeaders) {
  const { filename, size } = await request.json();

  // Validate file extension
  const ext = (filename || "").split(".").pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return new Response(
      JSON.stringify({
        error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Validate size
  if (size > MAX_FILE_SIZE) {
    return new Response(
      JSON.stringify({
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const key = generateFileKey(filename);

  return new Response(JSON.stringify({ key }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Handler: Upload file to R2
async function handleUpload(request, env, corsHeaders) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key || !key.startsWith("uploads/")) {
    return new Response(JSON.stringify({ error: "Invalid key" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const contentType =
    request.headers.get("Content-Type") || "application/octet-stream";
  const body = await request.arrayBuffer();

  // Validate size
  if (body.byteLength > MAX_FILE_SIZE) {
    return new Response(JSON.stringify({ error: "File too large" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await env.UPLOADS.put(key, body, {
    httpMetadata: { contentType },
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Handler: Submit form
async function handleSubmit(request, env, corsHeaders) {
  const data = await request.json();
  const {
    formType,
    firstName,
    lastName,
    email,
    message,
    service,
    fileKey,
    fileName,
  } = data;

  // Validate required fields
  if (!firstName || !lastName || !email || !message || !formType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate service is provided for quote requests
  if (formType === "quote" && !service) {
    return new Response(
      JSON.stringify({
        error: "Service selection is required for quote requests",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const fullName = `${firstName} ${lastName}`;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Generate download URL if file was uploaded
  let downloadUrl = null;
  if (fileKey && fileName) {
    // Create a simple token for download verification (expires in 30 days)
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const token = btoa(JSON.stringify({ key: fileKey, fileName, expiry }));
    downloadUrl = `${new URL(request.url).origin}/api/download?token=${encodeURIComponent(token)}`;
  }

  // Send notification email to Nova Sei Press
  await sendEmail(env, {
    to: env.RECIPIENT_EMAIL,
    from: `Nova Sei Press <${env.SENDER_EMAIL}>`,
    replyTo: email,
    subject:
      formType === "quote"
        ? `New Quote Request from ${fullName}`
        : `New Inquiry from ${fullName}`,
    html: getNotificationEmailHtml({
      formType,
      name: fullName,
      email,
      message,
      service,
      fileName,
      downloadUrl,
    }),
  });

  // Send confirmation email to submitter
  await sendEmail(env, {
    to: email,
    from: `Nova Sei Press <${env.SENDER_EMAIL}>`,
    subject: "We received your message - Nova Sei Press",
    html: getConfirmationEmailHtml({ name: firstName, formType }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Handler: Download file from R2
async function handleDownload(request, env, corsHeaders) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400, headers: corsHeaders });
  }

  try {
    const { key, fileName, expiry } = JSON.parse(atob(token));

    // Check expiry
    if (Date.now() > expiry) {
      return new Response("Download link has expired", {
        status: 410,
        headers: corsHeaders,
      });
    }

    // Get file from R2
    const object = await env.UPLOADS.get(key);

    if (!object) {
      return new Response("File not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Return file with appropriate headers
    const headers = new Headers();
    headers.set(
      "Content-Type",
      object.httpMetadata?.contentType || "application/octet-stream",
    );
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set("Content-Length", object.size);

    return new Response(object.body, { headers });
  } catch (e) {
    return new Response("Invalid token", { status: 400, headers: corsHeaders });
  }
}

// Send email via Resend
async function sendEmail(env, { to, from, replyTo, subject, html }) {
  const body = {
    from,
    to,
    subject,
    html,
  };

  if (replyTo) {
    body.reply_to = replyTo;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}
