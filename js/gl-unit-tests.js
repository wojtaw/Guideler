// JavaScript Document	
var testDomainBase = {
    'http://youtu.be/Z6xJJMIifi8': "youtu.be", 
    'http://www.youtube.com/watch?v=J1IJpHDalvk': "youtube.com", 
	'http://www.youtube.com/watch?v=buX_WAy8CCI&list=PL6mMgmFafIG6rWbsKiUGCQQR_ZWl4GYbv':"youtube.com",
    'http://www.youtube.com/watch?NR=1&v=MjFTc8C24kI&feature=fvwp': "youtube.com", 	
    'http://www.techrepublic.com/article/manipulating-strings-with-javascript/5147185': "techrepublic.com", 
    'http://www.slideslive.com/LaDegustationOnline/w/38889586': "slideslive.com", 
    'http://slideslive.com/LaDegustationOnline/w/38889586': "slideslive.com", 	
    'https://vimeo.com/channels/staffpicks': "vimeo.com", 
    'https://VIMEO.COM/CHannels/staffpicks': "vimeo.com", 	
    'https://ViMEo.CoM/CHannels/staffpicks': "vimeo.com", 	
	'https://picasaweb.google.com/lh/myphotos?noredirect=1':"picasaweb.google.com",	
};	

function runTests(){
	testServices();
	createStepString("http://www.youtube.com/watch?v=J1IJpHDalvk");
}

function testServices(){
	printLog("Testing services");
	var testPass = true;
	var result;
	for (testedString in testDomainBase){
		result = getURLBase(testedString);
		expected = testDomainBase[testedString];
		if(result != expected){
			printLog("FAIL" + testedString+"----Expected "+expected+" recieved "+result);	
			testPass = false;
		}
	}
	
	if(testPass) printLog("TEST PASSED YEAAAAAAAAH");
	else printLog("EPIC FAIL");
}

function printLog(message){
	console.log("TEST LOG: "+message);	
}