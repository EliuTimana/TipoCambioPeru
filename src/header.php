<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:33.
 */

namespace EliuTimana\TipoCambioPeru;

interface TipoCambioInterface
{
    public function getCambioHoy();

    public function getCambioMes();

    public function getCambioFecha(\DateTime $fecha);
}
