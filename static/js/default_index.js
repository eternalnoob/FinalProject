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
        var marker = new google.maps.Marker({
            position: event.position,
            map: map
        });
        console.log(marker);
        return marker;
    };

    self.auto_refresh = function () {
        setInterval(
            self.load_events, 10000
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
            markers: []
        },
        methods: {
            get_more: self.get_more
        }

    });

    self.load_events(); //first load
    self.auto_refresh(); //set to refresh page so we see all events

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
