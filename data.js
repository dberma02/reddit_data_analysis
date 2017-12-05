$.getJSON('sampledata.json', function(data) {
	// console.log(data);
	var nodes;
	var output = '<ul>';
	$.each(data, function(key, val){
		output += '<li>' + val.sub_a + " " + val.sub_b+ '</li>';
		nodes = {"subreddit"  : val.sub_a, "weight" : val.sub_ac};
	});
	console.log(nodes);
	output += '</ul>';
	$("#update").html(output);
});


 // var graph = { "nodes" : [ 
 //            { "subreddit"  : "default", "weight" : val.sub_ac},
 //            ], 		
 //            "links"  : [
 //               { "from"  : val.sub_a, "to" : val.sub_b, "weight" : val.percent }, 
 //               ]    
 //         }    
