MapController = Iron.RouteController.extend( {
  template: 'mapView',

  subscriptions: function() {
    return Meteor.subscribe('venueQueries');
  },

  action: function () {
    if (this.ready()) {
      this.render();
    } else {
      this.render('loadingView');
    }
  }

});
