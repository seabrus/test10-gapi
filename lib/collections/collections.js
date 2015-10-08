// ================================================
//  Collections
// ================================================
VenueQueries = new Mongo.Collection('venueQueries');

// ================================================
//  Schemas
// ================================================
var VenueQuerySchema = new SimpleSchema({
  ownerId: {
    type: String,
    denyUpdate: true,
    autoValue: function() {
      if (!this.isSet) {
        return this.userId;
      }
    }
  },

  query: {
    type: String,
    autoValue: function() {
      if (!this.isSet) {
        return 'n/a';
      }
    }
  },

  latitude: {
    type: Number,
    decimal: true,
    autoValue: function() {
      if (!this.isSet) {
        return 0;
      }
    }
  },

  longitude: {
    type: Number,
    decimal: true,
    autoValue: function() {
      if (!this.isSet) {
        return 0;
      }
    }
  },

  radius: {
    type: Number,
    decimal: true,
    autoValue: function() {
      if (!this.isSet) {
        return 0;
      }
    }
  },

  date: {
    type: Date,
    autoValue: function() {
      if ( !this.isSet ) {
        return new Date();
      }
    }
  },

});

VenueQueries.attachSchema(VenueQuerySchema);
