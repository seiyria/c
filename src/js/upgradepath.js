
var upgradePath = function($q, GameState, UPGRADES) {
  var defer = $q.defer();

  var structure = {
    nodes: [],
    links: []
  };

  var recalculate = function() {
    structure.nodes = _(GameState.upgrade.get()).keys().map(key => { return {name: key}; }).value();
    structure.links = _(structure.nodes).map(node => {
      var nodeLinks = [];

      _.each(UPGRADES[node.name].requirements, (val, key) => {
        nodeLinks.push({
          source: key,
          value: val,
          target: node.name
        });
      });

      return nodeLinks;
    }).flatten().value();

    defer.notify(structure);
  };

  recalculate();

  GameState.upgrade.watch().then(null, null, recalculate);

  return {
    get: function() {
      return structure;
    },
    watch: function() {
      return defer.promise;
    }
  };
};

upgradePath.$inject = ['$q', 'GameState', 'Upgrades'];

module.exports = upgradePath;