(function () {
  "use strict";

  // Configuration - Update this after deploying the worker
  const WORKER_URL = "https://nova-sei-worker.dustinwdev.workers.dev";
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ["pdf", "docx", "pages"];

  // DOM Elements
  const form = document.getElementById("contact-form");
  const formTypeSelect = document.getElementById("form-type");
  const quoteFields = document.getElementById("quote-fields");
  const serviceSelect = document.getElementById("service");
  const fileInput = document.getElementById("file");
  const messageLabel = document.getElementById("message-label");
  const quoteHint = document.querySelector(".quote-hint");
  const submitBtn = document.getElementById("submit-btn");
  const loadingDiv = document.getElementById("form-loading");
  const loadingText = document.getElementById("loading-text");
  const responseTime = document.getElementById("response-time");

  if (!form) return;

  // Function to update form based on type selection
  function updateFormType(isQuote) {
    quoteFields.hidden = !isQuote;
    quoteHint.hidden = !isQuote;
    serviceSelect.required = isQuote;
    messageLabel.textContent = isQuote ? "Project Details" : "Message";
    responseTime.textContent = isQuote
      ? "Expected response: 2-5 business days"
      : "Expected response: 1-3 business days";
  }

  // Check initial state on page load (handles browser remembering selection)
  updateFormType(formTypeSelect.value === "quote");

  // Toggle quote fields visibility on change
  formTypeSelect.addEventListener("change", function () {
    const isQuote = this.value === "quote";
    updateFormType(isQuote);

    // Reset quote-specific fields when switching to General Inquiry
    if (!isQuote) {
      serviceSelect.value = "";
      fileInput.value = "";
    }
  });

  // File validation on selection
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be under 10MB. Please choose a smaller file.");
      this.value = "";
      return;
    }

    // Validate extension
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert("Only .pdf, .docx, and .pages files are accepted.");
      this.value = "";
    }
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot check
    if (form.querySelector('[name="accept_terms"]').checked) {
      return;
    }

    // Disable form
    submitBtn.disabled = true;
    submitBtn.hidden = true;
    loadingDiv.hidden = false;

    try {
      const file = fileInput.files[0];
      let fileKey = null;

      // If file exists, upload to R2
      if (file) {
        loadingText.textContent = "Uploading file...";

        // Step 1: Get upload key from worker
        const keyResponse = await fetch(`${WORKER_URL}/api/get-upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            size: file.size,
          }),
        });

        if (!keyResponse.ok) {
          const error = await keyResponse.json();
          throw new Error(error.error || "Failed to prepare upload");
        }

        const { key } = await keyResponse.json();
        fileKey = key;

        // Step 2: Upload file to worker
        const uploadResponse = await fetch(
          `${WORKER_URL}/api/upload?key=${encodeURIComponent(key)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
          },
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }
      }

      // Step 3: Submit form data
      loadingText.textContent = "Sending message...";

      const submitData = {
        formType: formTypeSelect.value,
        firstName: form.querySelector("#first-name").value,
        lastName: form.querySelector("#last-name").value,
        email: form.querySelector("#email").value,
        message: form.querySelector("#message").value,
        service: serviceSelect.value || null,
        fileKey: fileKey,
        fileName: file ? file.name : null,
      };

      const submitResponse = await fetch(`${WORKER_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (submitResponse.ok) {
        window.location.href = "/success";
      } else {
        const error = await submitResponse.json();
        throw new Error(error.error || "Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        "There was an error submitting your form. Please try again or contact us directly.",
      );

      // Re-enable form
      submitBtn.disabled = false;
      submitBtn.hidden = false;
      loadingDiv.hidden = true;
    }
  });
})();
