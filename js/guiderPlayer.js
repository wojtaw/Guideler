outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

var guider = new Object();
guider.id = "John";
guider.name = 12;
guider.steps = new Array();

function initPlayer(guiderID){
	if(typeof(guiderID)=='undefined'){
		printOutput("Undegined guider ID", outputTypes.ERROR);
		return false;	
	}
	this.guiderID = guiderID;
	
	getGuiderData()
}

function getGuiderData(){
	//Here will be AJAX reqeust to obtain guider data
	
	
		
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
}