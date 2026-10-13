const trackingRecords = {
  "WT-2048": { status: "Delivered", detail: "Demo parcel delivered to the recipient. This is illustrative sample data.", step: "Completed" },
  "WT-2050": { status: "In transit", detail: "Demo parcel is moving through the next delivery hub. This is illustrative sample data.", step: "On the move" }
};

const trackingForm = document.querySelector("#tracking-form");
const trackingInput = document.querySelector("#tracking-number");
const trackingResult = document.querySelector("#tracking-result");
const yearElement = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (yearElement) yearElement.textContent = String(new Date().getFullYear());

trackingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const reference = trackingInput?.value.trim().toUpperCase() ?? "";
  if (!trackingResult) return;

  trackingResult.replaceChildren();
  trackingResult.classList.remove("is-error");
  const record = trackingRecords[reference];

  const title = document.createElement("strong");
  const description = document.createElement("p");
  if (!/^WT-[0-9]{4}$/.test(reference) || !record) {
    title.textContent = "No demo shipment found";
    description.textContent = "Use WT-2048 or WT-2050 to preview this local tracking interaction.";
    trackingResult.classList.add("is-error");
  } else {
    title.textContent = `${record.status} · ${reference}`;
    description.textContent = record.detail;
  }
  trackingResult.append(title, description);
});

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navigation?.classList.toggle("is-open", !expanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
