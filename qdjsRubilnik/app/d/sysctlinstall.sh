#!/bin/bash
cp -f "/opt/qt-desktop-js/apps/qdjsRubilnik/app/d/landautostopd.service" /etc/systemd/system/landautostopd.service
systemctl enable landautostopd.service
systemctl start landautostopd.service
