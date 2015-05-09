var ads = require('./ads');

var adManager = function($interval, notificationService, GameState) {

  var viewed = [];

  $interval(function() {

    if(!GameState.upgrade.has('Advertisements')) { return; }
    if(!GameState.adSet.get()) { return; }

    var ad = _.sample(ads);
    viewed.push(ad.name);
    viewed = _.uniq(viewed);
    if(viewed.length === ads.length) {
      GameState.achieve('Ad Viewer Extraordinaire');
    }

    notificationService.notifyWithDefaults({
      title: `${ad.name} <a target="_blank" href="${ad.url}"><span class='fa fa-external-link'></span></a>`,
      text: ad.text
    });
  }, 180000); //6 minutes

  return {};
};

adManager.$inject = ['$interval', 'notificationService', 'GameState'];

module.exports = adManager;
