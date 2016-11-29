// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.load_events = function() {
        $.get(
            getMarkerUrl,
            function(data) {
                if (self.vue.events != data.events){
                    self.clear_events;
                    self.vue.events = data.events;
                    self.show_events();
                }
            }
        )
    };

    self.clear_events = function() {
        for(var i = 0; i < self.vue.markers.length; i++) {
            self.vue.markers[i].setVisible(false);
            self.vue.markers = [];
            self.vue.events = [];
        }
    };

    self.show_events = function() {
        self.vue.markers = self.vue.events.map(self.make_marker);
    };

    self.make_marker = function(event) {
        var infoWindow = new google.maps.InfoWindow({
            content: event.infobox_content
        });

        var marker = new google.maps.Marker({
            position: event.position,
            map: map
        });
        marker.addListener('click', function(){
            infoWindow.open(map, marker);
        });
        console.log(marker);
        return marker;
    };

    self.auto_refresh = function () {
        setInterval(
            self.load_events, 10000
        )
    };



    /*self.googleMap = {


        init: function () {
            var map = new google.maps.Map(document.getElementById('map'), {
                // S(lat), W(lng) are negative coordinates
                center: {lat: 36.9914, lng: -122.0609},
                zoom: 15
            });
            return map;
            console.log(map);

        };

        addMarker: function() {

        }
    };*/

    self.initMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            // S(lat), W(lng) are negative coordinates
            center: {lat: 36.9914, lng: -122.0609},
            zoom: 15
        });
        return map;
    }

    /*self.googleMap = new google.maps.Map(document.getElementById('map'), {
        // S(lat), W(lng) are negative coordinates
        center: {lat: 36.9914, lng: -122.0609},
        zoom: 15
    });


    self.addMarker = function() {
        var marker = new google.maps.Marker({
            position: {lat: 36.9914, lng: -122.0609},
            map: self.googleMap,
            title: 'Hello World!'
        });

        marker.setMap(self.googleMap);
    }*/



    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            page: 'event_view',
            events: [],
            markers: [],
            googleMap: self.googleMap
        },
        methods: {
            get_more: self.get_more,
            initMap: self.initMap,
            addMarker: self.addMarker
        }

    });

    self.load_events(); //first load
    self.auto_refresh(); //set to refresh page so we see all events
    self.initMap(); // googleializes the map on reload


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
