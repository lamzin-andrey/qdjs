/**
 * @depends recentdir.js
*/
window.Settings = {
	/**
	 * @description {String} s
	*/
	get:function(s){
		var sets = RecentDir.jmp3cutGetSetting(s, {});
		return sets;
	},
	set:function(s, oData){
		RecentDir.jmp3cutSaveSetting(s, oData);
	}
};
