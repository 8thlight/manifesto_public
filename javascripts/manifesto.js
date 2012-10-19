var Manifesto = {
  init: function() {
    $('#content').hide();

    Manifesto.fetchSignatories(1);
    Manifesto.translate("en");
    Manifesto.switchLocale();
  },

  translate: function(lang) {
    Transitions.before(function() {
      $('div#sign, div#reading, div#message').hide();

      $.fetchStaticJSON("jsons/reading/" + lang + ".json").done(function(response) {
        $('div#reading').html(Partials.renderReading(response));
      });

      $.fetchStaticJSON("jsons/sign/" + lang + ".json").done(function(response) {
        $('div#sign').html(Partials.renderSign(response));
      });

      $.fetchStaticJSON("jsons/manifesto/" + lang + ".json").done(function(response) {
        $('html').attr('lang', lang);
        $('title').html(response.title);
        $('#heading_title').attr('href', 'api.html#' + lang);
        Manifesto.fetchContent(response);
        $('#content_top, #manifesto, #signatory-table, #footer').show();

        Transitions.after(function() {
          Manifesto.toggleSignForm();
          Manifesto.toggleReading();
          Manifesto.toggleHeading();
          Manifesto.bindSignButton(lang);
          Transitions.infiniteScroll(function() {
            Manifesto.fetchMoreSignatories();
          });
        });
      });
    });
  },

  signatureFormJSON: function() {
    return {
      "sign": {
        "name": $('#signatory_name').val(),
        "email": $('#signatory_email').val(),
        "location": $('#signatory_location').val()
      }
    }
  },

  bindSignButton: function(lang) {
    $('#sign-button').on('click', function() {
      $.postJSON(lang + '/sign/sign', Manifesto.signatureFormJSON()).done(function(response) {
        if (response.success) {
          Transitions.before(function() {
            $.fetchStaticJSON("jsons/sign/" + lang + ".json").done(function(response) {
              var confirmation = response.confirmation;
              confirmation.signatory_email = $('#signatory_email').val();
              $('#message').html(Partials.renderConfirmation(confirmation));
              $('#message').show();
              $('#sign').hide();
              Transitions.after();
            });
          });
        } else {
          Transitions.before(function() {
            var errors = response.errors;
            $.fetchStaticJSON("jsons/sign/" + lang + ".json").done(function(response) {
              response.errors = errors;
              $('#signature-form-errors').html(Partials.renderSignatureErrors(response));
              Transitions.after();
            });
          });
        }
      });
    });
  },

  fetchContent: function(content) {
    $('#content_top').html(Partials.renderContentTop(content));
    $('#manifesto').html(Partials.renderManifesto(content));
    $('#footer').html(Partials.renderFooter(content));
  },

  fetchMoreSignatories: function() {
    var page = $('#signatory-table').data('id') + 1;
    $('#signatory-table').data('id', page);
    Manifesto.fetchSignatories(page);
  },

  fetchSignatories: function(page) {
    $.fetchJSON("signatories?page=" + page).done(function(signatories) {
      var rows = '';
      $.each(signatories, function(index) {
        var order = index % 3;
        if (order == 0) { rows = rows + "<tr>"; }
        var signatory = signatories[index];
        rows = rows + "<td>" + signatory.name + " (" + signatory.location + ")" + "</td>";
        if (order == 2) { rows = rows + "</tr>"; }
      });
      $('#signatory-table').append(rows);
    });
  },

  switchLocale: function() {
    $('a#en, a#zh-cn, a#es').on('click', function() {
      Manifesto.translate($(this).attr('id'));
    });
  },

  toggleSignForm: function() {
    $('a#sign').bind('click', function() {
      Transitions.before(function() {
        $('#signatory-table, #manifesto, div#reading').hide();
        $('div#sign').show();
        Transitions.after();
      });

      Transitions.infiniteUnscroll();
    });
  },

  toggleReading: function() {
    $('a#reading').bind('click', function() {
      Transitions.before(function() {
        $('#signatory-table, #manifesto, div#sign').hide();
        $('div#reading').show();
        Transitions.after();
      });

      Transitions.infiniteUnscroll();
    });
  },

  toggleHeading: function() {
    $('.heading_title').on('click', function() {
      Transitions.before(function() {
        $('div#sign, div#reading, div#message').hide();
        $('#signatory-table, #manifesto').show();

        Transitions.after(function() {
          Transitions.infiniteScroll(function() {
            Manifesto.fetchMoreSignatories();
          });
        });
      });
    });
  }
}
