document.addEventListener("DOMContentLoaded", function () {
  if (!window.listing?.geometry?.coordinates) return;

  const [lng, lat] = window.listing.geometry.coordinates;

  const map = L.map("map", {
    center: [lat, lng],
    zoom: 13,
    scrollWheelZoom: false,
    tap: false, // 🔥 mobile fix
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      `<b>${window.listing.title}</b><br>₹${
        window.listing.price?.toLocaleString("en-IN") || ""
      }`
    );

  // 🔥 MOST IMPORTANT FIX FOR MOBILE
  setTimeout(() => {
    map.invalidateSize(true);
  }, 600);
});
