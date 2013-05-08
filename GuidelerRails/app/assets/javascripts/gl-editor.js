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

function initEditor(){

    //Create first emptz step
    editSteps.push(createStep("","","","","","",""));

    initEditorListeners();

    refreshStepBar();
}

function initEditorListeners() {
    $("#edit-newStepButton").click(addStep);
    $("#edit-saveGuiderButton").click(editPrintJson);
    /*
    for(var i=0;i<guiderJSON.steps.length;i++){
        $("#gl-stepButton-"+i).click(function(e) {
            var tmpNumber =  parseInt(e.target.id.split('-')[2]);
            showStep(tmpNumber+1);
        });
    }
    */
}

function addStep(){
    editSteps.push(createStep("","","","","","",""));
    refreshStepBar();
}

function editPrintJson(e){
    editorGuiderJSON.name = "Testovaci jmeno";
    editorGuiderJSON.description = "Testovaci jmeno";
    editorGuiderJSON.steps = editSteps;
    console.log("Result:"+JSON.stringify(editorGuiderJSON));
}

function refreshStepBar(){
    console.log("Refreshing");
    var editStepButtons= [];
    for(var i=0;i < editSteps.length;i++){
        var stepButtonString = '<div id="gl-stepButton-'+i+'" class="edit-stepGeneralButton">'+i+'</div>';
        editStepButtons.push(stepButtonString);
    }
    $("#edit-stepButtonsBar").html(editStepButtons.join(''));
}

function refreshEditTabs() {

}

function createStep(externalLink, questionEnabled, questionText, answer1, answer2, answer3, correctAnswer){
    var tmpStep = new Object();
    tmpStep.externalLink = externalLink;
    tmpStep.questionEnabled = questionEnabled;
    tmpStep.questionText = questionText;
    tmpStep.answer1 = answer1;
    tmpStep.answer2 = answer2;
    tmpStep.answer3 = answer3;
    tmpStep.correctAnswer = correctAnswer;
    return tmpStep;
}
