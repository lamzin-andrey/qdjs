/**
 * @depends settings.js
*/
window.HostsSaver = {
    /**
     * @description Добавить хост в список
     * @param {String} host
     * @param {String} port
     * @param {String} dbname
     * @param {String} dbuser
     * @param {String} dbpassword
     * @return Boolean true если всё ок
    */
    addHost:function(host, port, dbname, dbuser, dbpassword) {
		if (!host || !port || !dbname || !dbuser || !dbpassword) {
			return false;
		}
		var data = {host: host, port: port, dbname: dbname, dbuser: dbuser, dbpassword: dbpassword, active: 1},
			id = host + ':' + port + ':' + dbname;
		Settings.set(id, data);
		//save php config
		this.savePhpConfig(host, port, dbname, dbuser, dbpassword);
		this.setHostAsActive(id);
		return true;
    },
    /**
     * @description Сохранить данные хоста в конфиге PHP
     * @param {String} host
     * @param {String} port
     * @param {String} dbname
     * @param {String} dbuser
     * @param {String} dbpassword
    */
    savePhpConfig:function(host, port, dbname, dbuser, dbpassword) {
	var tpl = PHP.file_get_contents(Qt.appDir() + '/p/q/custom.php.example');
	tpl = tpl.replace("'localhost'", "'" + host + "'");
	tpl = tpl.replace("8123", port);
	tpl = tpl.replace("'default'", "'" + dbuser + "'");
	tpl = tpl.replace("'123456'", "'" + dbpassword + "'");
	tpl = tpl.replace("'dbname'", "'" + dbname + "'");
	PHP.file_put_contents(Qt.appDir() + '/p/q/phpClickHouse-master/example/00_config_connect.php', tpl);
    },
    /**
     * @return Array
    */
    getAllIdList:function() {
	var sets = Settings.findAll(), i, d = ':', r = [];
	for (i in sets) {
	    if (i.indexOf(d) != -1) {
		r.push(i);
	    }
	}
	return r;
    },
    /**
     * @return Array
    */
    getAll:function() {
	var sets = Settings.findAll(), i, d = ':', r = {};
	for (i in sets) {
	    if (i.indexOf(d) != -1) {
		r[i] = sets[i];
	    }
	}
	return r;
    },
    /**
     * @return Array
    */
    setHostAsActive:function(id) {
	var hosts = this.getAll(), i;
	for (i in hosts) {
	    hosts[i].active = (i == id ? 1 : 0);
	    Settings.set(i, hosts[i]);
	}
    },
    /**
     * @description Получить данные хоста по id
     * @param {String} id for example '127.0.0.1:3306'
    */
    loadHostData:function(id) {
        var o = Settings.get(id), s = '';
        if (!o.host) {
            o = {host: s, port: s, dbname: s, dbuser: 'root', dbpassword: s};
        }
        return o;
    },
    /**
     * @description Удалить данные хоста по id
     * @param {String} id for example '127.0.0.1:3306'
     * @return Boolean
    */
    remove:function(id) {
        return Settings.remove(id);
    }
};
