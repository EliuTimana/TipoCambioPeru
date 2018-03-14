<?php

require '../vendor/autoload.php';
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:33.
 */
/*$content = file_get_contents('http://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias');
libxml_use_internal_errors(true);
if (!empty($content)) {
    $domDocument = new DOMDocument();
    $domDocument->loadHTML($content);

    $domXPath = new DOMXPath($domDocument);

    $nodesTr = $domXPath->query('(//table[contains(@class, "form-table")])[1]/tr');
    foreach ($nodesTr as $r => $tr) {
        if ($r > 0) {
            $nodesTd = $tr->getElementsByTagName('td');
            for ($i = 0; $i < $nodesTd->length; $i += 3) {
                echo 'dia:'.$nodesTd->item($i)->nodeValue.'<br>';
                echo 'compa: '.$nodesTd->item($i + 1)->nodeValue.'<br>';
                echo 'venta:'.$nodesTd->item($i + 2)->nodeValue.'<br>';
            }
        }
    }
}*/

$tipocambio = new \EliuTimana\TipoCambioPeru\TipoCambio();
$tipocambio->getCambioMes(1);
$tipocambio->getCambioFecha(new DateTime());
$tipocambio->getCambioHoy();
