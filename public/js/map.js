
document.addEventListener("DOMContentLoaded", function () {
  if (typeof L === "undefined") {
    console.error("Leaflet not loaded");
    return;
  }

  if (!window.listing || !window.listing.geometry || !window.listing.geometry.coordinates) {
    console.error("Listing data missing or coordinates not provided");
    return;
  }

  const [lng, lat] = window.listing.geometry.coordinates;

  const map = L.map("map", {
    center: [lat, lng],
    zoom: 23,
  });

  // Free OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Marker with popup
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${window.listing.title}</b><br>₹${window.listing.price?.toLocaleString("en-IN") || ""}`)
    .openPopup();

  // Fix map rendering if container size changes
  setTimeout(() => {
    map.invalidateSize();
    map.setView([lat, lng], 13);
  }, 500);
});
