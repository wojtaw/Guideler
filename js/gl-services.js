// Decode the link, identifz service and create appropriate window
function createStepString(serviceType,externalData){
	if(serviceType == "YOUTUBE") return createYoutubeBox(externalData);
	else if(serviceType == "VIMEO") return createVimeoBox(externalData);
	else if(serviceType == "SLIDESLIVE") return createSLBox(externalData);	
	else if(serviceType == "GENERAL") return createGeneralBox(externalData);		
	else if(serviceType == "CUSTOMCODE") return createCustomCodeBox(externalData);			


}

//Individual boxes and their strings
function createYoutubeBox(externalData){
	var htmlString = "<h1>Youtube box</h1>";
	htmlString += '<iframe src="http://www.youtube.com/embed/'+externalData+'" class="videoAspectRatio center" frameborder="0" allowfullscreen>'+
					'</iframe>';
	return htmlString;
}

function createVimeoBox(externalData){
	var htmlString = "<h1>Vimeo box</h1>";
		htmlString += '<iframe src="http://player.vimeo.com/video/'+externalData+'" class="videoAspectRatio center" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen>'+
					'</iframe>';
	return htmlString;	
}

function createSLBox(externalData){
	var htmlString = "<h1>SlidesLive box</h1>";
		htmlString += '<script type="text/javascript" id="sle81767">'+
			'slidesLive = createSlidesLiveBox();'+
			'slidesLive.bgColor="transparent"; '+
			'slidesLive.embedPresentation('+externalData+',960); '+
			'</script>';
	return htmlString;	
}

function createGeneralBox(externalData){
	var htmlString = "<h1>General box</h1>";
	htmlString += '<iframe src="'+externalData+'" class="generalBox center"></iframe>'
	return htmlString;	
}


function createCustomCodeBox(externalData){
	console.log("custom box");
	var htmlString = "<h1>Custom box</h1>";	
	var countedWidth = boxStandartWidth;
	var countedHeight = (boxStandartWidth * 9) / 16;		
	

	return htmlString;	
}