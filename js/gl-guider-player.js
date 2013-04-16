outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var glPathToJSONAPI = "http://localhost/Guideler/testing/sampleGuiderData.json";
//var glPathToJSONAPI = "http://wpstudio.cz/guideler/testing/sampleGuiderData.json";
var guiderJSON = new Object();
var isLoaded = new Array();
var boxStandartWidth = ($(window).width() * 0.7);
var boxStandartSpacing = ($(window).width() * 1.3);
var currentStepNumber = 1;
var draggableStartPosition = 0;


document.onkeydown = keyboardHandler;

$(window).ready(function() {
	$(window).resize(recalculatePlayer);	
});

function keyboardHandler(e){
	var e= window.event || e
	if(e.keyCode == 37) moveLeft();		
	if(e.keyCode == 39) moveRight();						
};

function recalculatePlayer(){
	console.log("recalculating player");
	boxStandartWidth = ($(window).width() * 0.7);
	boxStandartSpacing = ($(window).width() * 1.3);	
	modifyCSSclass();
	positionStepBoxes();
}

function modifyCSSclass(){
	var videoWidth = boxStandartWidth * 0.85;
	var videoHeight = (9*videoWidth) / 16;		
	
	var generalBoxWidth = boxStandartWidth * 0.9;
	var generalBoxHeight = (generalBoxWidth * 9) / 16;			
	
	var cssHtmlString = '.videoAspectRatio{ width:'+videoWidth+'; height:'+videoHeight+';}'+
			'.generalBox{ width:'+generalBoxWidth+'; height:'+generalBoxHeight+';}';
	
	$('#gl-dynamic-classes').html(cssHtmlString);
	
//	$('<style type="text/css"> .videoAspectRatio{ width:'+videoWidth+'; height:'+videoHeight+';} </style>').appendTo("head");	
}

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
	console.log("Initing stage");
	styleStage();
	initStepBoxes();
	recalculatePlayer();
	initListeners();
	hideLoading();
	showStep(currentStepNumber);
}

function styleStage(){
	$("#gl-guiderName").html(guiderJSON.guiderName);
}

//Helper function
function isStepLoaded(stepNumber){
	return isLoaded[stepNumber];
}

function isValidStep(stepNumber){
	if(stepNumber > guiderJSON.steps.length || stepNumber <= 0)	return false;
	else return true;
}

function showStep(stepNumber){
	if(!isValidStep(stepNumber))	return printOutput("Step number "+stepNumber+"is out of range", outputTypes.ERROR); 
	//Check if step is loaded, otherwise load it
	if(!isStepLoaded(stepNumber)) loadStep(stepNumber);

	//Match current step number in special cases and refresh controls
	currentStepNumber = stepNumber;
	showCurrentControls();
	
	//Bring on the requested step
	$('#gl-stepsContent').animate({
	left: - calculateStepCenterPosition(stepNumber-1),
	}, 2000, 'easeOutBack', function() {
	// Animation complete.
	});		

	//Start loading next steps
	loadStep(stepNumber+1);
	loadStep(stepNumber-1);	
}

function loadStep(stepNumber){
	if(!isValidStep(stepNumber)) return;
	if(isLoaded[stepNumber-1]) return;
	printOutput("Loading step number"+stepNumber, outputTypes.LOG);	
	$("#gl-step-"+(stepNumber-1)).html(createStepString(guiderJSON.steps[stepNumber-1].serviceType,guiderJSON.steps[stepNumber-1].externalData));
	isLoaded[stepNumber-1] = true;
}

function calculateStepCenterPosition(stepNumber){
	var leftSpace = ($(window).width() - $("#gl-step-"+stepNumber).width()) / 2;
	return $("#gl-step-"+stepNumber).position().left - leftSpace;
}

function initStepBoxes() {
	var stepBoxes= [];
	var stepButtons= [];	
	for(var i=0;i<guiderJSON.steps.length;i++){
		var stepBoxString = '<div id="gl-step-'+i+'" class="gl-playerStepWrapper">'+
			'</div>';
		var stepButtonString = '<div id="gl-stepButton-'+i+'" class="tmpButton">'+i+'</div>';
		stepBoxes.push(stepBoxString);
		stepButtons.push(stepButtonString);
	}
	$("#gl-stepsContent").append(stepBoxes.join(''));
	$("#gl-playerBottomBar").append(stepButtons.join(''));		
	
}

function positionStepBoxes() {	
	//Count size of one box
	$(".gl-playerStepWrapper").css("width",boxStandartWidth);	
		
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#gl-step-"+i).css("left",i*boxStandartSpacing);									
	}
	widthMax = parseInt(($("#gl-step-"+(guiderJSON.steps.length-1)).css("left")), 10) + ($("#gl-step-"+(guiderJSON.steps.length-1)).width());	
	$("#gl-stepsContent").width(widthMax);
	//Count height depending on top and bottom bar
	var countedPlayerHeight = $(window).height() - $("#gl-playerTopBar").outerHeight() - $("#gl-playerBottomBar").outerHeight();
	console.log("Counted height "+countedPlayerHeight);
	
	$("#gl-stepsContent").height(countedPlayerHeight+"px");	
	$("#gl-stepsContent").draggable({
		axis: 'x',
		start: function() {
			draggableStartPosition = $("#gl-stepsContent").position().left;
		},
		stop: function(){
			var currentPosition = $("#gl-stepsContent").position().left;
			if(draggableStartPosition > currentPosition){
				$('#gl-stepsContent').animate({
				left:'-=200px',
				}, 500, 'easeOutBack');		
			}else{
				$('#gl-stepsContent').animate({
				left:'+=200px',
				}, 500, 'easeOutBack');					
			}
        }
	});	
}

function showCurrentControls(){
	for(var i=0;i<guiderJSON.steps.length;i++){
		if(currentStepNumber == (i+1)){
			$("#gl-stepButton-"+(i)).css("color","black");			
			$("#gl-stepButton-"+(i)).css("background-color","orange");						
		}else{
			$("#gl-stepButton-"+(i)).css("color","white");						
			$("#gl-stepButton-"+(i)).css("background-color","#333");									
		}
	}
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
	console.log("GL-"+outputTypes + " " + message);
	return false;
}