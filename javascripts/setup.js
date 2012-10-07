Setup = {
  init: function() {
    var stage = "http://scmanifesto-stage.herokuapp.com/";
    var local = "http://localhost:3000/";
    var url   = stage;

    $.postJSON = function(path, data) {
      return $.ajax({
        url: url + path,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json; charset=UTF-8",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("accept", "application/json");
        }
      });
    }

    $.fetchJSON = function(path) {
      return $.ajax({
        url: url + path,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("accept", "application/json");
        }
      });
    };

    $.fetchStaticJSON = function(path) {
      return $.ajax({
        url: path,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("accept", "application/json");
        }
      });
    };
  }
}
