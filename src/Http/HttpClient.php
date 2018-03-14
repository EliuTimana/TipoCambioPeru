<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 14:40.
 */

namespace EliuTimana\TipoCambioPeru\Http;

use DOMDocument;
use DOMElement;
use DOMNodeList;
use DOMXPath;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;

/**
 * Class HttpClient.
 */
class HttpClient implements HttpClientInterface
{
    const URL = 'http://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias?mes=03&anho=1500';
    private $data;

    public function __construct()
    {
        try {
            $this->data = $this->getHtmlContent();
        } catch (\Exception $e) {
        }
    }

    public function getDataMes()
    {
        return $this->data;
    }

    /**
     * {@inheritdoc}
     */
    public function getHtmlContent()
    {
        $content = file_get_contents(HttpClient::URL);

        if (!$content) {
            throw new \Exception('Error al obtener los datos del servidor');
        }

        libxml_use_internal_errors(true);

        $domDocument = new DOMDocument();
        $domDocument->loadHTML($content);

        $domXPath = new DOMXPath($domDocument);

        $nodesTr = $domXPath->query('(//table[contains(@class, "form-table")])[1]/tr');

        return $this->parseTableRows($nodesTr);
    }

    /**
     * {@inheritdoc}
     */
    public function parseTableRows(DOMNodeList $rows)
    {
        $data = new TipoCambioCollection();

        foreach ($rows as $rowIndex => $tr) {
            if ($rowIndex > 0) { //No se toma en cuenta la fila de [Día, Compra, Venta]
                /** @var DOMElement $tr */
                $nodesTd = $tr->getElementsByTagName('td');
                $dataRow = $this->parseColumnGroup($nodesTd);

                $data->addAll($dataRow);
            }
        }

        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function parseColumnGroup(DOMNodeList $columns)
    {
        $data = new TipoCambioCollection();
        //Día  Compra  Venta  | Día  Compra   Venta | Día  Compra   Venta | Día  Compra Venta
        //1	   3.259   3.261  | 2	 3.262    3.265 | 3	   3.257    3.259 | 6	 3.249  3.250
        //7	   3.250   3.252  | 8	 3.253    3.257 | 9	   3.254    3.256 | 10   3.258  3.260
        //...................................................................................
        if ($columns->length < 3) {
            return $data;
        }

        $tdLength = $columns->length;

        for ($i = 0; $i < $tdLength; $i += 3) {
            $tipoCambioDia = new TipoCambioDia();
            $tipoCambioDia
                ->setDia(intval($columns->item($i)->nodeValue))
                ->setCompra(floatval($columns->item($i + 1)->nodeValue))
                ->setVenta(floatval($columns->item($i + 2)->nodeValue));

            $data->add($tipoCambioDia);
        }

        return $data;
    }
}
