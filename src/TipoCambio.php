<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:29.
 */

namespace EliuTimana\TipoCambioPeru;

use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
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
        return new \stdClass();
    }

    /**
     * @return TipoCambioCollection
     */
    public function getCambioMes($mes = null)
    {
        return $this->dataMes;
    }

    /**
     * @param \DateTime $fecha
     *
     * @return \stdClass
     *
     * @throws \Exception
     */
    public function getCambioFecha(\DateTime $fecha)
    {
        if ($fecha > new \DateTime()) {
            throw new \Exception('La fecha no puede ser mayor a hoy');
        }

        return new \stdClass();
    }
}
