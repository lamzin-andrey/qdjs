var searchProcessId = null;
var searchInterval = null;
var searchDirectory = null;

function DevNull() {} // Empty function

function addParameterInput(paramType, textid) {
    var paramInputsDiv = document.getElementById("param-inputs");
    var paramSelect = document.getElementById("param-select");

    var paramRow = document.createElement("div");
    paramRow.className = "param-row";
    paramRow.id = "row-" + paramType; // Unique ID

    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.className = "param-input";
    inputField.id = "input-" + paramType; // Unique ID
    inputField.placeholder = textid;

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "param-remove";
    removeButton.onclick = function() {
        // Add option back to select
        var option = document.createElement("option");
        option.value = paramType;
        option.textContent = paramType.replace(/_/g, " ").replace(/^\w/, function zFoo(c) { return c.toUpperCase()});
        paramSelect.appendChild(option);

        // Remove the row
        paramInputsDiv.removeChild(paramRow);
    };

    paramRow.appendChild(inputField);
    paramRow.appendChild(removeButton);
    paramInputsDiv.appendChild(paramRow);

    // Remove option from select
    for (var i = 0; i < paramSelect.options.length; i++) {
        if (paramSelect.options[i].value === paramType) {
            paramSelect.remove(i);
            break;
        }
    }
}

function main(){
    MW.setIconImage(App.dir() + "/i/icons/32.png");
    MW.setTitle(L("Clone Gnome-Search-Tool"));
    MW.maximize();

    // Восстанавливаем последний каталог при старте
    var lastPath = storage("lastPath");
    if (lastPath && FS.isDir(lastPath)) {
        searchDirectory = lastPath;
        document.getElementById("directory").value = lastPath;
    }

    // Обновляем состояние кнопки поиска
    updateSearchButtonState();

    document.getElementById("param-select").addEventListener("change", function() {
        var selectedValue = this.value;
        if (selectedValue) {
            addParameterInput(selectedValue, selectedValue);
            this.value = ""; // Сбрасываем выбор
        }
    });
    addParameterInput('content', 'content');
    setLocale();
}

window.addEventListener("load", main);

