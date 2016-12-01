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

    self.show_events = function() {
        self.vue.map.addMarkers(self.vue.events.map(make_marker_dict));
    };

    self.auto_refresh = function () {
        setInterval(
            self.load_events, 30000
        )
    };

    self.initmap = function() {
        self.vue.map = new GMaps({
            el: '#map',
            lat: 36.9914,
            lng: -122.0609
        });
        test = self.vue.map;
        self.vue.map.setContextMenu({
            control: 'map',
            options:[{
                title: 'Add marker',
                name: 'add_marker',
                action: function (e) {
                    this.addMarker({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                        title: 'New marker'
                    });
                }
            }
            ]
        })
        test.addControl({
            position: 'top_center',
            content: 'Geolocate',
            style: {
                margin: '5px',
                padding: '1px 6px',
                border: 'solid 1px #717B87',
                background: '#fff'
            },
            events: {
                click: function(){
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            test.setCenter(pos);
                        }, function() {
                            alert('Your browser is old AF!');
                        });
                    }
                }
            }
        });
    };

    self.first_load = function () {
        self.load_events();
        $(function () {
            $('#datetimepicker1').datetimepicker({
                //don't let them set times less than right now
                minDate: moment(),
                //don't plan ahead too much, either, that's bad
                maxDate: moment().add(15, 'days')
            });
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
            title: event.title,
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


    self.add_event_marker = function(address, title, desc) {
        var moment = $('#datetimepicker1').data("DateTimePicker").date();
        console.log(moment);
        if(address == '' || title == '' || desc == '' || moment == null){

        }
        else{
            GMaps.geocode({
                address: address.trim(),
                callback: function(results, status) {
                    var latlng = results[0].geometry.location;
                    console.log(latlng);
                    $.post(addEventUrl,
                        {
                            latitude: latlng.lat(),
                            longitude: latlng.lng(),
                            title: title,
                            description: desc,
                            date: moment.utc().format('YYYY-MM-DDTHH:mm:ss')
                        },
                        function(data) {
                            self.add_to_map(data);
                            console.log(data);
                        })
                }
            });
        }
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

    self.check_login = function() {
        $.get(checkLoginUrl,
            function(data){
                self.vue.islogged = data.islogged;
            }
        );
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            islogged  : false,
            page      : 'event_view',
            events    : [],
            markers   : [],
            addr      : '',
            latt      : null,
            long      : null,
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

    self.check_login();
    self.initmap(); // googleializes the map on reload
    self.first_load();
    self.auto_refresh(); //set to refresh page so we see all events

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
