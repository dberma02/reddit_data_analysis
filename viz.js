var graph_simulation;
var dist_factor;
var dist_exp;
var charge_str;
const createForceGraph = function (result) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const NODE_RADIUS = 10;
    const LINE_WEIGHT_FACTOR = 0.05;
    const DISTANCE_FACTOR = 5260;
    const DISTANCE_EXP = 1.8;
    const TEXT_OFFSET = NODE_RADIUS * 1.25 ;
    const CHARGE_STRENGTH = -300;
    const LINE_WEIGHT_EXP = 0.90;

    dist_factor = DISTANCE_FACTOR;
    dist_exp = DISTANCE_EXP;
    charge_str = CHARGE_STRENGTH;

    const svg_force_graph = d3.select("#force-graph");
    svg_force_graph.attr("width", width);
    svg_force_graph.attr("height", height);
    // width = +svg_force_graph.attr("width"),
    // height = +svg_force_graph.attr("height");
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const graph = toGraph(result);
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id;}).distance(function (d) {
            return  (1/Math.pow(d.value, DISTANCE_EXP)) * DISTANCE_FACTOR
        }))
        .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
        .force("center", d3.forceCenter(width / 2, height / 2));


    const link = svg_force_graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.pow(d.value , LINE_WEIGHT_EXP)*LINE_WEIGHT_FACTOR;
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
    // console.log("nodes", graph.nodes);
    simulation.force("link")
        .links(graph.links);

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
            .attr("transform", function (d) {
                return `translate(${d.x}, ${d.y})`;
            });
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
    console.log(simulation);
    return simulation;
};
$.getJSON("response.json", (result) => {
    graph_simulation = createForceGraph(result.rows);
    console.log(graph_simulation);
});

function setCharge(simulation, CHARGE_STRENGTH) {
charge_str = CHARGE_STRENGTH;
console.log("charge strength", charge_str);
simulation.force("charge").strength(CHARGE_STRENGTH);
    simulation.restart();
    simulation.alpha(1);
}
function setDistance(simulation, DISTANCE_FACTOR, DISTANCE_EXP) {
    dist_exp = DISTANCE_EXP;
    dist_factor = DISTANCE_FACTOR;
simulation.force("link").distance(function (d) {
        return  (1/Math.pow(d.value, DISTANCE_EXP)) * DISTANCE_FACTOR
    });
    simulation.restart();
    simulation.alpha(1);

}

$(document).keypress(function(e) {
    console.log("key", e.which);
    switch(e.which) {
        case 119:
            setCharge(graph_simulation, charge_str*1.1);
            break;
        case 115:
            setCharge(graph_simulation, charge_str*.9);
            break;
        case 106:
            setDistance(graph_simulation, dist_factor, dist_exp*1.009);
            break;
        case 105:
            setDistance(graph_simulation, dist_factor, dist_exp*0.991);
            break;
        case 111:
            setDistance(graph_simulation, dist_factor * 1.10, dist_exp);
            break;
        case 107:
            setDistance(graph_simulation, dist_factor * .90, dist_exp);
            break;
    }
});
createSankeyDiagram();
