Transitions = {
  before: function(callback) {
    $('#content').slideUp(500, function() {
      if (callback != null) {
        callback.call();
      }
    });
  },

  after: function(callback) {
    $('#content').slideDown(1000, function() {
      if (callback != null) {
        callback.call();
      }
    });
  },

  infiniteScroll: function(callback) {
    $(window).unbind('scroll');
    $(window).on('scroll', _.throttle(function() {
      if ($(this).scrollTop() + $(this).height() * 2 > $(document).height()) {
        callback.call();
      }
    }, 500));
  },

  infiniteUnscroll: function() {
    $(window).unbind('scroll');
  }
}
