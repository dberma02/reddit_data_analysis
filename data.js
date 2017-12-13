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
             const link = {source: source, target: target, value: data[i].f[2].v};
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
     console.log(data);
     const MAX_NEIGHBORS = 10;
     for(let i = 0; i < data.length; i++) {

         const target = data[i].f[1].v;
         const source = data[i].f[0].v;
         nodesMap[source] = source;
         if (!numLinks[target]) {
             numLinks[target] = 0;
         }
         if (!numLinks[source]) {
             numLinks[source] = 0;
         }
         if (numLinks[target] < MAX_NEIGHBORS) {
             nodesMap[target] = target;
             const link = {source: source, target: target, value: data[i].f[2].v};
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
     const nodes = dictToSankeyNodes(nodesMap);
     const fixed_links = links.map(link => ({
         source: nodes.findIndex(node => node.id === link.source),
         target: nodes.findIndex(node => node.id === link.target),
         value: link.value
     }));
     const graph = {nodes, links: fixed_links};
    // console.log(graph);
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
