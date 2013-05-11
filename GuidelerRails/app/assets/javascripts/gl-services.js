// Decode the link, identifz service and create appropriate window
function createStepString(serviceType,externalData){
	if(serviceType == "YOUTUBE") return createYoutubeBox(externalData);
	else if(serviceType == "VIMEO") return createVimeoBox(externalData);
	else if(serviceType == "SOUNDCLOUD") return createSoundCloudBox(externalData);
    else if(serviceType == "SLIDESHARE") return createSlideshareBox(externalData);
    else if(serviceType == "SLIDESLIVE") return createSLBox(externalData);
	else if(serviceType == "GENERAL") return createGeneralBox(externalData);		
	else if(serviceType == "CUSTOMCODE") return createCustomCodeBox(externalData);			


}

//Individual boxes and their strings
function createYoutubeBox(externalData){
	var htmlString = "<h3>Youtube box</h3>";
	htmlString += '<iframe src="http://www.youtube.com/embed/'+externalData+'" class="videoAspectRatio center" frameborder="0" allowfullscreen>'+
					'</iframe>';
	return htmlString;
}

function createSoundCloudBox(externalData){
    var generatedID = Math.round(Math.random()*10000);
    var htmlString = "<h3>Soundcloud box</h3><div id='soundcloud-"+generatedID+"'></div> ";
    $.getJSON('http://soundcloud.com/oembed?',
        {format: 'json', url: externalData, iframe: true},
        function(data) {
            $('#soundcloud-'+generatedID).html(data['html']);
        }
    )
    return htmlString;
}

function createSlideshareBox(externalData){
    var generatedID = Math.round(Math.random()*10000);
    var htmlString = "<h3>Soundcloud box</h3><div id='soundcloud-"+generatedID+"'></div> ";
    $.getJSON('http://www.slideshare.net/api/oembed/2?',
        {format: 'json', url: externalData},
        function(data) {
            $('#soundcloud-'+generatedID).html(data['html']);
        }
    )
    return htmlString;
}

function createVimeoBox(externalData){
	var htmlString = "<h3>Vimeo box</h3>";
		htmlString += '<iframe src="http://player.vimeo.com/video/'+externalData+'" class="videoAspectRatio center" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen>'+
					'</iframe>';
	return htmlString;	
}

function createSLBox(externalData){
	var htmlString = "<h3>SlidesLive box</h3>";
		htmlString += '<script type="text/javascript" id="sle81767">'+
			'slidesLive = createSlidesLiveBox();'+
			'slidesLive.bgColor="transparent"; '+
			'slidesLive.embedPresentation('+externalData+',960); '+
			'</script>';
	return htmlString;	
}

function createGeneralBox(externalData){
	var htmlString = "<h3>General box</h3>";
	htmlString += '<iframe src="'+externalData+'" class="generalBox center"></iframe>'
	return htmlString;	
}


function createCustomCodeBox(externalData){
	console.log("custom box");
	var htmlString = "<h3>Custom box</h3>";	
	var countedWidth = boxStandartWidth;
	var countedHeight = (boxStandartWidth * 9) / 16;		
	

	return htmlString;	
}