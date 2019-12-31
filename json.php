<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$json = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'data.json');

echo $json;