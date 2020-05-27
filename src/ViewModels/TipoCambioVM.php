<?php

namespace EliuTimana\TipoCambioPeru;

use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;
use EliuTimana\TipoCambioPeru\Http\HttpClient;

class TipoCambio implements TipoCambioInterface
{
    private $client;
    private $dataMes;

    public function __construct()
    {
        $this->client = new HttpClient();
        $this->dataMes = $this->client->getDataMes();
    }

    public function getCambioHoy()
    {
        return $this->client->getDataFecha(new \DateTime(), true);
    }

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
}
