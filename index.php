<?php 
    //get the string content of external files
    function get_css_content($url) {
        //http://davidwalsh.name/curl-download
        $ch = curl_init();
        $timeout = 20;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $content = curl_exec($ch);
        curl_close($ch);
        return $content;
    }
    //if there is a CSS URL to get stylesheet content from
    if(isset($_REQUEST["cssurl"])) {
        $content = '';
        //get the css url... urldecode() should be automatic
        $cssurl = $_REQUEST["cssurl"];
        //get the external stylesheet content
        $content = get_css_content($cssurl);
        if (!$content){$content='';}
        //output the response text back to the calling script
        echo $content;
    }
    /*else {
    if (isset($_POST["cssurl"])) {
        header("Content-type: text/css");
        $content = '';
        //get the css url... urldecode() should be automatic
        $cssurl = $_POST["cssurl"];
        //get the external stylesheet content
        $content = get_css_content($cssurl);
        if (!$content){$content='';}
        //output the response text back to the calling script
        echo $content;
    }}*/
?>