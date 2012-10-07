Setup = {
  init: function() {
    var stage = "http://scmanifesto-stage.herokuapp.com/";
    var local = "http://localhost:3000/";
    var url   = stage;

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
