<?php

require '../vendor/autoload.php';


$tipocambio = new \EliuTimana\TipoCambioPeru\TipoCambio();
echo $tipocambio->getCambioMes();
echo $tipocambio->getCambioFecha(new DateTime('2017-08-06'), true);
echo $tipocambio->getCambioHoy();
echo $tipocambio->getCambioMes();
echo $tipocambio->getCambioFecha(new DateTime('2017-08-06'), true);
echo $tipocambio->getCambioHoy();
