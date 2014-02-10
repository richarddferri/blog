# For more information see: http://emberjs.com/guides/routing/
App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.reopen({
  rootURL: '/home'
});

