var graph_simulation;
var dist_factor;
var dist_exp;
var charge_str;
let FISHEYE_ENABLED = false;
let CHARGE = false;

//FISHEYE TOGGLE CLICK HANDLER
$("#fishEyeToggle").click(() => {
    FISHEYE_ENABLED = !FISHEYE_ENABLED;
});
$("#increaseRepulsion").click(() => {
    setCharge(graph_simulation, charge_str*1.1);
});
$("#decreaseRepulsion").click(() => {
    setCharge(graph_simulation, charge_str*.9);
});
$("#shrinkLink").click(() => {
    setDistance(graph_simulation, dist_factor * .90, dist_exp);
});
$("#growLink").click(() => {
    setDistance(graph_simulation, dist_factor * 1.10, dist_exp);
});



const createForceGraph = function (result) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const NODE_RADIUS = 10;
    const LINE_WEIGHT_FACTOR = 0.05;
    const DISTANCE_FACTOR = 5260;
    const DISTANCE_EXP = 0.9;
    const TEXT_OFFSET = NODE_RADIUS * 1.25 ;
    const CHARGE_STRENGTH = -200;
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
    const data = graph.dataConnects;
    console.log(data);
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id;}).distance(function (d) {
            return  (1/Math.pow(d.value, DISTANCE_EXP)) * DISTANCE_FACTOR
        }))
        .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
        .force("center", d3.forceCenter(width / 2, height / 2));
//ARROW MARKERS
//    svg_force_graph.append("defs").selectAll("marker")
//        .data(["suit", "licensing", "resolved"])
//        .enter().append("marker")
//        .attr("id", function(d) { return d; })
//        .attr("viewBox", "0 -5 10 10")
//        .attr("refX", 25)
//        .attr("refY", 0)
//        .attr("markerWidth", 6)
//        .attr("markerHeight", 6)
//        .attr("orient", "auto")
//        .append("path")
//        .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
//        .style("stroke", "#4679BD")
//        .style("opacity", "0.6");
//FISHEYE

    const fisheye = d3.fisheye.circular()
        .radius(120);
    svg_force_graph.on("mousemove", function() {
        if (FISHEYE_ENABLED) {
        fisheye.focus(d3.mouse(this));
        circle.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return d.fisheye.z * 8; });
        link.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });
        }
    });

    const link = svg_force_graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.pow(d.value , LINE_WEIGHT_EXP)*LINE_WEIGHT_FACTOR;
        })
.style("marker-end",  "url(#suit)");// Modified line

    const node = svg_force_graph.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("g").attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on('mouseover', connectedNodes)
        .on('click', () => toggle = 1)
        .on('mouseout', connectedNodes)
        .on('click', connectedData);
    const circle = node.append("circle")
        .attr("r", NODE_RADIUS)
        .attr("fill", function (d) {
            return color(d.group);
        });

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

        circle
            // .attr("transform", function (d) {
            //     return `translate(${d.x}, ${d.y})`;
            // });
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });

        label.attr("x", function (d) {
            return d.x;
        }).attr("y", function (d) {
            return d.y;
        });
    }
    //Toggle stores whether the highlighting is on
    var toggle = 0;
    var togData = 0;
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    graph.links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    //This function looks up whether a pair are neighbours
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }
    function connectedData () {
        if (togData == 0) {
        d = d3.select(this).node().__data__;
        console.log(d);

        var neighbors = "<h5>" + d.id + "</h5>"+ `
            <table class='table table-hover sm-table'> 
                <thead class='thead-light'>
                <tr> 
                    <th>Source</th> 
                    <th>Target</th> 
                    <th>%Controversial Commented</th> 
                    <th>%Noncontroversial Commented</th> 
                    <th>Source Size</th> 
                    <th>Target Size</th> 
                </tr>
                </thead>
                <tbody>`;
        for (i=0; i < data.length; i++) {
            if (data[i].source == d.id) {
                console.log("Source" + data[i].source + "  "+ data[i].target);
                neighbors += 
                '<tr>'+
                '<th>'+data[i].source+'</th>' +
                '<th>'+data[i].target+'</th>' +
                '<th>'+data[i].value+'</th>' +
                '<th>'+data[i].percentNonContro+'</th>' +
                '<th>'+data[i].aAuthorCount+'</th>' +
                '<th>'+data[i].bAuthorCount+'</th>' +
                '</tr>'
                
            }
            else if (data[i].target == d.id) {
                console.log("Target" +data[i].target + "  "+ d.id);
                neighbors += 
                '<tr>'+
                '<th>'+data[i].source+'</th>' +
                '<th>'+data[i].target+'</th>' +
                '<th>'+data[i].value+'</th>' +
                '<th>'+data[i].percentNonContro+'</th>' +
                '<th>'+data[i].aAuthorCount+'</th>' +
                '<th>'+data[i].bAuthorCount+'</th>' +
                '</tr>'  
            }
        }
        neighbors += "</tbody></table>";
        document.getElementById('table').innerHTML = neighbors;
        togData = 1;
    }
    else {
        togData = 0;
        document.getElementById('table').innerHTML = '';
    }
    }
    function connectedNodes() {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            node.transition().duration(150).style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            });
            link.transition().duration(150).style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            node.transition().duration(150).style("opacity", 1);
            link.transition().duration(150).style("opacity", 1);
            toggle = 0;
            // 
        }


  // <tr>
  //   <td>Jill</td>
  //   <td>Smith</td> 
  //   <td>50</td>
  // </tr>
  // <tr>
  //   <td>Eve</td>
  //   <td>Jackson</td> 
  //   <td>94</td>
  // </tr>

    }

    function dragstarted(d) {
        toggle = 1;
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        toggle = 1;
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        toggle = 1;
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    console.log(simulation);
    graph_simulation = simulation;
    return simulation;
};


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
        default:
            updateMinTargetValue(6000);
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function testSankey(numNodes, numLinks, maxValue) {
    const nodes = new Array(numNodes);
    const links = new Array(numLinks);
    const sources = [];
    const targets = [];
    console.log(numNodes);
    for (let i = 0; i < numNodes; i++) {
        const name = `node${i}`;
        nodes[i] = {node : i,  name};
        if(Math.random() >= 0.5) {
            sources.push(i);
        } else {
            targets.push(i);
        }
    }
    for (let i = 0; i < numLinks; i++) {
        const source = sources[getRandomInt(0, sources.length)];
        const target = targets[getRandomInt(0, targets.length)];
        const value = getRandomInt(0, maxValue );
        links[i] = {source, target, value};
    }
    console.log("nodes", nodes);
    console.log("links", links);
    createSankeyDiagram({nodes, links});
}



// $.getJSON("sankey_test.json", result => {
//     console.log(result.rows);
//     return createSankeyDiagram(result.rows);
// });

function updateMinTargetValue(newMinTargetValue) {
    MIN_VALUE = newMinTargetValue;
    gapi.load('client:auth', authorize);
    // sankey_diagram.updateLinksWithFilter(link => link.target.value > newMinTargetValue);
    // sankey_diagram.updateNodesWithFilter(node => node.depth !=1 || node.value > newMinTargetValue);
}

// testSankey(20, 20, 100);
// $.getJSON("results-20171211-234134.json", result => graph_simulation = createForceGraph(result.rows));
// $.getJSON("forceDirectedGraphNewQuery.json", result => graph_simulation = createForceGraph(result.rows));


