var boxTypes =['video','article','map','gallery'];
boxTypes['video'] = ["youtube.com","youtu.be","vimeo.com"];
boxTypes['article'] = ["idnes.cz"];
boxTypes['map'] = ["maps.google.com"];
boxTypes['gallery'] = ["flickr.com","picasaweb.google.com"];


// Decode the link, identifz service and create appropriate window
function createStepString(externalLink){
	var urlBase = getURLBase(externalLink);
	boxType = getBoxType(urlBase);
	if(boxType == "video") return createVideoBox(externalLink, urlBase);
	else if(boxType == "gallery") return createImageGaleryBox(externalLink, urlBase);	
	else if(boxType == "article") return createArticleBox(externalLink, urlBase);	
	else if(boxType == "map") return createMapBox(externalLink, urlBase);			
	else return createCustomCodeBox(externalLink, urlBase);
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



//Individual boxes and their strings
function createVideoBox(externalLink, urlBase){
	console.log("video box");
	var videoID;
	var htmlString = "<h1>Video box</h1>";
	
	//Link Types
	//http://www.youtube.com/embed/J1IJpHDalvk
	//http://www.youtube.com/watch?feature=player_embedded&v=J1IJpHDalvk
	//

	if(urlBase == "youtube.com"){
		videoID = getURLquery("v",externalLink);
		var countedWidth = boxStandartWidth;
		var countedHeight = (boxStandartWidth * 9) / 16;		
		htmlString += '<object width="'+countedWidth+'" height="'+countedHeight+'">'+
			'<param name="movie" value="http://www.youtube.com/v/'+videoID+'?version=3&amp;hl=cs_CZ">'+
			'</param><param name="allowFullScreen" value="true"></param>'+
			'<param name="allowscriptaccess" value="always"></param>'+
			'<embed src="http://www.youtube.com/v/'+videoID+'?version=3&amp;hl=cs_CZ" type="application/x-shockwave-flash" width="'+countedWidth+'" height="'+countedHeight+'" allowscriptaccess="always" allowfullscreen="true"></embed>'+
			'</object>';
	}
	console.log(htmlString);
	return htmlString;
}

function createArticleBox(externalLink, urlBase){
	console.log("article");
	var htmlString = "<h1>Article box box</h1>";	
	return htmlString;
}

function createMapBox(externalLink, urlBase){
	console.log("map box");	
	var htmlString = "<h1>Map box</h1>";	
	return htmlString;	
}

function createImageGaleryBox(externalLink, urlBase){
	var htmlString = "<h1>Image box</h1>";	
	return htmlString;	
}

function createCustomCodeBox(externalLink, urlBase){
	console.log("custom box");
	var htmlString = "<h1>Custom box</h1>";	
	var countedWidth = boxStandartWidth;
	var countedHeight = (boxStandartWidth * 9) / 16;		
	
	htmlString += '<iframe src="'+externalLink+'" width="'+countedWidth+'" height="'+countedHeight+'"></iframe>'
	return htmlString;	
}