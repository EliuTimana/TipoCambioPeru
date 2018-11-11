<?php

require '../vendor/autoload.php';
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:33.
 */

$tipocambio = new \EliuTimana\TipoCambioPeru\TipoCambio();
print_r($tipocambio->getCambioMes());
print_r($tipocambio->getCambioFecha(new DateTime('2017-08-06'), true));
print_r($tipocambio->getCambioHoy());
