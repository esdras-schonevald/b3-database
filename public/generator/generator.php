<?php

include "SingleCurl.php";

if (session_status() !== 2){
    session_start();
}

if (empty($_SESSION["stock_list_current"])){
    $_SESSION["stock_list_current"] =   1000;
}

$info       =   filter_input(INPUT_POST, "info");
$config     =   yaml_parse_file("config.yaml");
$max        =   count($config["STOCK LIST"]);
$current    =   $_SESSION["stock_list_current"];
$percent    =   intval(($current/$max)*100);

if (isset($info)) {
    $rInfo   =   json_decode($info, 1);
    if (isset($rInfo["Papel"]))
        $_SESSION["stock_list"]["ativos"][$rInfo["Papel"]]    =   $rInfo;

    if ($current >= $max) {
        $_SESSION["stock_list"]["atualizacao"] = date("r");
        file_put_contents($config["STOCK LIST FILE"], json_encode($_SESSION["stock_list"]));
        $_SESSION["stock_list_current"] =   0;
        $_SESSION["stock_list"]         =   [];
        header("Location: ./done.html");
        //echo file_get_contents($config["STOCK LIST FILE"]);
        exit;
    }
}

$ticker     =   $config["STOCK LIST"][$_SESSION["stock_list_current"]++];
$url        =   "{$config["STOCK PROVIDER REPOSITORY"]}?papel=$ticker";

$curl = new SingleCurl($url);
echo utf8_encode(
    $curl->getResponse()
);

echo "<script>
document.getElementById('file').value = $current;
document.getElementById('file').max = $max;
document.getElementById('lab_file').innerHTML = 'Downloading $percent%<br><small>{$rInfo["Papel"]} - {$rInfo["Empresa"]}</small>';
</script>";

if ($percent == 100){
    echo "<script>
    document.getElementById('stocklist').style.display = 'inherit';
    </script>";
}