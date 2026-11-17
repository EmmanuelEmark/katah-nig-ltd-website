
// EMMIMEH NIG. LTD. WhatsApp number.
// Use the country code without the leading + sign.
const EMMIMEH_WHATSAPP_NUMBER = "2348037093759";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("supplyEnquiryForm");

  // Stop safely if this script runs on a page without the supply form.
  if (!form) {
    return;
  }

  const categoryField = document.getElementById("category");
  const detailsField = document.getElementById("details");
  const quantityField = document.getElementById("quantity");
  const locationField = document.getElementById("location");
  const errorMessage = document.getElementById("formError");
  const submitButton = form.querySelector('button[type="submit"]');

  // Display the current year if the page contains this element.
  const yearElement = document.querySelector("[data-year]");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Clicking a product enquiry button selects its category.
  const categoryButtons = document.querySelectorAll("[data-category]");

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      categoryField.value = button.dataset.category;

      // Move the visitor to the enquiry form.
      const enquirySection = document.getElementById("enquiry");

      if (enquirySection) {
        enquirySection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      // Put the cursor in the materials description field.
      window.setTimeout(function () {
        detailsField.focus({ preventScroll: true });
      }, 500);

      // Clear any previous validation message.
      if (errorMessage) {
        errorMessage.textContent = "";
      }
    });
  });

  // Remove the error message when the visitor corrects the form.
  [categoryField, detailsField].forEach(function (field) {
    field.addEventListener("input", function () {
      if (errorMessage) {
        errorMessage.textContent = "";
      }
    });

    field.addEventListener("change", function () {
      if (errorMessage) {
        errorMessage.textContent = "";
      }
    });
  });

  // Prepare the enquiry and open WhatsApp.
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (errorMessage) {
      errorMessage.textContent = "";
    }

    const category = categoryField.value.trim();
    const details = detailsField.value.trim();
    const quantity = quantityField.value.trim();
    const location = locationField.value.trim();

    if (!category) {
      if (errorMessage) {
        errorMessage.textContent =
          "Please select the electrical material category.";
      }

      categoryField.focus();
      return;
    }

    if (!details) {
      if (errorMessage) {
        errorMessage.textContent =
          "Please describe the electrical materials you need.";
      }

      detailsField.focus();
      return;
    }

    const message = [
      "Hello EMMIMEH NIG. LTD.,",
      "",
      "I would like to enquire about electrical materials.",
      "",
      "Material category: " + category,
      "Requirements: " + details,
      "Quantity required: " + (quantity || "Not specified"),
      "Delivery location: " + (location || "Not specified"),
      "",
      "Please review my requirements and provide a quotation.",
      "Thank you."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" +
      EMMIMEH_WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    // Open WhatsApp in a new tab.
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    // Fallback if the browser blocks the new tab.
    if (!whatsappWindow) {
      window.location.href = whatsappURL;
    }
  });
});
