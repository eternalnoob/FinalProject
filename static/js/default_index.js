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
                    self.vue.map.removeMarkers();
                    self.vue.events = data.events;
                    self.show_events();
                }
            }
        )
    };

    self.show_events = function() {
        self.vue.map.addMarkers(self.vue.events.map(make_marker_dict));
    };

    self.auto_refresh = function () {
        setInterval(
            self.load_events, 10000
        )
    };

    self.initmap = function() {
        self.vue.map = new GMaps({
            el: '#map',
            lat: 36.9914,
            lng: -122.0609
        });

    };

    make_marker_dict = function(event) {
        return {
            lat: event.lat,
            lng: event.lng,
            infoWindow: {
                content: event.infobox_content
            },
            title: event.title
        };
    };

    self.add_to_map = function(event) {
        self.vue.map.addMarker(make_marker_dict(event));
    };

    self.addMarker = function(latt, long) {
        var date = new Date();
        var muhstring = date.toISOString();
        console.log(map);
        $.post(addEventUrl,
            {
                latitude: latt,
                longitude: long,
                title: 'BOW BOW BOW BOW BOW BOW',
                description: 'BAZINGA',
                date: muhstring
            },
            function(data) {
                self.add_to_map(data);
                console.log("AWW YUS");
            }
            )
    };


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
            latt: 0,
            long: 0,
            map: null
        },
        methods: {
            get_more: self.get_more,
            initmap: self.initmap,
            addMarker: self.addMarker,
            map: self.map,
            logMap: self.logMap
        }

    });

    self.initmap(); // googleializes the map on reload
    self.load_events(); //first load
    self.auto_refresh(); //set to refresh page so we see all events
    //self.addMarker();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
