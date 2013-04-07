outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var glPathToJSONAPI = "http://localhost/Guideler/testing/sampleGuiderData.json";
var guiderJSON = new Object();

document.onkeypress=function(e){
	var e=window.event || e
	if(e.keyCode == 37) moveLeft();		
	if(e.keyCode == 38) moveUp();
	if(e.keyCode == 39) moveRight();		
	if(e.keyCode == 40) moveDown();					
};

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
	var heightMax = -1;
	var widthMax = -1;		
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#step-"+i).css("left",guiderJSON.steps[i].positionX);
		$("#step-"+i).css("top",guiderJSON.steps[i].positionY);	
		if(guiderJSON.steps[i].positionX > widthMax)
			 widthMax = guiderJSON.steps[i].positionX;
		if(guiderJSON.steps[i].positionY > heightMax)
			heightMax = guiderJSON.steps[i].positionY;									
	}	
	$("#gl-stepsContent").width(widthMax);
	$("#gl-stepsContent").height(heightMax);	
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