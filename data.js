function toGraph(data) {
    var output = '<ul>';
    var jsonObject = new Object();
    var nodesMap = [];
    var links = Array();

    $.each(data, function (key, val) {
        output += '<li>' + val.sub_a + " " + val.sub_b + '</li>';
        nodesMap[val.sub_a] = val.sub_ac;
        links.push({"source": val.sub_a, "target": val.sub_b, "value": val.percent})
    });
    output += '</ul>';
    var nodes = dictToArray(nodesMap);
    jsonObject.nodes = nodes;
    jsonObject.links = links;
    // var newJson = JSON.stringify(jsonObject);
    console.log(jsonObject);
    return jsonObject;
    $("#update").html(output);
}

$.getJSON('sampledata.json', function(data) {
    // toGraph(data);
});

function dictToArray(nodesMap) {
	var output = [], item;
	for (var subreddit in nodesMap) {
		item = {};
		item.id = subreddit;
		item.group = nodesMap[subreddit];
		output.push(item);
	}
	return output;

}