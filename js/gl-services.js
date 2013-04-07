// Decode the link, identifz service and create appropriate window
function createStepString(externalLink){
	console.log("Analyzing link"+externalLink);
}

function getURLBase(url){
  var regexS = "a";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  return results;
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