<?php

include_once __DIR__ . '/../include.php';

$config = include_once __DIR__ . '/00_config_connect.php';


$db = new ClickHouseDB\Client($config);


// ---------------------------- Write ----------------------------
echo "\n-----\ntry write:create_table\n";
$db->database('default');
//------------------------------------------------------------------------------

$table = 'osago_funnel_new_old_users_dashboard_data';


$db->write('DROP TABLE IF EXISTS ' . $table);
die("Drop done\n");

$db->write("
    CREATE TABLE IF NOT EXISTS default.{$table}  ON CLUSTER '{cluster}'       
             (                                                                                                          
                 `event_time` Date,                                                                                     
                 `event` String,                                                                                        
                 `event_open_count_new` UInt32,
                 `event_open_count_old` UInt32,
                 `event_close_count_new` UInt32,
                 `event_close_count_old` UInt32
             )                                                                                                          
             ENGINE =                                                                                                   
 ReplicatedMergeTree('/clickhouse/tables/{cluster}/{shard}/default/{$table}',
 '{replica}')                                                                                                           
             ORDER BY (event_time, event)                                                                                      
             SETTINGS index_granularity = 8192
"
);

echo "Create done\n";

// echo 'Table EXISTS: ' . json_encode($db->showTables()) . PHP_EOL;

