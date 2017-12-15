let sankey_diagram;
let MIN_VALUE = 2000;
const createSankeyDiagram = function(results)  {
    const diagram = toSankey(results, MIN_VALUE);
    console.log(diagram);
const svg = d3.select("#sankey-diagram"),
    width = window.innerWidth,
    height = window.innerHeight;
svg.attr("width", width).attr("height", height);

const formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " TWh"; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

const sankey = d3.sankey()
    .nodeWidth(25)
    .nodePadding(10)
    .extent([[1, 1], [width - 2, height - 6]]);
    const defs = svg.append('defs');
let link = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.5)
    .selectAll("path");

let node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

    sankey.resolveCollisions = function () {

    };
    sankey(diagram);
    link = link
        .data(diagram.links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal()
            .source(function (d) {
                return [d.source.x1 + ((d.source.y1 - d.source.y0) / 2), d.y0];
            })
        .target(function (d) {
            return [d.target.x0 - ((d.target.y1 - d.target.y0) / 2), d.y1];
        }))
        .attr("stroke-width", function(d) { return Math.max(1, d.width); })
        .style('stroke', (d, i) => {
        // console.log('d from gradient stroke func', d);

        // make unique gradient ids
        const gradientID = `gradient${i}`;
        const startColor = color(d.source.name.replace(/ .*/, ""));
        const stopColor = color(d.target.name.replace(/ .*/, ""));

        // console.log('startColor', startColor);
        // console.log('stopColor', stopColor);

        const linearGradient = defs.append('linearGradient')
            .attr('id', gradientID);
        if (Math.abs(d.y1 - d.y0) <= 0.000000001) {
                linearGradient.attr('gradientUnits', "userSpaceOnUse");
            }

        linearGradient.selectAll('stop')
            .data([
                {offset: '10%', color: startColor },
                {offset: '90%', color: stopColor }
            ])
            .enter().append('stop')
            .attr('offset', d => {
                // console.log('d.offset', d.offset);
                return d.offset;
            })
            .attr('stop-color', d => {
                // console.log('d.color', d.color);
                return d.color;
            });

        return `url(#${gradientID})`;
    });
    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });
    node = node
        .data(diagram.nodes)
        .enter().append("g")
        .on('click', highlightNode);

    node.append("circle")
        .attr("cx", d => {
            return d.x0 - ((d.y1 - d.y0) / 2);
        })
        .attr("cy", function(d) { return ((d.y1 - d.y0) / 2)  +d.y0; })
        .attr("r", function(d) {return (d.y1 - d.y0) / 2;})
        .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000")
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("cx", function(d) { return d.x1 + ((d.y1-d.y0) / 2); });

    // node.append("rect")
    //     .attr("x", function(d) { return d.x0; })
    //     .attr("y", function(d) { return d.y0; })
    //     .attr("height", function(d) { return d.y1 - d.y0; })
    //     .attr("width", function(d) { return d.x1 - d.x0; })
    //     .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
    //     .attr("stroke", "#000");

    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    node.append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });
    var toggle = 0;
    var linkedByIndex = {};
    for (i = 0; i < diagram.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    diagram.links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }

    function highlightNode() {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            node.style("opacity", function (o) {
                return (neighboring(d, o) | neighboring(o, d)) ? 1 : 0.1; 
            });
            link.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            // if(d.targetLinks.length <= 0) {
            //     node.style("opacity", function (o) {
            //         return neighboring(d, o) ? 1 : 0.1; 
            //     });
            //     link.style("opacity", function (o) {
            //         return d.index==o.source.index ? 1 : 0.1;
            //     });
            // }
            // else {
            //     node.style("opacity", function (o) {
            //         return neighboring(o, d) ? 1 : 0.1; 
            //     });
            //     link.style("opacity", function (o) {
            //         return d.index==o.target.index ? 1 : 0.1;
            //     });
            // }
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            node.style("opacity", 1);
            link.style("opacity", 1);
            toggle = 0;
        }

    }
    sankey_diagram = sankey;
    sankey_diagram.updateNodesWithFilter = function (predicate) {
        console.log(diagram.nodes.filter(predicate));

        let newDiagram = {nodes: diagram.nodes.filter(predicate), links: diagram.links};
        console.log(newDiagram);
        sankey.update(newDiagram);
        sankey.relayout();
        node.data(newDiagram.nodes);
        link.data(newDiagram.links);
        node.exit().remove();
        link.exit().remove();
        node.enter();
    };
    sankey_diagram.updateLinksWithFilter = function (predicate) {
        console.log("updating Links");
        // link.filter(d => !predicate(d)).transition().duration(750).style("opacity", 0.0).remove();
        // link.filter(predicate).transition();
        console.log(diagram.links.filter(predicate));
        let newDiagram = {links: diagram.links.filter(predicate), nodes: diagram.nodes};
        console.log(newDiagram);
        sankey.update(newDiagram);
        sankey.relayout();
        node.data(newDiagram.nodes);
        link.data(newDiagram.links);
        link.exit().remove();
        node.exit().remove();
        link.enter();
    };
    return sankey_diagram;


};

