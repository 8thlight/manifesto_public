Setup = {
  init: function() {
    var stage = "http://scmanifesto-staging.8thlight.com/";
    var production = "http://manifesto.softwarecraftsmanship.org/";
    var local = "http://localhost:3000/";
    var relative = "/"
    var url   = relative;
    var cacheBuster = "?cb=36883dd9266990027bcb3588d905bfa4380bc738";

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
        url: path + cacheBuster,
        type: "GET",
        contentType: "application/json; charset=UTF-8"
      });
    };
  }
}
