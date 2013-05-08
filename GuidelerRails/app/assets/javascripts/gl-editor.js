/**
 * Created with JetBrains RubyMine.
 * User: WojtawDell
 * Date: 5/6/13
 * Time: 10:49 PM
 * To change this template use File | Settings | File Templates.
 */
var editorGuiderJSON = new Object();
var steps = new Array();

function initEditor(){
    setInterval(editPrintJson,100000);
    editorGuiderJSON.name = "Testovaci jmeno";
    editorGuiderJSON.description = "Testovaci jmeno";
}

function editPrintJson(e){
     console.log("Result:"+JSON.stringify(editorGuiderJSON));
}
