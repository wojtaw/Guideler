outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var guiderJSON = new Object();
var isLoaded = new Array();
var stepsFinished = new Array();

var boxStandartWidth = ($(window).width() * 0.7);
var boxStandartSpacing = ($(window).width() * 1.3);
var viewportHeight = 100;
var currentStepNumber = 1;
var stepDoneTimer;
var draggableStartPosition = 0;


function keyboardHandler(e){
	var e= window.event || e
	if(e.keyCode == 37) previousStep();
	if(e.keyCode == 39) nextStep();
};

function recalculatePlayer(){
	boxStandartWidth = ($(window).width() * 0.7);
	boxStandartSpacing = ($(window).width() * 1.3);

    viewportHeight = ($(window).height() - $("#gl-stepsContent").offset().top - $("#gl-playerBottomBar").height() - (0.05*$(window).height())-70);

	modifyCSSclass();
	positionStepBoxes();
    showStep(currentStepNumber)
}

function modifyCSSclass(){
//	var videoWidth = Math.round(boxStandartWidth * 0.85);
//	var videoHeight = Math.round((9*videoWidth) / 16);

    var videoHeight = Math.round(viewportHeight);
    var videoWidth = Math.round((16*videoHeight) / 9);


    var slideHeight = Math.round(viewportHeight);
    var slideWidth = Math.round((427*slideHeight) / 340);

	var generalBoxWidth = Math.round(boxStandartWidth - 30);
	var generalBoxHeight = Math.round(viewportHeight);

	var cssHtmlString = '.gl-dynamic-videoAspectRatio{ width:'+videoWidth+'px; height:'+videoHeight+'px;}'+
			'.gl-dynamic-generalBox{ width:'+generalBoxWidth+'px; height:'+generalBoxHeight+'px;}'+
            '.gl-dynamic-soundcloudEmbed{ width:'+(boxStandartWidth-16)+'px;}'+
            '.gl-dynamic-slideAspectRatio{ width:'+slideWidth+'px; height:'+slideHeight+'px;}';

	$('#gl-dynamic-classes').html(cssHtmlString);

//	$('<style type="text/css"> .videoAspectRatio{ width:'+videoWidth+'; height:'+videoHeight+';} </style>').appendTo("head");
}

function initPlayer(guiderID){
    $('body').attr('id', 'player-body');

    document.onkeydown = keyboardHandler;

    $(window).ready(function() {
        $(window).resize(recalculatePlayer);
    });

	if(typeof(guiderID)=='undefined'){
		return printOutput("Undefined guider ID", outputTypes.ERROR);
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
	$.getJSON((glPathToJSONAPI+guiderID), function(data) {
		guiderJSON = data;
		initStage();
	});
}

function initStage(){
	styleStage();
    animateBrain();
	initStepBoxes();
	recalculatePlayer();
	initListeners();
	hideLoading();
	showStep(currentStepNumber);
}

function styleStage(){
	$("#gl-guiderName").html(guiderJSON.guiderName);
    $("#gl-guiderDescription").html(guiderJSON.guiderDescription);
}

//Helper function
function isStepLoaded(stepNumber){
	return isLoaded[stepNumber];
}

function isValidStep(stepNumber){
	if(stepNumber > guiderJSON.steps.length || stepNumber <= 0)	return false;
	else return true;
}

function isStepFinished(stepNumber){
	return stepsFinished[stepNumber];
}

function showStep(stepNumber){
	if(!isValidStep(stepNumber))	return printOutput("Step number "+stepNumber+"is out of range", outputTypes.ERROR);
    currentStepNumber = stepNumber;

    window.clearInterval(stepDoneTimer);
    if(guiderJSON.steps[currentStepNumber-1].questionEnabled == "false"){
        stepDoneTimer = setTimeout(markStepAsFinished,30000);
    }

	//Check if step is loaded, otherwise load it
	if(!isStepLoaded(stepNumber)) loadStep(stepNumber);

	//Match current step number in special cases and refresh controls
	refreshQuestionBox();
	showCurrentControls();
    clearAnswers();


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

function markStepAsFinished(){
    stepsFinished[currentStepNumber-1] = true;
    increaseProgress();
    showCurrentControls();
}

function increaseProgress(){
    var successCount = 0;
    var totalSteps = guiderJSON.steps.length;
    var progressBar = $('#gl-progressBar');
    for(var i=0;i<totalSteps;i++){
        console.log(stepsFinished[i]);
        if(stepsFinished[i] == true) successCount++;
    }
    var currentPercantage = parseInt(progressBar.html());
    var newPercentage = Math.round(100 * (successCount / totalSteps));

    var tmpInterval = setInterval(function(){
        currentPercantage++;
        if(currentPercantage >= newPercentage) window.clearInterval(tmpInterval);
        progressBar.html(currentPercantage+"%");
    },100)

    console.log("Current percentage "+currentPercantage);


}

function refreshQuestionBox(){
    if(guiderJSON.steps[currentStepNumber-1].questionEnabled == "true"){
        $('#gl-question').css("visibility","visible");

    } else {
        $('#gl-question').css("visibility","hidden");
        hideQuestion();
    }
	//Deselect radios
	$('input[name=gl-answers]').attr('checked', false);
	//Fill up proper texts
	$('#gl-questionText').text(guiderJSON.steps[currentStepNumber-1].question);
	$('#gl-flashMessage').text(" ");
	$("label[for='gl-answerText1']").text("A] "+guiderJSON.steps[currentStepNumber-1].answers[0].answer1);
	$("label[for='gl-answerText2']").text("B] "+guiderJSON.steps[currentStepNumber-1].answers[1].answer2);
	$("label[for='gl-answerText3']").text("C] "+guiderJSON.steps[currentStepNumber-1].answers[2].answer3);
}

function loadStep(stepNumber){
	if(!isValidStep(stepNumber)) return;
	if(isLoaded[stepNumber-1]) return;
	printOutput("Loading step number"+stepNumber, outputTypes.LOG);
    var stepDescription = "<div class='gl-stepDescription center'>"+guiderJSON.steps[stepNumber-1].description+"</div> "
	$("#gl-step-"+(stepNumber-1)).html(stepDescription+createStepString(guiderJSON.steps[stepNumber-1].serviceType,guiderJSON.steps[stepNumber-1].externalData));
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
		var stepButtonString = '<div id="gl-stepButton-'+i+'" class="gl-stepButtonGeneral"></div>';
		stepBoxes.push(stepBoxString);
		stepButtons.push(stepButtonString);
	}
	$("#gl-stepsContent").append(stepBoxes.join(''));
	$("#gl-stepsButtonWrapper").append(stepButtons.join(''));

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

	$("#gl-stepsContent").height(countedPlayerHeight+"px");
//	$("#gl-stepsContent").draggable({
//        zIndex: 200,
//		axis: 'x',
//		start: function() {
//			draggableStartPosition = $("#gl-stepsContent").position().left;
//		},
//		stop: function(){
//			var currentPosition = $("#gl-stepsContent").position().left;
//			if(draggableStartPosition > currentPosition){
//				$('#gl-stepsContent').animate({
//				left:'-=200px',
//				}, 500, 'easeOutBack');
//			}else{
//				$('#gl-stepsContent').animate({
//				left:'+=200px',
//				}, 500, 'easeOutBack');
//			}
//        }
//	});
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
        if(isStepFinished(i)) $("#gl-stepButton-"+(i)).css("background-color","green");
	}
}

