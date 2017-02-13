// TODO: XML parsing using jQuery
// TODO: Print attributes

$(document).ready(function () {
    setTextAreasHeight();
    
    $(".nav-tabs a").click(function(){
        $(this).tab('show');
    });
    
    $("#convert").click(function() {
        xml2list();
        $('.nav-tabs a[href="#xmlTagList"]').tab('show');
    });
    
    $(window).resize(function() {
        setTextAreasHeight();
    });
});

function setTextAreasHeight() {
    $("#xmlDataTextArea").attr('style', 'height:' + (window.innerHeight - 130) + 'px');
    $("#xmlTagListTextArea").attr('style', 'height:' + (window.innerHeight - 130) + 'px');
}

function xml2list() {
    var xmlString = $("#xmlDataTextArea").val();
    $("#xmlTagListTextArea").val("");

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml");

    if(xmlDoc.getElementsByTagName("parsererror")[0]) {
        $("#xmlTagListTextArea").val("Please enter well formed XML");
    } else {
        var currentPath = "/" + xmlDoc.firstChild.nodeName.replace(xmlDoc.firstChild.prefix + ":", "");
        traverseAndPrintPath(xmlDoc.firstChild, currentPath, $("#printAllOccurrences").is(':checked'), $("#includeNamespacePrefixes").is(':checked'));
    }
}

function traverseAndPrintPath(xmlNode, currentPath, printAllOccurrences, includeNamespacePrefixes) {
    for (var i = 0; i < xmlNode.children.length; i++) {
        var childNode = xmlNode.children[i];

        if(i == 0 || printAllOccurrences || childNode.nodeName != xmlNode.children[i - 1].nodeName) {
            // Remove namespace prefix
            if(includeNamespacePrefixes) {
                var newPath = currentPath + "/" + childNode.nodeName;              
            } else {
                var newPath = currentPath + "/" + childNode.nodeName.replace(childNode.prefix + ":", "");
            }

            // Recurse
            traverseAndPrintPath(childNode, newPath, printAllOccurrences, includeNamespacePrefixes);
        }
    }
    if(xmlNode.children.length == 0) {
        $("#xmlTagListTextArea").val($("#xmlTagListTextArea").val() + currentPath + "\n");
    }
}
