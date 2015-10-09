Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loadingView'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
});

Router.route('/map', {
  name: 'map',
  controller: 'MapController'
});

Router.onBeforeAction(function() {
  if (Meteor.loggingIn()) {
    this.render('loadingView');
  } else {
    this.next();
  }
});

Router.onBeforeAction(function () {
    if (!Meteor.user()) {
      this.redirect('home');
    } else {
      this.next();
    }
  },
  {except: ['home']}
);

Router.onBeforeAction(function() {
    GoogleMaps.load();
    this.next();
  },
  {only: ['map']}
);
