/**
 * Created with JetBrains RubyMine.
 * User: WojtawDell
 * Date: 5/6/13
 * Time: 10:49 PM
 * To change this template use File | Settings | File Templates.
 */
var editorGuiderJSON = new Object();
var editSteps = new Array();
var currentEditStep = 0;
var guiderEditID = -1;

function initEditor(guiderEditID){
    //Add CSS class via unique ID
    $('body').attr('id', 'editor-body');

    this.guiderEditID = guiderEditID;
    //First load steps of this guider
    $.getJSON((glPathToJSONAPI+guiderEditID), function(data) {
        editorGuiderJSON.guiderName = data.guiderName;
        editorGuiderJSON.guiderName = data.guiderName;

        console.log("looping through steps "+data.steps.length)
        for(var i=0;i < data.steps.length;i++){
            var externalLink = data.steps[i].originalLink;
            var question = data.steps[i].question;
            var answer1 = data.steps[i].answers[0].answer1;
            var answer2 = data.steps[i].answers[1].answer2;
            var answer3 = data.steps[i].answers[2].answer3;
            if(data.steps[i].questionEnabled == true || data.steps[i].questionEnabled == "TRUE" || data.steps[i].questionEnabled == "true")
                var questionEnabled = true
            else
                var questionEnabled = false
            var correctAnswer = data.steps[i].correctAnswer;
            editSteps[i] = createStep(externalLink,question, answer1, answer2, answer3,correctAnswer,questionEnabled);
        }
        editorJSONloadingFinished();
    });
}

//////////////INIT functions
function prepareEditJSON(){
    for(var i=0;i<editSteps.length;i++){
        editSteps[i].step_order = (i+1);
    }
    editorGuiderJSON.guiderID = guiderEditID;
    editorGuiderJSON.guiderName = $("#edit-guiderName").val();
    editorGuiderJSON.guiderDescription = $("#edit-guiderDescription").val();
    editorGuiderJSON.steps = editSteps;
    console.log("Sending out");
    console.log(JSON.stringify(editorGuiderJSON));
}

function saveSuccess(e) {
    console.log("Server responded: "+e);
    $("#edit-saveGuiderButton").html("Saved");
}

function editorJSONloadingFinished(){
    //Create first step if guider is empty
    if(editSteps.length == 0)
        editSteps.push(createStep("","","","","","",true));

    currentEditStep = editSteps.length - 1;

    initEditorListeners();
    redrawEditorGUI();
}

function initEditorListeners() {
    $("#edit-newStepButton").click(addStep);
    $("#edit-saveGuiderButton").click(saveEditData);
    $("#edit-questionSwitch").click(questionEnableSwitch);
    refreshStepListeners();
}

//---------OTHER LOGIC

function saveEditData(){
    $("#edit-saveGuiderButton").html("Saving...");
    saveCurrentStep()
    prepareEditJSON();

    $.ajax({
        url: '/api/edit_guider',
        type: 'POST',
        data: JSON.stringify(editorGuiderJSON),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: saveSuccess()
    });
}

//--------REDRAWING GUI
function redrawEditorGUI(){
    $("#edit-saveGuiderButton").html("Save");
    showSwitchState();
    refreshStepBar();
    refreshEditTabs();
}
function refreshStepBar(){
    console.log("Refreshing");
    console.log(editSteps)
    var editStepButtons= [];
    //TODO
    var stateClass = "edit-step-empty";
    for(var i=0;i < editSteps.length;i++){
        var stepButtonString = '<div id="edit-stepButton-'+i+'" class="edit-stepGeneralButton '+stateClass+'">'+i+'</div>';
        editStepButtons.push(stepButtonString);

    }
    $("#edit-stepButtonsBar").html(editStepButtons.join(''));

    $("#edit-stepButton-"+currentEditStep).addClass("edit-stepGeneralButtonActive");
    refreshStepListeners();
}

