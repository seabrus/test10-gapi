// On the base of https://github.com/OlehZymnytskiy/foursquare/

var fs_config = {
  id: 'NORNA12X40YUTDQXZYGPKRR0X1HM4KFWC1J0JSDFJ31DQOE1',
  secret: 'HBIYOBSJPVDTZ03MNPKUBD2VNY5F3JDGTSMXKBQ1T222UBXG',
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
      throw new Meteor.Error('no-ll-near-params', errorMessage);
    }

    if (config.ll) {
      check(config.ll, String);
    }
    if (config.near) {
      check(config.near, String);
    }

    var query = {
      client_id: fs_config.id,
      client_secret: fs_config.secret,
      v: 20140801
    };

    _.extend(config, query);

    try {
      var result = HTTP.get('https://api.foursquare.com/v2/venues/search', {
        params: config,
        timeout: 20000
      });
    } 
    catch(e) {
      throw new Meteor.Error('Foursquare search error', 'Foursquare search error');
    }

    return result.data;
  }
});
