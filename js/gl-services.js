var boxTypes =["video","article","map","gallery"];

webProviders = {
    "youtube.com" : "YOUTUBE",
    "youtu.be" : "YOUTUBE",	
    "vimeo.com" : "VIMEO",
    "slideslive.com" : "SLIDESLIVE",
    "flickr.com" : "FLICKR",
    "picasaweb.google.com" : "PICASA",					
}



// Decode the link, identifz service and create appropriate window
function createStepString(externalLink){
	console.log("Analyzing link"+externalLink);
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

function getLinkParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function createVideoBox(){
	
}

function createArticleBox(){
	
}

function createMapBox(){
	
}

function createImageGaleryBox(){
	
}

function createCustomCodeBox(){
	
}