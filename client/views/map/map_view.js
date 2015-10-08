// ================================================
//   Events
// ================================================
var venuesArray = [];
var markersArray = [];

Template.mapView.events({
  'keypress #venue-query': function(e) {
    if(e.keyCode === 13) {
      $('#loading-gif').css('display', 'inline');
      Session.set('newVenues', false);
      
      var queryData = {};
      var queryRadius = 0;
      var venueInfo = {};
      venuesArray = [];

      var marker = null;
      if (markersArray.length !== 0) {
		  markersArray.forEach(function(marker) {
			marker.setMap(null);  
		  });
		  markersArray.length = 0;
	  }
            
      var ll = GoogleMaps.maps.mainMap.instance.getCenter();
      var fsParams = {
        ll: '' +  ll.lat() + ', ' + ll.lng(),
        query: $('#venue-query').val(),
      };

      Meteor.call('foursquareSearch', fsParams, function(error, result) {
        if(!error) {

          if(result.response.venues.length === 0) {
            console.log('Foursquare found nothing');
            alert('Foursquare found nothing, sorry');
          }
          else {
            venuesData = result.response.venues;
            venuesData.forEach(function(venue, index) {
              var venueName = venue.name;
              var venueCity = venue.location.city || 'n/a';
              var venueStreetAddress = venue.location.address || 'n/a';
              var venueLat = venue.location.lat;
              var venueLng = venue.location.lng;
              var venueDistance = venue.location.distance || 0;

              queryRadius = Math.max(queryRadius, venueDistance);

            // Add markers on the map
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(venueLat, venueLng),
                map: GoogleMaps.maps.mainMap.instance,
                title: venueName
              });
              markersArray.push(marker);

            // Create venues array for possible export
              venueInfo = {
                name: venueName,
                city: venueCity,
                street: venueStreetAddress,
                lat: venueLat,
                lng: venueLng,
              };
              venuesArray.push(venueInfo);
            });

            // Store this query in DB
            queryData = {query: fsParams.query, latitude: ll.lat(), longitude: ll.lng(), radius: queryRadius};
            VenueQueries.insert(queryData, function(e, r) { if(e) console.log('error = ' + e); });

            $('#loading-gif').css('display', 'none');
            Session.set('newVenues', true);
            console.log( 'queryRadius = ' + queryRadius);
          }
          
        }   // end of "if(!error)..."
      });   // end of "Meteor.call('foursquare-search'..."

    } // end of "if(e.keyCode === 13)..."
  },

});


// ================================================
//   Initialization
// ================================================
Template.mapView.onCreated(function() {
  GoogleMaps.ready('mainMap', function(map) {
/*
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
*/
  });

});


// ================================================
//   Helpers
// ================================================
Template.mapView.helpers({
  prevQueries: function() {
    return VenueQueries.find({});
  },

  mainMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(35.6833, 139.6833),   // Tokyo coordinates
        zoom: 10
      };
    }
  },

  venues: function() {
	if(Session.get('newVenues')) {
      return venuesArray;
    }
    return [];
  },

});