// Обновление состояния кнопки поиска
function updateSearchButtonState() {
    var button = document.getElementById("search-button");
    if (searchDirectory && searchDirectory.trim() !== "") {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

// Выбор каталога
function selectDirectory() {
    var currentPath = searchDirectory || "";
    var path = Env.openDirectoryDialog("Select Directory", currentPath);
    if (path) {
        searchDirectory = path;
        document.getElementById("directory").value = path;
        storage("lastPath", path); // Сохраняем путь
        updateSearchButtonState(); // Разблокируем кнопку поиска
    }
}

// Изменённый startSearch — без выбора каталога
function startSearch() {
    var filename = document.getElementById("filename").value;
    if (!filename) {
        alert("File name is required.");
        return;
    }

    if (!searchDirectory) {
        alert("Please select a directory first.");
        return;
    }

    prepareAndExecuteSearch(filename);
}

function prepareAndExecuteSearch(filename) {
    var appDir = App.dir();
    var searchScriptPath = appDir + '/sh/search.sh';
    var searchResultPath = appDir + '/sh/searchresult.txt';
    var scriptContent = buildSearchScript(filename);
    FS.writefile(searchResultPath, ""); // Clear the result file
    FS.writefile(searchScriptPath, scriptContent);
    executeSearchScript(searchScriptPath, searchResultPath);
}

function buildSearchScript(filename) {
    var content = document.getElementById("input-content") ? document.getElementById("input-content").value : "";
    var hidden = document.getElementById("row-hidden") !== null;
    var dateBefore = document.getElementById("input-date_before") ? document.getElementById("input-date_before").value : "";
    var dateAfter = document.getElementById("input-date_after") ? document.getElementById("input-date_after").value : "";
    var sizeLarger = document.getElementById("input-size_larger") ? document.getElementById("input-size_larger").value : "";
    var sizeSmaller = document.getElementById("input-size_smaller") ? document.getElementById("input-size_smaller").value : "";

    var script = "#!/bin/bash\n";
    script += "find \"" + searchDirectory + "\"";

    if (hidden) {
        // Do nothing. find shows hidden files by default
    } else {
        script += " -not -path '*/.*'"; // Exclude hidden files and directories
    }

    if (filename) {
        script += " -name \"*" + filename + "*\"";
    }

    if (dateBefore) {
        script += " -not -newermt \"" + dateBefore + "\"";
    }

    if (dateAfter) {
        script += " -newermt \"" + dateAfter + "\"";
    }

    if (sizeLarger) {
        script += " -size +" + sizeLarger + "c"; // Assuming bytes
    }

    if (sizeSmaller) {
        script += " -size -" + sizeSmaller + "c"; // Assuming bytes
    }

    if (content) {
        script = '#!/bin/bash\ngrep -rl --include="' + filename + '" "' + content + '" "' + searchDirectory + '" | \
while read -r file; do\n\
    find "$file" -not -path \'*/.*\' -printf \'%f|%h|%s|%F|%t\\n\'\n\
done > "' + App.dir() + '/sh/searchresult.txt"\n';
    } else {
        script += " -printf '%f|%h|%s|%F|%t\\n' > \"" + App.dir() + "/sh/searchresult.txt\"";
    }

    return script;
}

function executeSearchScript(scriptPath, resultPath) {
    document.getElementById("search-status").textContent = "Searching...";
    var processData = Env.exec(scriptPath, [this, this.onFinishSearch], [this, this.onSearchStdOut], [this, this.onSearchStdErr]);
    searchProcessId = processData[1];

    searchInterval = setInterval(function onTick() {
        var isRunning = Env.isRun(searchProcessId);
        if (!isRunning) {
            clearInterval(searchInterval);
            this.onFinishSearch("", "");
        }
    }.bind(this), 1000);
}

onSearchStdOut = function(data) {
    console.log("stdout: " + data);
};

onSearchStdErr = function(data) {
    console.error("stderr: " + data);
};

onFinishSearch = function(data, status) {
    document.getElementById("search-status").textContent = "Search completed.";
    clearInterval(searchInterval);

    var appDir = App.dir();
    var searchResultPath = appDir + '/sh/searchresult.txt';
    var fileContent = FS.readfile(searchResultPath);

    setTimeout(function(){
        displayResults(fileContent);
    }, 200);
};

function displayResults(fileContent) {
    var resultsTable = document.getElementById("results-table").getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = "";

    var lines = fileContent.trim().split('\n');
    if (lines.length === 1 && lines[0] === "") {
        resultsTable.innerHTML = "<tr><td colspan='5'>No results found.</td></tr>";
        return;
    }

    lines.forEach(function parseLine(line) {
        var parts = line.split('|');
        if (parts.length === 5) {
            var filename = parts[0];
            var directory = parts[1];
            var size = parts[2];
            var type = parts[3];
            var dateModified = parts[4];

            var row = resultsTable.insertRow();

            var filenameCell = row.insertCell(0);
            filenameCell.textContent = filename;

            filenameCell.onclick = function onClickDirName(event) {
                event.preventDefault();
                var sh, shfile = App.dir() + "/sh/opener.sh";
                sh = "#!/bin/bash\nxdg-open \"" + directory + '/' + filename + "\"";
                FS.writefile(shfile, sh);
                Env.exec(shfile, DevNull, DevNull, DevNull);
            };

            var directoryCell = row.insertCell(1);
            var truncatedDir = document.createElement('span');
            truncatedDir.className = 'truncated';
            truncatedDir.textContent = directory;
            truncatedDir.title = directory;

            var tooltip = document.createElement('span');
            tooltip.className = 'tooltiptext';
            tooltip.textContent = directory;
            truncatedDir.appendChild(tooltip);
            directoryCell.appendChild(truncatedDir);

            truncatedDir.onclick = function onClickDirName(event) {
                event.preventDefault();
                var sh, shfile = App.dir() + "/sh/opener.sh";
                sh = "#!/bin/bash\nthunar \"" + directory + "\"";
                FS.writefile(shfile, sh);
                Env.exec(shfile, DevNull, DevNull, DevNull);
            };

            directoryCell.classList.add('directory-link');

            var sizeCell = row.insertCell(2);
            sizeCell.textContent = size + " bytes";

            var typeCell = row.insertCell(3);
            typeCell.textContent = type;

            var dateModifiedCell = row.insertCell(4);
            dateModifiedCell.textContent = dateModified;
        }
    });
}