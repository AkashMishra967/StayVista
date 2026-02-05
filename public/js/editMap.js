document.addEventListener("DOMContentLoaded", () => {

  if (!window.listing.geometry) return;

  const [lng, lat] = window.listing.geometry.coordinates;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  const marker = L.marker([lat, lng], {
    draggable: true
  }).addTo(map);

  // hidden input initial value
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;

  // marker drag
  marker.on("dragend", function (e) {
    const { lat, lng } = e.target.getLatLng();
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
  });

  // map click
  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    document.getElementById("lat").value = e.latlng.lat;
    document.getElementById("lng").value = e.latlng.lng;
  });
});
