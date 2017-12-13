 function toGraph(data) {
     const nodesMap = [];
     const numLinks = [];
     const links = new Array();
     console.log(data);
     const MAX_NEIGHBORS = 20;
     for(let i = 0; i < data.length; i++) {

         const target = data[i].f[1].v;
         const source = data[i].f[0].v;
         nodesMap[target] = target;
         if (!numLinks[target]) {
             numLinks[target] = 0;
         }
         if (!numLinks[source]) {
             numLinks[source] = 0;
         }
         if (numLinks[target] < MAX_NEIGHBORS) {
             nodesMap[source] = target;
             const value = data[i].f[2].v;
             const link = {source, target, value};
             numLinks[target] += 1;
             numLinks[source] += 1;
             links.push(link);
         }

    }
    for (let node in nodesMap) {
        if (numLinks[node] > 1) {
            nodesMap[node] = node
        }
    }
     // console.log("links", links);
     const nodes = dictToArray(nodesMap);
     const graph = {nodes, links};
    // console.log(graph);
    return graph;
}



function dictToArray(nodesMap) {
	var output = [], item;
    // console.log(nodesMap.length);
	for (var subreddit in nodesMap) {
		item = {};
		item.id = subreddit;
		item.group = nodesMap[subreddit];
		output.push(item);
	}
	return output;
}
 function dictToSankeyNodes(nodesMap) {
     var output = [], item;
     // console.log(nodesMap.length);
     for (var subreddit in nodesMap) {
         item = {};
         item.id = subreddit;
         item.name = nodesMap[subreddit];
         output.push(item);
     }
     return output;
 }

function toSankey(data){
     const nodesMap = [];
     const numLinks = [];
     const links = new Array();
     const targetTotalValue = [];
     const sourceTotalValue = [];
     console.log(data);
     const MIN_TARGET_VALUE = 1000;
     const MAX_NEIGHBORS = 30;
     for(let i = 0; i < data.length; i++) { // data.length
         const target = data[i].f[1].v;
         const source = data[i].f[0].v;
         nodesMap[source] = source;
         if (!numLinks[target]) {
             numLinks[target] = 0;
         }
         if (!numLinks[source]) {
             numLinks[source] = 0;
         }
         if (!targetTotalValue[target]) {
             targetTotalValue[target] = 0;
         }
         if (!sourceTotalValue[source]) {
             sourceTotalValue[source] = 0;
         }
         // if (numLinks[source] < MAX_NEIGHBORS) {
             nodesMap[target] = target;
             const value = data[i].f[2].v;
             const link = {source, target, value};
             targetTotalValue[target] += parseInt(value);
             sourceTotalValue[source] += parseInt(value);
             numLinks[source] += 1;
             links.push(link);
         // }
    }
    for (let node in nodesMap) {
        if (numLinks[node] > 1) {
            nodesMap[node] = node
        }
    }
     // console.log("links", links);
     const nodes = dictToSankeyNodes(nodesMap).filter(node => !targetTotalValue[node.id] || targetTotalValue[node.id] >= MIN_TARGET_VALUE).sort((a, b) => sortByTotalValue(a.id, b.id));
     const fixed_links = links.filter(link => targetTotalValue[link.target] >= MIN_TARGET_VALUE).map(link => ({
         source: nodes.findIndex(node => node.id === link.source),
         target: nodes.findIndex(node => node.id === link.target),
         value: link.value
     })).filter(link => link.source != -1 && link.target != -1);
     const graph = {
         nodes: nodes,
         links: fixed_links
     };
     console.log("nodes", nodes);
     console.log(sourceTotalValue, targetTotalValue);

    function sortByTotalValue(a, b) {
        if (targetTotalValue[b] && sourceTotalValue[a]) {
            return 1;
        } else if (targetTotalValue[a] && sourceTotalValue[b]) {
            return -1
        } else {
        const a_totalValue = targetTotalValue[a] ? targetTotalValue[a] : sourceTotalValue[a];
        const b_totalValue = targetTotalValue[b] ? targetTotalValue[b] : sourceTotalValue[b];
        return b_totalValue - a_totalValue};
    }

    console.log(graph);
    return graph;

}
// {
//   "nodes":[
//     {"node":0,"name":"node0"},
//     {"node":1,"name":"node1"},
//     {"node":2,"name":"node2"},
//     {"node":3,"name":"node3"},
//     {"node":4,"name":"node4"}
//   ],
//   "links":[
//     {"source":0,"target":2,"value":2},
//     {"source":1,"target":2,"value":2},
//     {"source":1,"target":3,"value":2},
//     {"source":0,"target":4,"value":2},
//     {"source":2,"target":3,"value":2},
//     {"source":2,"target":4,"value":2},
//     {"source":3,"target":4,"value":4}
//   ]}
