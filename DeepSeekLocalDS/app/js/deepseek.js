
        // Глобальные переменные
        var currentView = 'inbox';
        var currentMessageId = null;
        var checkInterval = null;
        var tasksPath = App.dir() + '/data/tasks';
        var uScriptPath = App.dir() + '/data/u.sh';

        // Пустая функция для DevNull
        function DevNull(){}

        // Инициализация приложения
        function init() {
			MW.maximize();
			MW.setIconImage(App.dir() + '/i/icons/32.png');
            // Создаем необходимые каталоги
            if (!FS.isDir(tasksPath)) {
                FS.mkdir(tasksPath);
            }

            // Проверяем доступность сервера Ollama
            checkOllamaServer();

            // Настройка обработчиков событий
            document.getElementById('compose-btn').onclick = showComposeForm;
            document.getElementById('cancel-btn').onclick = hideComposeForm;
            document.getElementById('send-btn').onclick = sendPrompt;
            document.getElementById('inbox-link').onclick = function onClickInbox() {
                showView('inbox');
                window.scrollTo(0, 0);
                return false;
            };
            document.getElementById('sent-link').onclick = function onClickInbox() {
                showView('sent');
                window.scrollTo(0, 0);
                return false;
            };

            // Запускаем периодическую проверку сообщений
            checkInterval = setInterval(checkMessages, 5000);
            
            // Первоначальная загрузка сообщений
            loadMessages();
        }

        // Проверка доступности сервера Ollama
        function checkOllamaServer() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:21434/api/tags', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var statusBar = document.getElementById('status-bar');
                    try {
                        var response = JSON.parse(xhr.responseText);
                        if (response.models) {
                            statusBar.textContent = 'Ollama сервер запущен';
                            statusBar.className = 'status-online';
                        } else {
                            statusBar.textContent = 'Ollama сервер не запущен, пытаемся запустить...';
                            statusBar.className = 'status-starting';
                            startOllamaServer();
                        }
                    } catch (e) {
                        statusBar.textContent = 'Ollama сервер не запущен, пытаемся запустить...';
                        statusBar.className = 'status-starting';
                        startOllamaServer();
                    }
                }
            };
            xhr.onerror = function() {
                var statusBar = document.getElementById('status-bar');
                statusBar.textContent = 'Ollama сервер не запущен, пытаемся запустить...';
                statusBar.className = 'status-starting';
                startOllamaServer();
            };
            xhr.send();
        }

        // Запуск сервера Ollama
        function startOllamaServer() {
            var startScript = App.dir() + '/data/u.sh';
            var cmd = '#!/bin/bash\nexport OLLAMA_HOST=127.0.0.1:21434\nollama serve\n';
            FS.writefile(startScript, cmd);
            
            var procInfo = Env.exec(startScript, DevNull, DevNull, DevNull);
            
            // Проверяем через 5 секунд, запустился ли сервер
            setTimeout(checkOllamaServer, 5000);
        }

        // Отображение нужного представления
        function showView(view) {
            currentView = view;
            
            // Обновляем активную ссылку в сайдбаре
            document.getElementById('inbox-link').className = 'pointer';
            document.getElementById('sent-link').className = 'pointer';
            document.getElementById(view + '-link').className = 'active pointer';
            
            // Показываем нужное представление
            document.getElementById('inbox-view').style.display = 'none';
            document.getElementById('sent-view').style.display = 'none';
            document.getElementById('message-view').style.display = 'none';
            document.getElementById('compose-form').style.display = 'none';
            
            if (view === 'inbox') {
                document.getElementById('inbox-view').style.display = 'block';
                loadInboxMessages();
            } else if (view === 'sent') {
                document.getElementById('sent-view').style.display = 'block';
                loadSentMessages();
            }
        }

        // Показать форму создания нового промпта
        function showComposeForm() {
            document.getElementById('inbox-view').style.display = 'none';
            document.getElementById('sent-view').style.display = 'none';
            document.getElementById('message-view').style.display = 'none';
            document.getElementById('compose-form').style.display = 'block';
            
            // Очищаем форму
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
            document.getElementById('ask-small-first').checked = false;
            document.getElementById('model-select').selectedIndex = 0;
        }

        // Скрыть форму создания нового промпта
        function hideComposeForm() {
            showView(currentView);
        }

        // Отправка промпта
        function sendPrompt() {
            var subject = document.getElementById('subject').value.trim();
            var message = document.getElementById('message').value.trim();
            var askSmallFirst = document.getElementById('ask-small-first').checked;
            var model = document.getElementById('model-select').value;
            
            if (message === '') {
                alert('Пожалуйста, введите сообщение');
                return;
            }
            
            // Формируем полное сообщение (тема + тело)
            var fullMessage = subject + '\n' + message;
            
            if (askSmallFirst) {
                // Сначала отправляем на маленькую модель
                createTask(fullMessage, 'deepseek-r1:1.5b');
            }
            
            // Затем отправляем на выбранную модель
            setTimeout(function createBigTask() {
				createTask(fullMessage, model);
			}, 5 * 1000);
            
            
            // Скрываем форму и показываем входящие
            hideComposeForm();
        }

        // Создание задачи (каталога с файлами)
        function createTask(message, model) {
            // Находим следующий доступный ID
            var files = FS.scandir(tasksPath);
            var maxId = 0;
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file !== '.' && file !== '..') {
                    var id = parseInt(file, 10);
                    if (id > maxId) {
                        maxId = id;
                    }
                }
            }
            
            var newId = maxId + 1;
            var taskDir = tasksPath + '/' + newId;
            
            // Создаем каталог для задачи
            FS.mkdir(taskDir);
            
            // Создаем файлы
            var shellFile = taskDir + '/run.sh';
            var shellFile2 = taskDir + '/run2.sh';
            var inFile = taskDir + '/in.txt';
            var dateFile = taskDir + '/date.txt';
            var outFile = taskDir + '/out.txt';
            var timeFile = taskDir + '/time.txt';
            var pidFile = taskDir + '/processId.txt';
            
            // Копируем u.sh в run.sh и run2.sh
            var uFile = App.dir() + '/data/u.sh';
            var sh = '#!/bin/bash\ncp ' + uFile + ' ' + taskDir + '/run.sh\n';
            sh += 'cp ' + uFile + ' ' + taskDir + '/run2.sh\n';
            FS.writefile(uFile, sh);
            Env.exec(uFile, function onTaskCreate() {
				// Формируем команды
				var cmd = '#!/bin/bash\ncat ' + inFile + ' | ollama run ' + model + ' --verbose --nowordwrap > ' + outFile;
				FS.writefile(shellFile, cmd);
				
				cmd = '#!/bin/bash\ntime ' + shellFile + '  > ' + timeFile + ' 2>&1';
				FS.writefile(shellFile2, cmd);
				
				// Записываем промпт
				FS.writefile(inFile, message);
				
				// Записываем текущую дату
				var now = new Date();
				FS.writefile(dateFile, time());
				
				// Запускаем процесс
				var procInfo = Env.exec(shellFile2, DevNull, DevNull, DevNull);
				FS.writefile(pidFile, procInfo[0]);
				//end
			}, DevNull, DevNull);
            
            
        }

        // Загрузка сообщений
        function loadMessages() {
            if (currentView === 'inbox') {
                loadInboxMessages();
            } else {
                loadSentMessages();
            }
        }

        // Загрузка входящих сообщений
        function loadInboxMessages() {
            var inboxList = document.getElementById('inbox-list');
            var lettersData = [], oLetter, i, z;
            inboxList.innerHTML = '';
            
            if (!FS.isDir(tasksPath)) {
                return;
            }
            
            var taskDirs = FS.scandir(tasksPath);
            taskDirs.reverse();
            
            for (i = 0; i < taskDirs.length; i++) {
                var dir = taskDirs[i];
                if (dir === '.' || dir === '..') continue;
                
                var taskDir = tasksPath + '/' + dir;
                var outFile = taskDir + '/out.txt';
                var inFile = taskDir + '/in.txt';
                var runFile = taskDir + '/run.sh';
                var readFile = taskDir + '/read.txt';
                var dateFile = taskDir + '/date.txt';
                
                var timeComplete = false;
                var realTimeMatch = '';
                if (FS.fileExists(taskDir + '/time.txt')){
					realTimeMatch = getTimeDuration(FS.readfile(taskDir + '/time.txt'));
				}
                if (FS.fileExists(taskDir + '/time.txt') && realTimeMatch != '') {
					timeComplete = true;
				}
                // Проверяем, есть ли ответ
                if ((FS.isDir(taskDir) && zFileHasCloseCodeBlock(outFile)) || timeComplete) {
                    // Получаем тему из первой строки in.txt
                    var inContent = FS.readfile(inFile);
                    var firstLine = inContent.split('\n')[0] || 'Без темы';
                    
                    // Получаем модель из run.sh
                    var modelName = zGetModelNameFromRunFile(runFile);
                    
                    // Проверяем, прочитано ли сообщение
                    var isRead = FS.isDir(taskDir) && FS.readfile(readFile) !== '';
                   
					oLetter = {};
					oLetter.subject = firstLine;
					oLetter.timestamp = zFormatDate(FS.readfile(dateFile));
					oLetter.date = date('d.m.Y H:i:s', oLetter.timestamp);
					oLetter.model = modelName;
					oLetter.dir = dir;
					lettersData.push(oLetter);
                }
            }// end scandir
            lettersData.sort(zTsCmp);
            lettersData.reverse();
            z = sz(lettersData);
            for (i = 0; i < z; i++) {
				// Создаем элемент списка
				var li = document.createElement('li');
				li.className = 'pointer message-item' + (isRead ? '' : ' unread');
				li.onclick = (function onClickInboxItemA(id) {
					return function onClickInboxItem() { showMessage(id, 'inbox'); };
				})(lettersData[i].dir);
				li.innerHTML = '<div>' + lettersData[i].subject + '</div>' +
							   '<div class="message-sender">' + lettersData[i].date + '</div>' + 
							   '<div class="message-sender">' + lettersData[i].model + '</div>';
				
				inboxList.appendChild(li);
			}
            
        }

        // Загрузка отправленных сообщений
        function loadSentMessages() {
            var sentList = document.getElementById('sent-list'),
				letters = [], oLetter, i, z;
            sentList.innerHTML = '';
            
            if (!FS.isDir(tasksPath)) {
                return;
            }
            
            var taskDirs = FS.scandir(tasksPath);
            
            for (i = 0; i < taskDirs.length; i++) {
                var dir = taskDirs[i];
                if (dir === '.' || dir === '..') continue;
                
                var taskDir = tasksPath + '/' + dir;
                var inFile = taskDir + '/in.txt';
                var dateFile = taskDir + '/date.txt';
                var runFile = taskDir + '/run.sh';
                
                if (FS.isDir(taskDir)) {
                    // Получаем тему из первой строки in.txt
                    var inContent = FS.readfile(inFile);
                    var firstLine = inContent.split('\n')[0] || 'Без темы';
                    
                    oLetter = {};
                    oLetter.subject = firstLine;
                    oLetter.timestamp = zFormatDate(FS.readfile(dateFile));
                    oLetter.date = date('d.m.Y H:i:s', oLetter.timestamp);
                    oLetter.model = zGetModelNameFromRunFile(runFile);
                    oLetter.dir = dir;
                    letters.push(oLetter);
                }
            } // end scandir
            letters.sort(zTsCmp);
            letters.reverse();
            z = sz(letters);
            for (i = 0; i < z; i++) {
				// Создаем элемент списка
				var li = document.createElement('li');
				li.className = 'pointer message-item';
				li.onclick = (function(id) {
					return function onClickSentMsgItem() { showMessage(id, 'sent'); };
				})(letters[i].dir);
				
				li.innerHTML = '<div>' + letters[i].subject + '</div>' 
							 + '<div class="message-sender">' + letters[i].date + '</div>'
							 + '<div class="message-sender">' + letters[i].model + '</div>';
				
				sentList.appendChild(li);
			}
        }

        // Показать содержимое сообщения
        function showMessage(id, type) {
            var taskDir = tasksPath + '/' + id;
            var messageView = document.getElementById('message-view');
            
            // Помечаем как прочитанное (для входящих)
            if (type === 'inbox') {
                var readFile = taskDir + '/read.txt';
                if (!FS.readfile(readFile)) {
                    FS.writefile(readFile, 'read');
                }
            }
            
            // Загружаем содержимое сообщения
            var inFile = taskDir + '/in.txt';
            var inContent = FS.readfile(inFile);
            var firstLine = inContent.split('\n')[0] || 'Без темы';
            var body = inContent.split('\n').slice(1).join('\n');
            
            var html = '<div class="message-subject stdhead">' + escapeHtml(firstLine) + 
						'<input type="button" class="btnNorm ml-3" value="Удалить" onclick="onClickRemoveMessage(\'' + taskDir + '\')"/>' + 
					   '</div>' +
					   '<div class="stdheadph">&nbsp;</div>' + 
					   //'<div><input type="button" value="Удалить" onclick="onClickRemoveMessage(\'' + taskDir + '\')"/></div>' + 
                       '<div class="message-body">' + escapeHtml(body) + '</div>';
            
            if (type === 'inbox') {
                var outFile = taskDir + '/out.txt';
                var outContent = FS.readfile(outFile);
                var timeFile = taskDir + '/time.txt';
                var timeContent = FS.readfile(timeFile);
                var runFile = taskDir + '/run.sh';
                var runContent = FS.readfile(runFile);
                var modelMatch = runContent.match(/ollama run (deepseek-r1:\w+)/);
                var model = modelMatch ? modelMatch[1] : 'Неизвестная модель';
                var modelName = getModelName(model);
                
                // Извлекаем think и остальной ответ
                var thinkStart = outContent.indexOf('<think>');
                var thinkEnd = outContent.indexOf('</think>');
                var thinkContent = '';
                var responseContent = outContent;
                
                if (thinkStart !== -1 && thinkEnd !== -1) {
                    thinkContent = outContent.substring(thinkStart + 7, thinkEnd);
                    responseContent = outContent.substring(0, thinkStart) + outContent.substring(thinkEnd + 8);
                }
                
                if (thinkContent) {
                    html += '<div class="think-toggle" onclick="toggleThink(this)">Показать размышления модели</div>' +
                            '<div class="think-content">' + escapeHtml(thinkContent) + '</div>';
                }
                
                html += '<div class="message-body">' + escapeHtml(responseContent) + '</div>';
                var realTimeMatch = '';
                if (timeContent) {
					// Извлекаем время выполнения из time.txt
                    realTimeMatch = getTimeDuration(timeContent);
				}
                
                if (realTimeMatch) {
                    //timeContent.match(/eval duration\s+(\d+m\d+\.\d+s)/);
                    var userTimeMatch = timeContent.match(/user\s+(\d+m\d+\.\d+s)/);
                    var sysTimeMatch = timeContent.match(/sys\s+(\d+m\d+\.\d+s)/);
                    
                    var timeHtml = '<div class="response-time">Модель: ' + modelName + '</div>';
                    
                    if (realTimeMatch) {
                        timeHtml += '<div class="response-time">Общее время: ' + realTimeMatch + '</div>';
                    }
                    if (userTimeMatch) {
                        timeHtml += '<div class="response-time">Пользовательское время: ' + userTimeMatch[1] + '</div>';
                    }
                    if (sysTimeMatch) {
                        timeHtml += '<div class="response-time">Системное время: ' + sysTimeMatch[1] + '</div>';
                    }
                    
                    html += timeHtml;
                    
                    
                } else {
                    html += '<div class="processing-info">Ответ ещё не полный, обработка продолжается...</div>';
                }
            }
            
            messageView.innerHTML = html;
            
            // Показываем view сообщения
            document.getElementById('inbox-view').style.display = 'none';
            document.getElementById('sent-view').style.display = 'none';
            document.getElementById('compose-form').style.display = 'none';
            document.getElementById('message-view').style.display = 'block';
            
            // Обновляем список сообщений, чтобы снять жирный шрифт с прочитанного
            loadMessages();
            
            window.scrollTo(0, e('message-view').offsetHeight + 1000);
        }
        
        function getTimeDuration(timeContent){
			var realTimeMatch = '';
			var aTime = timeContent.split('\n');
			var ii;
			var ia;
			for (ii = 0; ii < aTime.length; ii++){
				if (aTime[ii].indexOf('total duration') != -1) {
					ia = aTime[ii].split('total duration:');
					realTimeMatch = String(ia[1]).trim();
					break;
				}
			}
			return realTimeMatch;
		}

        // Периодическая проверка новых сообщений
        function checkMessages() {
            loadMessages();
        }

        // Вспомогательная функция для экранирования HTML
        function escapeHtml(text) {
            return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // Вспомогательная функция для получения имени модели
        function getModelName(model) {
            switch(model) {
                case 'deepseek-r1:1.5b': return 'Модель 1Гб';
                case 'deepseek-r1:1': return 'Модель 1Гб';
                case 'deepseek-r1:8b': return 'Модель 5Гб';
                case 'deepseek-r1:32b': return 'Модель 20Гб';
                default: return model;
            }
        }

        // Переключение видимости think-блока
        function toggleThink(element) {
            var thinkContent = element.nextElementSibling;
            if (thinkContent.style.display === 'block') {
                thinkContent.style.display = 'none';
                element.textContent = 'Показать размышления модели';
            } else {
                thinkContent.style.display = 'block';
                element.textContent = 'Скрыть размышления модели';
            }
        }
        
        function zFormatDate(ds) {
			var dt;
			if (String(intval(ds)) === String(ds)) {
				return intval(ds);
			}
			dt = new Date(ds);
			return Math.floor(dt.getTime() / 1000);
		}
		
		function zTsCmp(x, y){
			if (x.timestamp < y.timestamp) {
				return -1;
			}
			return 1;
		}
		
		function zGetModelNameFromRunFile(runFile){
			var runContent = FS.readfile(runFile);
			var modelMatch = runContent.match(/ollama run (deepseek-r1:\w+)/);
			var model = modelMatch ? modelMatch[1] : 'Неизвестная модель';
			return getModelName(model);
		}
		
		function zFileHasCloseCodeBlock(outFile) {
			var c = FS.readfile(outFile).split('\n'), i, z;
			z = sz(c);
			for (i = 0; i < z; i++) {
				if (c[i] == '```') {
					return true;
				}
			}
			
		}
		
		function onClickRemoveMessage(path){
			var sh = '#!/bin/bash\nrm -rf ' + path + '\n',
				f = App.dir() + '/data/u.sh';
			FS.writefile(f, sh);
			Env.exec(f, DevNull, DevNull, DevNull);
			showView('inbox');
		}

        // Запуск приложения после загрузки страницы
        window.onload = init;
