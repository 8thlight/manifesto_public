Router = {
  init: function() {
    var AppRouter = Backbone.Router.extend({
      routes: {
        ":lang/confirmation/:id": "confirmation",
        ":locale/metrics":        "metrics",
        ":locale/sign":           "sign",
        ":locale/reading":        "reading",
        ":locale":                "localized_root",
        "":                       "root"
      }
    });

    var router = new AppRouter();

    router.on("route:confirmation", function(lang, id) {
      Manifesto.confirmation({ lang: lang, id: id });
    });

    router.on("route:metrics", function(locale) {
      Manifesto.toggleMetrics(locale);
    });

    router.on("route:sign", function() {
      Manifesto.toggleSignForm();
    });

    router.on("route:reading", function() {
      Manifesto.toggleReading();
    });

    router.on("route:localized_root", function(locale) {
      Manifesto.translate(locale);
    });

    router.on("route:root", function() {
      Manifesto.translate("en");
    });

    Backbone.history.start();
  }
}

