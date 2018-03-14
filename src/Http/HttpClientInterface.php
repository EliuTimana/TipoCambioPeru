<?php

/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:40.
 */

namespace EliuTimana\TipoCambioPeru\Http;

use DOMNodeList;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;

interface HttpClientInterface
{
    public function getDataMes();

    /**
     * @return TipoCambioDia[]
     *
     * @throws \Exception
     */
    public function getHtmlContent();

    /**
     * @param DOMNodeList $rows
     *
     * @return TipoCambioDia[]
     */
    public function parseTableRows(DOMNodeList $rows);

    /**
     * @param DOMNodeList $columns
     *
     * @return TipoCambioDia[] Grupo de Dias de la fila
     */
    public function parseColumnGroup(DOMNodeList $columns);
}
