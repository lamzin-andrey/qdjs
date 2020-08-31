#! /bin/bash
dir=`pwd`
export LD_LIBRARY_PATH=$dir/app/data/lib
export QT_PLUGIN_PATH=$dir/app/data/plugins
$dir/app/data/bin/launcher/qdjs "$dir/app"
