#!/bin/bash
mv -f "/opt/qt-desktop-js/apps/qdjsAutoStop/app/d/landautostopd.service" /etc/systemd/system/landautostopd.service
systemctl enable landautostopd.service
systemctl start landautostopd.service
