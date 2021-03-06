$(document).ready(function () {
    setTextAreasHeight();
    
    $(".tabs a").click(function(){
        var tab = $(this).attr('id');
        if(tab == "xmlDataLink") {
            showXmlData();
        } else {
            showXmlTagList();
        }
    });
    
    $("#convert").click(function() {
        xml2list();
        showXmlTagList();
    });
    
    $(window).resize(function() {
        setTextAreasHeight();
    });
});

function showXmlData() {
    $("#xmlData").removeClass("is-hidden");
    $("#xmlTagList").addClass("is-hidden");
    $("#xmlDataTab").addClass("is-active");
    $("#xmlTagListTab").removeClass("is-active");
}

function showXmlTagList() {
    $("#xmlData").addClass("is-hidden");
    $("#xmlTagList").removeClass("is-hidden");
    $("#xmlDataTab").removeClass("is-active");
    $("#xmlTagListTab").addClass("is-active");
}

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
    var y;
    for (y = 0; y < xmlNode.attributes.length; y++) {
        if(includeNamespacePrefixes) {
            $("#xmlTagListTextArea").val($("#xmlTagListTextArea").val() + currentPath + "/@" + xmlNode.attributes[y].name + "\n");
        } else {
            $("#xmlTagListTextArea").val($("#xmlTagListTextArea").val() + currentPath + "/@" + xmlNode.attributes[y].name.replace(xmlNode.attributes[y].prefix + ":", "") + "\n");
        }
    }
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
