window.Rest2 = {
	/**
	 * @description Set _token and _tiken_name in Rest
	*/
	_setToken:function(sT, sN){
		Rest._token = sT;
		Rest._token_name = sN;
	},
	/**
	 * @description Set Rest._fileIndex
	 * @property {Number} nFor multiupload uploading input.files[_fileIndex]
	*/
	_setFileIndex:function(n){
		Rest._fileIndex = n;
	},
	/**
	 * @description Set Rest._fileIndex
	 * @property {String} sLng
	*/
	_setLang:function(sLng){
		Rest._lang = sLng;
	},
	/**
	 * @description Set Rest.root
	 * @property {String} sRoot
	*/
	_setRoot:function(sRoot){
		Rest.root = sRoot;
	},
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     * @param {Object} context 
     */
    _post:function(data, onSuccess, url, onFail, ctx) {
        var t = Rest._getToken();
        /*if (typeof(data) == 'string') {
			data = this.grab(data);
		}*/
        if (t) {
            data[Rest._token_name] = t;
            Rest._restreq('post', data,
				function(data){
					onSuccess.call(ctx, data);
				},
			url,
				function(status, responseText, info, xhr, readyState){
					onFail.call(ctx, status, responseText, info, xhr, readyState);
				}
			); // Rest_post END
        }
	},
	onFailCallback:function(status, responseText, info, xhr, readyState){},
	/**
     * @description ajax post request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     * @param {Object} context 
     */
    _put:function(data, onSuccess, url, onFail, ctx) {
        var t = Rest._getToken();
        if (t) {
            data._token = t;
            Rest._restreq(
				'put',
				data,
					function(data) {
						onSuccess.call(ctx, data);
					},
				url,
					function(status, responseText, info, xhr, readyState){
						onFail.call(ctx, status, responseText, info, xhr, readyState);
					}
            );// end _restreq;
        }
	},
	/**
     * @description ajax patch request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     * @param {Object} context
     */
    _patch:function(data, onSuccess, url, onFail, ctx) {
        var t = Rest._getToken();
        if (t) {
            data._token = t;
            Rest._restreq(
				'patch',
				data,
					function(data){
						onSuccess.call(ctx, data);
					},
				url,
					function(status, responseText, info, xhr, readyState){
						onFail.call(ctx, status, responseText, info, xhr, readyState);
					}
			);	// end _restreq
        }
	},
	/**
     * @description ajax delte request (FormData)
     * @param {Object} data 
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     * @param {Object} ctx
     */
    _delete:function(data, onSuccess, url, onFail, ctx) {
        var t = Rest._getToken();
        if (t) {
            data._token = t;
            Rest._restreq(
				'delete',
				data,
					function(data){
						onSuccess.call(ctx, data);
					},
				url,
					function(status, responseText, info, xhr, readyState){
						onFail.call(ctx, status, responseText, info, xhr, readyState);
					}
			);
        }
	},
	/**
     * @description ajax get request (FormData)
     * @param {Function} onSuccess
     * @param {String} url 
     * @param {Function} onFail 
     * @param {Object} context
     */
    _get:function(onSuccess, url, onFail, ctx) {
        Rest._restreq(
			'get',
			{},
				function(data){
					onSuccess.call(ctx, data);
				},
			url,
				function(status, responseText, info, xhr, readyState){
					onFail.call(ctx, status, responseText, info, xhr, readyState);
				}
		);
	},
	/**
     * @description get asrf token
	 * @return String
     */
    _getToken:function() {
        return Rest._getToken();
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
     * @param {Object} context
    */
    _postSendFile: function(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout, ctx) {
		
		var xhr = new XMLHttpRequest(), form, t, i;
		
		try {
			form = new FormData();
		} catch(e) {
			this._postSendFileAndroid2(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout, ctx);
			return;
		}
        
        tokenName = tokenName ? tokenName : '_token';
        
        form.append(iFile.id, iFile.files[Rest._fileIndex]);
        form.append("path", url);
        form.append("mt", iFile.files[Rest._fileIndex].lastModified);
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
            ctx.call(onProgress, loadedPercents, pEvt.loaded, pEvt.total);
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
                    ctx.call(onSuccess, s);
                } else {
                    ctx.call(onFail, t.status, arguments);
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
     * @param {Object} context
    */
    _postSendFileAndroid2: function(iFile, url, data, onSuccess, onFail, onProgress, tokenName, token, timeout, ctx) {
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
			ce(form, 'input', 'mt', {value: intval(iFile.files[Rest._fileIndex].lastModified), type:'hidden', name: 'mt'});
		} else {
			e('mt').value = intval(iFile.files[Rest._fileIndex].lastModified);
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
			iFrame.onload = function zOnLoadIframeA2Upload() {
				if (window.up == 0) {
					window.up++;
					form.submit();
					localStorage.removeItem('iframeUpload');
					i = 0;
					ival = setInterval(function zA2UploadInt() {
						response = localStorage.getItem('iframeUpload');
						var r = response;
						if (r) {
							try {
								response = JSON.parse(response);
								if (response) {
									clearInterval(ival);
									ctx.call(onSuccess, response);
								}
								
							} catch(e) {
								clearInterval(ival);
								showError(e);
								showError(r);
								ctx.call(onFail, e);
							}
						}
						
						if (i > timeout) {
							clearInterval(ival);
							ctx.call(onFail, {status: 'error', errors: {p: l('Превышен интервал ожидания запроса')}});
						}
						
						i++;
					}, 1000);
					
				}
			}
			attr(iFrame, 'src', '/0.html?r=' + Math.random());
			iFrame.onerror = function(err) {
				clearInterval(ival);
				ctx.call(onFail, err);
			}
		}
    }
    
};
