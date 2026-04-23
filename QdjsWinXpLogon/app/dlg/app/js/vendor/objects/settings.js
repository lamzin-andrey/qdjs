/**
 * @depends recentdir.js
*/
window.Settings = {
    /**
     * @description {String} s
    */
    get:function(s, def){
	    var sets = RecentDir.jmp3cutGetSetting(s, def);
	    return sets;
    },
    set:function(s, oData){
	    RecentDir.jmp3cutSaveSetting(s, oData);
    },
    /**
     * @description Получить все настройки
     * @return Object
    */
    findAll:function() {
		return RecentDir.jmp3cutLoadSettings();
    },
    /**
     * @description Удалить данные хоста по id
     * @param {String} id for example '127.0.0.1:3306'
     * @return Boolean
    */
    remove:function(s) {
		return RecentDir.jmp3cutRemoveSetting(s);
    }
};
