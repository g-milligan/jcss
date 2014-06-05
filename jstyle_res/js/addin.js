//jcss object
var jcss = (function(){
	//private object that will be returned; made public to the world!
	function jcss(){}
	//window.ready
	function ready(func){
		//http://stackoverflow.com/questions/9434/how-do-i-add-an-additional-window-onload-event-in-javascript
		if (window.addEventListener) // W3C standard
		{
		  window.addEventListener('load', func, false); // NB **not** 'onload'
		} 
		else if (window.attachEvent) // Microsoft
		{
		  window.attachEvent('onload', func);
		}
	}
	//function to attach a hover event to an element
	function hover(elem,onFunc,offFunc){
		if(elem!=undefined){
			if(elem.nodeType==1){
				elem['isHovered']=false;
				//prevent bubbling of the event multiple times 
				//when crossing over child elements of hovered parent
				var preventBubble=function(e){
					var allow=true;
					//get the sender trigger for the event
					var sender = e.toElement || e.relatedTarget;
					//if there is a sender element
					if(sender!=undefined){
						//get the outer HTML of the original owner of the event
						var elemHtml=elem.outerHTML;
						//if the sender is NOT already the original parent event owner, elem
						if(elemHtml!=sender.outerHTML){
							//if the sending element is a descendant of elem
							while(sender.parentNode!=undefined) {
								sender = sender.parentNode;
								//if this sender is the elem
								if(sender.outerHTML==elemHtml){
									allow=false;
									break;
								}
							}
						}
					}else{allow=false;}
					return allow;
				};
				//if onFunc specified
				if(onFunc!=undefined){
					appendEvent(elem, 'onmouseover', function(e){
						//if NOT already hovered OR 
						//NOT entering the descendent inside an already-hovered parent
						if(!elem.isHovered || preventBubble(e)){
							elem.isHovered=true;
							onFunc(e,elem);
							//---console.log('hover ON ');
						}
					});
					//if offFunc specified
					if(offFunc!=undefined){
						appendEvent(elem, 'onmouseout', function(e){
							//if already hovered AND NOT
							//exiting the descendent inside an already-hovered parent
							if(elem.isHovered && preventBubble(e)){
								elem.isHovered=false;
								offFunc(e,elem);
								//---console.log('hover OFF ');
							}
						});
					}
				}
			}
		}
	}
	//function to attach a hover event (that adds a hover class on hover) to an element
	function hoverClass(elem,overClass){
		if(overClass==undefined){overClass='hover';}
		hover(elem,function(e,elem){addClass(elem,overClass);},
		function(e,elem){removeClass(elem,overClass);});
	}
	//function to append events so that they don't get overwritten
	function appendEvent(obj, eventName, func) {
		var oldevent = obj[eventName];
		//if this event isn't already set
		if (typeof oldevent != 'function') {
			//set the event
			obj[eventName] = func;
		} else {
			//the event is already set so...
			obj[eventName] = function(e) {
				//if the old event is defined
				if (oldevent) {
					//execute the old event
					oldevent(e);
				}
				//execute the appended event
				func(e);
			}
		}
	}
	//make an element resizable
	function dragResizable(elem, args) {
		//for each arg
		for (var a = 0; a < args.length; a++) {
			var json = args[a];
			//if there is draggable handle element set
			var handle; if (json.hasOwnProperty('handle')){if (json.handle.nodeType == 1){handle = json.handle;}}
			if (handle != undefined) {
				//if there is a function to execute while resizing
				var onResize;if (json.hasOwnProperty('onresize')){if (typeof json.onresize == 'function'){onResize = json.onresize;}}
				//if there is a function to execute on start
				var onStart;if (json.hasOwnProperty('onstart')){if (typeof json.onstart == 'function'){onStart = json.onstart;}}
				//if there is a function to execute on end
				var onEnd;if (json.hasOwnProperty('onend')){if (typeof json.onend == 'function'){onEnd = json.onend;}}
				//get resizing class
				var onclass; if (json.hasOwnProperty('onclass')){if (typeof json.onclass == 'string'){onclass = json.onclass;}}
				if (onclass==undefined){onclass='onresize';}
				//get direction (vertical or horizontal)
				var direction; if (json.hasOwnProperty('direction')){if (typeof json.direction == 'string'){direction = json.direction;}}
				//resize vertical by default
				if (direction==undefined){direction='vertical';}
				var doResize;
				switch(direction) {
					case 'vertical':
						//set the vertical resize function
						doResize = function(elem, handle, e) {
							if (handle.className == onclass) {
								e.preventDefault();
								//if the relative difference between the mouse/ui y-axis offset is not defined
								if (handle.uiAndMouseYDiff == undefined) {
									//find the difference between the ui wrapper offset and the mouse offset
									handle.uiAndMouseYDiff = elem.offsetTop - e.clientY;
								}
								//get the current ui offset
								var uiOffset = elem.offsetTop - handle.uiAndMouseYDiff;
								//get the current cursor offset
								var cursorOffset = e.clientY;
								//don't allow the cursor offset to drop below zero
								if (cursorOffset < 0) {cursorOffset=0;}
								//if the cursor and ui don't have the same offset values
								if (uiOffset != cursorOffset) {
									//get the current ui height
									var uiHeight = elem.clientHeight;
									//if resize larger
									if (uiOffset > cursorOffset) {
										//resize larger
										var increaseDiff = uiOffset - cursorOffset;
										uiHeight += increaseDiff;
									} else {
										//resize smaller
										var decreaseDiff = cursorOffset - uiOffset;
										uiHeight -= decreaseDiff;
									}
									//set resized ui height
									elem.style.height = uiHeight + 'px';
								}
								//if there is a custom function to execute on resize
								if (onResize!=undefined){onResize(elem, json);}
							}
						};
						break;
					case 'horizontal':
						break;
				}
				//if a resize (vertical or horizontal) is specified
				if (doResize != undefined) {
					//end resize function
					var endResize = function(handle, e) {
						if (handle.className == onclass) {
							handle.className = '';
							handle.uiAndMouseYDiff = undefined;
							//if there is a custom function to execute on end
							if (onEnd!=undefined){onEnd(elem, json);}
						}
					};
					//start resize function
					var startResize = function(handle, e) {
						if (handle.className != onclass) {
							e.preventDefault();
							handle.className = onclass;
							//if there is a custom function to execute on start
							if (onStart!=undefined){onStart(elem, json);}
						}
					};
					//attach the startResize, endResize, and doResize functions to actual events
					appendEvent(handle, 'onmousedown', function(e){startResize(handle, e);});
					appendEvent(document, 'onmouseup', function(e){endResize(handle, e);});
					appendEvent(document, 'onmouseleave', function(e){endResize(handle, e);});
					appendEvent(document, 'onmousemove', function(e){doResize(elem, handle, e);});
				}
			}
		}
	}
	function hasClass(elem, theClass, removeTheClass) {
		if (removeTheClass==undefined){removeTheClass=false;}
		var has = false;
		if (elem!=undefined) {
			if (elem.nodeType==1) {
				if (theClass!=undefined) {
					if (typeof theClass=='string') {
						theClass = theClass.trim();
						//get the current classes
						var currentClass = elem.className;if(currentClass==undefined){currentClass='';}
						currentClass = currentClass.trim();
						//if theClass is a substring of currentClass
						if (currentClass.indexOf(theClass) != -1) {
							//get an array of current classes
							var classArray = currentClass.split(' ');
							//for each current class
							var keepClasses = '';
							for (var c = 0; c < classArray.length; c++) {
								//if this current class is the same as theClass
								if (classArray[c].trim() == theClass) {
									//theClass already exists as a class of elem
									has = true;
									//force the loop to end if NOT removing theClass
									if (!removeTheClass){break;}
								} else {
									//this is not theClass... if removing theClass
									if (removeTheClass) {
										//add this class that should be kept
										keepClasses += classArray[c].trim()+' ';
									}
								}
							}
							//if removed theClass
							if (removeTheClass && has) {
								//trim the class list
								keepClasses = keepClasses.trim();
								//set the new classes 
								elem.className = keepClasses;
								//if there are NO classes to keep
								if(keepClasses==''){
									//remove the class attribute
									elem.removeAttribute('class');
								}
							}
						}
					}
				}
			}
		}
		return has;
	}
	function addClass(elem, newClass) {
		var returnClass = '';
		if (elem!=undefined) {
			if (elem.nodeType==1) {
				if (newClass!=undefined) {
					if (typeof newClass=='string') {
						newClass = newClass.trim();
						//if elem doesn't already have this newClass
						if (!hasClass(elem, newClass)) {
							//get the current classes
							var currentClass = elem.className;if(currentClass==undefined){currentClass='';}
							currentClass = currentClass.trim();
							//if elem currently has any class at all
							if (currentClass.length > 0) {
								//add the new class
								elem.className = currentClass + ' ' + newClass;
							} else {
								//newClass is elem's first class
								elem.className = newClass;
							}
						}
					}
				}
				returnClass = elem.className;
			}
		}
		return returnClass;
	}
	function removeClass(elem, theClass) {
		var returnClass = '';
		//if the element has theClass... true = remove theClass
		if (hasClass(elem, theClass, true))
		{
			//set the new className to return
			returnClass = elem.className;
		}
		return returnClass;
	}
	function toggleClass(elem, theClass){
		if(typeof theClass=='string'){
			//if doesn't already have this class... (if does, remove)
			if(!hasClass(elem,theClass,true)){
				//add the class
				addClass(elem,theClass);}
		}
	}
	//get a query string value from the current url
	function getQsVal(qsKey, url) {
		qsStr = '';
		//if the qsKey is defined and is a string
		if (qsKey != undefined && typeof qsKey == 'string') {
			qsKey = qsKey.trim();
			//if qsKey is not blank
			if (qsKey.length > 0) {
				//get query string from the url
				var qsStr=document.location.search;
				//get the url from the passed parameter, if it was passed
				if(url!=undefined){
					qsStr=url;qsStr=qsStr.trim();
					//if the passed url contains '?'
					if (qsStr.indexOf('?')!=-1) {
						//trim off '?' and everything to the left
						qsStr=qsStr.substring(qsStr.lastIndexOf('?')+1);
					}
				}
				//if the query string starts with ?
				if (qsStr.indexOf('?') == 0) {
					qsStr = qsStr.substring(1); //trim off ?
				}
				//if the "qsKey=" is a substring inside qsStr
				qsKey += '=';
				if (qsStr.indexOf(qsKey) != -1) {
					//trim off the string before (and including) "qsKey="
					qsStr = qsStr.substring(qsStr.indexOf(qsKey) + qsKey.length);
					//if there are any more qs tacked on
					if (qsStr.indexOf('&') != -1) {
						//trim off the string after (and including) the next "&"
						qsStr = qsStr.substring(0, qsStr.indexOf('&'));
					}
					//if there are any anchors tacked on
					if (qsStr.indexOf('#') != -1) {
						//trim off the string after (and including) the next "#"
						qsStr = qsStr.substring(0, qsStr.indexOf('#'));
					}
					qsStr = qsStr.trim();
				}
			}
		}
		return qsStr;
	}
	//request get/set saved state data via ajax
	function requestState(responseFunc, path, saveValue, numRetries) {
		if (numRetries==undefined){numRetries=0;}
		var xmlhttp;
		//get the ui wrapper element
		var jcss_ui = ui(false);
		//if not already requesting state (limit state ajax requests to one at a time) 
		if (!hasClass(jcss_ui, 'requestState')) {
			//handle overloaded params... if there is no third param given
			if (saveValue==undefined) {
				//if the first param given is a string
				if (typeof responseFunc == 'string') {
					//temp vars for first and second param
					var firstParam = responseFunc;
					var secondParam = path;
					//set path and saveValue as first and second param, respectively
					path = firstParam;
					saveValue = secondParam;
					//no response function given
					responseFunc = undefined;
				}
			}
			//path must have been given
			if (path != undefined) {
				if (typeof path == 'string') {
					path = path.trim();
					//path format: {folder}>{file}.xml>{x-path}
					if (path.indexOf('>>') != -1 && path.indexOf('.xml') != -1) {
						//start building the request url
						var requestUrl = '/jstyle_state/state.php?';
						//get OR set state value?
						var getOrSet = 'get=';
						var setWhat = '';
						//if set state value
						if (saveValue!=undefined) {
							getOrSet = 'set=';
							setWhat = '&value='+saveValue;
						}
						//tack on the url query params 
						requestUrl += getOrSet + encodeURIComponent(path) + setWhat;
						//tack on the nocache param
						requestUrl += '&nocache='+(new Date).getTime();
						//make the ajax request
						xmlhttp = new XMLHttpRequest();
						xmlhttp.open("GET", requestUrl, true);
						//when the request return is received
						xmlhttp.onreadystatechange = function() {
							if (xmlhttp.readyState==4){
								removeClass(jcss_ui,'requestState');
							}
							//if a repsonse function was given
							if (responseFunc!=undefined){
								//execute the ready function
								responseFunc(xmlhttp, requestUrl);
							}
						};
						//send the request
						try {addClass(jcss_ui,'requestState');xmlhttp.send();}
						catch(err) {
							removeClass(jcss_ui,'requestState');
							console.log('jStyle could not finish state request for ' + requestUrl);
						}
					}
				}
			}
		} else {
			//state could not be saved since there was already a previous state ajax request running...
			//if num retries is no more than N
			if (numRetries < 5) {
				//wait before trying to make this ajax request again
				setTimeout(function(){
					//recursive retry
					requestState(responseFunc, path, saveValue, numRetries + 1);
				}, 500);
			}
		}
	}
	//ajax request a proxy url
	function requestProxyUrl(responseFunc, originalUrl, typeKey, domain) {
		var xmlhttp;
		if (responseFunc != undefined) {
			//validate overloaded params
			if (originalUrl != undefined) {
				if (typeof originalUrl == 'string') {
					originalUrl = originalUrl.trim();
					if (originalUrl.length > 0) {
						if (typeKey==undefined){typeKey='url';}
						if (domain==undefined){
							//get the domain from the pageurl query param
							domain = getQsVal('pageurl');
						}
						//build the request url with the given params
						var requestUrl = '../../proxy.php';
						var encodedOriginalUrl = encodeURIComponent(originalUrl);
						requestUrl += '?geturl=' + encodedOriginalUrl;
						requestUrl += '&type=' + typeKey;
						if (domain.length > 0) {requestUrl += '&domain=' + domain;}
						//make the ajax request
						xmlhttp = new XMLHttpRequest();
						xmlhttp.open("GET", requestUrl, true);
						//when the request return is received
						xmlhttp.onreadystatechange = function() {
							//execute the ready function
							responseFunc(xmlhttp, requestUrl);
						};
						//send the request
						try {xmlhttp.send();}
						catch(err) {
							console.log('jStyle could not finish proxy url request for ' + requestUrl);
						}
					}
				}
			}
		}
	}
	var undoBodySizeAdjust;
	//get/create the jcss ui wrapper
	function ui(createIfNotExist) {
		if (createIfNotExist==undefined){createIfNotExist=true;}
		//if the ui window is open (undocked ui)
		var doc = document; var win = ui_window(false); if (win!=undefined) {
			//get the document of the separate ui window
			doc = win.document;
			//if there is a docked ui (in addition to the undocked ui)...
			var dockedUi = document.getElementById(ui_id());
			if (dockedUi != undefined) {
				//remove the docked ui since there is an open ui window (no need to show both docked / undocked interfaces)
				dockedUi.parentNode.removeChild(dockedUi);
				//remove the height styles needed to expand the docked ui to fit below the page content
				if (undoBodySizeAdjust!=undefined){undoBodySizeAdjust();}
			}
		}
		//get the ui wrapper element, if it exists (either docked or undocked)
		var jcss_ui = doc.getElementById(ui_id());var createUiCSSLink = true;
		//ui wrapper doesn't already exist
		if (jcss_ui==undefined) {
			//if supposed to create the ui when it doesn't already exist
			if (createIfNotExist) {
				//create the ui wrapper element
				jcss_ui = doc.createElement(ui_tag());
				jcss_ui.setAttribute('id', ui_id());
				//if the ui window is NOT open (docked ui)
				if (win==undefined) {
					jcss_ui.setAttribute('class', 'docked');
				}
				//append ui to the body
				doc.body.appendChild(jcss_ui);
			} else {
				//don't create the non-existent ui... nor try to add the ui <link>
				createUiCSSLink = false;
			}
		}
		//create the <link> stylesheet for the ui, if it doesn't already exist
		//also create the placeholder that appears when the ui is undocked
		if (createUiCSSLink){ui_sheet();ui_placeholder();}
		//return the ui wrapper element
		return jcss_ui;
	}
	//get/create the ui window
	var jcss_uiwindow;var jcss_uiwindow_checkOpen;
	function ui_window(openIfNotOpen) {
		if (openIfNotOpen==undefined){openIfNotOpen=true;}
		//if the window is not already open AND it should be created
		var isOpen = ui_window_isOpen();
		if (!isOpen && openIfNotOpen) {		
			//open the window
			jcss_uiwindow=window.open('/jstyle_res/ui/ui.php','jcss_uiwindow','height=450,width=750,toolbar=no,scrollbars=yes,resizable=yes,location=no,directories=no,menubar=no,status=no');			
		} else {
			//if window is NOT open
			if (!isOpen) {
				//window is NOT open and WILL NOT be opened 
				return undefined;
			}
		}
		return jcss_uiwindow;
	}
	//get the active pane
	function ui_activePane(){
		var activePane;
		var jcss_ui=ui(false);
		if(jcss_ui!=undefined){
			var stage=jcss_ui.ui_stage;
			if(stage){
				//try to get pane by the active class
				if(stage.getElementsByClassName){
					activePane=stage.getElementsByClassName('active')[0];
				}else{
					//loop through panes to return the first one that has the active class
					for(var c=0;c<stage.childNodes.length;c++){
						var pane=stage.childNodes[c];
						if(hasClass(pane,'active')){
							activePane=pane;
							break;
						}
					}
				}
			}
		}
		return activePane;
	}
	//make sure the sub panes are sized properly inside active pane
	var ui_resizeActivePane_timeout;
	function ui_resizeActivePane(activePane, useTimeout){
		if(useTimeout==undefined){useTimeout=true;}
		//try to find the active pane, IF NOT passed as param
		if(activePane==undefined){activePane=ui_activePane();}
		//resize function
		var doResize=function(){
			setTimeout(function(){
				var fillWidthPane;var hasOtherPanes=false;
				var availableWidth=activePane.clientWidth;
				//loop through sub pane children of activePane
				for(var s=0;s<activePane.childNodes.length;s++){
					//if this is the fill-width pane
					var subPane=activePane.childNodes[s];
					if(hasClass(subPane,'fill-width')){
						//set the sub pane element that will inherit the leftover available width
						fillWidthPane=subPane;
					}else{
						//if not text node
						if(subPane.nodeType==1){
							//if sub pane width is greater than zero
							if(subPane.clientWidth>0){
								//subtract from available width
								availableWidth-=subPane.clientWidth;
								hasOtherPanes=true;
							}
						}
					}
				}
				//if there is a fill-width pane
				if(fillWidthPane!=undefined){
					//if there are other panes
					if(hasOtherPanes){
						//if the other panes have width
						if(availableWidth!=activePane.clientWidth){
							//set the leftover width
							fillWidthPane.style.width=availableWidth+'px';
						}else{
							//the fill width pane is the only pane (with width)
							fillWidthPane.style.width='100%';
						}
					}else{
						//the fill width pane is the only pane
						fillWidthPane.style.width='100%';
					}
				}
			},100);
		};
		//if there is an active pane
		if(activePane!=undefined){
			//if using the timeout
			if(useTimeout){
				//delay
				clearTimeout(ui_resizeActivePane_timeout);
				ui_resizeActivePane_timeout=setTimeout(function(){
					//then resize
					doResize();
				},100);
			}else{
				//resize without delay
				doResize();
			}
		}
	}
	//is the ui minimized?
	function ui_isMinimized(){
		var isMinimized;
		//if ui is docked (NOT open)
		if (!ui_window_isOpen()) {
			isMinimized=false;
			//get the ui (should already exist, but create it if it doesn't)
			var jcss_ui = ui();
			//if the ui wrap has the minimized class
			if (hasClass(jcss_ui, 'minimized')){
				//is minimized
				isMinimized=true;
			}
		}
		return isMinimized;
	}
	//minimize ui
	function ui_minimize(){
		//if the ui is docked (NOT undocked)
		var isMinimized=ui_isMinimized();
		if (isMinimized!=undefined) {
			//if not already minimized, then minimize
			if (!isMinimized){ui_toggleMinimize();}
		}
	}
	//maximize ui
	function ui_maximize(){
		//if the ui is docked (NOT undocked)
		var isMinimized=ui_isMinimized();
		if (isMinimized!=undefined) {
			//if minimized, then maximize
			if (isMinimized){ui_toggleMinimize();}
		}
	}
	//toggle minimize/maximize
	function ui_toggleMinimize(){
		var isMinimized;
		//if ui is docked (NOT open)
		if (!ui_window_isOpen()) {
			isMinimized=false;
			//get the ui (should already exist, but create it if it doesn't)
			var jcss_ui = ui();
			//get the ui button to toggle minimize
			var btn = jcss_ui.ui_hud.btn.toggleMinimize;
			//if not minimized... (note: true means that the minimized class is removed, if found)
			if (!hasClass(jcss_ui, 'minimized', true)) {
				//then minimize... if it was minimized, then it was already maximized
				addClass(jcss_ui, 'minimized');
				isMinimized=true;
				//change button tooltip
				btn.setAttribute('title','maximize');
				btn.className = 'maximize';
			}else{
				//maximized now...
				
				//change button tooltip
				btn.setAttribute('title','minimize');
				btn.className = 'minimize';
			}
			//adjust the body height to accomodate the new ui height
			jcss_ui.bodySizeAdjust();
		}
	}
	//sometimes windows can be hiding as minimized in the task bar... reveal the ui window, if it's undocked
	function ui_window_revealIfOpen(){
		//if the ui window IS open
		if(jcss_uiwindow!=undefined) {
			var xCoord; var yCoord;
			//get the x/y coord of the ui's parent docking window
			if (window.screenLeft){xCoord=window.screenLeft;yCoord=window.screenTop;}
			else{xCoord=window.screenX;yCoord=window.screenY;}
			//move the undocked ui so that it has the same x/y top/left coordinate as the parent docking window
			jcss_uiwindow.moveTo(xCoord,yCoord);
			//note: on multiple monitors, javascript CANNOT move windows outside of the current screen boundary
			//set the focus so that the undocked ui is in front
			jcss_uiwindow.focus();
		}
	}
	//if the window is closed, make sure it is shown as docked
	function ui_window_dockIfClosed() {
		//if the ui window IS closed
		if (!ui_window_isOpen()) {
			//if the ui is NOT docked
			if (document.getElementById(ui_id()) == undefined) {
				//then clear up leftover objects and build the docked ui
				ui_window_close();
			}
		}
	}
	//if ui window is open, make sure the placeholder is visible on the parent window
	function ui_window_showPlaceholderIfOpen(){
		//if the ui window IS open
		if(ui_window_isOpen()) {
			//make sure the placeholder panel is visible
			var uiPh=ui_placeholder();
			if(uiPh.className!='active'){uiPh.className='active';}
		}
	}
	//hide the placeholder
	function ui_window_hidePlaceholder(){
		//make sure the placeholder panel is NOT visible
		var uiPh=ui_placeholder();
		if(uiPh.className=='active'){uiPh.className='';}
	}
	//close and dock the ui window
	function ui_window_close() {
		//if the ui window is open
		var win = jcss_uiwindow;
		if (win != undefined) {
			//then close the window
			if (win.close){win.close();}
			//set the jcss_uiwindow to null then load the ui in the docked position
			jcss_uiwindow=undefined;
		}
		//if the ui is NOT docked
		if (document.getElementById(ui_id()) == undefined) {
			//refresh the ui as being docked
			ui_refresh();
			setTimeout(function(){
				//make sure the body height is adjusted for the docked ui
				document.getElementById(ui_id()).bodySizeAdjust();
			},300);
		}
		//make sure the placeholder is hidden
		ui_window_hidePlaceholder();
	}
	function ui_bodySizeAdjust(){
		//get the ui wrapper (if exists)
		var jcss_ui = ui(false);
		if(jcss_ui!=undefined){
			//if the ui wrapper has the bodySizeAdjust function
			if(jcss_ui.bodySizeAdjust){
				//do the body size adjust
				jcss_ui.bodySizeAdjust();
			}
		}
	}
	//check to see if the ui window is open
	function ui_window_isOpen() {
		var isOpen = false;
		//is the window object defined?
		if (jcss_uiwindow != undefined) {
			try {
				//if not closed
				if (!jcss_uiwindow.closed) {isOpen=true;}
			//catch error if IE can't access this closed jcss_uiwindow window object
			} catch(err){}
		}
		//return the flag
		return isOpen;
	}
	//get/create the ui placeholder that appears when the ui is undocked
	function ui_placeholder(){
		var uiPh = document.getElementById(ui_placeholder_id());
		if(uiPh==undefined){
			//create <jstyle_ui_placeholder>
			uiPh=document.createElement(ui_placeholder_tag());
			uiPh.setAttribute('id',ui_placeholder_id());
			//button wrap
			var btnWrap=document.createElement('ui_buttons');
			//focus ui button
			var focusUIBtn=document.createElement('a');
			focusUIBtn.setAttribute('class','focus');
			focusUIBtn.setAttribute('href','#');
			focusUIBtn.innerHTML='Reveal';
			focusUIBtn.onclick=function(e){
				e.preventDefault();
				//if this ui placeholder doesn't already have a click processing
				if (!hasClass(uiPh,'clicked')){
					//focus and position the undocked ui
					ui_window_revealIfOpen();
				}
			};
			//dock ui button
			var dockUIBtn=document.createElement('a');
			dockUIBtn.setAttribute('class','dock');
			dockUIBtn.setAttribute('href','#');
			dockUIBtn.innerHTML='Dock';
			dockUIBtn.onclick=function(e){
				e.preventDefault();
				//if this ui placeholder doesn't already have a click processing
				if (!hasClass(uiPh,'clicked')){
					addClass(uiPh,'clicked');
					//dock the window after a slight delay
					setTimeout(function(){
						//close
						ui_window_close();
						//remove clicked class
						removeClass(uiPh,'clicked');
					},200);
				}
			};
			//put it all together
			btnWrap.appendChild(focusUIBtn);
			btnWrap.appendChild(dockUIBtn);
			uiPh.appendChild(btnWrap);
			document.body.appendChild(uiPh);
		}
		return uiPh;
	}
	//get/create the jcss_ui.css stylesheet <link>
	function ui_sheet() {
		//if the ui window is open (undocked ui)
		var doc = document; var win = ui_window(false); if (win!=undefined) {doc = win.document;}
		//get the ui <link> stylesheet element, if it exists
		var link = doc.getElementById(ui_sheet_id());
		//ui <link> element doesn't already exist
		if (link==undefined) {
			//create the <link> element
			link = doc.createElement('link');
			link.setAttribute('id', ui_sheet_id());
			link.setAttribute('type', 'text/css');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', '/jstyle_res/css/jcss_ui.css');
			//add to the head
			doc.head.appendChild(link);
		}
		return link;
	}
	//get the jcss_ui.css <link> id
	function ui_sheet_id() {return 'jcss_ui_sheet';}
	//get the ui id
	function ui_id() {return 'jcss_ui';}
	function ui_placeholder_id() {return 'jstyle_ui_placeholder';}
	//get the ui tag name
	function ui_tag() {return 'jcss_ui';}
	function ui_placeholder_tag() {return 'jcss_ui_placeholder';}
	//get the stylesheets (optionally pass a function to be executed for each sheet)
	function sheets(func) {
		var sheets = document.styleSheets;
		//if there is a function to execute for each styleSheet
		if (func!=undefined) {
			if (typeof func == 'function') {
				//for each stylesheet
				var isAlt = false;var sheetIndex=0;
				var origin='';
				//try to get the origin, eg: jstyle:8080/
				if(document.location.origin){origin=document.location.origin;}
				else{origin=document.location.host;}
				//get the root app resource, eg: jstyle:8080/jstyle_ ...
				var jstyleRoot=origin+'/jstyle_';
				//for each sheet
				for (var s = 0; s < sheets.length; s++) {
					//if this style sheet is not a jstyle app resource (must be a resource from current page)
					var href=sheets[s].href;if(href==undefined){href='';}
					if(href.indexOf(jstyleRoot)==-1){
						//execute the function and pass params to the function
						func(sheets[s], {'index':sheetIndex, 'count':sheets.length, 'isalt':isAlt});
						//toggle isAlt true/false
						if (isAlt){isAlt=false;}else{isAlt=true;}
						//next sheet index
						sheetIndex++;
					}
				}
			}
		}
		return sheets;
	}
	//refresh the ui to align with the current css state
	function ui_refresh() {
		//SOME INTERNAL FUNCTIONS
		//=======================
		//internal function to get the document object (either docked or undocked)
		var getWinDoc=function(){
			//if the ui window is open (undocked ui)
			var doc = document; var win = ui_window(false); if (win!=undefined) {
				//set the document of the open window
				doc = win.document;}
			//win is undefined if the ui is docked
			return {'doc':doc,'win':win};
		};
		//internal function to get objects and init if they aren't already defined
		var uiObj;
		var obj=function(objName){
			//if the object hasn't been init yet, then init
			if(uiObj==undefined){
				uiObj={};}
			//if the object doesn't have this property name yet
			if (!uiObj.hasOwnProperty(objName)){
				//figure out what property to init
				switch(objName){
					case 'doc':
						//init property
						var winDock=getWinDoc();
						uiObj.doc=winDock.doc;
						uiObj.win=winDock.win;
						break;
					case 'win':
						//init property
						var winDock=getWinDoc();
						uiObj.doc=winDock.doc;
						uiObj.win=winDock.win;
						break;
					case 'jcss_ui':
						//init property
						uiObj.jcss_ui=ui();
						break;
				}
			}
			return uiObj[objName];
		};
		//internal function to create / get an element and make sure it's empty
		var recreateEmptyElem=function(tagName, parentElem){
			if(parentElem==undefined){parentElem=obj('jcss_ui');}
			//if this element is already in the ui wrapper
			var elem = obj('jcss_ui')[tagName];
			//clear the elem's content if elem exists
			if(elem!=undefined){elem.innerHTML = '';}
			else{
				//this element doesn't exist yet so create it and add it to the ui
				elem = obj('doc').createElement(tagName);parentElem.appendChild(elem);
				obj('jcss_ui')[tagName] = elem;
			}
			return elem;};
		//internal function to both execute a function and add it as an element's refresh function
		var initRefreshFunc=function(uiElemName, func){
			//execute the function to do the initial refresh build
			func();
			//allow the element to access the refresh method
			obj('jcss_ui')[uiElemName]['refresh']=func;
		};
		//internal function to configure a sub pane element as a slide-out type
		var makeSlideOutSubPane=function(ui_subPane,slideStartFunc,slideEndFunc){
			ui_subPane.setAttribute('class','slide-out');
			//add the pane title element
			var ui_pane_title=obj('doc').createElement('ui_pane_title');
			//add the pane icon
			var ui_pane_ico=obj('doc').createElement('ui_pane_ico');
			ui_pane_title.appendChild(ui_pane_ico);
			//add the pane pin icon
			var ui_pin=obj('doc').createElement('a');
			ui_pin.setAttribute('class','ui_pin');
			ui_pin.setAttribute('href','#');
			ui_pin.onclick=function(e){
				e.preventDefault();
				//toggle add 'pinned' class on the ui_subPane
				toggleClass(ui_subPane,'pinned');
			};
			ui_pane_title.appendChild(ui_pin);
			//hover on/off
			hover(ui_subPane,function(){
				if(!hasClass(ui_subPane,'pinned')){
					addClass(ui_subPane,'expand');
					//after animation complete
					setTimeout(function(){
						//add the expanded class (indicates end of expand animation)
						addClass(ui_subPane,'expanded');
						//adjust the width of the filler-width-sub-pane
						ui_resizeActivePane(ui_subPane.parentNode, false);
					},500);
				}
				//call custom function, if exists
				if(slideStartFunc!=undefined){slideStartFunc();}
			},
			function(){
				if(!hasClass(ui_subPane,'pinned')){
					//hover off
					removeClass(ui_subPane,'expanded');
					removeClass(ui_subPane,'expand');
					//after animation complete
					setTimeout(function(){
						//adjust the width of the filler-width-sub-pane
						ui_resizeActivePane(ui_subPane.parentNode, false);
						//call custom function, if exists
						if(slideEndFunc!=undefined){slideEndFunc();}
					},500);
				}
			});
			//return
			return ui_pane_title;
		};
		//CLEAR/INIT
		//======================
		//clear the jcss_ui content
		obj('jcss_ui').innerHTML = '';
		//create the placeholder element
		var uiPh=ui_placeholder();
		//create the ui stage 
		var ui_stage=recreateEmptyElem('ui_stage');
		//UI SHEETS BUILD/REFRESH
		//====================
		//internal function to create/recreate the ui sheets
		var refreshUISheets=function(){
			//create the ui_sheets wrapper
			var ui_sheets = recreateEmptyElem('ui_sheets',ui_stage);
			ui_sheets.setAttribute('class','pane active');
			//create the sheet list wrapper
			var ui_sheet_list = obj('doc').createElement('ui_sheet_list');
			ui_sheet_list['sheet_hrefs']=[];
			ui_sheet_list['ui_sheet_hrefs']=[];
			ui_sheets.appendChild(ui_sheet_list);
			//create the sheet scrollable area wrapper
			var ui_sheets_scroll = obj('doc').createElement('ui_scroll');
			ui_sheet_list.appendChild(ui_sheets_scroll);
			//create the sheet editor wrapper
			var ui_sheet_editor = obj('doc').createElement('ui_sheet_editor');
			ui_sheet_editor.setAttribute('class','fill-width');
			ui_sheets.appendChild(ui_sheet_editor);
			//create the editor scrollable area wrapper
			var ui_editor_scroll = obj('doc').createElement('ui_scroll');
			ui_editor_scroll.innerHTML='Curabitur sit amet commodo dolor. Integer ultricies bibendum odio in sodales. Aenean euismod tempus tortor, eu pellentesque lectus hendrerit at. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis tempor, augue eu egestas luctus, lacus libero convallis nisi, suscipit consequat eros nunc sit amet dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet nibh rhoncus, porta massa et, tristique nisl. Aliquam magna erat, rutrum sed vulputate in, vestibulum in sapien. Sed ut ligula non est tempus ullamcorper. In dictum nunc nec enim vulputate, eu pulvinar ipsum laoreet. Mauris auctor at tortor condimentum molestie. Donec malesuada tortor non massa egestas, at molestie neque aliquet. Praesent id nisl erat. Proin dignissim, turpis in consectetur laoreet, lacus nisl auctor magna, placerat mollis metus lacus sed dui. Nullam eget placerat nibh.';//---
			ui_sheet_editor.appendChild(ui_editor_scroll);
			var isRefreshInit=true;
			//function to get the href of a sheet
			var getSheetHref=function(sheet){
				var href='';
				//if this sheet's original href was cached already
				if(sheet.hasOwnProperty('jcss_original_href')){
					//get cached original href
					href=sheet.jcss_original_href;
				}else{
					//get original href from encoded href...
					href=getQsVal('css',sheet.href);
					if(href==''){
						//href could be encoded as a 'url' query string value instead of 'css'
						href=getQsVal('url',sheet.href);}
					//is the owner node for this stylesheet an inline <style> node?
					if(sheet.ownerNode!=undefined){
						var ownerNodeTag=sheet.ownerNode.tagName;
						if(ownerNodeTag!=undefined){
							if(sheet.ownerNode.nodeType==1){
								ownerNodeTag=ownerNodeTag.toLowerCase();
								if(ownerNodeTag=='style'){
									href='';
								}
							}
						}
					}
				}
				return href;
			};
			//function that builds ui content, related to a single document.styleSheet
			var addUISheet=function(sheet){
				//if this sheet doesn't already have a ui element item
				if(isRefreshInit||!sheet.hasOwnProperty('jcss_ui_item')){
					//get sheet original href
					var href=getSheetHref(sheet);
					var isInline=false;
					//if the href for this sheet was retrieved
					if(href!=''){
						//get original decoded uri component
						href=decodeURIComponent(href);
					}else{
						isInline=true;
						href='[inline-style';
						var inlineStyleNum=1;
						//while this href is NOT unique
						while(ui_sheet_list.sheet_hrefs.indexOf(href+inlineStyleNum+']')!=-1){
							inlineStyleNum++;
						}
						href+=inlineStyleNum+']';
					}
					//if this stylesheet is not an internal resource of the jcss jstyle app
					if(href.indexOf(document.location.protocol+'//'+document.location.host+'/jstyle_')!=0){		
						//get sheet file name
						var name=href;
						if(name.indexOf('/')!=-1){
							//get the string after the last '/'
							name=name.substring(name.lastIndexOf('/')+1);
						}
						//create a popout hover menu for this sheet (if NOT inline style)
						var popMenu;
						if(!isInline){
							popMenu=obj('doc').createElement('sheet_popup');
							//open sheet option	
							var optionOpenSheet=obj('doc').createElement('a');	
							optionOpenSheet.setAttribute('class','option open-sheet');
							optionOpenSheet.setAttribute('target','_blank');		
							optionOpenSheet.setAttribute('href',href);	
							optionOpenSheet.setAttribute('title',href);
							optionOpenSheet.innerHTML='open';
							popMenu.appendChild(optionOpenSheet);
						}
						//create sheet item
						var sheetItem = obj('doc').createElement('ui_sheet');
						sheetItem.setAttribute('name',name);
						if(isInline){sheetItem.setAttribute('class','inline');}
						hoverClass(sheetItem);
						//create sheet button
						var sheetBtn = obj('doc').createElement('a');
						sheetBtn.setAttribute('class','sheet');
						sheetBtn.setAttribute('href',href);
						sheetBtn.setAttribute('title','edit');
						sheetBtn.innerHTML=name;
						sheetBtn.onclick=function(e){
							e.preventDefault();
							//*** open sheet editor
						};
						//add sheetItem child contents
						sheetItem.appendChild(sheetBtn);
						if(popMenu!=undefined){sheetItem.appendChild(popMenu);}
						//add the sheet link item to the ui_sheet_list
						ui_sheets_scroll.appendChild(sheetItem);
						//increase the sheet count
						ui_sheet_list.sheet_hrefs.push(href);
						//make the sheetItem accessible through the sheet object
						sheet['jcss_ui_item']=sheetItem;
						sheetItem['docSheetObj']=sheet;
						sheet['jcss_original_href']=href;
					}else{
						//this is a stylesheet used for this app and is NOT for this page...
						//increase the sheet count (for internal app ui sheets)
						ui_sheet_list.ui_sheet_hrefs.push(href);
					}
				}
			};
			sheets(addUISheet);isRefreshInit=false;
			var removeUISheet=function(sheet){
				var isRemoved=true;
				//FIGURE OUT IF THE SHEET WAS REMOVED
				//if owner node was NOT removed
				if(sheet.ownerNode!=undefined){
					//this ui sheet is NOT removed
					isRemoved=false;
				}
				//REMOVE RELATED PROPERTIES IF THE SHEET WAS REMOVED
				//if this sheet was removed
				if(isRemoved){
					//get sheet original href
					var href=getSheetHref(sheet);
					if(href!=''){
						var foundRemoved=false;
						//LOOP THROUGH PAGE-STYLESHEETS
						var keepHrefs=[];
						//if this href is listed for the page
						for(var u=0;u<ui_sheet_list.sheet_hrefs.length;u++){
							//if this is not the item to remove
							if(ui_sheet_list.sheet_hrefs[u]!=href){
								//keep this item
								keepHrefs.push(ui_sheet_list.sheet_hrefs[u]);
							}else{
								foundRemoved=true;
							}
						}
						//if removed a ui stylesheet
						if(foundRemoved){
							//reset the new href array
							ui_sheet_list.sheet_hrefs=keepHrefs;
							//remove the ui list item for this sheet
							sheet.jcss_ui_item.parentNode.removeChild(sheet.jcss_ui_item);
							sheet.jcss_ui_item=undefined;
						}else{
							//LOOP THROUGH APP-STYLESHEETS
							keepHrefs=[];
							//if this href is listed for the ui app
							for(var u=0;u<ui_sheet_list.ui_sheet_hrefs.length;u++){
								//if this is not the item to remove
								if(ui_sheet_list.ui_sheet_hrefs[u]!=href){
									//keep this item
									keepHrefs.push(ui_sheet_list.ui_sheet_hrefs[u]);
								}else{
									foundRemoved=true;
								}
							}
							//if removed a ui stylesheet
							if(foundRemoved){
								//reset the new href array
								ui_sheet_list.ui_sheet_hrefs=keepHrefs;
							}
						}
					}
				}
			};
			//function to update the sheet list when hovering over the list (post page init)
			var sheetsPostInitUpdate=function(){
				//HANDLE A CHANGE IN THE NUMBER OF STYLESHEETS
				//count the number of sheets (internal app sheets + page sheets)
				var sheetCount=ui_sheet_list.ui_sheet_hrefs.length+ui_sheet_list.sheet_hrefs.length;
				//if the number of sheets has changed
				if(sheetCount!=document.styleSheets.length){
					//if there are more stylesheets now
					if(sheetCount<document.styleSheets.length){
						//for each document.styleSheet
						for(var s=document.styleSheets.length-1;s>-1;s--){
							//add this sheet to the ui, if not already added
							addUISheet(document.styleSheets[s]);
							//if the ui now shows the correct number of sheets
							sheetCount=ui_sheet_list.ui_sheet_hrefs.length+ui_sheet_list.sheet_hrefs.length;
							if(sheetCount==document.styleSheets.length){
								//end the loop to quit trying to add sheets
								break;
							}
						}
					}else{
						//sheet has been removed...
						//for each stylesheet ui item
						for(var u=0;u<ui_sheets_scroll.childNodes.length;u++){
							//if this is an html dom node
							var uiSheetNode=ui_sheets_scroll.childNodes[u];
							if(uiSheetNode.nodeType==1){
								//if this is a ui_sheet node
								if(uiSheetNode.tagName.toLowerCase()=='ui_sheet'){
									//if this node has a related docSheetObj property
									if(uiSheetNode.hasOwnProperty('docSheetObj')){
										//remove this UI sheet, if its owner sheet was removed
										removeUISheet(uiSheetNode.docSheetObj);
										//if the ui now shows the correct number of sheets
										sheetCount=ui_sheet_list.ui_sheet_hrefs.length+ui_sheet_list.sheet_hrefs.length;
										if(sheetCount==document.styleSheets.length){
											//end the loop to quit trying to remove sheets
											break;
										}
									}
								}
							}
						}
					}
				}
				//HANDLE A CHANGE IN THE ENABLED/DISABLED PROPERTY OF STYLESHEETS
				//for each stylesheet ui item
				for(var u=0;u<ui_sheets_scroll.childNodes.length;u++){
					//if this is an html dom node
					var uiSheetNode=ui_sheets_scroll.childNodes[u];
					if(uiSheetNode.nodeType==1){
						//if this is a ui_sheet node
						if(uiSheetNode.tagName.toLowerCase()=='ui_sheet'){
							//if this node has a related docSheetObj property
							if(uiSheetNode.hasOwnProperty('docSheetObj')){
								//if this sheet is disabled
								if(uiSheetNode.docSheetObj.disabled){
									//disabled so add disabled class
									addClass(uiSheetNode,'disabled');
								}else{
									//not disabled, so remove disabled class
									removeClass(uiSheetNode,'disabled');
								}
							}
						}
					}
				}
			};
			//add the slide out functionality and content for the ui_sheet_list
			ui_sheet_list.appendChild(makeSlideOutSubPane(ui_sheet_list,sheetsPostInitUpdate));
			//after page load
			setTimeout(function(){
				//check the number of document.styleSheets and align the ui sheet list
				sheetsPostInitUpdate();
			},1000);
		};
		//ui sheets build
		initRefreshFunc('ui_sheets', refreshUISheets);
		//UI HUD BUILD/REFRESH
		//====================
		//internal function to create/recreate the ui hud
		var refreshUIHud=function(){
			//create the ui_hud wrapper
			var ui_hud = recreateEmptyElem('ui_hud');
			//init the ui hud's btns array and JSON
			ui_hud['btns']=[];ui_hud['btn']={};
			//internal function to create a ui hud button
			var createUIBtn = function(wrap, btnKey, btnClass, btnText, tooltip, func) {
				var btn = obj('doc').createElement('a');
				btn.setAttribute('class', btnClass);
				if (tooltip.length > 0){btn.setAttribute('title', tooltip);}
				btn.setAttribute('name', btnKey);
				btn.setAttribute('href', '#');
				btn.innerHTML = btnText;
				btn.onclick = function(e) {
					e.preventDefault();
					func(this, e);
				};
				wrap.appendChild(btn);
				//add the ui button to the array / JSON for easy access
				ui_hud.btns.push(btn);
				ui_hud.btn[btnKey]=btn;
				return btn;
			};
			//create the ui_main_btns (main options button wrapper)
			var ui_main_btns = obj('doc').createElement('ui_main_btns');
			ui_hud.appendChild(ui_main_btns);
			//create the ui_window_btns (window options button wrapper)
			var ui_window_btns = obj('doc').createElement('ui_window_btns');
			ui_hud.appendChild(ui_window_btns);
			//if the ui is docked on the window (there is no open ui window)
			if (obj('win')==undefined) {
				//create ui_window_btns
				createUIBtn(ui_window_btns, 'undock', 'undock window', '', 'undock window', function(){ui_window();});
				createUIBtn(ui_window_btns, 'toggleMinimize', 'minimize', '', 'minimize', function(){ui_toggleMinimize();});
				//create the ui_resize_handle
				var ui_resize_handle = recreateEmptyElem('ui_resize_handle');
				obj('jcss_ui').appendChild(ui_resize_handle);
				//create the ui_resize_screen
				var ui_resize_screen = obj('doc').createElement('ui_resize_screen');
				ui_resize_handle.appendChild(ui_resize_screen);
				//function to adjust the body height/padding-bottom to accomodate the ui wrapper
				var bodySizeAdjust = function() {
					//see which element to use for scrollTop (body, or html)
					var scrollTopElem = obj('doc').body;
					var keepScrollTop = scrollTopElem.scrollTop;
					//if the body.scrollTop value is 0
					if (keepScrollTop == 0) {
						var testScrollElem = obj('doc').getElementsByTagName("html")[0];
						keepScrollTop = testScrollElem.scrollTop;
						//if the html.scrollTop value is NOT 0
						if (keepScrollTop != undefined && keepScrollTop != 0) {scrollTopElem = testScrollElem;}
					}
					//if the original body height and padding are not already saved...
					if (undoBodySizeAdjust==undefined) {
						//save the original padding and height 
						//so that the adjustment can be undone if the docked ui is undocked
						var origHeight = obj('doc').body.style.height;
						var origPadBottom = obj('doc').body.style.paddingBottom;
						undoBodySizeAdjust = function() {
							//restore original height and padding-bottom
							if (origHeight==undefined) {origHeight='';}
							if (origPadBottom==undefined) {origPadBottom='';}
							//set restored values
							obj('doc').body.style.height = origHeight;
							obj('doc').body.style.paddingBottom  = origPadBottom;
						};
					}
					//remove the height and the padding on the doc.body
					obj('doc').body.style.height = '';
					obj('doc').body.style.paddingBottom  = '';
					//set the height and the padding on the doc.body
					var bodyHeight = obj('doc').body.scrollHeight;
					var uiHeight = obj('jcss_ui').clientHeight;
					obj('doc').body.style.height = bodyHeight+'px';
					obj('doc').body.style.paddingBottom  = uiHeight+'px';
					//restore the original scroll positioning
					scrollTopElem.scrollTop = keepScrollTop;
					//if jcss_ui doesn't already have a height... 
					var heightStatePath = 'window >> orientation.xml >> //orientation/docked/height';
					var uiHeightStyle = obj('jcss_ui').style.height;
					if (uiHeightStyle==undefined||uiHeightStyle=='') {
						//request the saved height from orientation.xml... then set the saved ui height state that was returned from orientation.xml
						requestState(function(resp){if(resp.readyState==4){
							obj('jcss_ui').style.height=resp.responseText;}
						}, heightStatePath);
					} else {
						//...else save the new adjusted height of the docked ui into the state, orientation.xml
						requestState(heightStatePath, uiHeightStyle);
					}
				};
				//if the resize handle already has onmousedown event
				var resizeEventAdded = false;
				var resizeMouseDownEvent=ui_resize_handle.onmousedown;
				if (resizeMouseDownEvent!=undefined){
					//if onmousedown event includes startResize function
					resizeMouseDownEvent=resizeMouseDownEvent.toString();
					if(resizeMouseDownEvent.indexOf('startResize')!=-1){
						resizeEventAdded = true;
					}
				}
				//if resize event not already added
				if (!resizeEventAdded){
					//add the dragResizable event to the ui_resize_handle
					dragResizable(obj('jcss_ui'), [{'handle':ui_resize_handle,'direction':'vertical','onend':bodySizeAdjust}]);
				}
				//add the bodySizeAdjust event to the jcss_ui so that the function can be called elsewhere
				obj('jcss_ui')['bodySizeAdjust'] = bodySizeAdjust;
				//on page load, adjust the body height to accomodate the ui wrapper
				setTimeout(function(){bodySizeAdjust();},300);
			} else {
				//ui is open in a separate window (undocked)
			
				//create ui_window_btns
				createUIBtn(ui_window_btns, 'dock', 'dock window', '', 'dock window', function(){ui_window_close();});
			}
		}
		//ui hud build
		initRefreshFunc('ui_hud', refreshUIHud);
		//return the ui wrapper
		return obj('jcss_ui');
	}
	//PUBLIC ACCESS
	jcss.getQsVal = getQsVal;
	//class
	jcss.hasClass = hasClass;
	jcss.toggleClass = toggleClass;
	jcss.addClass = addClass;
	jcss.removeClass = removeClass;
	//ajax
	jcss.requestProxyUrl = requestProxyUrl;
	jcss.requestState = requestState;
	//events
	jcss.ready = ready;
	jcss.hover = hover;
	jcss.hoverClass = hoverClass;
	jcss.appendEvent = appendEvent;
	jcss.dragResizable = dragResizable;
	//ui
	jcss.ui = ui;
	jcss.ui.id = ui_id;
	jcss.ui.tag = ui_tag;
	jcss.ui.activePane = ui_activePane;
	jcss.ui.resizeActivePane = ui_resizeActivePane;
	jcss.ui.placeholder = ui_placeholder;
	jcss.ui.placeholder.id = ui_placeholder_id;
	jcss.ui.placeholder.tag = ui_placeholder_tag;
	jcss.ui.sheet = ui_sheet;
	jcss.ui.sheet.id = ui_sheet_id;
	jcss.ui.toggleMinimize = ui_toggleMinimize;
	jcss.ui.isMinimized = ui_isMinimized;
	jcss.ui.minimize = ui_minimize;
	jcss.ui.maximize = ui_maximize;
	jcss.ui.bodySizeAdjust = ui_bodySizeAdjust;
	jcss.ui.win = ui_window;
	jcss.ui.win.isOpen = ui_window_isOpen;
	jcss.ui.win.close = ui_window_close;
	jcss.ui.win.dockIfClosed = ui_window_dockIfClosed;
	jcss.ui.win.revealIfOpen = ui_window_revealIfOpen;
	jcss.ui.win.showPlaceholderIfOpen = ui_window_showPlaceholderIfOpen;
	jcss.ui.win.hidePlaceholder = ui_window_hidePlaceholder;
	jcss.ui.refresh = ui_refresh;
	//access
	return jcss;
})();
//ON WINDOW READY
jcss.ready(function(){
	//EVENTS
	//======
	//when the main window closes...
	jcss.appendEvent(window, 'onunload', function() {
		//get the separate ui window, if it's open, then close it
		var win = jcss.ui.win(); if (win != undefined) {jcss.ui.win.close();}
	});
	//when the window resizes...
	jcss.appendEvent(window, 'onresize', function(e){
		//adjust the body height to accomodate the ui wrapper
		jcss.ui.bodySizeAdjust();
		//adjust the sub-pane widths inside the active pane
		jcss.ui.resizeActivePane();
	});
	//when the window scrolls
	var scroll_timeout;
	jcss.appendEvent(window, 'onscroll', function(e){
		clearTimeout(scroll_timeout);
		scroll_timeout=setTimeout(function(){
			//if the height of the window is more than the available scroll height
			if (document.body.scrollHeight > document.body.clientHeight){
				//adjust the body height to accomodate the ui wrapper
				jcss.ui.bodySizeAdjust();
			}
		},200);
	});
	//when the main window gains focus...
	jcss.appendEvent(window, 'onfocus', function() {
		//make sure the docked ui appears if the ui window is closed
		jcss.ui.win.dockIfClosed();
		//show the undocked placeholder (if ui is open undocked)
		jcss.ui.win.showPlaceholderIfOpen();
	});
	//when the main window loses focus...
	jcss.appendEvent(window, 'onblur', function() {
		//make sure the docked ui appears if the ui window is closed
		jcss.ui.win.dockIfClosed();
		//make sure the placeholder is hidden
		jcss.ui.win.hidePlaceholder();
	});
	//when the main window has a mouse over it
	var out_timeout;
	jcss.appendEvent(document.body, 'onmouseover', function(e) {
		//cancel the onmouseout
		clearTimeout(out_timeout);
		//make sure the docked ui appears if the ui window is closed
		jcss.ui.win.dockIfClosed();
		//show the undocked placeholder (if ui is open undocked)
		jcss.ui.win.showPlaceholderIfOpen();
	});
	//when the main window has a mouse leave it
	jcss.appendEvent(document.body, 'onmouseout', function(e) {
		//after a delay...
		//onmouseout gets triggered when leaving any child element of window
		//so the purpose of the timeout is to try and prevent onmouseout from firing too many times...
		//note: onmouseover also gets triggered repeatedly this way
		out_timeout=setTimeout(function(){
			//hide the undocked placeholder when the mouse is not over the window
			jcss.ui.win.hidePlaceholder();
		},100);
	});
	//window scroll event
	//LOAD THE USER INTERFACE (ALWAYS DOCKED ON INITIAL LOAD)
	//=======================================
	jcss.ui.refresh();
	

	/*//---
	
	jcss.requestState(function(resp){if(resp.readyState==4){
		console.log('TEST: ' + resp.responseText);}
	}, 'window >> orientation.xml');*/
});
