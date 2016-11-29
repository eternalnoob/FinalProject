// AIzaSyBf-IjT8bV8XgVG_xl2B6U6DZA58l1GICI
var map; 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      // S(lat), W(lng) are negative coordinates
        center: {lat: 36.9914, lng: -122.0609},
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: {lat: 36.9914, lng: -122.0609},
        map: map,
        title: 'Hello World!'
    });

    marker.setMap(map);
}
