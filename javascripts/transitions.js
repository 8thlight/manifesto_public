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
    $(window).off('scroll');
    $(window).on('scroll', _.throttle(function() {
      if ($(this).scrollTop() >= $(document).height() - $(window).height() - 10) {
        callback.call();
      }
    }, 500));
  },

  infiniteUnscroll: function() {
    $(window).off('scroll');
  }
}
