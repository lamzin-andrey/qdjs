/**
 * @depends settings.js
*/
window.Settings = {
	/**
     * @description Добавить хост в список
	 * @param {String} host
	 * @param {String} port
	 * @param {String} dbname
	 * @param {String} dbuser
	 * @param {String} dbpassword
	*/
    addHost(host, port, dbname, dbuser, dbpassword) {
        var data = {host: host, port: port, dbname: dbname, dbuser: dbuser, dbpassword: dbpassword},
            id = host + ':' + port;
        Settings.set(id, data);
    },
    /**
     * @description Получить данные хоста по id
	 * @param {String} id for example '127.0.0.1:3306'
	*/
    loadHostData(id) {
        var o = Settings.get(id), s = '';
        if (!o.host) {
            o = {host: s, port: s, dbname: s, dbuser: 'root', dbpassword: s};
        }
        return o;
    }
};
