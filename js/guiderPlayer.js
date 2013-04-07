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
	showLoading();
	getGuiderData(guiderID)
}

function showLoading(){
    $('#gl-loading').css("display", "block");			
}

function hideLoading(){
    $('#gl-loading').css("display", "none");				
}

function getGuiderData(guiderID){	
	$.getJSON(glPathToJSONAPI, function(data) {
		guiderJSON = data;
		initStage();
	});		
}

function initStage(){
	initStepBoxes();
	positionStepBoxes();
	var items = [];
	$.each(this.guiderJSON, function(key, val) {
	items.push('<li id="' + key + '">' + val + '</li>');
	});
	$('<ul/>', {
	'class': 'my-new-list',
	html: items.join('')
	}).appendTo('body');	
	hideLoading();
}

function initStepBoxes() {
	var stepBoxes= [];
	for(var i=0;i<guiderJSON.steps.length;i++){
		stepBoxes.push('<div id="step-'+i+'" class="gl-playerStepWrapper">' + guiderJSON.steps[i].externalLink + '</div>');
	}
	$("#gl-stepsContent").append(stepBoxes.join(''));
	
}

function positionStepBoxes() {
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#step-"+i).css("left",guiderJSON.steps[i].positionX);
		$("#step-"+i).css("top",guiderJSON.steps[i].positionY);		
	}	
}

function moveLeft(){
	$("#gl-stepsWrapper").css('left','-=10px');		
}

function moveRight(){
	$("#gl-stepsWrapper").css('left','+=10px');			
}

function moveUp(){
	$("#gl-stepsWrapper").css('top','-=10px');			
}

function moveDown(){
	$("#gl-stepsWrapper").css('top','+=10px');			
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
}