Setup = {
  init: function() {
    var stage = "http://scmanifesto-staging.8thlight.com/";
    var production = "http://manifesto.softwarecraftsmanship.org/";
    var local = "http://localhost:3000/";
    var url   = production;

    $.ajaxSetup({
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("accept", "application/json");
      }
    });

    $.postJSON = function(path, data) {
      return $.ajax({
        url: url + path,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=UTF-8"
      });
    }

    $.fetchJSON = function(path) {
      return $.ajax({
        url: url + path,
        type: "GET",
        contentType: "application/json; charset=UTF-8"
      });
    };

    $.fetchStaticJSON = function(path) {
      return $.ajax({
        url: path,
        type: "GET",
        contentType: "application/json; charset=UTF-8"
      });
    };
  }
}
