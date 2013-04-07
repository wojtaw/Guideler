gl.outputTypes = {
    ERROR : "error: ",
    LOG : "log: ",
    DEBUG : "debug: "
}

function initPlayer(guiderID){
	if(typeof(guiderID)=='undefined'){
		printOutput("Undegined guider ID", gl.outputTypes.ERROR);
		return false;	
	}
}

function printOutput(message, outputTypes){
	console.log(outputTypes + " " + message);
}