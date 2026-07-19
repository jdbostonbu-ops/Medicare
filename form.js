(function () {
  "use strict";

  // CHANGE-ME: paste your Zapier "Catch Hook" webhook URL here.
  // Zapier -> new Zap -> "Webhooks by Zapier" -> "Catch Hook" -> copy the URL.
  const WEBHOOK_URL = "PASTE_YOUR_ZAPIER_WEBHOOK_URL_HERE";

  const setup = function () {
    const form = document.getElementById("lead-form");
    const submitButton = document.getElementById("submit-btn");
    const errorMessage = document.getElementById("error-msg");
    const successPanel = document.getElementById("success");
    const consentBox = document.getElementById("consent");

    const readValue = function (id) {
      return document.getElementById(id).value.trim();
    };

    const showError = function (message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden");
    };

    const clearError = function () {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    };

    const collectLead = function () {
      return {
        first_name: readValue("first"),
        last_name: readValue("last"),
        phone: readValue("phone"),
        email: readValue("email"),
        street: readValue("street"),
        city: readValue("city"),
        state: readValue("state"),
        zip: readValue("zip"),
        consent_given: consentBox.checked,
        consent_text:
          "Requested contact from a licensed sales agent about Medicare options; understands info is provided to a licensed sales agent.",
        submitted_at: new Date().toISOString(),
        source: "CT Medicare landing page"
      };
    };

    const findProblem = function (lead) {
      if (!lead.first_name || !lead.last_name || !lead.phone || !lead.zip) {
        return "Please fill in your name, phone, and ZIP code.";
      }
      if (!lead.consent_given) {
        return "Please check the box to request a call.";
      }
      return "";
    };

    const sendLead = function (lead) {
      return fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
    };

    const onSent = function () {
      form.classList.add("hidden");
      successPanel.classList.remove("hidden");
    };

    const onFailed = function () {
      submitButton.disabled = false;
      submitButton.textContent = "Request a call";
      showError(
        "Something went wrong sending your request. Please try again, or call us directly."
      );
    };

    const handleSubmit = function (event) {
      event.preventDefault();
      clearError();

      const lead = collectLead();
      const problem = findProblem(lead);
      if (problem) {
        showError(problem);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending\u2026";
      sendLead(lead).then(onSent).catch(onFailed);
    };

    form.addEventListener("submit", handleSubmit);
  };

  document.addEventListener("DOMContentLoaded", setup);
})();
