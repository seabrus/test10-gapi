// ================================================
//   Events
// ================================================
var venuesArray = [];
var markersArray = [];

Template.mapView.events({

  'keypress #venue-query': function(e) {
    if(e.keyCode === 13) {

      // Sanity check
      var venueQuery = $('#venue-query').val();
      if (!venueQuery || venueQuery.length < 2) {
        alert('Please type in a venue query (at least 2 letters)');
        return;
      }

      // Initialization
      $('#loading-gif').css('display', 'inline');
      Session.set('newVenues', false);

      var queryData = {};
      var queryRadius = 0;
      var venueInfo = {};
      venuesArray = [];

      var marker = null;
      if (markersArray.length !== 0) {
          markersArray.forEach(function(m) {
            m.setMap(null);
          });
          markersArray.length = 0;
      }

      // Prepare params for Foursquare search
      var ll = GoogleMaps.maps.mainMap.instance.getCenter();
      var fsParams = {
        ll: '' +  ll.lat() + ', ' + ll.lng(),
        query: venueQuery,
      };

      // Call Foursquare search
      Meteor.call('foursquareSearch', fsParams, function(error, result) {
        if(!error) {

          if(result.response.venues.length === 0) {
            $('#loading-gif').css('display', 'none');
            console.log('Foursquare found nothing');
            alert('Foursquare found nothing, sorry');
            return;
          }
          else {
            venuesData = result.response.venues;
            venuesData.forEach(function(venue, index) {
              var venueName = venue.name;
              var venueCity = venue.location.city || 'n/a';
              var venueStreetAddress = venue.location.address || 'n/a';
              var venueLat = venue.location.lat || 0;
              var venueLng = venue.location.lng || 0;
              var venueDistance = venue.location.distance || 0;

              // Query radius is equal to the maximum venue distance
              queryRadius = Math.max(queryRadius, venueDistance);

              // Add venue markers on the map
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(venueLat, venueLng),
                map: GoogleMaps.maps.mainMap.instance,
                title: venueName
              });
              markersArray.push(marker);

              // Create a venue array for possible export
              venueInfo = {
                name: venueName,
                city: venueCity,
                street: venueStreetAddress,
                lat: venueLat,
                lng: venueLng,
              };
              venuesArray.push(venueInfo);

            });   // end of "venuesData.forEach..."

            // Store this query in DB
            queryData = {query: venueQuery, latitude: ll.lat(), longitude: ll.lng(), radius: queryRadius};
            VenueQueries.insert(queryData, function(e, r) { if(e) console.log('error = ' + e); });

            // Finalize the process
            $('#loading-gif').css('display', 'none');
            Session.set('newVenues', true);
            console.log('queryRadius = ' + queryRadius);
            console.log('Foursquare search and processing was done successfully');
          }

        }   // end of "if(!error)..."
      });   // end of "Meteor.call('foursquare-search'..."

    } // end of "if(e.keyCode === 13)..."
  },


  'click .export-csv-btn': function(e) {
    e.preventDefault();

    var len = venuesArray.length;
    if (len === 0 ) {
      alert('No venues found yet');
      return;
	}

    var strCSV = 'Name,City,Street Address,Latitude,Longitude\n';
    for (var k = 0; k < len; k++) {
      strCSV += venuesArray[k].name + ',' + venuesArray[k].city + ',' + venuesArray[k].street + ',' + venuesArray[k].lat + ',' + 
      venuesArray[k].lng + '\n';
	}

    var blob = new Blob([strCSV], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, "venue-list.csv");
  },

});


// ================================================
//   Initialization
// ================================================
Template.mapView.onCreated(function() {
/*  GoogleMaps.ready('mainMap', function(map) {
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
*/
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
