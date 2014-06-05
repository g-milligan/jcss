var popup = function(tab) {
	//key proxy paths
	var proxyPage = 'proxy.php';
	var proxyQsKey = 'pageurl';
	var proxyResFolder = 'jstyle_res/';
	var proxyImgFolder = 'img/';
	//get the proxy domain url
	var proxyDomainUrl = function(url) {
		var localKey = 'jstyle_proxyDomainUrl';
		//if saving a url (url to save is given)
		if (url != undefined) {
			//set the local storage item
			localStorage.setItem(localKey, url);
		}
		//get url (if exists) from localStorage
		url = localStorage.getItem(localKey);
		if (url == undefined) {url = '';}
		//return 
		return url;
	};
	//detect if the current page is the proxy page
	var isProxyPage = function() {
		var isProxy = false;
		//get the two urls to compare
		var proxDomUrl = proxyDomainUrl();
		var tabUrl = tab.url;
		//if the tabUrl contains the proxy page name
		if (tabUrl.indexOf(proxyPage) != -1) {
			//if the tabUrl contains the 'pageurl=' query string key
			if (tabUrl.indexOf(proxyQsKey+'=') != -1) {
				//if the current page href starts with the proxDomUrl
				if (tab.url.indexOf(proxDomUrl) == 0) {
					isProxy = true;
				}
			}
		}
		return isProxy;
	};
	var setProxyDomainLink = function(proxyLink) {
		if (proxyLink != undefined) {
			//if there is a saved proxy url
			var proxyDomUrl = proxyDomainUrl();
			if (proxyDomUrl != '') {
				var proxyQsVal = '';
				//get the proxy url for this page
				proxyQsVal = tab.url;
				proxyQsVal = encodeURIComponent(proxyQsVal);
				proxyLink.setAttribute('href', proxyDomainUrl() + proxyPage + '?' + proxyQsKey + '=' + proxyQsVal);
				proxyLink.setAttribute('disabled', 'false');
			} else {
				//no saved proxy url
				proxyLink.setAttribute('href', '#');
				proxyLink.setAttribute('disabled', 'disabled');
			}
		}
	};
	//show the proxy domain url and option to change the url
	var showProxyDomainUrl = function(isProxy) {
		//detect if currently viewing the proxy page
		if (isProxy==undefined) {isProxy = isProxyPage();}
		//wrap
		var domainWrap = document.createElement('div');
		domainWrap.setAttribute('class', 'domain-wrap');
		domainWrap.setAttribute('title', 'The host domain of your local proxy');
		//label
		var domainLabel = document.createElement('label');
		domainLabel.setAttribute('for', 'domain');
		domainLabel.setAttribute('class', 'domain-label');
		domainLabel.innerHTML = "Proxy";
		//textbox
		var domainInput = document.createElement('input');
		domainInput.setAttribute('id', 'domain');
		domainInput.setAttribute('type', 'text');
		var placeholder = 'Example: http://localproxy:8080/';
		var url = proxyDomainUrl(); if (url == '') {url = placeholder;}
		domainInput.value = url;
		//save button
		var saveBtn = document.createElement('a');
		saveBtn.setAttribute('href', '#');
		saveBtn.setAttribute('class', 'save-proxy');
		saveBtn.setAttribute('title', 'save proxy domain');
		saveBtn.innerHTML = '<span>Save</span>';
		saveBtn.style.display = 'none';
		//if NOT currently viewing the proxy page
		if (!isProxy) {
			//save button click event AND toggle show/hide 
			var toggleSaveBtn = function() {
				//if the input value does NOT equal the saved value NOR the placeholder value NOR blank
				var show = false;
				var val = domainInput.value; val = val.trim();
				if (val != proxyDomainUrl()) {
					if (val != placeholder) {
						if (val.length > 0) {
							show = true;
						}
					}
				}
				//if the save button should be shown
				if (show) {
					//this value can be saved... so show the save button
					saveBtn.style.display = '';
				} else {
					//this value cannot be saved... so hide the save button
					saveBtn.style.display = 'none';
				}
			};
			saveBtn.onclick = function() {
				//get the proxy url string to save
				var val = domainInput.value; val = val.trim();
				var isValid = false;
				//check if valid val
				if (val != proxyDomainUrl()) {
					if (val != placeholder) {
						if (val.length > 0) {
							//if the value doesn't begin with http
							if (val.indexOf('http') != 0) {
								val = 'http://'+val;
							}
							//if the value doesn't end with /
							if (val.lastIndexOf('/') != val.length - 1) {
								val += '/';
							}
							isValid = true;
						}
					}
				}
				//if value is valid
				if (isValid) {
					//refresh status message to indicate connection to the proxy
					document.getElementById('refresh-status-click').onclick();
					//save the proxy domain url in local storage
					domainInput.value = proxyDomainUrl(val);
				} else {
					//+++ invalid message
				}
			};
			//textbox blur and focus events
			domainInput.onblur = function() {
				//if the input lost focus and doesn't have a value
				var val = this.value; val = val.trim();
				if (val.length < 1) {
					//if there is no saved value
					var savedVal = proxyDomainUrl();
					if (savedVal.length < 1) {
						//show default value
						this.value = placeholder;
					} else {
						//show the saved value placeholder
						this.value = savedVal;
					}
				} else {
					//the input value can possibly be saved... possibly show the save button
					toggleSaveBtn();
				}
			};
			domainInput.onfocus = function() {
				//if the input gained focus and has the default value
				var val = this.value; val = val.trim();
				if (val == placeholder) {
					//remove the default text
					this.value = '';
				} else {
					//the input value can possibly be saved... possibly show the save button
					toggleSaveBtn();
				}
			};
			domainInput.onkeyup = function() {toggleSaveBtn();};
			domainInput.onclick = function() {toggleSaveBtn();};
		} else {
			//disable the proxy text box since the proxy page is already open
			domainInput.setAttribute('disabled','disabled');
		}
		//put it all together
		domainWrap.appendChild(domainLabel);
		domainWrap.appendChild(domainInput);
		domainWrap.appendChild(saveBtn);
		document.body.appendChild(domainWrap);
	};
	//show connection with proxy status
	var showProxyStatus = function() {
		var getSuccessImgPath = function() {
			//get the NON-cached path to the proxy image (stored in the local proxy site)
			return proxyDomainUrl() + proxyResFolder + proxyImgFolder + 'check.png?nocache=' + new Date().getTime();
		};
		//wrap
		var statusWrap = document.createElement('div');
		statusWrap.setAttribute('class', 'status-wrap');
		//loading image
		var loadingImg = document.createElement('img');
		loadingImg.setAttribute('alt', 'loading');
		loadingImg.setAttribute('class', 'status-img loading');
		loadingImg.setAttribute('src', '../img/loading.gif');
		//error image
		var errorImg = document.createElement('img');
		errorImg.setAttribute('alt', 'error');
		errorImg.setAttribute('class', 'status-img error');
		errorImg.setAttribute('src', '../img/x.png');
		//success image
		var successImg = document.createElement('img');
		successImg.setAttribute('alt', 'success');
		successImg.setAttribute('class', 'status-img success');
		successImg.setAttribute('src', getSuccessImgPath());
		//status message
		var statusMsg = document.createElement('p');
		statusMsg.setAttribute('class', 'status-msg');
		//put each image into an array
		var imgArray = [loadingImg, errorImg, successImg];
		var statusesArray = ['loading', 'error', 'success'];
		//function to deactivate all status images
		var deactivateStatuses = function() {
			//for each image
			for (var i = 0; i < imgArray.length; i++) {
				//remove active class
				var classStr = imgArray[i].className;
				classStr = classStr.replace(' active', '');
				imgArray[i].className = classStr;
				//remove status class from wrap
				var wrapClass = statusWrap.className;
				wrapClass = wrapClass.replace(' ' + statusesArray[i], '');
				statusWrap.className = wrapClass;
			}
		};
		//function to set a proxy status
		var setProxyStatus = function(status) {
			//deactivate any images that may be active now
			deactivateStatuses();
			//temporarily disable the "Open CSS Editor" Link
			var proxyLink = document.getElementById('proxy-link');
			if (proxyLink != undefined) {proxyLink.setAttribute('disabled', 'disabled');}
			//switch on one of the statuses
			switch(status) {
				case 'loading':
					//make the loading image active
					loadingImg.className += ' active';
					statusWrap.className += ' ' + statusesArray[0];
					statusMsg.innerHTML = 'checking local proxy connection...';
					break;
				case 'error':
					//make the error image active
					errorImg.className += ' active';
					statusWrap.className += ' ' + statusesArray[1];
					statusMsg.innerHTML = 'proxy turned off or disconnected';
					break;
				case 'success':
					//make the success image active
					successImg.className += ' active';
					statusWrap.className += ' ' + statusesArray[2];
					statusMsg.innerHTML = 'proxy connected; ready to rock!';
					//enable the "Open CSS Editor" Link
					if (proxyLink != undefined) {setProxyDomainLink(proxyLink);}
					break;
			}
		};
		//activate the loading status initially
		setProxyStatus('loading');
		//detect if cannot connect to the proxy
		successImg.onerror = function(e) {setProxyStatus('error');e.preventDefault();return false;};
		//detect if successfully connected to the proxy
		successImg.onload = function() {setProxyStatus('success');};
		//refresh click
		var refreshLink = document.createElement('a');
		refreshLink.setAttribute('class', 'refresh-click');
		refreshLink.setAttribute('href', '#');
		refreshLink.setAttribute('title', 'test connection');
		refreshLink.setAttribute('id', 'refresh-status-click');
		refreshLink.onclick = function(e) {
			if (e != undefined) {e.preventDefault();}
			//show a loading status
			setProxyStatus('loading');
			//slight delay for dramatic loading effect
			setTimeout(function(){
				//reload the proxy success image
				successImg.src = getSuccessImgPath();
			}, 300);
		};
		//put it all together
		statusWrap.appendChild(refreshLink);
		refreshLink.appendChild(loadingImg);
		refreshLink.appendChild(errorImg);
		refreshLink.appendChild(successImg);
		refreshLink.appendChild(statusMsg);
		document.body.appendChild(statusWrap);
	};
	//show the link to the proxy
	var showProxyLink = function() {
		//IF THE PROXY IS ACTIVE... DISPLAY A BUTTON TO ACCESS PROXY PAGE

		//create the proxy link 
		var proxyAElem = document.createElement('a');
		proxyAElem.setAttribute('target', '_blank');
		proxyAElem.setAttribute('class', 'proxy-link');
		proxyAElem.setAttribute('id', 'proxy-link');
		proxyAElem.onclick = function(e){if(this.getAttribute('disabled') == 'disabled'){e.preventDefault();}};
		setProxyDomainLink(proxyAElem);
		proxyAElem.innerHTML = '<span>Open CSS Editor</span>';
		document.body.appendChild(proxyAElem);
	};
	//PROCESS
	var isProxy = isProxyPage();
	//show the proxy domain url 
	showProxyDomainUrl(isProxy);
	//show the status of the proxy site connection
	showProxyStatus();
	//if not on the proxy page currently
	if (!isProxy) {
		//show the proxy link to access the poxy site
		showProxyLink();
	} else {
		//*** on the proxy site page already
	}
};
//init
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    popup(tabs[0]);
});