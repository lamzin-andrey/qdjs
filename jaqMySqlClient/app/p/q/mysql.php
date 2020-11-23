<?php
global $SQLCACHE;
$SQLCACHE = [];
/**
 * @require php 7.0.4 +
*/
function query($cmd, &$numRows = 0, &$affectedRows = 0, $skipSqlCache = false) {
	global $SQLCACHE;
	$lCmd = trim(strtolower($cmd));
	$isSelect = false;
	if (strpos($lCmd, 'select') === 0) {
		$isSelect = true;
		if (!$skipSqlCache && isset($SQLCACHE[$cmd])) {
			$numRows = $SQLCACHE[$cmd]['n'];
			return $SQLCACHE[$cmd]['data'];
		}
	}

	$link = setConnection();
	
	$insert = 0;
	if (strpos($lCmd, 'insert') === 0) {
		$insert = 1;
	}
	global $dberror; 
	global $dbaffectedrows; 
	global $dbnumrows;
	$res = mysqli_query($link, $cmd);
	$data = array();
	$dberror = mysqli_error($link);
	if ($dberror) {
		if (defined('DEV_MODE')) {
                        echo '<div class="bg-rose">';
			var_dump($dberror);
			echo "\n<hr>\n$cmd<hr>\n";
                        echo '</div>';
		}
		mysqli_close($link);
		return $data;
	}
	
	$numRows = $dbnumrows = @mysqli_num_rows($res);
	
	if ($dbnumrows ) {
		while ($row = mysqli_fetch_array($res)) {
			$rec =array();
			foreach ($row as $k=>$i) {				
				if (strval((int) $k) != strval($k)) {
					//$rec[$k] = html_entity_decode($i, ENT_QUOTES);
					//$rec[$k] = html_entity_decode($rec[$k], ENT_QUOTES);
					
					//$rec[$k] = str_replace('`', '\'', $rec[$k]);
					//$rec[$k] = str_replace('_QUICK_ENGIN__APOSTROF__', '`', $rec[$k]);
					$rec[$k] = db_unsafeString($i);
					
					//Если это xhr и существует константа DB_ENC_IS_1251
					if ( defined('DB_ENC_IS_1251') && utils_isXhr() ) {
						$rec[$k] = utils_utf8($rec[$k]);
					}
				}
			}
			$data[] = $rec;
		}
	}
	if ($isSelect) {
		$SQLCACHE[$cmd] = [];
		$SQLCACHE[$cmd]['n'] = $numRows;
		$SQLCACHE[$cmd]['data'] = $data;
	}
	$affectedRows = $dbaffectedrows = mysqli_affected_rows($link);
	if ($insert) {
		$id = mysqli_insert_id($link);
		mysqli_close($link);
		return $id; 
	}
	mysqli_close($link);
	return $data;
}
function dbrow($cmd, &$numRows = null) {
	$link = setConnection();
	$data = query($cmd, $numRows);
	if ($numRows) {
            return $data[0];
	}
	//mysql_close($link);
	return array();
}
function dbvalue($cmd) {
	$row = dbrow($cmd);
	$v = current($row);
	if (isset($v)) {
		return $v;
	}
	return false;
}
function setConnection() {
	$link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT) or die('Error connect to mysql');
	mysqli_select_db($link, DB_NAME) or die('Error select db ' . DB_NAME);
	//mysqli_query($link, 'SET NAMES UTF8');
	mysqli_query($link, 'SET NAMES CP1251');
	return $link;
}
function db_escape(&$s) {
	$s = str_replace('`', '_QUICK_ENGIN__APOSTROF__', $s);
	$s = str_replace('\'', '`', $s);
	$s = str_replace('\\', '_QUICK_ENGIN__DSLASH__', $s);
	return $s;
}
function db_set_delta($id, $table, $delta_field = 'delta', $id_field = 'id') {
	$query = "SELECT MAX({$delta_field}) FROM {$table}";
	$max = (int)dbvalue($query) + 1;
	$query = "UPDATE {$table} SET {$delta_field} = {$max} WHERE {$id_field} = {$id}";
	query($query);
}
/**
* @desc Привести значения полей в POST к типам одноименных полей в таблице $table
* @param string $table
**/
function db_mapPost($table) {
    return _db_map_request($table, $_POST);
}
/**
* @desc Привести значения полей в REQUEST к типам одноименных полей в таблице $table
* @param string $table
**/
function db_mapReq($table) {
    return _db_map_request($table, $_REQUEST);
}
/**
* @desc Привести значения полей в REQUEST к типам одноименных полей в таблице $table
* @param string $table
**/
function db_mapGet($table) {
    return _db_map_request($table, $_GET);
}
/**
* @desc Заменяет все кавычки в строке на html entity
* @return string $s
**/
function db_safeString(&$s) {
    //$s = htmlspecialchars($s, ENT_QUOTES);
    db_escape($s);
    return $s;
}
/**
* @desc Заменяет все кавычки в строке на html entity
* @return string $s
**/
function db_unsafeString(&$s) {
    $s = htmlspecialchars_decode($s, ENT_QUOTES);
    $s = str_replace('`', '\'', $s);
	$s = str_replace('_QUICK_ENGIN__APOSTROF__', '`', $s);
	$s = str_replace('_QUICK_ENGIN__DSLASH__', '\\', $s);
	//$s = str_replace('\\', '_QUICK_ENGIN__DSLASH__', $s);
    return $s;
}
/**
* @desc Создает INSERT запрос из полей одновременно присутствующих в $data и $tableName
* @param assocArray $data
* @param string $tableName
* @param assocArray $config ключ_в_data => поле_в_tableName
* @param assocArray &$options опции, которые есть в $data, но нет в $tableName
**/
function db_createInsertQuery($data, $tableName, $config = array(), &$options = null) {
    $struct = _db_load_struct_for_table($tableName);
    _db_set_std_values($struct, $data, $tableName);
    $sql_query = 'INSERT INTO {TABLE} 
            ({FIELDS}) 
            VALUES({VALUES});';
    $fields = array();
    $values = array();
    $count = 0;
    $options = array();
    foreach ($data as $key => $item) {
        if (isset($struct[$key]) || (isset($config[$key]) && isset( $struct[ $config[$key] ] ) ) ) {
            if (isset($struct[$key])) {
                $fields[] = '`'. $key .'`';
            } else {
                $fields[] = '`'. $config[$key] .'`';
            }
            db_safeString($item);
            $values[] = "'{$item}'";
            $count++;
        } else {
			db_safeString($item);
            $options[$key] = $item;
        }
    }
    if ($count) {
        $sql_query = str_replace('{TABLE}', $tableName, $sql_query);
        $sql_query = str_replace('{FIELDS}', join(',', $fields), $sql_query );
        $sql_query = str_replace('{VALUES}', join(',', $values), $sql_query );
        return $sql_query;
    }
    return false;
}
/**
* @desc Создает INSERT запрос из полей одновременно присутствующих в $data и $tableName добавляет в запрос плейсхолдеры {EXT_FIELDS} и {EXT_VALUES} которые позволяют добавлять еще значения
* @param assocArray $data
* @param string $tableName
* @param assocArray $config ключ_в_data => поле_в_tableName
* @param assocArray &$options опции, которые есть в $data, но нет в $tableName
**/
function db_createInsertQueryExt(&$data, $tableName, $config = array(), &$options = null) {
    $struct = _db_load_struct_for_table($tableName);
    _db_set_std_values($struct, $data, $tableName);
    $sql_query = 'INSERT INTO {TABLE} 
            ({FIELDS}{EXT_FIELDS}) 
            VALUES({VALUES}{EXT_VALUES});';
    $fields = array();
    $values = array();
    $count = 0;
    $options = array();
    foreach ($data as $key => $item) {
        if (isset($struct[$key]) || (isset($config[$key]) && isset( $struct[ $config[$key] ] ) ) ) {
            if (isset($struct[$key])) {
                $fields[] = '`'. $key .'`';
            } else {
                $fields[] = '`'. $config[$key] .'`';
            }
            db_safeString($item);
            $values[] = "'{$item}'";
            $count++;
        } else {
			db_safeString($item);
            $options[$key] = $item;
        }
    }
    if ($count) {
        $sql_query = str_replace('{TABLE}', $tableName, $sql_query);
        $sql_query = str_replace('{FIELDS}', join(',', $fields), $sql_query );
        $sql_query = str_replace('{VALUES}', join(',', $values), $sql_query );
        return $sql_query;
    }
    return false;
}
/**
 * @desc Создает UPDATE запрос из полей одновременно присутствующих в $data и $tableName
 * @param assocArray $data
 * @param string $tableName
 * @param string $condition
 * @param assocArray $config ключ_в_data => поле_в_tableName
 * @param assocArray &$options опции, которые есть в $data, но нет в $tableName
 **/
