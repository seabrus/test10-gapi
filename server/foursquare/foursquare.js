// On the base of https://github.com/OlehZymnytskiy/foursquare/
var fs_auth = {
  client_id: 'NORNA12X40YUTDQXZYGPKRR0X1HM4KFWC1J0JSDFJ31DQOE1',
  client_secret: 'HBIYOBSJPVDTZ03MNPKUBD2VNY5F3JDGTSMXKBQ1T222UBXG',
  v: 20140801
};

Meteor.methods({
  foursquareSearch: function(config) {
    if(!this.userId) {
      console.log('ATTENTION: Attempt of unauthorized access!');
      throw new Meteor.Error('no-access', 'Server failed');
    }

    check(config, Object);
    check(config.query, String);
    
    if (!config.ll && !config.near) {
      var errorMessage = "Please specify either 'll' or 'near' in the Foursqaure params";
      console.log(errorMessage);
      throw new Meteor.Error('no-ll-or-near-param', errorMessage);
    }

    if (config.ll) {
      check(config.ll, String);
    } else {
      check(config.near, String);
    }

    _.extend(config, fs_auth);

    try {
      var result = HTTP.get('https://api.foursquare.com/v2/venues/search', {
        params: config,
        timeout: 20000
      });
    } 
    catch(e) {
      throw new Meteor.Error('fs-search-error', 'Error: Foursquare venues search failed');
    }

    return result.data;
  }
});
