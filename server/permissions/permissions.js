var userIsCorrect = function(userId, doc) {
  return !!userId;
};
var ownsDoc = function(userId, doc) {
  return (doc  &&  doc.ownerId === userId);
};

VenueQueries.allow({
  insert: userIsCorrect,
  update: ownsDoc,
  remove:  ownsDoc,
  fetch: ['ownerId']
});
