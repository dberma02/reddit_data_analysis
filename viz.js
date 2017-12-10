const createForceGraph = function (result) {
    const width = innerWidth;
    const height = innerHeight;
    const NODE_RADIUS = 10;
    const LINE_WEIGHT_FACTOR = 0.25;
    const DISTANCE_FACTOR = 7;
    const TEXT_OFFSET = NODE_RADIUS * 1.25 ;

    const svg_force_graph = d3.select("#force-graph");
    svg_force_graph.attr("width", width);
    svg_force_graph.attr("height", height);
    // width = +svg_force_graph.attr("width"),
    // height = +svg_force_graph.attr("height");
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id;}).distance(d => {return d.value * DISTANCE_FACTOR}))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const graph = toGraph(result);
    
    const link = svg_force_graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value)*LINE_WEIGHT_FACTOR;
        });

    const node = svg_force_graph.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("g").attr("class", "node");
    const circle = node
        .append("circle")
        .attr("r", NODE_RADIUS)
        .attr("fill", function (d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const label = node.append("text")
        .attr("dx", TEXT_OFFSET)
        .attr("dy", 0)
        .text(function (d) {
            return d.id;
        });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);//.distance(link => {return link.value * DISTANCE_FACTOR});

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
        /*.attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });*/
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};


createSankeyDiagram();
