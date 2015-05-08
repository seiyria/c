var animatedFlyTip = function($filter) {
  return {
    fly: function(num, useSeparator = false) {
      var $element = $('<div />');

      var numString = num;
      if(useSeparator) {
        numString = $filter('number')(numString, 0);
      }

      if(num < 0) {
        $element.addClass('text-danger');
        $element.html(numString);
      } else if(num > 0) {
        $element.addClass('text-success');
        $element.html(`+${numString}`);
      }

      $element.css('position', 'absolute');
      $('body').append($element);

      var $base = $('.navbar-unit:visible');
      if(!$base.length) { return; }

      $element.offset({left: $base.offset().left, top: $base.offset().top});

      $element.animate({top: '60px'});
      $element.animate({opacity: 0, top: '60px'}, 500, 'swing', function() {
        $(this).remove();
      });

    }
  };
};

animatedFlyTip.$inject = ['$filter'];

module.exports = animatedFlyTip;