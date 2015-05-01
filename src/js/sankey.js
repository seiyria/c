var sankeyFunctionality = require('../extjs/sankeyfunctionality');
d3.sankey = sankeyFunctionality;

var sankey = function(UpgradePath) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element) {

      var getAndFixData = function() {

        var graph = UpgradePath.get();

        var nodeMap = {};
        graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
        graph.links = graph.links.map(function(x) {
          return {
            source: nodeMap[x.source],
            target: nodeMap[x.target],
            value: 1 //x.value || 0
          };
        });

        return graph;
      };

      scope.data = getAndFixData();

      var width = 500;
      var height = 500;

      var svg = d3.select(element[0])
        .append('svg')
        .style('width', width)
        .style('height', height);
      
      var sankeyD = d3.sankey()
        .nodeWidth(26)
        .nodePadding(10)
        .size([width, height]);

      var color = d3.scale.category20();
      var path = sankeyD.link();
      var formatNumber = d3.format(',.0f');
      var format = (d) => formatNumber(d) + ' ASDF';

      var reinit = function() {
        svg.selectAll('g').remove();
        sankeyD
          .nodes(scope.data.nodes)
          .links(scope.data.links)
          .layout(32);

        var link = svg.append('g').selectAll('.link')
          .data(scope.data.links)
          .enter().append('path')
          .attr('class', 'link')
          .attr('d', path)
          .style('stroke-width', function(d) { return Math.max(1, d.dy); })
          .sort(function(a, b) { return b.dy - a.dy; });

        link.append('title')
          .text(function(d) {
            return d.source.name + ' → ' +
              d.target.name + '\n' + format(d.value); });

        var node = svg.append('g').selectAll('.node')
          .data(scope.data.nodes)
          .enter().append('g')
          .attr('class', 'node')
          .attr('transform', function(d) {
            d.y = _.isNaN(d.y) ? 0 : d.y;
            return 'translate(' + d.x + ',' + d.y + ')'; });

        node.append('rect')
          .attr('height', function(d) { return d.dy; })
          .attr('width', sankeyD.nodeWidth())
          .style('fill', function(d) {
            d.color = color(d.name.replace(/ .*/, ''));
            return d.color; })
          .style('stroke', function(d) {
            return d3.rgb(d.color).darker(2); })
          .append('title')
          .text(function(d) {
            return d.name + '\n' + format(d.value); });

        node.append('text')
          .attr('x', -6)
          .attr('y', function(d) { return d.dy / 2; })
          .attr('dy', '.35em')
          .attr('text-anchor', 'end')
          .attr('transform', null)
          .text(function(d) { return d.name; })
          .filter(function(d) { return d.x < width / 2; })
          .attr('x', 6 + sankeyD.nodeWidth())
          .attr('text-anchor', 'start');
      };

      reinit();

      UpgradePath.watch().then(null, null, function() {
        scope.data = getAndFixData();

        reinit();
      });
    }
  };
};

sankey.$inject = ['UpgradePath'];

module.exports = sankey;