function initListeners() {
	$("#gl-leftArrow").click(previousStep);
	$("#gl-rightArrow").click(nextStep);
	$("#gl-question").click(displayQuestion);
    $("#gl-questionWindowClose").click(hideQuestion);
    $('input[name=gl-answers]').change(checkAnswer);
	$("#gl-answerConfirm").click(checkAnswer);
	for(var i=0;i<guiderJSON.steps.length;i++){
		$("#gl-stepButton-"+i).click(function(e) {
			var tmpNumber =  parseInt(e.target.id.split('-')[2]);
			showStep(tmpNumber+1);
		});
	}
}

function checkAnswer(){
	var answer = parseInt($('input[name=gl-answers]:checked').val());
    var correctAnswer = parseInt(guiderJSON.steps[currentStepNumber-1].correctAnswer);
	if(typeof(answer)=='undefined'){
        $('#gl-flashMessage').text("Check at least one answer!");
        return false;
    }

    var allFields = $("label[for*='gl-answerText']");
    var selectedField = $("label[for='gl-answerText"+answer.toString()+"']");
    var selectedRadio = $('input[name=gl-answers]:checked');
    var flashMessage = $("#gl-flashMessage");
    allFields.css("background-color","#fff");
    allFields.css("border","solid 1px #cacdce");

    if(answer == correctAnswer){
		stepsFinished[currentStepNumber-1] = true;
        increaseProgress();
        selectedField.css("background-color","#d1f0bd");
        selectedField.css("border","solid 2px #346f0d");
        flashMessage.css("color","#459410");
        flashMessage.text("Correct, move on! :)");


		showCurrentControls();
	} else {
		stepsFinished[currentStepNumber-1] = false;
        selectedField.css("background-color","#ffb1b1");
        selectedField.css("border","solid 2px #b00000");
        flashMessage.css("color","#e00909");
        flashMessage.text("Incorrect :(");
        selectedRadio.css("background-image","url('/assets/player/incorrect.png')")
        selectedRadio.css("background-position","0px 0px")
    }
}

function animateBrain(e){
    $('#gl-question').animate({top:'+7px',opacity:'0.5'},2000,"swing",animateBrainBack);
}

function animateBrainBack(e){
    $('#gl-question').animate({top:'-7px',opacity:'1'},2000,"swing",animateBrain);
}

function clearAnswers(){
    $("label[for*='gl-answerText']").removeAttr( 'style' );
    $('input[name=gl-answers]').removeAttr( 'style' );
    $("#gl-flashMessage").removeAttr( 'style' );
}

function displayQuestion(){
    var questionWindow = $("#gl-questionWindow");
    questionWindow.css("top","-500px");
    questionWindow.css("display","block");
    questionWindow.css("opacity","0");
    questionWindow.animate({top:'80px',opacity:'1'},1000,"swing");
}

function hideQuestion(){
    var questionWindow = $("#gl-questionWindow");
    questionWindow.css("opacity","1");
    questionWindow.animate({top:'-500px',opacity:'0'},1000,"swing", hideQuestionBlock);
}

function hideQuestionBlock(e){
    $("#gl-questionWindow").css("display","none");
}

function previousStep(){
	currentStepNumber--;
	checkBoundary();
	showStep(currentStepNumber);
}

function nextStep(){
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