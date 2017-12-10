 function toGraph(data) {
    var jsonObject = new Object();
    var nodesMap = [];
    var links = Array();
    for(i = 0; i < data.length; i++) {
        var key = data[i].f[0].v;
        nodesMap[key] = data[i].f[3].v;
        links.push({"source": data[i].f[0].v, "target": data[i].f[1].v, "value": data[i].f[2].v});
    }
    var nodes = dictToArray(nodesMap);
    jsonObject.nodes = nodes;
    jsonObject.links = links;
    console.log(jsonObject);
    return jsonObject;
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