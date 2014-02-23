$(document).ready(function() {
  Setup.init();
  Partials.init();
  Manifesto.init();

  YUI().use('router', function (Y) {
    var router = new Y.Router({
      html5: false,
      root : '/',

      routes: [
        { path: '/', callbacks: function (request) { Manifesto.translate("en"); }},
        { path: '/:locale', callbacks: function (request) { Manifesto.translate(request.params.locale); }},
        { path: '/:locale/reading', callbacks: function (request) { Manifesto.toggleReading(); }},
        { path: '/:locale/sign', callbacks: function (request) { Manifesto.toggleSignForm(); }},
        { path: '/:lang/confirmation/:id', callbacks: function (request) { Manifesto.confirmation(request.params); }}
      ]
    });

    if (router.get('html5')) {
      router.upgrade();
    } else {
      router.dispatch();
    }
  });
});
