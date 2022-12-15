<?php

require '../vendor/autoload.php';

$tipocambio = new \EliuTimana\TipoCambioPeru\TipoCambio();
echo $tipocambio->getCambioMes();
echo $tipocambio->getCambioFecha(new DateTime('2017-08-06'), true);
echo $tipocambio->getCambioHoy();

    public function getCambioMes($mes = null)
    {
        return $this->client->getDataMes($mes);
    }

    public function getCambioFecha(\DateTime $fecha, $previo = false)
    {
        if ($fecha > new \DateTime()) {
            throw new \Exception('La fecha no puede ser mayor a hoy');
        }

        return $this->client->getDataFecha($fecha, $previo);
    }