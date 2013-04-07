// JavaScript Document	
var testDomainBase = {
    'http://youtu.be/Z6xJJMIifi8': "youtu", 
    'http://www.youtube.com/watch?v=J1IJpHDalvk': "youtube", 
};	

function runTests(){
	testServices()	
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