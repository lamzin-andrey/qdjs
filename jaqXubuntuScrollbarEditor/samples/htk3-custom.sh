
# set scrollbars
mkdir $HOME/.config/gtk-3.0

echo '
.scrollbar.vertical slider, 
	scrollbar.vertical slider {
	min-width: 14px;
	background-color:#C3D5FD;
	border-radius: 1px;
	border: 2px solid #6285D4;
}

.scrollbar.horizontal slider, 
	scrollbar.horizontal slider {
	min-height: 14px;
	background-color:#C3D5FD;
	border-radius: 1px;
	border: 2px solid #6285D4;
}' > $HOME/.config/gtk-3.0/gtk.css
