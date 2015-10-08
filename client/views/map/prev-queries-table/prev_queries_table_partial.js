// =====================================
//   Events
// =====================================
Template.prevQueriesTablePartial.events({
  'click #queries-table': function (e) {
    e.preventDefault();
    var clickedElement = $(e.target);
    var docID = clickedElement.parents('tr').data('doc-id');

    if (clickedElement.is('.delete-btn')) {
      if (confirm('Are you sure?')) {
        VenueQueries.remove({ '_id' : docID});
      }
    }
  }
});

// =====================================
//   Helpers
// =====================================
Template.prevQueriesTablePartial.helpers({
  formatNumber: function(n) {
    return n.toFixed(4);
  },
  
  formatRadius: function(n) {
    var nKm = (n / 1000).toFixed(2);
    return nKm + 'km';
  },
  
  formatDate: function(d) {
    return d.toString().slice(4, 11) + d.toString().slice(16, 21);
  }, 
});
