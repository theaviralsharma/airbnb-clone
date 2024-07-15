mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12',
center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 8 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker({color: 'red'})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p><b>Exact location provided after booking!<b></p>`))
.addTo(map);
