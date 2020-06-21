/**
 * @depends recentdir.js
*/
window.RecentFileInfo = {
	/**
	 * @description {String} s
	*/
	getFileInfo:function(s){
		var sets = RecentDir.jmp3cutGetSetting(s, {});
		return sets;
	},
	setFileInfo:function(s, oData){
		RecentDir.jmp3cutSaveSetting(s, oData);
	}
};