function db_createUpdateQuery($data, $tableName, $condition, $config = array(), &$options = null) {
    $struct = _db_load_struct_for_table($tableName);
    $sql_query = 'UPDATE {TABLE} SET {PAIRS} WHERE {CONDITION};';
    $pairss = array();
    $count = 0;
    $options = array();
    foreach ($data as $key => $item) {
        if (isset($struct[$key]) || (isset($config[$key]) && isset( $struct[ $config[$key] ] ) ) ) {
            if (isset($struct[$key])) {
                $key = '`'. $key .'`';
            } else {
                $key = '`'. $config[$key] .'`';
            }
            db_safeString($item);
            $pairs[] = "{$key} = '{$item}'";
            $count++;
        } else {
			db_safeString($item);
            $options[$key] = $item;
        }
    }
    if ($count) {
        $sql_query = str_replace('{TABLE}', $tableName, $sql_query);
        $sql_query = str_replace('{PAIRS}', join(',', $pairs), $sql_query );
        $sql_query = str_replace('{CONDITION}', $condition, $sql_query );
        return $sql_query;
    }
    return false;
}
/**
 * @desc Создает UPDATE запрос из полей одновременно присутствующих в $data и $tableName  добавляет в запрос плейсхолдеры {EXT_PAIRS} который позволяет добавлять еще значения
 * @param assocArray $data
 * @param string $tableName
 * @param string $condition
 * @param assocArray $config ключ_в_data => поле_в_tableName
 * @param assocArray &$options опции, которые есть в $data, но нет в $tableName
 **/
