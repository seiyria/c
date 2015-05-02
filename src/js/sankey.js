var sankeyFunctionality = require('../extjs/sankeyfunctionality');
d3.sankey = sankeyFunctionality;

var sankey = function(UpgradePath) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element) {

      const constants = {
        OPACITY_LOW: 0.2,
        OPACITY_HIGH: 0.6
      };

      scope.data = UpgradePath.get();

      var width = 500;
      var height = 750;

      var svg = d3.select(element[0])
        .append('svg')
        .style('width', width)
        .style('height', height);

      var sankeyD = d3.sankey()
        .nodeWidth(8)
        .nodePadding(10)
        .size([width, height]);

      var color = d3.scale.category20();
      var path = sankeyD.link();
      var formatNumber = d3.format(',.0f');
      var format = (d) => formatNumber(d);

      var reinit = function() {
        svg.selectAll('g').remove();
        sankeyD
          .nodes(scope.data.nodes)
          .links(scope.data.links)
          .layout(256);

        var link = svg.append('g').selectAll('.link')
          .data(scope.data.links)
          .enter()
          .append('path')
            .attr('class', 'link')
            .attr('d', path)
            .style('stroke-width', function(d) { return Math.max(1, d.dy); })
            .attr('stroke', function(i) {
              return d3.rgb(color(i.source.name.replace(/ .*/, ''))).darker();
            })
            .attr('opacity', constants.OPACITY_LOW)
            .on('mouseover', function() {
              d3.select(this).style('opacity', constants.OPACITY_HIGH);
            })
            .on('mouseout', function() {
              d3.select(this).style('opacity', constants.OPACITY_LOW);
            })
            .sort(function(a, b) { return b.dy - a.dy; });

        link.append('title')
          .text(function(d) {
            return d.source.name + ' → ' +
              d.target.name; });

        var node = svg.append('g').selectAll('.node')
          .data(scope.data.nodes)
          .enter()
          .append('g')
            .attr('class', 'node')
            .attr('transform', function(d) {
              d.y = _.isNaN(d.y) ? 0 : d.y;
              return 'translate(' + d.x + ',' + d.y + ')'; });

        node.append('rect')
          .attr('height', function(d) { return d.dy; })
          .attr('width', sankeyD.nodeWidth())
          .style('fill', function(d) {
            return color(d.name.replace(/ .*/, '')); })
          .style('stroke', function(d) {
            return d3.rgb(d.color).darker(2); })
          .on('mouseover', function(d) {
            svg.selectAll('.link').filter(function(l) {
              return l.source === d || l.target === d;
            }).transition().style('opacity', constants.OPACITY_HIGH);
          }).on('mouseout', function(d) {
            svg.selectAll('.link').filter(function(l) {
              return l.source === d || l.target === d;
            }).transition().style('opacity', constants.OPACITY_LOW);
          }).on('dblclick', function(d) {
            svg.selectAll('.link').filter(function(l) {
              return l.target === d;
            }).attr('display', function() {
              if (d3.select(this).attr('display') === 'none') {return 'inline';
              } else {return 'none';}
            });
          })
          .append('title')
            .text(function(d) {
              return d.name + '\n' + format(d.value); });

        node.append('text').append('tspan')
          .attr('x', -6)
          .attr('y', function(d) { return d.dy / 2; })
          .attr('dy', '.35em')
          .attr('text-anchor', 'end')
          .attr('transform', null)
          .text(function(d) { return d.name; })
          .filter(function(d) { return d.x < width * 0.75; })
          .attr('x', 2 + sankeyD.nodeWidth())
          .attr('text-anchor', 'start')
          .filter(function(d) { return d.x > width * 0.25; })
          .attr('text-anchor', 'middle');
      };

      reinit();

      UpgradePath.watch().then(null, null, function() {
        scope.data = UpgradePath.get();

        reinit();
      });
    }
  };
};

sankey.$inject = ['UpgradePath'];

module.exports = sankey;