function refreshStepListeners(){
     for(var i=0;i<editSteps.length;i++){
     $("#edit-stepButton-"+i).click(function(e) {
         saveCurrentStep();
     var tmpNumber =  parseInt(e.target.id.split('-')[2]);
         editStep(tmpNumber);
     });
     }
}

function refreshEditTabs() {
    console.log("PARSIIIIIIIIIIIIIIING "+parseURLHost(editSteps[currentEditStep].externalLink));

    $('#edit-stepLink').val(editSteps[currentEditStep].externalLink);
    $('#edit-question').val(editSteps[currentEditStep].question);
    $('#edit-answer1').val(editSteps[currentEditStep].answer1);
    $('#edit-answer2').val(editSteps[currentEditStep].answer2);
    $('#edit-answer3').val(editSteps[currentEditStep].answer3);
    //Decheck radios and check proper one
    //$('input[name=edit-correctAnswer]').attr('checked', false);
    console.log("Should be checked number /////////"+editSteps[currentEditStep].correctAnswer);
    $('#edit-radio-answer'+editSteps[currentEditStep].correctAnswer).get(0).checked = true;
}

function questionEnableSwitch(){
    if(editSteps[currentEditStep].questionEnabled == true)
        editSteps[currentEditStep].questionEnabled = false;
    else
        editSteps[currentEditStep].questionEnabled = true;
    showSwitchState();
}

function showSwitchState(){
    if(editSteps[currentEditStep].questionEnabled){
        $("#edit-switchOff").css("background-color","#b4b6b6");
        $("#edit-switchOn").css("background-color","#346f0d");
        $("#edit-thinkBox").css("display","block");
    } else {
        $("#edit-switchOn").css("background-color","#b4b6b6");
        $("#edit-switchOff").css("background-color","#346f0d");
        $("#edit-thinkBox").css("display","none");
    }
}

/////////WORKING WITH STEPS
function createStep(externalLink, question, answer1, answer2, answer3, correctAnswer, questionEnabled){
    var tmpStep = new Object();
    tmpStep.externalLink = externalLink;
    tmpStep.question = question;
    tmpStep.answers = new Object();
    tmpStep.answer1 = answer1;
    tmpStep.answer2 = answer2;
    tmpStep.answer3 = answer3;


    if(typeof(correctAnswer)=='undefined') tmpStep.correctAnswer = 1;
    else tmpStep.correctAnswer = correctAnswer;

    if(typeof(questionEnabled)!='undefined') tmpStep.questionEnabled = questionEnabled;
    return tmpStep;
}


function addStep(){
    editSteps.push(createStep("","","","","","",true));
    saveCurrentStep();
    editStep(editSteps.length - 1);
}

function saveCurrentStep() {
    editSteps[currentEditStep].externalLink = $('#edit-stepLink').val();
    editSteps[currentEditStep].question = $('#edit-question').val();
    editSteps[currentEditStep].answer1 = $('#edit-answer1').val();
    editSteps[currentEditStep].answer2 = $('#edit-answer2').val();
    editSteps[currentEditStep].answer3 = $('#edit-answer3').val();
    var tmpCorrectAnswer = $('input[name=edit-correctAnswer]:checked').val();
    if(typeof(tmpCorrectAnswer)=='undefined') tmpCorrectAnswer = 1;
    editSteps[currentEditStep].correctAnswer = tmpCorrectAnswer;
}

function editStep(stepIndex){
    currentEditStep = stepIndex;
    redrawEditorGUI();
}

function validateAndFixURL(checkUrl){
    if(checkUrl.indexOf("http://") == 0) return checkUrl
    else if(checkUrl.indexOf("https://") == 0) return checkUrl
    else {
        if(checkUrl.indexOf("www") == 0){
            return ("http://"+checkUrl);
        }
    }
}

function parseURLHost(urlToParse){
    urlToParse = validateAndFixURL(urlToParse);

    console.log("Parsiing -" + urlToParse);
    var a =  document.createElement('a');
    a.href = urlToParse;
    var result = String(a.hostname);
    result = result.toLowerCase();
    if(result.indexOf("www.") === 0) result = result.substring(4,result.length);
    return result;
}
