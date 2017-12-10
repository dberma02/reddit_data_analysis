const createSankeyDiagram = function()  {
const svg = d3.select("#sankey-diagram"),
    width = window.innerWidth,
    height = window.innerHeight;
svg.attr("width", width).attr("height", height);

const formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " TWh"; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

const sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(50)
    .extent([[1, 1], [width - 1, height - 6]]);
    const defs = svg.append('defs');
let link = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.8)
    .selectAll("path");

let node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

d3.json("sankey_test.json", function(error, energy) {
    if (error) throw error;

    sankey(energy);

    link = link
        .data(energy.links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(1, d.width); })
        .style('stroke', (d, i) => {
        console.log('d from gradient stroke func', d);

        // make unique gradient ids
        const gradientID = `gradient${i}`;
        const startColor = color(d.source.name.replace(/ .*/, ""))
        const stopColor = color(d.target.name.replace(/ .*/, ""))

        console.log('startColor', startColor);
        console.log('stopColor', stopColor);

        const linearGradient = defs.append('linearGradient')
            .attr('id', gradientID);

        linearGradient.selectAll('stop')
            .data([
                {offset: '10%', color: startColor },
                {offset: '90%', color: stopColor }
            ])
            .enter().append('stop')
            .attr('offset', d => {
                console.log('d.offset', d.offset);
                return d.offset;
            })
            .attr('stop-color', d => {
                console.log('d.color', d.color);
                return d.color;
            });

        return `url(#${gradientID})`;
    });

    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    node = node
        .data(energy.nodes)
        .enter().append("g");

    node.append("circle")
        .attr("cx", function(d) { return d.x0; })
        .attr("cy", function(d) { return ((d.y1 - d.y0) / 2)  +d.y0; })
        .attr("r", function(d) {return (d.y1 - d.y0) / 2;})
        .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000");

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
    });
};
