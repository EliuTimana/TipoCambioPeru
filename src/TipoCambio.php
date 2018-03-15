<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:29.
 */

namespace EliuTimana\TipoCambioPeru;

use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;
use EliuTimana\TipoCambioPeru\Http\HttpClient;

/**
 * Class TipoCambio.
 */
class TipoCambio implements TipoCambioInterface
{
    private $client;
    private $dataMes;

    public function __construct()
    {
        $this->client = new HttpClient();
        $this->dataMes = $this->client->getDataMes();
    }

    /**
     * @return \stdClass
     */
    public function getCambioHoy()
    {
        return $this->client->getDataFecha(new \DateTime(), true);
    }

    /**
     * @return TipoCambioCollection
     */
    public function getCambioMes($mes = null)
    {
        return $this->client->getDataMes($mes);
    }

    /**
     * @param \DateTime $fecha
     *
     * @return TipoCambioDia
     *
     * @throws \Exception
     */
    public function getCambioFecha(\DateTime $fecha, $previo = false)
    {
        if ($fecha > new \DateTime()) {
            throw new \Exception('La fecha no puede ser mayor a hoy');
        }

        return $this->client->getDataFecha($fecha, $previo);
    }
}
