<?php 
    //explode a state value path
    function getPathArray($path='') {
        $pathArray = array();
        //if there is a given path
        if ($path) {
            //split the path into different parts
            $arr = explode('>>', $path);
            $arrCount = count($arr);
            //if the array has 2 or more items
            if ($arrCount > 1) {
                //get the parsed values of the path
                $pathArray['rootdir'] = trim($arr[0]);
                $pathArray['file'] = trim($arr[1]);
                $pathArray['path'] = $pathArray['rootdir'].'/'.$pathArray['file'];
            }
            //if the array has 3 or more items
            if ($arrCount > 2) {$pathArray['xpath'] = trim($arr[2]);}
        }
        return $pathArray;
    }
    function hasChild($parentNode) {
        $has = false;
        //if node has any child content
        if ($parentNode->hasChildNodes()) {
            //for each child content
            foreach ($parentNode->childNodes as $childNode) {
                //if child content is an xml node
                if ($childNode->nodeType == XML_ELEMENT_NODE) {
                    //has child
                    $has = true;
                    //force the loop to end
                    break;
                }
            }
        }
        return $has;
    }
    //get all descendents that do not have children (have text value)
    //for example: "<root><width>555px</width><height>444px</height><test><path>value</path><test></root>"
    //$returnArray = (<width>, <height>, <path>)
    function getAllNoChildDescendents($parentNode, $returnArray=array()) {
        //if the parentNode has child nodes
        if (hasChild($parentNode)) {
            //for each child node
            foreach ($parentNode->childNodes as $childNode) {
                //if child content is an xml node
                if ($childNode->nodeType == XML_ELEMENT_NODE) {
                    //recursive call to get the childless text nodes of this childNode
                    $returnArray = getAllNoChildDescendents($childNode, $returnArray);
                }
            }
        } else {
            //add the childless node to the array
            array_push($returnArray, $parentNode);
        }
        return $returnArray;
    }
    //if an xml string is provided, this function will return an array that represents all of the xpaths and values
    //for example: $xmlStr = "<width>555px</width><height>444px</height><test><path>value</path><test>"
    //$returnArray = ("width"=>"555px", "height"=>"444px", "test/path"=>"value")
    function getXPathValuesArray($xmlStr) {
        $returnArray = array();
        if (strpos($xmlStr, '<') !== false) {
            if (strpos($xmlStr, '>') !== false) {
                //load an xml document from this xmlStr
                $doc = new DOMDocument();
                $doc->loadXML('<root>'.$xmlStr.'</root>');
                //get root node
                $rootNode = $doc->documentElement;
                //get all descendents that do not have children (have text value)
                $valNodes = getAllNoChildDescendents($rootNode);
                //for each value node
                foreach ($valNodes as $node) {
                    //get the xpath for this value-containing node
                    $nodePath = $node->getNodePath();
                    $nodeValue = $node->nodeValue.'';
                    //remove the "root" node from this path
                    if (strpos($nodePath, 'root/') !== false) {
                        //strip off everything to the left of, and including, 'root/'
                        $nodePath = substr($nodePath, strpos($nodePath, 'root/') + strlen('root/'));
                    }
                    //set the return array value
                    $returnArray[$nodePath] = $nodeValue;
                }
            }
        }
        return $returnArray;
    }
    //get the content of a node... if content is NOT a single text value, get the content as a JSON string
    function getChildContent($parentNode, $hasChild='unknown') {
        $content = '';
        //find out if the parentNode has children, if this is unknown
        if ($hasChild=='unknown'){$hasChild=hasChild($parentNode);}
        //if the parentNode has child nodes (not just child text)
        if ($hasChild) {
            //start building the JSON string
            $content .= '{';
            //for each child content
            foreach ($parentNode->childNodes as $childNode) {
                //if child content is an xml node
                if ($childNode->nodeType == XML_ELEMENT_NODE) {
                    //print the node name as the JSON key
                    $content .= '"'.strtolower($childNode->nodeName).'":';
                    //recursive call to get the JSON value
                    $recursiveContent = getChildContent($childNode);
                    //if the recursive content is a JSON; starts with {
                    if (strpos($recursiveContent, '{') === 0) {
                        //don't surround this sub-json with quotes
                        $content .= $recursiveContent;
                    } else {
                        //surround this sub-value with quotes
                        $content .= '"'.$recursiveContent.'"';
                    }
                    //comma
                    $content .= ',';
                }
            }
            //strip off the last ","
            $content = substr($content, 0, strlen($content) - 1);
            //end building the JSON string
            $content .= '}';
        } else {
            //get the child text of this node
            $content = $parentNode->nodeValue.'';
            $content = trim($content);
        }
        return $content;
    }
    //set the content of a node... if content is NOT a single text value, set the content as an XML string
    function setChildContent($parentNode, $content=false, $doc, $path, $hasChild='unknown') {
        $changeMade = false;
        //if there is content to set
        if ($content !== false) {
            //find out if the parentNode has children, if this is unknown
            if ($hasChild=='unknown'){$hasChild=hasChild($parentNode);}
            //if the parentNode has child nodes (not just child text)
            if ($hasChild) {
                //get an xpath object
                $xp = new DOMXPath($doc);
                //get an array of xpath=>value to modify
                $xpathsToSet = getXPathValuesArray($content);
                //for each xpath to modify
                foreach ($xpathsToSet as $xpStr => $value) {
                    //try to get a node from the xpath
                    $nodeToMod = $xp->query($xpStr, $parentNode);
                    //if there is a node selected by this xpath to modify
                    if ($nodeToMod->length > 0) {
                        //make sure there is only one selected node to modify
                        $nodeToMod = $nodeToMod->item(0);
                        //if the new value is not the same as the old value
                        if ($value != $nodeToMod->nodeValue) {
                            //make the change
                            $nodeToMod->nodeValue = $value;
                            $changeMade = true;
                        }
                    }
                }
                //get the content to return in JSON form
                $content = getChildContent($parentNode, $hasChild);
            } else {
                //if the new value is not the same as the old value
                if ($content != $parentNode->nodeValue) {
                    //make the change
                    $parentNode->nodeValue = $content;
                    //set the changed value as the return value
                    $content = $parentNode->nodeValue;
                    $changeMade = true;
                }
            }
        }
        else {$content = '';}
        //if a change was made
        if ($changeMade) {
            //save the change
            $doc->save($path);
        }
        return $content;
    }
    //if getting or setting a saved state value via ajax call
    if(isset($_REQUEST['get']) || isset($_REQUEST['set'])) {
        //what to get/set? ie: {folder}>{file}>{x-path}
        $isGet = true;
        if(isset($_REQUEST['get'])){$getOrSetWhat=$_REQUEST['get'];}
        else{$getOrSetWhat=$_REQUEST['set'];$isGet=false;}
        $returnWhat = '';
        //get the parts of the path
        $pathArray = getPathArray($getOrSetWhat);
        $pathArrayCount = count($pathArray);
        //if there is ATLEAST a path in the array
        if ($pathArrayCount > 0) {
            //if the given file exists
            if (file_exists($pathArray['path'])) {
                //try to load the XML file based on the path
                $doc = new DOMDocument();
                $doc->load($pathArray['path']);
                //if there is no xpath specified
                if (!array_key_exists('xpath', $pathArray)) {
                    //get root node
                    $rootNode = $doc->documentElement;
                    //set the xpath as the root of the xml document
                    $pathArray['xpath'] = '//'.$rootNode->nodeName;
                }
                //if there is an xpath specified
                if (array_key_exists('xpath', $pathArray)) {
                    //get an xpath object
                    $xp = new DOMXPath($doc);
                    //try to get a node from the xpath
                    $nodes = $xp->query($pathArray['xpath']);
                    //if the xpath grabbed any nodes
                    if ($nodes->length > 0) {
                        //get the first grabbed node's value
                        $node = $nodes->item(0);
                        //does this node have child nodes?
                        $hasChild = hasChild($node);
                        //if setting this as a new value
                        if (!$isGet) {
                            //if there is a new value to set
                            if(isset($_REQUEST['value'])){
                                $newValue = $_REQUEST['value'];
                                //set the newValue
                                $returnWhat = setChildContent($node, $newValue, $doc, $pathArray['path'], $hasChild);
                            } else {
                                //get node value (as JSON, for all child nodes, or a single value)
                                $returnWhat = getChildContent($node, $hasChild);
                            }
                        } else {
                            //not setting... getting... 
                            
                            //get node value (as JSON, for all child nodes, or a single value)
                            $returnWhat = getChildContent($node, $hasChild);
                        }
                    }
                }
            }
        }
        echo $returnWhat;
    }
?>