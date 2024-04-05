<?php

namespace EliuTimana\TipoCambioPeru;

interface TipoCambioInterface
{
    public function getCambioHoy();

    public function getCambioMes();

    public function getCambioFecha(\DateTime $fecha);
}
