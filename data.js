let targetTotalValue = [];
let sourceTotalValue = [];
let originalNodesMap;
let originalLinks;

 function toGraph(data) {
     const nodesMap = [];
     const numLinks = [];
     const dataConnects = [];
     const links = new Array();
     const MAX_NEIGHBORS = 20;
     for(let i = 0; i < data.length; i++) {

         const target = data[i].f[1].v;
         const source = data[i].f[0].v;
         nodesMap[target] = target;
         if (!numLinks[target]) {
             numLinks[target] = 0;
             dataConnects[target] = 0;
         }
         if (!numLinks[source]) {
             numLinks[source] = 0;
             dataConnects[source] = 0;
         }
         if (numLinks[target] < MAX_NEIGHBORS) {
             nodesMap[source] = target;
             const value = data[i].f[2].v;
             const percentNonContro = data[i].f[3].v;
             const aAuthorCount = data[i].f[4].v;
             const bAuthorCount = data[i].f[5].v;
             const link = {source, target, value};
             const connect = {source, target, value, percentNonContro, aAuthorCount, bAuthorCount};
             numLinks[target] += 1;
             numLinks[source] += 1;
             links.push(link);
             dataConnects.push(connect);
         }

    }
    for (let node in nodesMap) {
        if (numLinks[node] > 1) {
            nodesMap[node] = node
        }
    }
     // console.log("links", links);
     const nodes = dictToArray(nodesMap);
     const graph = {nodes, links, dataConnects};
    console.log("force directed", graph);
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

function filterGraph(nodesMap, MIN_TARGET_VALUE, links) {
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
    return graph;
}

function toSankey(data, MIN_TARGET_VALUE){
     const nodesMap = [];
     const numLinks = [];
     const links = new Array();
     // console.log(data);
     // const MIN_TARGET_VALUE = 2000;
     const MAX_NEIGHBORS = 30;
     for(let i = 0; i < data.length; i++) { // data.length
         let target = data[i].f[1].v;
         let source = data[i].f[0].v;
         nodesMap[source] = source;
         if(targetTotalValue[source]) {
             source += " (user)";

         }
         if(sourceTotalValue[target]) {
             target += " (subreddit)";
         }

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
        // if (numLinks[node] > 1) {
            nodesMap[node] = node
        // }
    }
    originalNodesMap = nodesMap;
     originalLinks = links;
    const graph = filterGraph(nodesMap, MIN_TARGET_VALUE, links);
     // console.log("nodes", nodes);
     // console.log(sourceTotalValue, targetTotalValue);


    console.log("sankey", graph);
    return graph;

}
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
