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
	showStep(1);
}

function showStep(stepNumber){
	//Check if number is valid
	if(stepNumber > guiderJSON.steps.length || stepNumber <= 0)
		return printOutput("Step number "+stepNumber+"is out of range", outputTypes.ERROR); 
	$('#gl-stepsWrapper').animate({
	//left: -guiderJSON.steps[stepNumber - 1].positionX,
	//top: -guiderJSON.steps[stepNumber - 1].positionY,	
	}, 1500, function() {
	// Animation complete.
	});		
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
	widthMax = $("#gl-step-"+(guiderJSON.steps.length-1)).css("left");	
	console.log("width "+widthMax+" - "+(guiderJSON.steps.length-1));
	
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
	console.log("left");
	$("#gl-stepsContent").css('left','-=10px');	
	console.log("left - "+$("#gl-stepsContent").css('left'));	
}

function moveRight(){
	$("#gl-stepsContent").css('left','+=10px');			
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
	return false;
}