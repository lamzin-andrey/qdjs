# Контекст проекта: Приложение для поиска файлов (клон Gnome-Search-Tool)

## Архитектура
- **Frontend**: HTML + CSS + JavaScript ES5! (статический клиент)
- **Backend API**: Самописное API (не веб-сервер, а локальный/встроенный API)
- **Тип приложения**: Десктоп-подобное приложение, использующее локальные вызовы API

## API Reference

### О программе

Qt5 WebView DESKTOP API позволяет создавать в Linux Xubuntu и Windows десктоп-приложения, используя JavaScript, HTML и CSS.

Вам не придётся разбираться с Node.js и npm — установить это API так же просто, как браузер, и вы тут же получите все возможности Qt5 WebView.

Это прежде всего Qt5 WebView (в Windows Qt4.6.3 WebView), то есть по сути веб-браузер, лишенный адресной строки и работающий с файлами на диске пользователя.

Помимо этого, программа предоставляет JavaScript API, позволяющее:
- Запускать программы операционных систем Linux Xubuntu и Windows
- Взаимодействовать с файловой системой
- Использовать системные диалоги
- Запускать другие программы

Исходный код доступен [на github](https://github.com/lamzin-andrey/gjs/)


### Возможности HTML

#### meta[name=windowButtons]

Используйте мета-тег с атрибутом name="windowButtons" для управления кнопками окна приложения. Атрибут content содержит строковое представление битовой маски.

**Пример:**
```html
<meta name="windowButtons" content="1110">
```

**Значение битов (справа налево):**

| Номер бита | 0 | 1 |
|------------|---|---|
| 0 | Не показывать кнопку контекстной справки | Показывать кнопку контекстной справки |
| 1 | Не показывать кнопку закрытия окна | Показывать кнопку закрытия окна |
| 2 | Не показывать кнопку максимизации окна | Показывать кнопку максимизации окна |
| 3 | Не показывать кнопку минимизации окна | Показывать кнопку минимизации окна |

Значение по умолчанию: `1110`

#### Стиль окна приложения

Атрибуты также задаются в мета-теге windowButtons:

| Атрибут | Значение |
|---------|----------|
| onlyTop | Показывать окно на переднем плане |
| noFrame | Показывать окно без рамки |
| fullScreen | Показывать окно без рамки и развернутым на весь экран |
| width | Ширина окна приложения (например, width="800") |
| height | Высота окна приложения (например, height="600") |
| fixed | Если заданы width или height, окно становится неизменяемого размера |

**Пример окна 800×600, фиксированного размера:**
```html
<meta name="windowButtons" content="1110" width="800" height="600" fixed>
```

### Главное меню окна программы

Чтобы добавить главное меню, добавьте внутри тега `<head>` код menubar:

```html
<html lang="ru">
<head>
    <!-- здесь теги title, meta[windowButtons]... и другие -->
    <menubar style="display:none">
        <menu title="Action">
            <item onselect="onClickExitMenu()">Quit Ctrl+Q</item>
        </menu>
        <menu title="Language">
            <item onselect="onClickSelectEn()">English</item>
            <item onselect="onClickSelectRu()">Russian</item>
        </menu>
    </menubar>
</head>
<body>
    <!-- тело документа -->
</body>
</html>
```

Обработчики нажатий:

```javascript
function onClickExitMenu() {
    Qt.quit(); // Закрыть окно
}

function onClickSelectEn() {
    // Смена языка интерфейса
}

function onClickSelectRu() {
    // Смена языка интерфейса
}

// Поддержка хоткея
window.onkeyup = onKeyUp;

function onKeyUp(evt) {
    if (evt.ctrlKey) {
        switch(evt.keyCode) {
            case 81: // "Q"
                onClickExitMenu();
                break;
        }
    }
}
```

### Desktop API

#### Управление окном (MW - MainWindow)

##### MW.resizeTo
`MW.resizeTo(Number width, Number height)` или `Qt.resizeTo(width, height)`

Изменяет размер окна приложения. Координаты левого верхнего угла не изменяются.

##### MW.maximize
`MW.maximize()`

Разворачивает окно приложения на весь экран.

##### MW.minimize
`MW.minimize()`

Сворачивает окно приложения на панель задач.

**Примечание для Xubuntu 18.04:** для устойчивой работы рекомендуется:
```javascript
function onClickButtonMinimizeWindow(){
    MW.showNormal();
    MW.minimize();
    setTimeout(function() {
        MW.showNormal();
        MW.minimize();
    }, 100);
}
```

##### MW.showFullScreen
`MW.showFullScreen()` или `Qt.showFullScreen()`

Скрывает рамку окна и разворачивает окно на передний план.

##### MW.showNormal
`MW.showNormal()` или `Qt.showNormal()`

Показывает рамку окна, если оно было скрыто функцией `showFullScreen()`.

##### MW.hideMainMenu
`MW.hideMainMenu()` или `Qt.hideMainMenu()`

Скрывает главное меню окна приложения.

##### MW.showMainMenu
`MW.showMainMenu()` или `Qt.showMainMenu()`

Показывает главное меню окна приложения (если оно задано тегом menubar).

##### MW.moveTo
`MW.moveTo(Number x, Number y)` или `Qt.moveTo(x, y)`

Перемещает окно приложения. Аргументы — координаты левого верхнего угла.

**Пример размещения по центру экрана:**
```javascript
function onClickButtonPosWindowOnScreenCenter(){
    var w = 800, h = 600;
    MW.moveTo((screen.width - w) / 2, (screen.height - h) / 2);
    MW.resizeTo(w, h);
}
```

##### MW.setIconImage
`MW.setIconImage(String pathToPng32x32)` или `Qt.setWindowIconImage(pathToPng32x32)`

Устанавливает иконку в окне приложения рядом с заголовком. Аргумент — путь к PNG-файлу размером 32×32 или 24×24 пикселя.

##### MW.setTitle
`Qt.setTitle(String title)`

Изменяет заголовок окна.

##### MW.renameMenuItem
`MW.renameMenuItem(Number x, Number y, String text)`

Изменяет текст пункта главного меню программы.

**Пример:**
```javascript
function e(id) {
    return document.getElementById(id);
}

var ChangeContextMenuTextExample = {
    onkeydown: function(){
        var trg = e('inpKD4');
        setTimeout(function() {
            MW.renameMenuItem(2, 0, trg.value);
            // 2 — позиция пункта меню по горизонтали (начиная с 0)
            // 0 — позиция пункта меню по вертикали (начиная с 0)
        }, 10);
    }
}
```

##### MW.close
`MW.close()` или `App.quit()`, `Qt.quit()`

Закрывает окно приложения и завершает его работу.

#### Взаимодействие с окружением (Env)

##### Env.exec
`Array Env.exec(String command, Function|Array|Object onFinish, Function|Array|Object onStdOut, Function|Array|Object onStdErr)`

Запускает другое приложение, shell- или batch-файл.

**Примечания:**
- В Windows чтение stdin и stdout не поддерживается
- Для завершения процесса используйте `kill` в Linux или `taskkill` в Windows

**Аргументы:**
- `command` — команда для запуска (например, "xterm", "notepad")
- `onFinish` — функция, вызываемая при завершении: `onFinish(String stdout, String stderr)`
- `onStdOut` — функция, вызываемая при выводе в stdout
- `onStdErr` — функция, вызываемая при выводе в stderr

**Возвращаемое значение:** массив `[pid, innerProcId]`, где:
- `pid` — идентификатор процесса в ОС
- `innerProcId` — внутренний идентификатор процесса

**Форматы callback-аргументов:**
- `Function` — имя функции, доступной в глобальной области
- `Object` — `{context: Object, m: Function}`
- `Array` — `[Object, Function]`

**Пример:**
```javascript
function e(id) {
    return document.getElementById(id);
}

var RunProgrammExample = {
    runXTerm: function(){
        var o = this,
            cmd = 'xterm';
        if (!PHP.file_exists('/usr')) {
            cmd = 'notepad';
        }
        this.xtId = Env.exec(cmd, [o, o.onFinishXT], [o, o.onStdOutXT], [o, o.onStdErrXT]);
    },
    
    closeXTerm: function(){
        var o = this, 
            cmd = 'kill ' + this.xtId[0];
        
        if (!PHP.file_exists('/usr')) {
            cmd = 'TASKKILL /PID ' + this.xtId[0] + ' /T';
        }
        
        this.xtId = Env.exec(cmd, [o, o.onFinishXT], [o, o.onStdOutXT], [o, o.onStdErrXT]);
    },
    
    onFinishXT: function(stdout, stderr) {
        e('xtStdOut').innerHTML += '<div>' + stdout + '</div>';
        e('xtStdErr').innerHTML += '<div>' + stderr + '</div>';
    }
}

function onClickRunXTerm() {
    RunProgrammExample.runXTerm();
}
function onClickStopXTerm() {
    RunProgrammExample.stopXTerm();
}
```

##### Env.isRun
`Env.isRun(Number innerProcId)`

Проверяет, завершён ли уже запущенный процесс. `innerProcId` — значение элемента массива с индексом 1, возвращаемого `Env.exec`.

##### App.dir
`String App.dir()` или `Qt.appDir()`

Возвращает путь к каталогу, в котором находится исполняемый файл приложения.

##### App.getArgs
`Array App.getArgs()` или `Qt.getArgs()`

Возвращает аргументы командной строки, переданные приложению при запуске.

##### MW.getLastKeyChar
`String MW.getLastKeyChar()` или `Qt.getLastKeyChar()`

Возвращает символ последней нажатой клавиши (если она алфавитно-цифровая).

##### MW.getLastKeyCode
`Number MW.getLastKeyCode()` или `Qt.getLastKeyCode()`

Возвращает код последней нажатой клавиши.

##### Env.openFileDialog
`String Env.openFileDialog(String caption, String dir, String filter)` или `Qt.openFileDialog(caption, dir, filter)`

Открывает системный диалог выбора файла для чтения.

**Параметры:**
- `caption` — заголовок диалога
- `dir` — начальный каталог
- `filter` — расширения файлов, например `"*.txt *.js"`

**Возвращает:** путь к выбранному файлу или пустую строку.

##### Env.openFilesDialog
`Array Env.openFilesDialog(String caption, String dir, String filter)` или `Qt.openFilesDialog(caption, dir, filter)`

Открывает системный диалог выбора нескольких файлов для чтения.

**Возвращает:** массив путей к выбранным файлам.

##### Env.saveFileDialog
`String Env.saveFileDialog(String caption, String dir, String filter)` или `Qt.saveFileDialog(caption, dir, filter)`

Открывает системный диалог выбора файла для сохранения.

##### Env.openDirectoryDialog
`String Env.openDirectoryDialog(String caption, String dir)` или `Qt.openDirectoryDialog(caption, dir)`

Открывает системный диалог выбора каталога.

##### App.newWindow
`App.newWindow(String path, Array args)` или `Qt.newWindow(path, args)`

Открывает другое QDJS-приложение в новом окне.

##### Env.getTempDir
`String Env.getTempDir()` или `OS.getTempDir()`, `OS.getTempFolderPath()`

Возвращает путь к временной папке.

##### Env.getHomeDir
`String Env.getHomeDir()` или `OS.getHomeDir()`, `OS.getHomeFolderPath()`

Возвращает путь к домашней папке пользователя.

#### Файлы (FS)

##### FS.readfile
`String FS.readfile(String path)` или `PHP.file_get_contents(path)`

Возвращает содержимое текстового файла.

##### FS.writefile
`Number FS.writefile(String path, String data, Number flags)` или `PHP.file_put_contents(path, data, flags)`

Записывает строку data в текстовый файл. Возвращает число записанных байт.

**Флаги:** `FILE_APPEND = 1`

**Пример:**
```javascript
function e(id) {
    return document.getElementById(id);
}

var ReadAndWriteExample = {
    onClickLoadFile: function(){
        this.currentTextFile = Qt.openFileDialog('Выберите текстовый файл', '', '*.txt *.js');
        e('inpKD5').value = PHP.file_get_contents(this.currentTextFile);
    },

    onClickSaveFile: function(){
        if (!this.currentTextFile) {
            alert('Надо сначала выбрать текстовый файл');
            return;
        }
        var nB = PHP.file_put_contents(this.currentTextFile, e('inpKD5').value);
        alert('Записано байт: ' + nB);
    }
}
```

##### FS.fileExists
`Boolean FS.fileExists(String path)` или `PHP.file_exists(path)`

Возвращает `true`, если файл существует.

##### FS.unlink
`Boolean FS.unlink(String path)` или `PHP.unlink(path)`

Возвращает `true`, если удалось удалить файл.

##### FS.isDir
`Boolean FS.isDir(String path)` или `PHP.is_dir(path)`

Возвращает `true`, если путь указывает на каталог.

##### FS.partDir
`Array FS.partDir(String path, Number partSize, Boolean fromFirst = false)`

Чтение больших каталогов частями. При каждом вызове считывает `partSize` наименований файлов.

**Возвращаемый массив:** строки вида `size/mtime/owner/grp/TEname/path`

- `size` — размер в байтах (hex)
- `mtime` — время изменения (секунды с 01.01.1970, hex)
- `owner` — владелец
- `grp` — группа
- `TEname` — тип и имя:
  - T = 0 (каталог), 1 (файл), 2 (ссылка на каталог), 3 (ссылка на файл)
  - E = 0 (не исполняемый), 1 (исполняемый)
- `path` — полный путь

##### FS.partDirItem
`Object|String FS.partDirItem(String encodedFileInfo)`

Преобразует строку из `FS.partDir` в объект.

**Возвращаемый объект:**
- `size` — размер в байтах (десятичный)
- `mtime` — время изменения (секунды с 01.01.1970, десятичный)
- `owner` — владелец
- `group` — группа
- `type` — тип файла
- `isDir` — `true` для каталога
- `isSymlink` — `true` для символьной ссылки
- `isExec` — 1 для исполняемых файлов
- `name` — короткое имя файла
- `path` — полный путь
- `src` — исходная строка

**Пример:**
```javascript
var ReadNFilesFromDirExample = {
    onclick: function(){
        var ls = FS.partDir('C:/WINDOWS/system32', 10, true), i, fileItem;
        for (i = 0; i < ls.length; i++) {
            fileItem = FS.partDirItem(ls[i]);
            if (fileItem == "EOF") {
                break; // все файлы прочитаны
            }
            alert(fileItem.size);
            alert(fileItem.mtime);
            alert(fileItem.owner);
            alert(fileItem.group);
            alert(fileItem.type);
            alert(fileItem.isDir);
            alert(fileItem.isSymlink);
            alert(fileItem.isExec);
            alert(fileItem.name);
            alert(fileItem.path);
            alert(fileItem.src);
        }
        ls = FS.partDir('C:/WINDOWS/system32', 10); // следующие 10 файлов
    }
}
```

##### FS.scandir
`Array FS.scandir(String path)` или `PHP.scandir(path)`

Возвращает список файлов в каталоге.

**Пример:**
```javascript
function e(id) {
    return document.getElementById(id);
}

var ReadDirectoryContentExample = {
    scandir: function(){
        var s = Qt.openDirectoryDialog('Выберите каталог', '', '');
        var ls = FS.scandir(s), i, icon = 'exec.png', width = 24, file;
        
        ls.sort();
        e('xtStdOut5Content').innerHTML = '';
        
        for (i = 0; i < ls.length; i++) {
            icon = 'exec.png';
            if (FS.isDir(s + '/' + ls[i])) {
                icon = 'folder' + width + '.png';
            }
            file = '<div><img class="filielistitem" width="' + width
                + '" height="' + width + '" src="' + Qt.appDir() 
                + '/doc/i/' + icon + '"> <span class="filelistitemtext">' 
                + ls[i] + '</span></div>';
            
            e('xtStdOut5Content').innerHTML += file;
        }
    }
}
```

##### FS.filesize
`Number FS.filesize(String path)` или `PHP.filesize(path)`

Возвращает размер файла в байтах.

##### FS.savePng
`FS.savePng(String path, String base64Str, Number iQuality)` или `Qt.savePng(path, base64Str, iQuality)`

Сохраняет изображение в формате PNG. `iQuality` — качество (0–9).

**Примечание для Windows:** при использовании Image на HTML5 Canvas необходимо указывать в `src` путь к изображению в том же каталоге, что и index.html, иначе возникает ошибка `SECURITY_ERR: DOM Exception 18`.

**Пример:**
```javascript
// Пусть есть элемент canvas с id="appCanvas"
var imageData = document.getElementById('appCanvas').toDataURL('image/png', 1);
FS.savePng('/home/andrey/image.png', imageData, 9);
```

##### FS.saveJpeg
`FS.saveJpeg(String path, String base64Str, Number iQuality)` или `Qt.saveJpeg(path, base64Str, iQuality)`

Сохраняет изображение в формате JPEG. `iQuality` — качество (0–100).

**Пример:**
```javascript
var imageData = document.getElementById('appCanvas').toDataURL('image/jpeg', 1);
FS.saveJpeg('/home/andrey/image.jpg', imageData, 100);
```

##### FS.mkdir
`Boolean FS.mkdir(String path)` или `PHP.mkdir(path)`

Создаёт каталог.

**Примечание для Windows:** вызов `FS.mkdir("/home/temp")` создаст каталог на том диске, где расположен `qdjs.exe`.

**Пример:**
```javascript
function e(id) {
    return document.getElementById(id);
}

var MkdirExample = {
    onclick: function(){
        var result = FS.mkdir(e('inpMkdir').value);
        alert(result);
    }
}
```

##### FS.startWatchDir
`Boolean FS.startWatchDir(String path)`

Начинает наблюдение за каталогом (только для Linux, использует inotify).

**Примечания:**
- Мониторит только первый уровень файлов
- Не проверяет существование каталога

##### FS.stopWatchDir
`FS.stopWatchDir()`

Прекращает наблюдение за каталогом.

##### FS.getModifyListInDir
`Array FS.getModifyListInDir()`

Возвращает список файлов, изменившихся в каталоге с момента начала наблюдения.

Каждое имя файла возвращается с префиксом:
- Первый символ: `'c'` (создание), `'m'` (изменение), `'d'` (удаление)
- Второй символ: `'d'` (каталог), `'f'` (файл)

##### FS.md5File
`String FS.md5File(String path)` или `PHP.md5_file()`

Возвращает MD5-сумму файла.

##### FS.open
`FS.open(String filename, String mode)` или `PHP.open(filename, mode)`

Открывает файл.

**Режимы:**
- `r` — чтение
- `w` — запись (существующий файл перезаписывается)
- `a` — добавление
- `b` — двоичный режим (используется с r/w/a)
- `+` — чтение и запись (с r/w/a)

**Примечание:** текст в UTF-8 выводится корректно.

##### FS.gets
`String FS.gets(Number fileDescriptor)` или `PHP.gets(fd)`

Считывает строку из открытого файла. Окончание строки — `\n`.

##### FS.eof
`Boolean FS.eof(Number fileDescriptor)` или `PHP.eof(fd)`

Возвращает `true`, если достигнут конец файла.

##### FS.close
`FS.close(Number fileDescriptor)` или `PHP.close(fd)`

Закрывает открытый файл.

**Пример работы с файлами:**
```javascript
var fd = FS.open("/tmp/file.txt", "r");
var s = "";
while (!FS.eof(fd)) {
    s += FS.gets(fd);
}
FS.close(fd);
```

##### FS.md5
`String FS.md5(String str)` или `PHP.md5()`

Возвращает MD5-сумму переданной строки.

### Пример приложения: редактор текстовых файлов

#### Подготовка к работе

1. Установите Qt5 Desktop WebView API
2. Установите редактор кода Geany (опционально)
3. Скопируйте [desktopjs.js.tags](https://github.com/lamzin-andrey/gjs/blob/master/data/default/geany/desktopjs.js.tags) в каталог настроек Geany

#### Создание файлов приложения

1. Создайте каталог для приложения (например, `~/myapps/simpleTextEditor` или `D:\myapps\simpleTextEditor`)
2. Создайте ярлык/кнопку запуска с командой:
   - Linux: `qdjs /home/username/myapps/simpleTextEditor`
   - Windows: `C:\qdjs\hw.exe D:\myapps\simpleTextEditor`
3. Создайте `index.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <link rel="stylesheet" type="text/css" href="./css/editor.css">
    <meta charset="UTF-8">
    <meta name="windowButtons" content="1010" width="800" height="600" fixed>
    <title>Простой редактор текстовых файлов</title>
</head>
<body>
    <div class="textplacer">
        <textarea id="edit1" class="mainTextEdit" rows="1"></textarea>
    </div>
    <div class="statusBar">&nbsp;0:0</div>
    <script src="./js/simpleTextEditor.js"></script>
</body>
</html>
```

4. Создайте `css/editor.css`:

```css
body {
    margin: 0px;
    padding: 0px;
}

.textplacer {
    width: 100%;
    height: 560px;
}

.textplacer textarea {
    width: 100%;
    height: 560px;
    border: gray solid 1px;
    resize: none;
}

.statusBar {
    width: 100%;
    height: 40px;
    text-align: right;
    background-color: #EFE9D6;
    font-family: MS Sans Serif, Courier new, Liberation Sans, Geneva, Arial;
}
```

5. Создайте `js/simpleTextEditor.js`:

```javascript
// Главный класс приложения
function SimpleTextEditor() {}
var ClassMembers = SimpleTextEditor.prototype;

// Вспомогательная функция для локализации
function L(s) {
    return s; // Заглушка, позже можно реализовать перевод
}

// Инициализация
ClassMembers.init = function() {
    MW.setIconImage(App.dir() + '/img/icon48.png');
    MW.setTitle(L('Простой редактор текстовых файлов'));
    
    this.isCurrentFileChange = false;
    this.textarea = document.getElementById('edit1');
    this.setEventListeners();
};

// Установка обработчиков событий
ClassMembers.setEventListeners = function() {
    var o = this;
    this.textarea.oninput = function(event) {
        o.onInput(event);
    };
};

// Обработка ввода текста
ClassMembers.onInput = function(event) {
    this.isCurrentFileChange = true;
};

// Обработка меню "Открыть"
ClassMembers.onClickOpenMenuItem = function() {
    if (!this.isCurrentFileChange) {
        try {
            var fileName = Env.openFileDialog(L('Выберите текстовый файл'), '', '*.txt *.js *.cpp *.html');
            if (fileName && FS.fileExists(fileName)) {
                this.currentFileName = fileName;
                this.textarea.value = FS.readfile(fileName);
            }
        } catch (err) {
            alert(err);
        }
    } else {
        if (confirm(L('Файл') + ' ' + this.currentFileName + ' ' + L('изменен. Сохранить изменения перед открытием файла?'))) {
            FS.writefile(this.currentFileName, this.textarea.value);
            this.isCurrentFileChange = false;
            this.onClickOpenMenuItem();
        }
    }
};

// Обработка меню "Сохранить"
ClassMembers.onClickSaveMenuItem = function() {
    FS.writefile(this.currentFileName, this.textarea.value);
};

// Обработка меню "Выход"
ClassMembers.onClickQuitMenuItem = function() {
    if (!this.isCurrentFileChange) {
        App.quit();
        return;
    }
    
    if (confirm(L('Файл') + ' ' + this.currentFileName + ' ' + L('изменен. Сохранить изменения перед выходом?'))) {
        FS.writefile(this.currentFileName, this.textarea.value);
        this.isCurrentFileChange = false;
        this.onClickQuitMenuItem();
    }
};

// Обработчики пунктов меню (глобальные функции)
function onClickOpenMenuItem() {
    editor.onClickOpenMenuItem();
}

function onClickSaveMenuItem() {
    editor.onClickSaveMenuItem();
}

function onClickExitMenuItem() {
    editor.onClickQuitMenuItem();
}

// Создание экземпляра приложения
window.editor = new SimpleTextEditor();

// Запуск после загрузки страницы
window.addEventListener('load', function() {
    editor.init();
}, false);
```

6. Добавьте главное меню в `index.html` (внутри `<head>`):

```html
<menubar class="d-none">
    <menu title="File">
        <item onselect="onClickOpenMenuItem()">Open Ctrl+O</item>
        <item onselect="onClickSaveMenuItem()">Save Ctrl+S</item>
        <item onselect="onClickExitMenuItem()">Exit Ctrl+Q</item>
    </menu>
</menubar>
```
# Важные правила

1  Это НЕ веб-приложение - все API вызовы идут к локальному бэкенду
2  Не добавлять серверный код (Node.js, Express и т.д.)
3  API методы реализованы отдельно и не должны изменяться
4  Нельзя использовать в javascript let, const, стрелочные функции,async, await, fetch
5 Нельзя использовать в css flex, grid.


