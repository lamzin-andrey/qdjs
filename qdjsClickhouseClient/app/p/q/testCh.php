<?php 
include __DIR__ . '/custom.php';
include __DIR__ . '/utils.php';
include __DIR__ . '/clickhouse.php';

$table = "osago_funnel_new_old_users_dashboard_data_2";


$cmd = "
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
";


$cmd = "SELECT * FROM {$table} LIMIT 2";

$insert = "INSERT INTO $table (`event_time`, `event`, `event_open_count_new`, `event_open_count_old`, `event_close_count_new`, `event_close_count_old`)
			VALUES('2024-11-18 15:11:00', '[Ситуация] Пошёл в обход', 10, 20, 10, 30)
";

$update = "ALTER TABLE {$table} UPDATE `event_open_count_new` = 333 
WHERE event_time = '2024-11-18' AND event = '[Ситуация] Пошёл в обход' ";

//$cmd = $insert;
// $cmd = $update;

global $dberror;
$rows = query($cmd, $nR);
print_r($rows);
var_dump($nR);
var_dump($dberror);
