// AIzaSyBf-IjT8bV8XgVG_xl2B6U6DZA58l1GICI
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // S(lat), W(lng) are negative coordinates
    center: {lat: 36.9914, lng: -122.0609},
    zoom: 15
  });

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
    },
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
}
