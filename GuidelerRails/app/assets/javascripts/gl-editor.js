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
    this.guiderEditID = guiderEditID;
    //Create first emptz step
    editSteps.push(createStep("","","","","","",""));

    initEditorListeners();

    refreshStepBar();
}

function initEditorListeners() {
    $("#edit-newStepButton").click(addStep);
    $("#edit-saveGuiderButton").click(saveEditData);
    refreshStepListeners();
}

function addStep(){
    editSteps.push(createStep("","","","","","",""));
    saveCurrentStep();
    refreshStepBar();
    editStep(editSteps.length - 1);
}

function saveEditData(){
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

function prepareEditJSON(){
    for(var i=0;i<editSteps.length;i++){
        editSteps[i].step_order = (i+1);
    }
    editorGuiderJSON.guider_id = guiderEditID;
    editorGuiderJSON.name = "Testovaci jmeno";
    editorGuiderJSON.description = "Testovaci jmeno";
    editorGuiderJSON.steps = editSteps;
    console.log("Result:"+JSON.stringify(editorGuiderJSON));
}

function saveSuccess(e) {
    console.log("Server responded: "+e)
}

function refreshStepBar(){
    console.log("Refreshing");
    var editStepButtons= [];
    for(var i=0;i < editSteps.length;i++){
        var stepButtonString = '<div id="edit-stepButton-'+i+'" class="edit-stepGeneralButton">'+i+'</div>';
        editStepButtons.push(stepButtonString);
    }
    $("#edit-stepButtonsBar").html(editStepButtons.join(''));
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

function saveCurrentStep() {
    var externalLink = $('#edit-stepLink').val();
    var questionText = $('#edit-question').val();
    var answer1 = $('#edit-answer1').val();
    var answer2 = $('#edit-answer2').val();
    var answer3 = $('#edit-answer3').val();
    var questionEnabled = true;
    var correctAnswer = 1;
    editSteps[currentEditStep] = createStep(externalLink,questionText, answer1, answer2, answer3,correctAnswer,questionEnabled);
}

function editStep(stepIndex){
    currentEditStep = stepIndex;
    refreshEditTabs();
}

function refreshEditTabs() {
    $('#edit-stepLink').val(editSteps[currentEditStep].externalLink);
    $('#edit-question').val(editSteps[currentEditStep].questionText);
    $('#edit-answer1').val(editSteps[currentEditStep].answer1);
    $('#edit-answer2').val(editSteps[currentEditStep].answer2);
    $('#edit-answer3').val(editSteps[currentEditStep].answer3);
}

function createStep(externalLink, questionText, answer1, answer2, answer3, correctAnswer, questionEnabled){
    var tmpStep = new Object();
    tmpStep.externalLink = externalLink;
    tmpStep.questionText = questionText;
    tmpStep.answer1 = answer1;
    tmpStep.answer2 = answer2;
    tmpStep.answer3 = answer3;
    tmpStep.correctAnswer = correctAnswer;
    tmpStep.questionEnabled = questionEnabled;
    return tmpStep;
}
