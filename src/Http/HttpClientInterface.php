<?php

/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:40.
 */

namespace EliuTimana\TipoCambioPeru\Http;

use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;

interface HttpClientInterface
{
    /**
     * @param $mes
     *
     * @return TipoCambioCollection|null
     */
    public function getDataMes($mes);

    /**
     * @param \DateTime $date
     *
     * @return TipoCambioDia|null
     */
    public function getDataFecha(\DateTime $date);
}
