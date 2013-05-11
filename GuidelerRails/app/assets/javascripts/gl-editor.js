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
            var description = data.steps[i].description;
            var question = data.steps[i].question;
            var answer1 = data.steps[i].answers[0].answer1;
            var answer2 = data.steps[i].answers[1].answer2;
            var answer3 = data.steps[i].answers[2].answer3;
            if(data.steps[i].questionEnabled == true || data.steps[i].questionEnabled == "TRUE" || data.steps[i].questionEnabled == "true")
                var questionEnabled = true
            else
                var questionEnabled = false
            var correctAnswer = data.steps[i].correctAnswer;
            editSteps[i] = createStep(externalLink,question, answer1, answer2, answer3,correctAnswer,questionEnabled,description);
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
        editSteps.push(createStep("","","","","","",true,""));

    currentEditStep = editSteps.length - 1;

    initEditorListeners();
    redrawEditorGUI();
}

function initEditorListeners() {
    $("#edit-newStepButton").click(addStep);
    $("#edit-saveGuiderButton").click(saveEditData);
    $("#edit-questionSwitch").click(questionEnableSwitch);
    $("#edit-stepLink").blur(linkEntered);
    $('input[name=edit-correctAnswer]').change(colorAnswerField);

    refreshStepListeners();
}

function colorAnswerField(){
   var tmpValue = $('input[name=edit-correctAnswer]:checked').val();
   var allFields = $('.edit-answerField');
   var selectedField = $('#edit-answer'+tmpValue);
    allFields.css("background-color","#fff");
    allFields.css("border","solid 1px #cacdce");

    selectedField.css("background-color","#d1f0bd");
    selectedField.css("border","solid 2px #346f0d");
}

//---------OTHER LOGIC

function linkEntered(){
    lightServiceIcon($("#edit-stepLink").val());
}

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
    colorAnswerField();
}
function refreshStepBar(){
    console.log("Refreshing");
    console.log(editSteps)
    var editStepButtons= [];
    //TODO
    var stateClass = "edit-step-empty";
    for(var i=0;i < editSteps.length;i++){
        var stepButtonString = '<div id="edit-stepButton-'+i+'" class="edit-stepGeneralButton '+stateClass+'"></div><div id="edit-stepDelete-'+i+'" class="edit-stepDeleteButton"></div>';
        editStepButtons.push(stepButtonString);

    }
    $("#edit-stepButtonsBar").html(editStepButtons.join(''));

    $("#edit-stepButton-"+currentEditStep).addClass("edit-stepGeneralButtonActive");
    refreshStepListeners();
}

function refreshStepListeners(){
     for(var i=0;i<editSteps.length;i++){
         $("#edit-stepDelete-"+i).click(function(e) {
             var tmpNumber =  parseInt(e.target.id.split('-')[2]);
             deleteStep(tmpNumber);
         });

         $("#edit-stepButton-"+i).click(function(e) {
             saveCurrentStep();
         var tmpNumber =  parseInt(e.target.id.split('-')[2]);
             editStep(tmpNumber);
         });
     }
}

function refreshEditTabs() {
    lightServiceIcon(editSteps[currentEditStep].externalLink);

    $('#edit-stepLink').val(editSteps[currentEditStep].externalLink);
    $('#edit-question').val(editSteps[currentEditStep].question);
    $('#edit-answer1').val(editSteps[currentEditStep].answer1);
    $('#edit-answer2').val(editSteps[currentEditStep].answer2);
    $('#edit-answer3').val(editSteps[currentEditStep].answer3);
    //Decheck radios and check proper one
    $('#edit-radio-answer'+editSteps[currentEditStep].correctAnswer).get(0).checked = true;
}

function lightServiceIcon(sourceLink){
    $('#edit-serviceBar').animate({opacity: 1}, 300);
    var tmpResult = parseURLHost(sourceLink);
    console.log("Matching resullllllllllllt"+tmpResult);
    var servicesArray = new Array("google","youtube","vimeo","flickr","picasa","soundcloud","wordpress","wikipedia","slideslive","slideshare");
    for(var i=0;i<servicesArray.length;i++){
        if(servicesArray[i] == tmpResult){
            $('#edit-serviceBar').animate({opacity: 0.2}, 500);
            $('#edit-service-'+servicesArray[i]+'-light').css({opacity: 0, visibility: "visible"}).animate({opacity: 1.0}, 800);
        }
        else $('#edit-service-'+servicesArray[i]+'-light').css("visibility","hidden");
    }



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
        $("#edit-switchOff").css("background-color","#000000");
        $("#edit-thinkBox").css("display","none");
    }
}

/////////WORKING WITH STEPS
function createStep(externalLink, question, answer1, answer2, answer3, correctAnswer, questionEnabled, description){
    var tmpStep = new Object();
    tmpStep.externalLink = externalLink;
    tmpStep.question = question;
    tmpStep.answers = new Object();
    tmpStep.answer1 = answer1;
    tmpStep.answer2 = answer2;
    tmpStep.answer3 = answer3;
    tmpStep.description = description;


    if(typeof(correctAnswer)=='undefined') tmpStep.correctAnswer = 1;
    else tmpStep.correctAnswer = correctAnswer;

    if(typeof(questionEnabled)!='undefined') tmpStep.questionEnabled = questionEnabled;
    return tmpStep;
}


