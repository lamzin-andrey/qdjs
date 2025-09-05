window.Rest = {
	/**
	 * @property {String} csrf token, set it from app
	*/
	_token : '',
	
	/**
	 * @property {String} csrf token name, set it from app
	*/
	_token_name : '_token',
	/**
	 * @property {Number} For multiupload uploading input.files[_fileIndex]
	*/
	_fileIndex: 0,
	
	/**
	 * @property {String} _lang
	*/
	_lang : '',
	root : '',
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _post:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data[this._token_name] = t;
            this._restreq('post', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _put:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('put', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax patch request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _patch:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('patch', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax delte request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _delete:function(data, onSuccess, url, onFail) {
        var t = this._getToken();
        if (t) {
            data._token = t;
            this._restreq('delete', data, onSuccess, url, onFail)
        }
	},
	/**
     * @description ajax get request (FormData)
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _get:function(onSuccess, url, onFail) {
        this._restreq('get', {}, onSuccess, url, onFail)
	},
	/**
     * @description get asrf token
	 * @return String
     */
    _getToken:function() {
        return this[this._token_name];
	},
	/**
     * @description ajax request (FormData).
	 * @param {String} method 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     */
    _restreq:function(method, data, onSuccess, url, onFail) {
		var sendData = data;
        if (!url) {
            url = window.location.href;
        } else {
            url = this.root + url;
        }
        if (!onFail && window.defaultFail) {
            onFail = defaultFail;
        }
        /*switch (method) {
            case 'put':
            case 'patch':
            case 'delete':
                break;
		}*/
		if (this._lang && !sendData.lang) {
			sendData.lang = this._lang;
		}
        /*$.ajax({
            method: method,
            data:sendData,
            url:url,
            dataType:'json',
            success:onSuccess,
            error:onFail
        });*/
        this.pureAjax(url, data, onSuccess, onFail, method);
	},
	/**
     * @desc Аякс запрос к серверу, использует JSON
    */
    pureAjax:function(url, data, onSuccess, onFail, method) {
        var xhr = new XMLHttpRequest();
        //подготовить данные для отправки
        var arr = []
        for (var i in data) {
            arr.push(i + '=' + encodeURIComponent(data[i]));
        }
        var sData = arr.join('&');
        //установить метод  и адрес
        //console.log("'" + url + "'");
        xhr.open(method, url);
        //console.log('Open...');
        //установить заголовок
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // xhr.setRequestHeader('Content-Type', 'application/json');
        //обработать ответ
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var error = {};
                if (xhr.status == 200) {
                    try {
                        var response = JSON.parse(String(xhr.responseText));
                        onSuccess(response, xhr);
                        return;
                    } catch(err) {
                        error.state = 1;
                        error.info = 'Fail parse JSON';
                    }
                }else {
                    error.state = 1;
                }
                if (error.state) {
                    onFail(xhr.status, xhr.responseText, error.info, xhr);
                }
            } else if (xhr.readyState > 3) {
                onFail(xhr.status, xhr.responseText, 'No ok', xhr, xhr.readyState);
            }
        }
        //отправить
        //console.log('bef send');
        xhr.send(sData, true);
        //console.log('aft send');
    },
	/**
     * @description Отправка файла методом POST
     * @param {FileInput} iFile
     * @param {String} url
     * @param {Object} data Дополнительные поля
     * @param {Function} onSuccess
     * @param {Function} onFail
     * @param {Function} onProgress
     * @param {String} tokenName Кастомное имя для токена
     * @param {String} token     Кастомное значение для токена, если почему-то не устраивает this._getToken
     * @param {Number} timeout   = 60 Сколько секунд ждать завершения аплоада (для старых браузеров)
    */
    _postSendFile: function(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout) {
		
		var xhr = new XMLHttpRequest(), form, t, i;
		
		try {
			form = new FormData();
		} catch(e) {
			this._postSendFileAndroid2(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout);
			return;
		}
        
        tokenName = tokenName ? tokenName : '_token';
        
        form.append(iFile.id, iFile.files[this._fileIndex]);
        form.append("path", url);
        form.append("mt", iFile.files[this._fileIndex].lastModified);
        for (i in data) {
            form.append(i, data[i]);
        }
        t = this._getToken();

        if (token) {
            t = token;
        }
        
        if (t) {
            form.append(tokenName, t);
        }
        xhr.upload.addEventListener("progress", function(pEvt){
            var loadedPercents;
            if (pEvt && pEvt.lengthComputable) {
                loadedPercents = Math.round((pEvt.loaded * 100) / pEvt.total);
            }
            onProgress(loadedPercents, pEvt.loaded, pEvt.total);
        });
        xhr.upload.addEventListener("error", onFail);
        xhr.onreadystatechange = function () {
            t = this;
            if (t.readyState == 4) {
                if(this.status == 200) {
                    var s;
                    try {
                        s = JSON.parse(t.responseText);
                    } catch(e)  {
                        //;
                    }
                    onSuccess(s);
                } else {
                    onFail(t.status, arguments);
                }
            }
        };
        xhr.open("POST", url);
        xhr.send(form, true);
    },
    
    /**
     * @description Отправка файла методом POST (для старых браузеров).
     *  Инпут обязательно должен быть завернут в тег form
     * @param {FileInput} iFile
     * @param {String} url
     * @param {Object} data Дополнительные поля
     * @param {Function} onSuccess
     * @param {Function} onFail
     * @param {Function} onProgress
     * @param {String} tokenName Кастомное имя для токена
     * @param {String} token     Кастомное значение для токена, если почему-то не устраивает this._getToken
     * @param {Number} timeout   = 60 Сколько секунд ждать завершения аплоада (для старых браузеров)
    */
    _postSendFileAndroid2: function(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout) {
		timeout = def(timeout, 60);
        var t, i, iFrameName = iFile.id + 'A2UpIframe',
			form = iFile.parentNode,
			ls, name, existsFields = {},
			iFrame,
			iFrameHtml, ival, response;
        
        while (form.tagName != 'FORM') {
			form = form.parentNode;
		}
		
		attr(form, 'method', 'POST');
		attr(form, 'enctype', 'multipart/form-data');
		attr(form, 'target', iFrameName);
		attr(form, 'action', url);
		ls = ee(form, 'input');
		for (i = 0; i < ls.length; i++) {
			name = attr(ls[i], 'id');
			if (data[name]) {
				attr(ls[i], 'value', data[name])
				existsFields[name] = 1;
			} else {
				name = attr(ls[i], 'name');
				if (data[name]) {
					attr(ls[i], 'value', data[name])
					existsFields[name] = 1;
				}
			}
		}
        
        tokenName = tokenName ? tokenName : '_token';
        
        if (!e('path')) {
			ce(form, 'input', 'path', {value: url, type:'hidden', name: 'path'});
		} else {
			e('path').value = url;
		}
		if (!e('isiframe')) {
			ce(form, 'input', 'isiframe', {value: 1, type:'hidden', name: 'isiframe'});
		} else {
			e('isiframe').value = 1;
		}
		
		// form.append("mt", iFile.files[this._fileIndex].lastModified);
		if (!e('mt')) {
			ce(form, 'input', 'mt', {value: intval(iFile.files[this._fileIndex].lastModified), type:'hidden', name: 'mt'});
		} else {
			e('mt').value = intval(iFile.files[this._fileIndex].lastModified);
		}
        for (i in data) {
            // form.append(i, data[i]); 
            if (!e(i)) {
				ce(form, 'input', i, {value: data[i], type:'hidden', name: i});
			} else {
				e(i).value = data[i];
			}
        }
        t = this._getToken();

        if (token) {
            t = token;
        }
        
        if (t) {
			if (!e(tokenName)) {
				ce(form, 'input', tokenName, {value: t, type:'hidden', name: tokenName});
			} else {
				e(tokenName).value = t;
			}
        }
        
        
        // xhr.open("POST", url);
        // xhr.send(form);
        iFrame = e(iFrameName);
        
        /*if (iFrame) {
			rm(iFrame);
			iFrame = null;
		}*/
		if (!iFrame) {
			iFrame = ce(bod(), 'iframe', iFrameName, {
				name: iFrameName,
				src: '/0.html?r=' + Math.random(),
				style: 'display:none'
			}); 
		}
		
		window.up = 0;
        
        if (iFrame) {
			iFrame.onload = function() {
				if (window.up == 0) {
					window.up++;
					form.submit();
					localStorage.removeItem('iframeUpload');
					i = 0;
					ival = setInterval(function() {
						response = localStorage.getItem('iframeUpload');
						var r = response;
						if (r) {
							try {
								response = JSON.parse(response);
								if (response) {
									clearInterval(ival);
									onSuccess(response);
								}
								
							} catch(e) {
								clearInterval(ival);
								showError(e);
								showError(r);
								onFail(e);
							}
						}
						
						if (i > timeout) {
							clearInterval(ival);
							onFail({status: 'error', errors: {p: l('Превышен интервал ожидания запроса')}});
						}
						
						i++;
					}, 1000);
					
				}
			}
			attr(iFrame, 'src', '/0.html?r=' + Math.random());
			iFrame.onerror = function(err) {
				clearInterval(ival);
				onFail(err);
			}
		}
		
		
		
		
    }
};
