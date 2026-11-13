function CSystemCtl() {
	/**
	 * @description Создаёт файлы foo.service, install.sh. В install.sh нет sudo.
	 * @param {String} shellFile путь к *.sh файлу с внутренней логикой сервиса
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} desc описание сервиса для секции  [Unit]\nDescription=
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.prepareServiceFiles = function(shellFile, serviceName, desc, installSh) {
		var serviceTmpFilePath;
		if (!installSh) {
			installSh = zCreateInstallShName()
		}
		serviceTmpFilePath = zWriteServiceFile(shellFile, serviceName, desc);
		return zWriteInstallSh(installSh, serviceName, serviceTmpFilePath);
	}
	
	/**
	 * @description Создаёт файлы foo.service, install.sh. В install.sh нет sudo. Запусает это всё через pkexec
	 * @param {String} shellFile путь к *.sh файлу с внутренней логикой сервиса
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} desc описание сервиса для секции  [Unit]\nDescription=
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.suCreateService = function(shellFile, serviceName, desc, installSh) {
		var sh = this.prepareServiceFiles(shellFile, serviceName, desc, installSh);
		zExec(sh);
	}
	
	/**
	 * @description Независимый. Создает install.sh файл с командой запуска.  В install.sh нет sudo. Запускает файл через pkexec;
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.suRunService = function(serviceName, installSh) {
		zExec(this.prepareRunService(serviceName, installSh));
	}
	
	/**
	 * @description Создаёт файлы foo.service, install.sh. В install.sh нет sudo. Дописывает в install.h команду запуска сервиса
	 * @param {String} shellFile путь к *.sh файлу с внутренней логикой сервиса
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} desc описание сервиса для секции  [Unit]\nDescription=
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.suCreateAndRunService = function(shellFile, serviceName, desc, installSh) {
		zExec(this.createAndRunService(shellFile, serviceName, desc, installSh));
	}
	
	function zExec(sh) {
		var cmd, rsh;
		rsh = App.dir() + "/d/r.sh";
		cmd = "#!/bin/bash\n";
		cmd += "pkexec " + sh + "\n";
		FS.writefile(rsh, cmd);
		jexec(rsh, DevNull, DevNull, DevNull);
	}
	
	
	/**
	 * @description Независимый. Создает install.sh файл с командой запуска.  В install.sh нет sudo.
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.prepareRunService = function(serviceName, installSh) {
		var cmd = "#!/bin/bash\n";
		if (!installSh) {
			installSh = zCreateInstallShName("run");
		}
		cmd += "systemctl start " + serviceName + "\n";
		FS.writefile(installSh, cmd);
		return installSh;
	}
	
	/**
	 * @description Создаёт файлы foo.service, install.sh. В install.sh нет sudo. Дописывает в install.h команду запуска сервиса
	 * @param {String} shellFile путь к *.sh файлу с внутренней логикой сервиса
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} desc описание сервиса для секции  [Unit]\nDescription=
	 * @param {String} installSh путь к файлу install.sh
	 * @return {String} путь к файлу install.sh
	*/
	this.createAndRunService = function(shellFile, serviceName, desc, installSh) {
		var cmd;
		installSh = this.prepareServiceFiles(shellFile, serviceName, desc, installSh);
		//cmd = FS.readfile(installSh);
		cmd  = "systemctl start " + serviceName + "\n";
		FS.writefile(installSh, cmd, FILE_APPEND);
		return installSh;
	}
	
	/**
	 * @description Создаёт файл install.sh. В install.sh нет sudo.
	 * @param {String} installSh путь к *.sh файлу который будет создан
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} serviceTmpFilePath полный путь к временному файлу .service
	 * @return {String} путь к файлу install.sh
	*/
	function zWriteInstallSh(installSh, serviceName, serviceTmpFilePath) {
		var cmd;
		 // TODO cp ; enable
		cmd = "#!/bin/bash\n" + 
			"mv -f \"" + serviceTmpFilePath + "\" /etc/systemd/system/" + serviceName + "\n" + 
			"systemctl enable " + serviceName + "\n";
		FS.writefile(installSh, cmd);
		return installSh;
	}
	
	/**
	 * @description Создаёт файл foo.service
	 * @param {String} shellFile путь к *.sh файлу с внутренней логикой сервиса
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @param {String} desc описание сервиса для секции  [Unit]\nDescription=
	 * @return {String} path путь к файлу foo.service
	*/
	function zWriteServiceFile(shellFile, serviceName, desc) {
		var path, s;
		path = zCreateServiceFileName(serviceName);
		s = zGetServiceTpl();
		s = s.replace("{{desc}}", desc);
		s = s.replace("{{ExecStart}}", shellFile);
		FS.writefile(path, s);
		return path;
	}
	
	/**
	 * @return {String} шаблон файла с описанием сервиса
	*/
	function zGetServiceTpl() {
		return "[Unit]\n" + 
		"Description={{desc}}\n\n" + 
		"[Service]\n" + 
		"Type=oneshot\n" + 
		"ExecStart={{ExecStart}}\n\n" + 
		"[Install]\n" + 
		"WantedBy=multi-user.target\n";
	}
	
	/**
	 * @param {String} serviceName короткое имя *.service файла с параметрами сервиса, например myservice.service
	 * @return {String} path путь к файлу foo.service
	*/
	function zCreateServiceFileName(serviceName) {
		return App.dir() + "/d/" + serviceName;
	}
	
	function zCreateInstallShName(prefix) {
		prefix = prefix ? prefix : "";
		return App.dir() + "/d/" + prefix + "sysctlinstall.sh";
	}
}
