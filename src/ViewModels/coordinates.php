<?php

namespace EliuTimana\TipoCambioPeru\Entity;

class TipoCambioDia
{
    /**
     * @var int
     */
    private $dia;
    /**
     * @var float
     */
    private $compra;

    /**
     * @var float
     */
    private $venta;

    /**
     * @return int
     */
    public function getDia()
    {
        return $this->dia;
    }

    /**
     * @param int $dia
     *
     * @return TipoCambioDia
     */
    public function setDia($dia)
    {
        $this->dia = $dia;

        return $this;
    }

    /**
     * @return float
     */
    public function getCompra()
    {
        return $this->compra;
    }

    /**
     * @param float $compra
     *
     * @return TipoCambioDia
     */
    public function setCompra($compra)
    {
        $this->compra = $compra;

        return $this;
    }

    /**
     * @return float
     */
    public function getVenta()
    {
        return $this->venta;
    }

    /**
     * @param float $venta
     *
     * @return TipoCambioDia
     */
    public function setVenta($venta)
    {
        $this->venta = $venta;

        return $this;
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
