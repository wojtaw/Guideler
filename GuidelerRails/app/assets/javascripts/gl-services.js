// Decode the link, identifz service and create appropriate window
var generatedRandomIDs = new Array();
function createStepString(serviceType,externalData){
    var stepString = "<div class='center'><div class='gl-stepContentWrapper clearfix'>";
    var tmpString = "";
    console.log("huraa zpitineeee"+serviceType);
	if(serviceType == "YOUTUBE") stepString += createYoutubeBox(externalData);
	else if(serviceType == "VIMEO") stepString += (createVimeoBox(externalData));
	else if(serviceType == "SOUNDCLOUD") stepString += (createSoundCloudBox(externalData));
    else if(serviceType == "SLIDESHARE") stepString += (createSlideshareBox(externalData));
    else if(serviceType == "FLICKR") stepString += (createFlickrBox(externalData));
    else if(serviceType == "SLIDESLIVE") stepString += (createSLBox(externalData));
	else if(serviceType == "GENERAL") stepString += (createGeneralBox(externalData));
    else if(serviceType == "CUSTOMCODE") stepString += (createCustomCodeBox(externalData));
    stepString += "</div></div>";
    return stepString;


}

//Individual boxes and their strings
function createYoutubeBox(externalData){
	var htmlString = '<iframe src="http://www.youtube.com/embed/'+externalData+'" class="gl-dynamic-videoAspectRatio center" frameborder="0" allowfullscreen>'+
					'</iframe>';
	return htmlString;
}

function createSoundCloudBox(externalData){
    var generatedID = generateUniqueID();
    var htmlString = "<div id='soundcloud-"+generatedID+"'></div> ";
    $.getJSON('http://soundcloud.com/oembed?',
        {format: 'json', url: externalData, iframe: true},
        function(data) {
            $('#soundcloud-'+generatedID).html(data['html']);
        }
    )
    return htmlString;
}

function createSlideshareBox(externalData){
    var generatedID = generateUniqueID();
    var htmlString = "<div class='gl-dynamic-slideAspectRatio center'><iframe id=slideshare-"+generatedID+" src=\"\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe></div>";

    $.ajax({
        type: 'GET',
        url: "http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/nminspiration/nmi13-jiri-materna",
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(data) {
            $('#slideshare-'+generatedID).attr('src','http://www.slideshare.net/slideshow/embed_code/'+data['slideshow_id']);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return htmlString;
}

function generateUniqueID(){
    var generatedID = Math.round(Math.random()*10000);
    while(generatedRandomIDs.indexOf(generatedID) != -1){
        generatedID = Math.round(Math.random()*10000);
    }
    generatedRandomIDs.push(generatedID);
    return generatedID;
}

function createFlickrBox(externalData){
    var generatedID = Math.round(Math.random()*10000);
    var htmlString = "<iframe id=flickr-"+generatedID+" src=\"\" width=\"427\" height=\"356\" frameborder=\"0\" allowfullscreen webkitallowfullscreen mozallowfullscreen> </iframe> ";
    $.getJSON('http://www.flickr.com/services/oembed/?callback=?',
        {format: 'json', url: externalData},
        function(data) {
            $('#flickr-'+generatedID).attr('src', "http://www.slideshare.net/slideshow/embed_code/"+data['slideshow_id']);
        }
    )
    return htmlString;
}



function createVimeoBox(externalData){
    var	htmlString = '<iframe src="http://player.vimeo.com/video/'+externalData+'" class="gl-dynamic-videoAspectRatio center" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen>'+
					'</iframe>';
	return htmlString;	
}

function createSLBox(externalData){
	var htmlString = '<div class="gl-slidesliveBox"><script type="text/javascript" id="sle81767">'+
			'slidesLive = createSlidesLiveBox();'+
			'slidesLive.bgColor="transparent"; '+
			'slidesLive.embedPresentation('+externalData+',960); '+
			'</script></div>';
	return htmlString;	
}

function createGeneralBox(externalData){
    var htmlString = '<iframe src="'+externalData+'" class="generalBox center"></iframe>'
	return htmlString;	
}


function createCustomCodeBox(externalData){
	var htmlString = "<h3>Custom box</h3>";	
	var countedWidth = boxStandartWidth;
	var countedHeight = (boxStandartWidth * 9) / 16;		
	

	return htmlString;	
}