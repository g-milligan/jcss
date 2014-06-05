<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>CSS Editor</title>
<script type="text/javascript">
    var undockedStatePath = 'window >> orientation.xml >> //orientation/undocked';
    var resize_timeout;
    function windowResizeEnd() {
        //get the current window width and height
        var wWidth = window.outerWidth;
        var wHeight = window.outerHeight;
        //save the window dimensions state
        opener.jcss.requestState(function(resp){
            if(resp.readyState==4){
                //--- console.log('test: '+resp.responseText);
            }
        }, undockedStatePath, '<width>'+wWidth+'px</width><height>'+wHeight+'px</height>');
    }
    function windowResize() {
        //while resizing, cancel the windowResizeEnd timeout
        clearTimeout(resize_timeout);
        resize_timeout = setTimeout(windowResizeEnd, 100);
        //resize open pane/sub-panes
        opener.jcss.ui.resizeActivePane();
    }
    function windowLoad() {
        //request the window's saved orientation state
        opener.jcss.requestState(function(resp){
            if(resp.readyState==4){
                //convert the orientation string data to JSON object
                var dataStr=resp.responseText;
                var orientation = JSON.parse(dataStr);
                //convert to integer
                var oWidth = parseInt(orientation.width);
                var oHeight = parseInt(orientation.height);
                //resize the window based on the saved width and height state
                window.resizeTo(oWidth,oHeight); 
                //set the window focus
                window.focus();  
                //make sure the placeholder is hidden in the main window
                opener.jcss.ui.win.hidePlaceholder();
            }
        }, undockedStatePath);
        //add the window resize event
        if (window.addEventListener) {window.addEventListener('resize', windowResize, false);} 
        else if (window.attachEvent) {window.attachEvent('onresize', windowResize);}
    }
    function windowFocus(){
        opener.jcss.ui.win.hidePlaceholder();
    }
    function windowMouseOver(){
        opener.jcss.ui.win.hidePlaceholder();
    }
    //ui <body> load and unload 
    function uiLoad(){
        //build the ui in this undocked window
        opener.jcss.ui.refresh();
        //add the body mouseover event
        if (window.addEventListener) {window.addEventListener('mouseover', windowMouseOver, false);} 
        else if (window.attachEvent) {window.attachEvent('onmouseover', windowMouseOver);}
    }
    function uiUnload(){opener.jcss.ui.win.close();}//close this undocked window AND rebuild the docked ui
    //add the window load event
    if (window.addEventListener) {window.addEventListener('load', windowLoad, false);} 
    else if (window.attachEvent) {window.attachEvent('onload', windowLoad);}
    //add the window focus event
    if (window.addEventListener) {window.addEventListener('focus', windowFocus, false);} 
    else if (window.attachEvent) {window.attachEvent('onfocus', windowFocus);}
</script>
</head>

<body id="jstyle_undocked_ui" onload="javascript:uiLoad();" onunload="javascript:uiUnload();">
</body>
</html>
