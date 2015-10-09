HomeController = Iron.RouteController.extend({
  template: 'homeView',

  action: function() {
    if (this.ready()) {
      this.render();
    }
  }

});
