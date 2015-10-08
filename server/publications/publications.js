Meteor.publish( 'venueQueries', function () {
  if (this.userId) {
    return VenueQueries.find({'ownerId': this.userId}, {fields: {ownerId: 0}});
  }

  this.ready();
  return;
});

