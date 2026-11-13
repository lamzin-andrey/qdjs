#!/bin/bash
sudo rm /etc/systemd/system/mydeamon.service
sudo cp -f /opt/qt-desktop-js/apps/qdjsAutoStop/test/mydaemon.service /etc/systemd/system/mydaemon.service
sudo systemctl enable mydaemon.service
