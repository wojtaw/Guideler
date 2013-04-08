qoutputTypes = {
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
		return printOutput("Undegined guider ID", outputTypes.ERROR);
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
	initListeners();
	hideLoading();
	showStep(1);
}

function showStep(stepNumber){
	//Check if number is valid
	if(stepNumber > guiderJSON.steps.length || stepNumber <= 0)
		return printOutput("Step number "+stepNumber+"is out of range", outputTypes.ERROR); 
	$('#gl-stepsWrapper').animate({
	left: -guiderJSON.steps[stepNumber - 1].positionX,
	top: -guiderJSON.steps[stepNumber - 1].positionY,	
	}, 1500, function() {
	// Animation complete.
	});		
}

function initStepBoxes() {
	var stepBoxes= [];
	var stepButtons= [];	
	for(var i=0;i<guiderJSON.steps.length;i++){
		var stepBoxString = '<div id="gl-step-'+i+'" class="gl-playerStepWrapper">'+
			'<iframe src="'+guiderJSON.steps[i].externalLink+'" width="100%" height="100%">'+
			'</iframe>'+
			'</div>';
		var stepButtonString = '<div id="gl-stepButton-'+i+'" class="tmpButton">'+i+'</div>';
		stepBoxes.push(stepBoxString);
		stepButtons.push(stepButtonString);
	}
	$("#gl-stepsContent").append(stepBoxes.join(''));
	$("#gl-playerControls").append(stepButtons.join(''));	
	
}

function positionStepBoxes() {
	var heightMax = -1;
	var widthMax = -1;		
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#gl-step-"+i).css("left",guiderJSON.steps[i].positionX);
		$("#gl-step-"+i).css("top",guiderJSON.steps[i].positionY);	
		if(guiderJSON.steps[i].positionX > widthMax)
			 widthMax = guiderJSON.steps[i].positionX + $("#gl-step-"+i).width();
		if(guiderJSON.steps[i].positionY > heightMax)
			heightMax = guiderJSON.steps[i].positionY + $("#gl-step-"+i).height();									
	}	
	$("#gl-stepsContent").width(widthMax);
	$("#gl-stepsContent").height(heightMax);
	$( "#gl-stepsWrapper" ).draggable();	
}

function initListeners() {
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#gl-stepButton-"+i).click(function(e) {
			var tmpNumber =  parseInt(e.target.id.split('-')[2]);
			showStep(tmpNumber+1);
		});
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
	return false;
}