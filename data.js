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
        // const numNeighbors = links.filter(link => link.source == node || link.target == node).length;
        // console.log("num Neighbors",numNeighbors);
        if (numLinks[node] > 1) {
            nodesMap[node] = node
        }
    }
     console.log("links", links);
     const nodes = dictToArray(nodesMap);
     const graph = {nodes, links};
    console.log(graph);
    return graph;
}



function dictToArray(nodesMap) {
	var output = [], item;
    console.log(nodesMap.length);
	for (var subreddit in nodesMap) {
		item = {};
		item.id = subreddit;
		item.group = nodesMap[subreddit];
		output.push(item);
	}
	return output;

}