function db_createUpdateQueryExt($data, $tableName, $condition, $config = array(), &$options = null) {
    $struct = _db_load_struct_for_table($tableName);
    $sql_query = 'UPDATE {TABLE} SET {PAIRS} {EXT_PAIRS} WHERE {CONDITION};';
    $pairss = array();
    $count = 0;
    $options = array();
    foreach ($data as $key => $item) {
        if (isset($struct[$key]) || (isset($config[$key]) && isset( $struct[ $config[$key] ] ) ) ) {
            if (isset($struct[$key])) {
                $key = '`'. $key .'`';
            } else {
                $key = '`'. $config[$key] .'`';
            }
            db_safeString($item);
            $pairs[] = "{$key} = '{$item}'";
            $count++;
        } else {
			db_safeString($item);
            $options[$key] = $item;
        }
    }
    if ($count) {
        $sql_query = str_replace('{TABLE}', $tableName, $sql_query);
        $sql_query = str_replace('{PAIRS}', join(',', $pairs), $sql_query );
        $sql_query = str_replace('{CONDITION}', $condition, $sql_query );
        return $sql_query;
    }
    return false;
}
/**
 * @desc set date_create, delta, uid, user_id if it exists in struct and no set in data
*/
function _db_set_std_values($struct, &$data, $tableName, $exclude = array()) {
    $_ex = array();
    foreach ($exclude as $v) {
        $_ex[$v] = 1;
    }
    $exclude = $_ex;
    if (isset($struct['date_create']) && !isset($data['date_create']) && !isset($exclude['date_create']) ) {
        $data['date_create'] = now();
    }
    if (isset($struct['uid']) && !isset($data['uid']) && !isset($exclude['uid']) ) {
        $data['uid'] = CApplication::getUid();
    }
    if (isset($struct['user_id']) && !isset($data['user_id']) && !isset($exclude['user_id']) ) {
        $data['user_id'] = CApplication::getUid();
    }
    if (defined('DB_DELTA_NOT_USE_TRIGGER') && isset($struct['delta']) && !isset($data['delta']) ) {
        $sql_query = "SELECT MAX(delta) FROM {$tableName}";
        $v = intval(dbvalue($sql_query));
        $data['delta'] = $v + 1;
    }
}
/**
* @desc Привести значения полей в data к типам одноименных полей в таблице $table
* @param string $table
**/
function _db_map_request($table, $data = null) {
    $res = array();
    if (!$data) {
        $data = $_REQUEST;
    }
    $struct = _db_load_struct_for_table($table);
    foreach ($data as $field => $value) {
        if ($field_info = a($struct, $field)) {
            switch ($field_info['type']) {
                case 'int':
                case 'bool':
                    $res[$field] = intval($value);
                    if ($field_info['length'] == 1) {
                            $res[$field] = $res[$field] ? 1 : 0;
                    }
                    break;
                case 'real':
                case 'double':
                    $res[$field] = doubleval($value);
                    break;
                case 'string':
                    $res[$field] = mb_substr($value, 0, $field_info['length'] / 3, 'UTF-8'); //TODO utf8_g_ci
                    $res[$field] = htmlspecialchars($res[$field], ENT_QUOTES);
                    break;
                case 'blob':
                    $res[$field] = htmlspecialchars($value, ENT_QUOTES);
                    break;
                default:
                    $res[$field] = htmlspecialchars($value, ENT_QUOTES);
            }
        } else {
            $res[$field] = htmlspecialchars($value, ENT_QUOTES);
        }
    }
    return $res;
}
function _db_load_struct_for_table(string $table) {
    $file = APP_CACHE_FOLDER . '/' . $table . '.cache';
    if (file_exists( $file ) && DEV_MODE != true) {
        $s = file_get_contents($file);
        $data = json_decode($s, true);
        return $data;
    }
    $link = setConnection();
    $res = mysqli_query($link, "SELECT * FROM {$table} LIMIT 1");
    if ( mysqli_error($link) ) {
        echo "Data Source <br>
	    $table
	    <br>
	    was not found
	    <br>
	    Mysql Error:<br>
	    <hr>
	    " . mysqli_error($link)."<hr>";
	    die;
    }
    $data  = array();
    for ($i = 0; $i < mysqli_num_fields($res); $i++) {
		$fieldData = mysqli_fetch_field($res);
		$key = $fieldData->name;
		$type = $fieldData->type;
		//echo '<pre>'; var_dump($fieldData);
		$type = _get_mysql_type_by_int($type);
		$len = $fieldData->length;
		$row    = array("type"=>$type, "length"=>$len);
		$data[$key]    = $row;
    }
    //die(__file__ .  __line__);
    mysqli_close($link);
    $s = json_encode($data);
    file_put_contents($file, $s);
    return $data;
}
function _get_mysql_type_by_int(int $type) {
	switch ($type) {
		case 3:
			return 'int';
		case 12:
			return 'datetime';
		case 253:
			return 'string';
		case 252:
			return 'blob';
	}
	return 'string';
}
