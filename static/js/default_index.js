// This is the js for the default/index.html view.
var app = function() {
    var self = {};
    Vue.config.silent = false; // show all warnings


    make_marker_dict = function(event) {
        return {
            lat: event.lat,
            lng: event.lng,
            infoWindow: {
                content: event.infobox_content
            },
            icon: event.marker_url,
            title: event.title
        };
    };


    self.add_to_map = function(event) {
        self.vue.map.addMarker(make_marker_dict(event));
    };


    self.add_event_marker = function(latt, long, title, desc) {
        var date = new Date();
        var date_string = date.toISOString();

        $.post(addEventUrl,
            {
                latitude   : latt,
                longitude  : long,
                title      : '<p>'+title+'</p>',
                description: '<p>'+desc+'</p>',
                date       : date_string
            },
            function(data) {
                self.add_to_map(data);
            }
        )
    };


    self.initmap = function() {
        self.vue.map = new GMaps({
            el : '#map',
            lat: 36.9914,
            lng: -122.0609
        });

    };


    self.load_events = function() {
        $.get(getMarkerUrl, function(data) {
            if (self.vue.events != data.events){
                self.vue.map.removeMarkers();
                self.vue.events = data.events;
                self.show_events();
            }
        })
    };


    self.show_events = function() {
        self.vue.map.addMarkers(self.vue.events.map(make_marker_dict));
    };


    self.auto_refresh = function () {
        setInterval(self.load_events, 10000)
    };


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more  : false,
            page      : 'event_view',
            events    : [],
            markers   : [],
            latt      : 36.99,
            long      : -122.05,
            title     : '',
            desc      : '',
            map       : null
        },
        methods: {
            get_more        : self.get_more,
            initmap         : self.initmap,
            add_event_marker: self.add_event_marker,
            map             : self.map,
            logMap          : self.logMap
        }

    });

    self.initmap(); // googleializes the map on reload
    self.load_events(); //first load
    self.auto_refresh(); //set to refresh page so we see all events
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
