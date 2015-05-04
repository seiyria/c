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
        .attr('height', height)
        .style('width', '100%')
        .style('height', height);

      var sankeyD = d3.sankey()
        .nodeWidth(8)
        .nodePadding(10)
        .size([width, height]);

      var color = d3.scale.category20();
      var path = sankeyD.link();

      var _initLinks = function() {
        var link = svg.append('g').selectAll('.link')
            .data(scope.data.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', path)
            .attr('stroke-width', d => Math.max(1, d.dy))
            .attr('stroke', d => d3.rgb(color(d.source.name.split(' ').join(''))).darker())
            .attr('opacity', constants.OPACITY_LOW)
            .on('mouseover', function() { d3.select(this).transition().style('opacity', constants.OPACITY_HIGH); })
            .on('mouseout', function() { d3.select(this).transition().style('opacity', constants.OPACITY_LOW); })
            .sort((a, b) => b.dy - a.dy );

        link
            .append('title')
            .text(d => `${d.source.name} -> ${d.target.name}`);
      };

      var _initNodes = function() {
        var node = svg.append('g').selectAll('.node')
            .data(scope.data.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${_.isNaN(d.y) ? 0 : d.y})`);

        var mouseFilter = (d, opacity) => {
          svg.selectAll('.link')
              .filter(l => l.source === d || l.target === d)
              .transition()
              .style('opacity', opacity);
        };

        node.append('rect')
            .attr('height', d => d.dy)
            .attr('width', sankeyD.nodeWidth())
            .style('fill', d => color(d.name.split(' ').join('')))
            .style('stroke', d => d3.rgb(d.color).darker(2))
            .on('mouseover', (d) => mouseFilter(d, constants.OPACITY_HIGH))
            .on('mouseout', (d) => mouseFilter(d, constants.OPACITY_LOW))
            .on('dblclick', d => {
              svg.selectAll('.link')
                  .filter(l => l.target === d)
                  .attr('display', function() { return d3.select(this).attr('display') === 'none' ? 'inline' : 'none'; });
            })
            .append('title')
            .text(d => d.name);

        node.append('text').append('tspan')
            .attr('x', -6)
            .attr('y', d => d.dy / 2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .attr('transform', null)
            .text(d => d.name)
            .filter(d => d.x < width * 0.75)
            .attr('x', 2 + sankeyD.nodeWidth())
            .attr('text-anchor', 'start')
            .filter(d => d.x > width * 0.25)
            .attr('text-anchor', 'middle');
      };

      var reinit = function() {
        svg.selectAll('g').remove();
        sankeyD
          .nodes(scope.data.nodes)
          .links(scope.data.links)
          .layout(256);

        _initLinks();
        _initNodes();
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