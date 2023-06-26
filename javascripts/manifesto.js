var Manifesto = {
  init: function() {
    $('#content').hide();

    Manifesto.fetchSignatories(1);
  },

  confirmation: function(params) {
    var lang = params.lang;
    var id = params.id;
    var context = {};

    $.postJSON('sign/confirmation', {'id': id}).done(function(response) {
      if (response.success) {
        $.fetchStaticJSON("jsons/manifesto/" + lang + ".json").done(function(json) {
          Manifesto.fetchContent(json);

          $('html').attr('lang', lang);
          $('title').html(json.title);
          $('a.heading_title').attr('href', '#/' + lang);

          $.fetchStaticJSON("jsons/messages/" + lang + ".json").done(function(json) {
            context.name = response['name'];
            context.message = json['signatory_not_confirmed'];
            context.sign = json['sign'];
            context.decline = json['decline'];
            context.lang = lang;
            context.id = id;

            $('div#message').html(Partials.renderSignatureConfirm(context));

            $('a#confirm').on('click', function(event) {
              event.preventDefault();
              $.postJSON('sign/confirm', {'id': id}).done(function(response) {
                if (response.success) {
                  context.message = json[response.message];
                  context.description = "<a href='#/" + lang + "'>" + json['view_all_signatories'] + "</a>";
                  $('div#message').html(Partials.renderMessage(context));
                } else {
                  var key = response.errors[0];
                  context.message = json['something_went_wrong'];
                  context.description = json[key];
                  $('#manifesto, #sign, #reading, #signatory-table').hide();
                  $('div#message').html(Partials.renderMessage(context));
                }
              });
            });

            $('a#decline').on('click', function(event) {
              event.preventDefault();
              $.postJSON('sign/decline', {'id': id}).done(function(response) {
                if (response.success) {
                  context.message = json[response.message];
                  context.description = "<a href='#/" + lang + "'>" + json['view_all_signatories'] + "</a>";
                } else {
                  var key = response.errors[0];
                  $('#manifesto, #sign, #reading, #signatory-table').hide();
                  context.message = json['something_went_wrong'];
                  context.description = json[key];
                }
                $('div#message').html(Partials.renderMessage(context));
              });
            });
          });
          $('#content, #content_top, #footer, #manifesto, div#message').show();
          $('#sign, #view, #reading, #signatory-table').hide();
        });
      } else {
        $.fetchStaticJSON("jsons/manifesto/" + lang + ".json").done(function(json) {
          Manifesto.fetchContent(json);

          $('html').attr('lang', lang);
          $('title').html(json.title);
          $('a.heading_title').attr('href', '#/' + lang);
          $('#manifesto, #sign, #reading, #signatory-table').hide();

          $.fetchStaticJSON("jsons/messages/" + lang + ".json").done(function(json) {
            var key = response.errors[0];
            var message = json[key];

            if (key == 'signatory_not_found') {
              $('div#message').html("<h2>" + json['something_went_wrong'] + "</h2><p class='text_center'>" + message + "</p>");
              $('#content, #content_top, #footer, div#message').show();
              $('#manifesto, #sign, #reading, #signatory-table').hide();
            } else if (key == 'signatory_already_confirmed') {
              context.name = response.name;
              context.message = message;
              context.remove_me = json.remove_me;

              $('div#message').html(Partials.renderSignatureRemove(context));

              $('a#decline').on('click', function(event) {
                event.preventDefault();
                $.postJSON('sign/decline', {'id': id}).done(function(response) {
                  if (response.success) {
                    context.message = json[response.message];
                    context.description = "<a href='#/" + lang + "'>" + json['view_all_signatories'] + "</a>";
                  } else {
                    var key = response.errors[0];
                    $('#manifesto, #sign, #reading, #signatory-table').hide();
                    context.message = json['something_went_wrong'];
                    context.description = json[key];
                  }
                  $('div#message').html(Partials.renderMessage(context));
                });
              });

              $('#content, #content_top, #footer, #manifesto, div#message').show();
              $('#sign, #view, #reading, #signatory-table').hide();
            }
          });
        });
      }
    });
  },

  translate: function(lang) {
    Transitions.before(function() {
      Manifesto.clearSignatories();
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
        Manifesto.fetchContent(response);
        $('a.heading_title').attr('href', '#/' + lang);
        $('a#sign').attr('href', '#/' + lang + '/sign');
        $('a#reading').attr('href', '#/' + lang + '/reading');
        $('#content_top, #manifesto, #signatory-table, #footer').show();

        Transitions.after(function() {
          Manifesto.bindSignButton(lang);
          Manifesto.bindSearchSignatories();
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
              $('div#message').html(Partials.renderConfirmation(confirmation));
              $('div#message').show();
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
    Manifesto.fetchSignatories(page);
  },

  fetchSignatories: function(page) {
    $.fetchJSON("signatories?page=" + page).done(function(signatories) {
      if (signatories.length < 1) { return; }

      $('#signatory-table').data('id', page);

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

  searchSignatories: function(name) {
    $.fetchJSON("signatories/search?name=" + name).done(function(signatories) {
      Transitions.infiniteUnscroll()
      var rows = '';
      $.each(signatories, function(index) {
        var signatory = signatories[index];
        date = new Date(Date.parse(signatory.signed_on))
        rows = rows + "<tr class='search-result'><td>" + signatory.number  + "</td><td class='signatory-name'>" + signatory.name + " (" + signatory.location + ")</td>" + "<td>" + date.toLocaleDateString() + "</td></tr>";
      });
      $('#signatory-table').html(rows);
    });
  },

  clearSignatories: function() {
    $('#signatory-table').data('id', 0);
    $('#signatory-table').html("");
    $('#search-name').val("");
  },

  showAllSignatories: function() {
    Manifesto.clearSignatories();
    Manifesto.fetchMoreSignatories();
    Transitions.infiniteScroll(function() {
      Manifesto.fetchMoreSignatories();
    });
  },

  bindSearchSignatories: function() {
    $('[data-id="search-submit"]').on('click', function(event) {
      event.preventDefault();
      Manifesto.searchSignatories($('[data-id="search-name"]').val());
    });

    $('[data-id="search-name"]').on('keypress', function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        Manifesto.searchSignatories($('[data-id="search-name"]').val());
      }
    });

    $('[data-id="search-clear"]').on('click', function(event) {
      event.preventDefault();
      Manifesto.showAllSignatories()
    });
  },

  switchLocale: function() {
    $('a#en, a#zh-cn, a#tr, a#es, a#de, a#fr-fr, a#ru-ru, a#vi, a#pt-br, a#it, a#ua').on('click', function() {
      Manifesto.translate($(this).attr('id'));
    });
  },

  toggleSignForm: function() {
    Transitions.before(function() {
      $('#signatory-table, #manifesto, div#reading').hide();
      $('div#sign').show();
      Transitions.after();
    });

    Transitions.infiniteUnscroll();
  },

  toggleReading: function() {
    Transitions.before(function() {
      $('#signatory-table, #manifesto, div#sign').hide();
      $('div#reading').show();
      Transitions.after();
    });

    Transitions.infiniteUnscroll();
  },
}
