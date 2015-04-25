
var favico = function() {
  var favico = new Favico({
    animation : 'fade'
  });

  var currentNum = 0;

  var badge = function(num) {
    if(num === currentNum) { return; }
    currentNum = num;
    favico.badge(num);
  };
  var reset = function() {
    favico.reset();
  };

  return {
    badge : badge,
    reset : reset
  };
};

module.exports = favico;