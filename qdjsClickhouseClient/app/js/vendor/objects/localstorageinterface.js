/**
 * @depends Settings.js
*/
window.LocalStorageShim = {
	getItem: function(k){
		return Settings.get(k);
	},
	setItem: function(k, v) {
		Settings.set(k, v);
	},
	removeItem: function(k){
		Settings.remove(k);
	}
};
