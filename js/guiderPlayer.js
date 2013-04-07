outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var glPathToJSONAPI = "http://localhost/Guideler/testing/sampleGuiderData.json";
var guiderJSON = new Object();

function initPlayer(guiderID){
	if(typeof(guiderID)=='undefined'){
		printOutput("Undegined guider ID", outputTypes.ERROR);
		return false;	
	}
	getGuiderData(guiderID)
}

function getGuiderData(guiderID){	
	$.getJSON(glPathToJSONAPI, function(data) {
		guiderJSON = data;
		console.log(guiderJSON);		
		console.log(data);
		initStage();
	});		
}

function initStage(){
	console.log(guiderJSON);		
	var items = [];
	$.each(this.guiderJSON, function(key, val) {
	items.push('<li id="' + key + '">' + val + '</li>');
	});
	$('<ul/>', {
	'class': 'my-new-list',
	html: items.join('')
	}).appendTo('body');	
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
}