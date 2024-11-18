<?php

include_once __DIR__ . '/../include.php';

$config = include_once __DIR__ . '/00_config_connect.php';


$db = new ClickHouseDB\Client($config);
//$db->verbose();
$db->settings()->readonly(false);

$table = 'osago_funnel_new_old_users_dashboard_data';

$result = $db->select(
    "SELECT * FROM $table LIMIT 10",
    []
);


print_r($result->rows());
die;

// ---------------------------- ASYNC SELECT ----------------------------
$state1 = $db->selectAsync('SELECT 1 as {key} WHERE {key} = :value', ['key' => 'ping', 'value' => 1]);
$state2 = $db->selectAsync('SELECT 2 as ping');
$db->executeAsync();

print_r($state1->fetchOne());
print_r($state1->rows());
print_r($state2->fetchOne('ping'));
//----------------------------------------//----------------------------------------