function addStep(){
    editSteps.push(createStep("","","","","",1,true,""));
    saveCurrentStep();
    editStep(editSteps.length - 1);
}

function saveCurrentStep() {
    var linkResult = validateAndFixURL($('#edit-stepLink').val())
    if(linkResult == "false")
        editSteps[currentEditStep].externalLink = "http://www.guideler.com/";
    else
        editSteps[currentEditStep].externalLink = linkResult;
    editSteps[currentEditStep].question = $('#edit-question').val();
    editSteps[currentEditStep].description = $('#edit-stepDescription').val();
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

function deleteStep(stepIndex){
    if(currentEditStep == stepIndex){

    }else{
        refreshGUI();
    }
}

function refreshGUI(){

}

function validateAndFixURL(checkUrl){
    if(checkUrl.indexOf("http://") == 0) return checkUrl
    else if(checkUrl.indexOf("https://") == 0) return checkUrl
    else if(checkUrl.indexOf("www") == 0) return ("http://"+checkUrl);
    else if(isBrokenURL(checkUrl)) return ("http://"+checkUrl);
    else return "false";
}

function isBrokenURL(brokenURL){
    console.log("BROKEN DOMAIN");
    var containsEnding = false;
    var tldArray = new Array(".aero",".biz",".cat",".com",".coop",".edu",".gov",".info",".int",".jobs",".mil",".mobi",".museum",
        ".name",".net",".org",".travel",".ac",".ad",".ae",".af",".ag",".ai",".al",".am",".an",".ao",".aq",".ar",".as",".at",".au",".aw",
        ".az",".ba",".bb",".bd",".be",".bf",".bg",".bh",".bi",".bj",".bm",".bn",".bo",".br",".bs",".bt",".bv",".bw",".by",".bz",".ca",
        ".cc",".cd",".cf",".cg",".ch",".ci",".ck",".cl",".cm",".cn",".co",".cr",".cs",".cu",".cv",".cx",".cy",".cz",".de",".dj",".dk",".dm",
        ".do",".dz",".ec",".ee",".eg",".eh",".er",".es",".et",".eu",".fi",".fj",".fk",".fm",".fo",".fr",".ga",".gb",".gd",".ge",".gf",".gg",".gh",
        ".gi",".gl",".gm",".gn",".gp",".gq",".gr",".gs",".gt",".gu",".gw",".gy",".hk",".hm",".hn",".hr",".ht",".hu",".id",".ie",".il",".im",
        ".in",".io",".iq",".ir",".is",".it",".je",".jm",".jo",".jp",".ke",".kg",".kh",".ki",".km",".kn",".kp",".kr",".kw",".ky",".kz",".la",".lb",
        ".lc",".li",".lk",".lr",".ls",".lt",".lu",".lv",".ly",".ma",".mc",".md",".mg",".mh",".mk",".ml",".mm",".mn",".mo",".mp",".mq",
        ".mr",".ms",".mt",".mu",".mv",".mw",".mx",".my",".mz",".na",".nc",".ne",".nf",".ng",".ni",".nl",".no",".np",".nr",".nu",
        ".nz",".om",".pa",".pe",".pf",".pg",".ph",".pk",".pl",".pm",".pn",".pr",".ps",".pt",".pw",".py",".qa",".re",".ro",".ru",".rw",
        ".sa",".sb",".sc",".sd",".se",".sg",".sh",".si",".sj",".sk",".sl",".sm",".sn",".so",".sr",".st",".su",".sv",".sy",".sz",".tc",".td",".tf",
        ".tg",".th",".tj",".tk",".tm",".tn",".to",".tp",".tr",".tt",".tv",".tw",".tz",".ua",".ug",".uk",".um",".us",".uy",".uz", ".va",".vc",
        ".ve",".vg",".vi",".vn",".vu",".wf",".ws",".ye",".yt",".yu",".za",".zm",".zr",".zw");
    for(var i=0; i < tldArray.length; i++){
        if(brokenURL.indexOf(tldArray[i]) != -1) containsEnding = true;
    }
    return containsEnding;
}

function parseURLHost(urlToParse){
    urlToParse = validateAndFixURL(urlToParse);
    if(urlToParse == "false") return "FALSE";
    console.log("Parsiing -" + urlToParse);
    var a =  document.createElement('a');
    a.href = urlToParse;
    var result = String(a.hostname);
    result = result.toLowerCase();
    if(result.indexOf("www.") === 0) result = result.substring(4,result.length);

    if(result == "youtube.com") return "youtube";
    else if(result == "vimeo.com") return "vimeo";
    else if(result == "soundcloud.com") return "soundcloud";
    else if(result == "flickr.com") return "flickr";
    else if(result == "wikipedia.org") return "wikipedia";
    else if(result == "en.wikipedia.org") return "wikipedia";
    else if(result == "slideslive.com") return "slideslive";
    else if(result == "slideshare.com") return "slideshare";
    else if(result == "slideshare.net") return "slideshare";
    else if(result == "google.com") return "google";
    else return "unknown"
}
