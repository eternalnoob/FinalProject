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

    self.first_load = function () {
        self.load_events();
        $(function () {
            $('#datetimepicker1').datetimepicker();
        });
        $("#vue-div").show();
    };

    make_infobox = function(event) {
        template = '<p>test</p>'
    };

    make_marker_dict = function(event) {
        return {
            lat: event.lat,
            lng: event.lng,
            desc: event.description,
            infoWindow: {
                content: event.infobox_content
            },
            icon: event.marker_url
        };
        //console.log(event);
    };

    make_feedback = function(id, bool){
        console.log(bool);
        $.post(
            feedbackUrl,
            {
                event_id: id,
                isreal: bool
            },
            function(data){
                console.log(data);
                console.log("huh");
                self.load_events();
            }
        )
    };


    self.fire = function(id){
        console.log("FIRE");
        console.log("WE STARTED THE FIRE AT" + id.toString());
        /*is googoo*/
        make_feedback(id, true);
    };
    self.del =  function(id) {
        console.log("NOFIRE");
        console.log("WE STOPPED THE FIRE AT" + id.toString());
        /* is poopoo*/
        make_feedback(id, false);
    };


    self.add_to_map = function(event) {
        // addMarker is a Gmaps method
        self.vue.map.addMarker(make_marker_dict(event));
    };


    self.add_event_marker = function(latt, long, title, desc) {
        var moment = $('#datetimepicker1').data("DateTimePicker").date();
        $.post(addEventUrl,
            {
                latitude: latt,
                longitude: long,
                title: '<h5>'+title+'</h5>',
                description: '<p>' + desc+'</p>',
                date: moment.utc().format('YYYY-MM-DDTHH:mm:ss')
            },
            function(data) {
                self.add_to_map(data);
                console.log(data);
            })
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


    // Complete as needed.
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
            initmap         : self.initmap,
            add_event_marker: self.add_event_marker,
            fire: self.fire,
            del: self.del
        }

    });

    self.initmap(); // googleializes the map on reload
    self.first_load();
    self.auto_refresh(); //set to refresh page so we see all events

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
