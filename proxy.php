<?php 

    //CURL ERRORS
    
    function get_curl_error_codes() {
    //http://www.php.net/manual/en/function.curl-errno.php
    $curl_error_codes=array('1' => 'CURLE_UNSUPPORTED_PROTOCOL','2' => 'CURLE_FAILED_INIT',
    '3' => 'CURLE_URL_MALFORMAT','4' => 'CURLE_URL_MALFORMAT_USER','5' => 'CURLE_COULDNT_RESOLVE_PROXY',
    '6' => 'CURLE_COULDNT_RESOLVE_HOST','7' => 'CURLE_COULDNT_CONNECT','8' => 'CURLE_FTP_WEIRD_SERVER_REPLY',
    '9' => 'CURLE_REMOTE_ACCESS_DENIED','11' => 'CURLE_FTP_WEIRD_PASS_REPLY','13' => 'CURLE_FTP_WEIRD_PASV_REPLY',
    '14' => 'CURLE_FTP_WEIRD_227_FORMAT','15' => 'CURLE_FTP_CANT_GET_HOST','17' => 'CURLE_FTP_COULDNT_SET_TYPE',
    '18' => 'CURLE_PARTIAL_FILE','19' => 'CURLE_FTP_COULDNT_RETR_FILE','21' => 'CURLE_QUOTE_ERROR',
    '22' => 'CURLE_HTTP_RETURNED_ERROR','23' => 'CURLE_WRITE_ERROR','25' => 'CURLE_UPLOAD_FAILED',
    '26' => 'CURLE_READ_ERROR','27' => 'CURLE_OUT_OF_MEMORY','28' => 'CURLE_OPERATION_TIMEDOUT',
    '30' => 'CURLE_FTP_PORT_FAILED','31' => 'CURLE_FTP_COULDNT_USE_REST','33' => 'CURLE_RANGE_ERROR',
    '34' => 'CURLE_HTTP_POST_ERROR','35' => 'CURLE_SSL_CONNECT_ERROR','36' => 'CURLE_BAD_DOWNLOAD_RESUME',
    '37' => 'CURLE_FILE_COULDNT_READ_FILE','38' => 'CURLE_LDAP_CANNOT_BIND','39' => 'CURLE_LDAP_SEARCH_FAILED',
    '41' => 'CURLE_FUNCTION_NOT_FOUND','42' => 'CURLE_ABORTED_BY_CALLBACK','43' => 'CURLE_BAD_FUNCTION_ARGUMENT',
    '45' => 'CURLE_INTERFACE_FAILED','47' => 'CURLE_TOO_MANY_REDIRECTS','48' => 'CURLE_UNKNOWN_TELNET_OPTION',
    '49' => 'CURLE_TELNET_OPTION_SYNTAX','51' => 'CURLE_PEER_FAILED_VERIFICATION','52' => 'CURLE_GOT_NOTHING',
    '53' => 'CURLE_SSL_ENGINE_NOTFOUND','54' => 'CURLE_SSL_ENGINE_SETFAILED','55' => 'CURLE_SEND_ERROR',
    '56' => 'CURLE_RECV_ERROR','58' => 'CURLE_SSL_CERTPROBLEM','59' => 'CURLE_SSL_CIPHER',
    '60' => 'CURLE_SSL_CACERT','61' => 'CURLE_BAD_CONTENT_ENCODING','62' => 'CURLE_LDAP_INVALID_URL',
    '63' => 'CURLE_FILESIZE_EXCEEDED','64' => 'CURLE_USE_SSL_FAILED','65' => 'CURLE_SEND_FAIL_REWIND',
    '66' => 'CURLE_SSL_ENGINE_INITFAILED','67' => 'CURLE_LOGIN_DENIED','68' => 'CURLE_TFTP_NOTFOUND',
    '69' => 'CURLE_TFTP_PERM','70' => 'CURLE_REMOTE_DISK_FULL','71' => 'CURLE_TFTP_ILLEGAL',
    '72' => 'CURLE_TFTP_UNKNOWNID','73' => 'CURLE_REMOTE_FILE_EXISTS','74' => 'CURLE_TFTP_NOSUCHUSER',
    '75' => 'CURLE_CONV_FAILED','76' => 'CURLE_CONV_REQD','77' => 'CURLE_SSL_CACERT_BADFILE',
    '78' => 'CURLE_REMOTE_FILE_NOT_FOUND','79' => 'CURLE_SSH','80' => 'CURLE_SSL_SHUTDOWN_FAILED',
    '81' => 'CURLE_AGAIN','82' => 'CURLE_SSL_CRL_BADFILE','83' => 'CURLE_SSL_ISSUER_ERROR',
    '84' => 'CURLE_FTP_PRET_FAILED','84' => 'CURLE_FTP_PRET_FAILED','85' => 'CURLE_RTSP_CSEQ_ERROR',
    '86' => 'CURLE_RTSP_SESSION_ERROR','87' => 'CURLE_FTP_BAD_FILE_LIST','88' => 'CURLE_CHUNK_FAILED');
    return $curl_error_codes;
    }

    //FUNCTIONS
    //http://, https://, file:///
    function current_protocol() {
        $ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true:false;
        $sp = strtolower($_SERVER['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        if (strpos($protocol, 'http') === 0) {
           $protocol .= '://'; 
        }
        return $protocol;
    }
    //http://jstyle:8080/
    function current_domain() {
        $currentDomain = current_protocol() . $_SERVER['HTTP_HOST'];
        if (strpos($currentDomain, '/') !== strlen($currentDomain) - strlen('/')) {
            $currentDomain .= '/';
        }
        return $currentDomain;
    }
    //http://jstyle:8080/proxy.php?pageurl=...
    function full_url($use_forwarded_host=false)
    {
        return current_domain() . $_SERVER['REQUEST_URI'];
    }
    function trimOffLastFolderIfEndsWith($url, $ifEndsWIth) {
        //if $url contains $ifEndsWIth
        $ifEndsWIth = strtolower($ifEndsWIth);
        if (strrpos(strtolower($url), $ifEndsWIth) !== false) {
            //if $ifEndsWIth is last
            $url = trim($url);
            if (strrpos(strtolower($url), $ifEndsWIth) == strlen($url) - strlen($ifEndsWIth)) {
                //if $url contains /
                if (strrpos(strtolower($url), '/') !== false) {
                    //trim off everything to the right of the last /
                    $url = substr($url, 0, strrpos(strtolower($url), '/'));
                }
            }
        }
        return $url;
    }
    function innerXML($node){
        $doc=$node->ownerDocument;
        $frag=$doc->createDocumentFragment();
        foreach ($node->childNodes as $child){
            $frag->appendChild($child->cloneNode(TRUE));
        }
        return $doc->saveXML($frag);
    } 
    function prependNode($parent, $newChild) {
       if ($parent) {
           //get child nodes (if any children)
           $children = $parent->childNodes;
           if ($children && $children->length > 0) {
               //get first child
               $firstChild = $children->item(0);
               //insert before first child
               $parent->insertBefore($newChild, $firstChild);
           } else {
               //no children, append new child
               $parent->appendChild($newChild);
           }
       } 
    }
    //get a chunk of string between two tags that may contain nested tags
    function getStrChunk($str,$startTag='{',$endTag='}',$returnWrapTags=true){
        $returnStr='';
        //if start tag is valid
        if($startTag&&strlen($startTag)>0){
            //if end tag is valid
            if($endTag&&strlen($endTag)>0){
                //if the string contains the start tag
                if(strpos($str, $startTag)!==false){
                    //if the string contains the end tag
                    if(strpos($str, $endTag)!==false){
                        $searchStr=$str;                          
                        //if the startTag is not already at the front of the string
                        if (strpos($searchStr, $startTag)!==0){
                            //trim off string before $startTag
                            $searchStr=substr($searchStr, strpos($searchStr, $startTag));
                        }
                        //if the first startTag is BEFORE the first endTag
                        if(strpos($searchStr, $startTag)<strpos($searchStr, $endTag)){
                            //loop to assemble the sub-string chunk
                            $search=true;$foundChunk=false;$startTagCount=0;$endTagCount=0;
                            while($search){
                                //if there is a next end tag
                                if(strpos($searchStr, $endTag)!==false){
                                    //if the next endTag is BEFORE the next startTag
                                    if(strpos($searchStr, $endTag)<strpos($searchStr, $startTag)){
                                        //get the string before and including the next endTag
                                        $returnStr.=substr($searchStr, 0, strpos($searchStr, $endTag)+strlen($endTag));
                                        //trim off the string before and including the endTag
                                        $searchStr=substr($searchStr, strpos($searchStr, $endTag)+strlen($endTag));
                                        //count the end tag
                                        $endTagCount++;
                                    }else{
                                        //if there is a next start tag
                                        if(strpos($searchStr, $startTag)!==false){
                                            //get the string before and including the next startTag
                                            $returnStr.=substr($searchStr, 0, strpos($searchStr, $startTag)+strlen($startTag));
                                            //trim off the string before and including the startTag
                                            $searchStr=substr($searchStr, strpos($searchStr, $startTag)+strlen($startTag));
                                            //count the start tag
                                            $startTagCount++;
                                        }else{
                                            $search=false;
                                        }
                                    }
                                    //if there are an equal number of start vs end tags
                                    if($startTagCount==$endTagCount){
                                        $search=false;
                                        $foundChunk=true;
                                    }
                                }else{
                                    $search=false;
                                }
                            }
                            //if couldn't find the complete string chunk
                            if(!$foundChunk){
                                //tack on the remaining string
                                $returnStr.=$searchStr;
                            }
                            //if not supposed to return the string wrapped in the tags
                            if(!$returnWrapTags){
                                //if starts with the start tag
                                if(strpos($returnStr, $startTag)===0){
                                    //remove the start tag
                                    $returnStr=substr($returnStr, strlen($startTag));
                                }
                                //if ends with the start tag
                                if(strrpos($returnStr, $endTag)===strlen($returnStr)-strlen($endTag)){
                                    //remove the end tag
                                    $returnStr=substr($returnStr, 0, strrpos($returnStr, $endTag));
                                }
                            }
                        }
                    }
                }
            }
        }
        return $returnStr;
    }
    //make sure the content of a certain tag name is wrapped in cdata or <!-- --> so it's not considered HTML
    function cdataTagContent($strContent, $tagName){
        $startTag='<'.$tagName;$endTag='</'.$tagName.'>';
        //if the start tag is in the string
        if (strpos(strtolower($strContent), $startTag) !== false) {
            //if the end tag is in the string
            if (strpos(strtolower($strContent), $endTag) !== false) {
                //make sure the start and end tags are lowercase
                $strContent=str_replace(strtoupper($endTag), $endTag, $strContent);
                $strContent=str_replace(strtoupper($startTag), $startTag, $strContent);  
                
                //*** while $startTag exists as a substring in $strContent...
                
                //get a full chunk, eg: "<script type="text/javascript">...content...</script>"
                //get a full chunk, eg: "<style type="text/css">...content...</style>"
                $fullChunkStr=getStrChunk($strContent,$startTag,$endTag);
                //get the start chunk, eg: "<script type="text/javascript">"
                //get the start chunk, eg: "<style type="text/css">"
                $startChunkStr=getStrChunk($fullChunkStr,'<','>');
                //get the inner text, eg: "...content..."
                $innerStr=getStrChunk($fullChunkStr,$startChunkStr,$endTag,false);
                //*** temporarily replace this $fullChunkStr in $strContent
                //if the inner text is NOT blank
                if(strlen(trim($innerStr))>0){
                    //*** make sure the inner text is surrounded by <!-- --> 
                }
            }
        }
        return $strContent;
    }
    //get a query string value from a url string
    function getQsVal($url='', $key='') {
        $val = false;
        if ($url) {
            if ($key) {
                //if the given url contains "key="
                if (strpos($url, $key.'=') !== false) {
                    $urlParts = explode('?', $url);
                    //if contains parts; 1 before and 1 after '?'
                    if (count($urlParts) > 1) {
                        //get just the query string part
                        $qsStr = $urlParts[1];
                        //normalize "&amp;" and "&"
                        $crazyStr = '(...|//__a__|//...)';
                        $qsStr = str_replace('&amp;', $crazyStr, $qsStr);
                        $qsStr = str_replace('&', $crazyStr, $qsStr);
                        $qsStr = str_replace($crazyStr, '&', $qsStr);
                        //trim off anchor after '#'
                        if (strpos($qsStr, '#') !== false) {
                            //get string before and excluding the '#'
                            $qsStr = substr($qsStr, strpos($qsStr, '#'));
                        }
                        //get the start position of the key=val
                        $qsPos = strpos($qsStr, $key.'=');
                        if ($qsPos !== false) {
                            //trim everything to the left of and including the key
                            $qsStr = substr($qsStr, $qsPos + strlen($key.'='));
                            //get just the first query string value
                            $qsList = explode('&', $qsStr);
                            $val = $qsList[0].'';
                            $val = trim($val);
                            if (strlen($val) < 1) {$val=false;}
                        }
                    }
                }
            }
        }
        return $val;
    }
    function getUrlExt($url) {
        $ext = '';
        //if there is a dot in the $url
        $lastIndexOfDot = strrpos($url, '.');
        if ($lastIndexOfDot !== false) {
            //if there is a query string ?
            $qsPos = strrpos($url, '?');
            if ($qsPos !== false) {
                //trim off everything to the right of (and including) '?'
                $url = substr($url, 0, $qsPos);
                //update the last dot index
                $lastIndexOfDot = strrpos($url, '.');
            }
            //if there is still a dot in the url
            if ($lastIndexOfDot !== false) {
                //if there is a slash in the $url
                $lastIndexOfSlash = strrpos($url, '/');
                if ($lastIndexOfSlash !== false) {
                    //if the last slash is before the last dot
                    if ($lastIndexOfSlash < $lastIndexOfDot) {
                        //get everything to the right and including the last dot
                        $url = substr($url, $lastIndexOfDot);
                        //lowercase extension
                        $ext = strtolower($url);
                    }
                }
            }
        }
        return $ext;
    }
    //make sure domain doesn't end in a file, eg: http://mysite.com/file.html
    function getUrlDomain($url) {
        $domain = $url;
        //get just the extension, if there is one
        $ext = getUrlExt($url);
        if ($ext != '') {
            //get everything to the right of and including the extension, eg: .css?test=true
            $endswith = substr($domain, strrpos(strtolower($domain), $ext));
            //get just the domain without the trailing /file.ext
            $domain = trimOffLastFolderIfEndsWith($domain, $endswith);
        }
        return $domain;
    }
    //get the proxy url for this resource and make sure the proxy url is sent an absolute url instead of a relative one
    function getProxyUrl($typeKey, $originalUrl, $domain='') {
        $proxyUrl = '';
        //MUST MAKE SURE $url IS A VALID ABSOLUTE URL
        $url = $originalUrl;
        //if $url starts with either " or ' then trim it off
        if (strpos($url, '"') === 0) {$url = substr($url, 1);$url = trim($url);} 
        else {if (strpos($url, "'") === 0) {$url = substr($url, 1);$url = trim($url);}}
        //if $url ends with either " or ' then trim it off
        if (strrpos($url, '"') === strlen($url) - 1) {$url = substr($url, 0, strlen($url) - 1);$url = trim($url);} 
        else {if (strrpos($url, "'") === strlen($url) - 1) {$url = substr($url, 0, strlen($url) - 1);$url = trim($url);}}
        //if the $url contains //
        if (strpos($url, '//') !== false) {
            //if the // appears first
            if (strpos($url, '//') === 0) {
                //add http: to the start
                $url = 'http:'.$url;
            }
        }
        //if the $url contains https://
        $verifyssl = '';
        if (strpos($url, 'https://') !== false) {
            //if the https:// appears first
            if (strpos($url, 'https://') === 0) {
               $verifyssl = '&verifyssl=false'; 
            }
        }
        //if the url is not an absolute local file path
        if (strpos($url, 'file:') !== 0) {
            //if http doesn't appear first (relative url)
            if (strpos($url, 'http') !== 0) {
                //get the domain of the current $pageurl (make sure $domain doesn't end with /page.html or /file.ext)
                if ($domain==''){$domain = getUrlDomain($url);}
                //if a domain was given
                if ($domain !== '') {
                    //if starts with ../
                    if (strpos($url, '../') === 0) {
                        //while url still contains '../'
                        while(strpos($url, '../') !== false) {
                            //remove one ../
                            $url = substr($url, strlen('../'));
                            //if domain contains /
                            if (strpos($domain, '/') !== false) {
                                //remove one directory from $domain, eg: http://google.com/dir/sub BECOMES http://google.com/dir
                                $domain = substr($domain, 0, strrpos($domain, '/'));
                            }
                        }
                    } else {
                        //if starts with /, eg: "/Portals/_default/Skins/godsleep/images/back_header_clouds.jpg"
                        if (strpos($url, '/') === 0) {
                            //strip the folders off of the domain, eg: "http://godmustbesleeping.com/" ...
                            //trim off starting /
                            $url = substr($url, 1);$url = trim($url);
                            $firstFolder = $url;
                            //if $url still has /
                            if (strpos($url, '/') !== false) {
                                //get the first folder in $url, eg: "Portals"
                                $firstFolder = substr($firstFolder, 0, strpos($firstFolder, '/'));
                            }
                            //separate the protocol from the domain
                            $protocol = substr($domain, 0, strrpos($domain, '//') + strlen('//'));
                            $domain = substr($domain, strlen($protocol));
                            //if the $domain contains with the first folder of the $url
                            if (strpos($domain, '/'.$firstFolder) !== false) {
                                
                                //strip the extra folders off of the domain, eg: "godmustbesleeping.com/" ...
                                $domain = substr($domain, 0, strpos($domain, '/'.$firstFolder));
                            }
                            //add the protocol back to the domain
                            $domain = $protocol . $domain;
                        }
                    }
                    //if $url starts with either / then trim it off
                    if (strpos($url, '/') === 0) {$url = substr($url, 1);$url = trim($url);} 
                    //if $domain ends with / then trim it off
                    if (strrpos($domain, '/') === strlen($domain) - 1) {$domain = substr($domain, 0, strlen($domain) - 1);$domain = trim($domain);}
                    //add the full domain before the relative url
                    $url = $domain.'/'.$url;
                    //$url = 'DOMAIN: '.$domain.' || URL:'.$url;
                }
            }
        }
        //if the type key is a type that should be proxied
        $doProxy = false;
        $proxyTypes = getProxyTypes();
        if (array_key_exists ($typeKey, $proxyTypes)) {
            //if the generic 'url' $typeKey wasn't given
            if ($typeKey != 'url') {
                $doProxy = true;
            } else {
                //have to figure out if this url points to a file type that should be proxied
                $ext = getUrlExt($url);
                //if the extension was found
                if ($ext != '') {
                    //file extension types that should be proxied
                    $proxyExts = array(
                        '.css'=>'1', '.html'=>'1', '.htm'=>'1',
                        '.php'=>'1', '.phtml'=>'1', '.asp'=>'1', '.aspx'=>'1',
                    );
                    //if this extension type should be proxied
                    if (array_key_exists ($ext, $proxyExts)) {
                        $doProxy = true;
                    }
                } else {
                    //extension not found... like www.google.com/ ??
                    $doProxy = true;
                }
            }
        }
        //if proxy
        if ($doProxy) {
            //replace the original css OR page url with the proxy url
            $proxyUrl = current_domain().'proxy.php?'.$typeKey.'='.urlencode($url).$verifyssl;
        } else {
            //don't proxy this file... just link it to the original source
            $proxyUrl = $url;
        }
        return $proxyUrl;
    }
    //proxy an entire resource file, eg: webpage 
    function proxy_url($url=false, $type=false) {
        if ($url) {
            // create a new cURL resource
            $ch = curl_init();
            // set URL and other appropriate options
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            //if verifyssl query param exists
            if(isset($_REQUEST["verifyssl"])) {
                //if verifyssl=false
                $verifyssl = $_REQUEST["verifyssl"];
                if ($verifyssl == 'false') {
                    //allow proxy of https://
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                }
            }

            // grab URL and pass it to the browser
            $urlContent = curl_exec($ch);
            // Check if any error occured
            if(!curl_errno($ch))
            {
                //get content type header info
                $info = curl_getinfo($ch);
                $content_type = $info['content_type'];
                //set the content type for the proxied file
                header('Content-type: '.$content_type);
                //set the header type, if not already set
                if (!$type) {$type = $content_type;}
                else {if ($type=='url'){$type = $content_type;}} //set the type if a general 'url' type is given
                $type = strtolower($type);
                //process the file contents in a way that depends on the file type
                switch ($type) {
                    case 'text/css': //proxy a stylesheet
                        proxy_css($urlContent, $url);
                        break;
                    case 'text/html': //proxy a page
                        proxy_page($urlContent, $url);
                        break;
                    default:
                        if (strpos($type, 'text/css') !== false) {
                            proxy_css($urlContent, $url);
                        } else {
                            if (strpos($type, 'text/html') !== false) {
                                proxy_page($urlContent, $url);
                            } else {
                                //proxy something else
                                echo $urlContent;
                            }
                        }
                        break;
                }
            } else {
                //get error code
                $err_code = curl_errno($ch);$err_msg = '';
                //show a message depending on the error code
                switch($err_code) {
                    case 60: //if trying to proxy a https site
                        echo '<h1>Are you sure you trust this site?</h1>';
                        echo '<p>This site uses https:// secure protocol.</p>';
                        echo '<p><strong>'.$url.'</strong></p>';
                        echo '<p>The SSL certification was not verified... Would you like to proceed anyway?</p>';
                        echo '<p><a class="proceed-ssl" href="'.full_url().'&verifyssl=false'.'">Proceed Anyway</a></p>';
                        break;
                    default:
                        //if this error code has a message
                        $curl_error_codes = get_curl_error_codes();
                        if (array_key_exists($err_code, $curl_error_codes)) {
                            //get the error code message
                            $err_msg = $curl_error_codes[$err_code];
                        }
                        //print error info
                        echo '<h1>Uh oh...</h1>';
                        echo '<p>Error ('.$err_code.') '.$err_msg.'</p>';
                        echo '<p><strong>'.$type.'</strong> '.$url.'</p>';
                        break;
                }
            }
            // close cURL resource, and free up system resources
            curl_close($ch);
        }
    }
    //intercept the css content and change some things, eg:
    //background image urls and @import urls
    function proxy_css($urlContent, $cssUrl) {
        $err = false;
        $domain = getUrlDomain($cssUrl);
        //if there are any url(... inside the css sheet
        if (strpos(strtolower($urlContent), 'url(') !== false) {          
            //while there are still url(... inside the css sheet string AND no syntax errors
            while (strpos(strtolower($urlContent), 'url(') !== false && !$err) {
                //strip off everything before the next url(
                $url = substr($urlContent, strpos(strtolower($urlContent), 'url('));
                //if there is a closing ) for this url(...
                if (strpos($url, ')') !== false) {
                    //strip off everything after the next )
                    $url = substr($url, 0, strpos($url, ')') + 1);
                    //get just the contents of url(...)
                    $u = $url;
                    //trim off url(
                    $u = substr($u, strlen('url('));
                    //trim off last )
                    $u = substr($u, 0, strrpos($u, ')'));
                    //trim 
                    $u = trim($u);
                    //get the proxy url for this url(...) 
                    //$cssUrl is passed as the domain (the /file.css will be trimmed off to get domain name)
                    $proxyurl = getProxyUrl('url', $u, $domain);
                    //replace the url(...)
                    $urlContent = str_replace($url, '/*<url>'.$proxyurl.'</url>*/', $urlContent);
                } else {
                    //url( must end with closing )
                    $err = true;
                }
            }
        }
        //if there hasn't been an error so far, eg: caused by a url( that's not closed by )
        if (!$err) {
            //if there are any '@import ' inside the css sheet
            if (strpos(strtolower($urlContent), '@import ') !== false) {  
                //while there are still @import inside the css sheet string AND no syntax errors
                while (strpos(strtolower($urlContent), '@import ') !== false && !$err) {
                    //strip off everything before the next '@import'
                    $import = substr($urlContent, strpos(strtolower($urlContent), '@import '));
                    //if there is a closing ; for this @import
                    if (strpos($import, ';') !== false) {
                        //strip off everything after the next ;
                        $import = substr($import, 0, strpos($import, ';') + 1);
                        //get just the contents of @import ... ;
                        $imp = $import;
                        //trim off @import
                        $imp = substr($imp, strlen('@import '));
                        //trim off last ;
                        $imp = substr($imp, 0, strrpos($imp, ';'));
                        //trim 
                        $imp = trim($imp);
                        //if $imp doesn't already have '/*<url>' && '</url>*/'
                        if (strpos($imp, '/*<url>') === false) {
                            //the contents of @import ... ; didn't already get processed because they don't use url(...)
                            //get the proxy url for this @import ... ;
                            //the 'css' type refers to the $cssUrl passed as the domain
                            $proxyurl = getProxyUrl('url', $imp, $domain);
                            //replace the @import ... ;
                            $urlContent = str_replace($import, '/*<import>/*<url>'.$proxyurl.'</url>*/</import>*/', $urlContent);
                        } else {
                            //replace the @import ... ;
                            $urlContent = str_replace($import, '/*<import>'.$imp.'</import>*/', $urlContent);
                        }
                    } else {
                        //@import must end with closing ;
                        $err = true;
                    }
                }
            }
        }
        //if there is still no error, eg: caused by a @import that's not closed by ;
        if (!$err) {
            //restore all of the replaced sections
            $urlContent = str_replace('/*<url>', 'url(', $urlContent);
            $urlContent = str_replace('</url>*/', ')', $urlContent);
            $urlContent = str_replace('/*<import>', '@import ', $urlContent);
            $urlContent = str_replace('</import>*/', ';', $urlContent);
        }
        echo $urlContent;
    }
    //intercept the page content after changing some things, eg:
    //change the external stylesheet links to point to the internal proxy
    function proxy_page($urlContent, $pageUrl) {
        //before loading urlContent as html, make sure the text inside inline <script> is CDATA
        $urlContent=cdataTagContent($urlContent,'script');
        //+++$urlContent=cdataTagContent($urlContent,'style');
        //load the urlContent as an XML document 
        $doc = new DOMDocument();
        @$doc->loadHTML($urlContent); //supress HTML format warnings with @
        //if could load document
        if ($doc) {
            $domain = getUrlDomain($pageUrl);
            $changesMade = false;
            //get all of the <link> elements with href attributes
            //<LINK>
            $xpath = new DOMXpath($doc);
            $links = $xpath->query('*/link[@href]'); 
            //if there are any external links
            if ($links->length > 0) {
                //for each <link>
                foreach($links as $link) {
                    $isCssLink = false;
                    //get the href and type of the <link>
                    $href = $link->getAttribute('href');
                    $type = $link->getAttribute('type');
                    //if there is a type attribute on <link>
                    if ($type) {
                        //if type is text/css
                        if (strtolower(trim($type)) == 'text/css') {$isCssLink = true;}
                    } else {
                        $hrefNoQs = $href;
                        //if the href contains a query ? 
                        if (strrpos($hrefNoQs, '?') !== false) {
                           //strip off the ? and the query params to the right of ?
                           $hrefNoQs = substr($hrefNoQs, 0, strrpos($hrefNoQs, '?'));
                        }
                        //if the href (without query string, and lowercase) ends with '.css'
                        if (strrpos(strtolower($hrefNoQs), '.css') == strlen($hrefNoQs) - strlen('.css')) {
                            $isCssLink = true;
                        }
                    }
                    //if this is determined to be a css <link>
                    if ($isCssLink) {
                        //replace the css link with a proxied href
                        $link->setAttribute('href', getProxyUrl('css', $href, $domain));
                        $changesMade = true;
                    }
                }
            }
            //<SCRIPT>
            $scripts = $doc->getElementsByTagName('script');
            //if there are any scripts
            if ($scripts->length > 0) {
                //for each <script>
                foreach($scripts as $script) {
                    //if this <script> has a src attribute
                    if ($script->hasAttribute('src')) {
                        //get the src of the <script>
                        $src = $script->getAttribute('src');
                        //replace the img src with a proxied src
                        $script->setAttribute('src', getProxyUrl('js', $src, $domain));
                        $changesMade = true;
                    }
                }
            }
            //<IMG>
            $imgs = $doc->getElementsByTagName('img');
            //if there are any images
            if ($imgs->length > 0) {
                //for each <img>
                foreach($imgs as $img) {
                    //if this <img> has a src attribute
                    if ($img->hasAttribute('src')) {
                        //get the src of the <img>
                        $src = $img->getAttribute('src');
                        //replace the img src with a proxied src
                        $img->setAttribute('src', getProxyUrl('img', $src, $domain));
                        $changesMade = true;
                    }
                }
            }
            //RESOURCE ADDONS, EG: EXTRA JAVASCRIPT AND STYLE FILES
            $headElem = $doc->getElementsByTagName('head');
            if ($headElem->length > 0) {
                //get the first <head> element
               $headElem = $headElem->item(0); 
               //create a new <script> element for addin.js
               $newScriptElem = $doc->createElement('script');
               $newScriptElem->setAttribute('id', 'jstyle_addin');
               $newScriptElem->setAttribute('type', 'text/javascript');
               $newScriptElem->setAttribute('src', 'jstyle_res/js/addin.js');
               //add the new script element
               prependNode($headElem, $newScriptElem);
               //change made
               $changesMade = true;
            }
            //SET CHANGED CONTENT STRING
            //if any changes were made to the page HTML
            if ($changesMade) {
                //dump the changed xml back into a string
                $urlContent = $doc->saveHTML(); 
            }
        }
        //display the page content
        echo $urlContent;
    }

    //types of files to proxy... if the file type is not in the list then it will not be proxied...
    //file types not in the list are linked from the original source instead of going through the proxy
    function getProxyTypes() {
        $types = array(
            'css'       => 'text/css', //proxy css so all of the document.styleSheets are available to javascript
            'url'       => 'url', //general... if the filetype is unkown, then try to figure it out in code
            'pageurl'   => 'text/html' //proxy the current page content (replace <link> hrefs to point to local proxy urls, etc...)
        );
        return $types;
    }
    
    //PROCESS
    //============================================================
    
    //if this is an error, based on a passed err query string key
    if(isset($_REQUEST['err'])) {
        $errType = $_REQUEST['err'];
        switch ($errType) {
            case '404':
                //HANDLE GET REQUESTS THAT RESULT IN 404 ERROR AFTER PAGE LOAD
                //get the url that produced the 404 error (file not found url), eg: /DesktopModules/module/css/somefile.css
                $url = $_SERVER["REQUEST_URI"];
                //if there is a referer... (a page where this file resource was called from)
                if (isset($_SERVER['HTTP_REFERER'])) {
                    //get the $refurl, eg: http://jstyle:8080/proxy.php?pageurl=http%3A%2F%2Fgodmustbesleeping.com%2F
                    $refurl = $_SERVER['HTTP_REFERER'];
                    //if $refurl contains 'pageurl' qs value
                    $pageurl = getQsVal($refurl, 'pageurl');
                    if ($pageurl) {
                        //if the $url starts with this proxy domain, eg: http://jstyle:8080/...
                        $currentDomain = current_domain();
                        if (strpos($url, $currentDomain) === 0) {
                            //trim off the jstyle domain from the $url
                            $url = '/'.substr($url, strlen($currentDomain));
                        }
                        //decode the $pageurl so it can be used as the domain
                        $domain = urldecode($pageurl);
                        //try to get a proxy url for this url and domain
                        $proxyUrl = getProxyUrl('url', $url, $domain);
                        //if there is a $proxyUrl
                        if ($proxyUrl) {
                            //redirect to the proxy url
                            header('Location: '.$proxyUrl);
                            die();
                        }
                    }
                }
                break;
            default:
                break;
        }
    } else if(isset($_REQUEST['ping'])) {
        //respond with success message if javascript is ping-testing this proxy page
        $pingVal = $_REQUEST['ping'];
        echo trim($pingVal).' success!';
    } else {
        //FIGURE OUT WHAT STANDARD PROXY TYPE IS BEING REQUESTED, EG: pageurl, css, url, etc...
        //loop through proxy types until discovering which type should be processed
        $proxyTypes = getProxyTypes(); $noProxyType = true;
        foreach ($proxyTypes as $key => $value) {
            //if this proxy type should be processed now
            if(isset($_REQUEST[$key])) {
                //get url to proxy
                $url = $_REQUEST[$key];
                //process the $url
                proxy_url($url,$value);
                $noProxyType = false;
                //end the foreach loop
                break;
            }
        }
        //if no proxy type is being used
        if ($noProxyType) {
            //HANDLE AJAX REQUEST TO RETRIEVE PROXY-URL ON THE CLIENT END
            //if using an ajax call to try to get the proxy url for a given url
            if(isset($_REQUEST['geturl'])) {
                //get the original url from the ajax call
                $url = $_REQUEST['geturl'];
                //get the url file type (if given)
                $typeKey = 'url';if(isset($_REQUEST['type'])) {$typeKey=$_REQUEST['type'];}
                //get the domain (if given)
                $domain = '';if(isset($_REQUEST['domain'])) {$domain=$_REQUEST['domain'];}
                //return the proxy url
                $proxyUrl = getProxyUrl($typeKey, $url, $domain);
                echo $proxyUrl;
            }
        }
    }
?>