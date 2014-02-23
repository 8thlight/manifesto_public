var Partials = {
  init: function() {
    Partials.renderContentTop = _.template(Partials.contentTop());
    Partials.renderManifesto = _.template(Partials.manifesto());
    Partials.renderFooter = _.template(Partials.footer());
    Partials.renderSign = _.template(Partials.sign());
    Partials.renderReading = _.template(Partials.reading());
    Partials.renderConfirmation = _.template(Partials.confirmation());
    Partials.renderSignatureErrors = _.template(Partials.signatureErrors());
    Partials.renderSignatureConfirm = _.template(Partials.signatureConfirm());
    Partials.renderSignatureRemove = _.template(Partials.signatureRemove());
    Partials.renderMessage = _.template(Partials.message());
  },

  sign: function() { return $('script#sign-template').html(); },
  contentTop: function() { return $('script#content-top-template').html(); },
  manifesto: function() { return $('script#manifesto-template').html(); },
  footer: function() { return $('script#footer-template').html(); },
  reading: function() { return $('script#reading-template').html(); },
  confirmation: function() { return $('script#confirmation-template').html(); },
  signatureErrors: function() { return $('script#signature-errors').html(); },
  signatureConfirm: function() { return $('script#signature-confirm').html(); },
  signatureRemove: function() { return $('script#signature-remove').html(); },
  message: function() { return $('script#message').html(); }
}