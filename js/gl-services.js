var boxTypes =['video','article','map','gallery'];
boxTypes['video'] = ["youtube.com","youtu.be","vimeo.com"];
boxTypes['article'] = ["idnes.cz"];
boxTypes['map'] = ["maps.google.com"];
boxTypes['gallery'] = ["flickr.com","picasaweb.google.com"];


// Decode the link, identifz service and create appropriate window
function createStepString(externalLink){
	console.log("Analyzing link "+externalLink);
	var urlBase = getURLBase(externalLink);
	boxType = getBoxType(urlBase);
	if(boxType == "video") createVideoBox(externalLink, urlBase);
	else if(boxType == "gallery") createImageGaleryBox(externalLink, urlBase);	
	else if(boxType == "article") createArticleBox(externalLink, urlBase);	
	else if(boxType == "map") createMapBox(externalLink, urlBase);			
	else createCustomCodeBox(externalLink, urlBase);
}

function getBoxType(urlBase){
	for(var i=0;i < boxTypes.length;i++){
		currentType = boxTypes[i];
		for(var j=0; j< boxTypes[currentType].length; j++){
			if(boxTypes[currentType][j] == urlBase) return boxTypes[i];
		}		
	}
	return "UNKNOWN";
}

function getURLBase(url){
	var tmpa = document.createElement('a');
	tmpa.href = url;
	var workingString = tmpa.hostname;
	if(workingString.indexOf("www.") == 0) 
		workingString = workingString.slice(4,workingString.length);
	workingString = workingString.toLowerCase();
	return workingString;	
}

function getURLquery(query,url) {
	query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var expr = "[\\?&]"+query+"=([^&#]*)";
	var regex = new RegExp( expr );
	var results = regex.exec( url );
	if ( results !== null ) {
		return results[1];
	} else {
		return false;
	}
}

//Helper functions for boxes
function parseVideoID(externalLink){
	console.log(getURLquery("watch",externalLink));
}


//Individual boxes and their strings
function createVideoBox(externalLink, urlBase){
	console.log("video box");
	parseVideoID(externalLink);
	var htmlString = "<h1>Video box</h1>";
}

function createArticleBox(externalLink, urlBase){
	console.log("article");
}

function createMapBox(externalLink, urlBase){
	console.log("map box");	
}

function createImageGaleryBox(externalLink, urlBase){
	
}

function createCustomCodeBox(externalLink, urlBase){
	console.log("custom box");
}