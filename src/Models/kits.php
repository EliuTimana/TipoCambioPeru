<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 16:11.
 */

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
}
