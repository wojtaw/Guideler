qoutputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var glPathToJSONAPI = "http://localhost/Guideler/testing/sampleGuiderData.json";
//var glPathToJSONAPI = "http://wpstudio.cz/guideler/testing/sampleGuiderData.json";
var guiderJSON = new Object();
var boxStandartWidth = ($(window).width() * 0.7);
var boxStandartSpacing = ($(window).width() * 1.3);
var currentStepNumber = 1;

document.onkeydown = keyboardHandler;

function keyboardHandler(e){
	var e= window.event || e
	if(e.keyCode == 37) moveLeft();		
	if(e.keyCode == 39) moveRight();						
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
	showStep(currentStepNumber);
}

function showStep(stepNumber){
	//Check if number is valid
	if(stepNumber > guiderJSON.steps.length || stepNumber <= 0)
		return printOutput("Step number "+stepNumber+"is out of range", outputTypes.ERROR); 
	$('#gl-stepsContent').animate({
	left: - calculateStepCenterPosition(stepNumber-1),
	}, 1500, function() {
	// Animation complete.
	});		
}

function calculateStepCenterPosition(stepNumber){
	console.log($("#gl-step-"+stepNumber).width()+ " and " +$(window).width());
	var leftSpace = ($(window).width() - $("#gl-step-"+stepNumber).width()) / 2;
	console.log(leftSpace);
	return $("#gl-step-"+stepNumber).position().left - leftSpace;
}

function initStepBoxes() {
	var stepBoxes= [];
	var stepButtons= [];	
	for(var i=0;i<guiderJSON.steps.length;i++){
		var stepBoxString = '<div id="gl-step-'+i+'" class="gl-playerStepWrapper">'+
			createStepString(guiderJSON.steps[i].externalLink)+
			'</div>';
		var stepButtonString = '<div id="gl-stepButton-'+i+'" class="tmpButton">'+i+'</div>';
		stepBoxes.push(stepBoxString);
		stepButtons.push(stepButtonString);
	}
	$("#gl-stepsContent").append(stepBoxes.join(''));
	$("#gl-playerControls").append(stepButtons.join(''));
	
	//Count size of one box
	$(".gl-playerStepWrapper").css("width",boxStandartWidth);		
	
}

function positionStepBoxes() {
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#gl-step-"+i).css("left",i*boxStandartSpacing);									
	}
	widthMax = $("#gl-step-"+(guiderJSON.steps.length-1)).css("left") + $("#gl-step-"+(guiderJSON.steps.length-1)).width();	
	
	$("#gl-stepsContent").width(widthMax);
	$("#gl-stepsContent").height("1000px");	
	$("#gl-stepsContent").draggable({
		axis: 'x'
	});	
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
	console.log("Current:"+currentStepNumber);
	currentStepNumber--;
	checkBoundary();
	showStep(currentStepNumber);
}

function moveRight(){
	currentStepNumber++;
	checkBoundary();	
	showStep(currentStepNumber);
}

function checkBoundary(){
	if(currentStepNumber > guiderJSON.steps.length) currentStepNumber = 1;
	if(currentStepNumber < 1) currentStepNumber = guiderJSON.steps.length;
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
	return false;
}