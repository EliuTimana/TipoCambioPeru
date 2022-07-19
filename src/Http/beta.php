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
    private $data;
    private $url = 'http://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias';
    private $mes;
    private $anio;

    /**
     * @return mixed
     */
    public function getMes()
    {
        return $this->mes;
    }

    /**
     * @param mixed $mes
     */
    public function setMes($mes)
    {
        $this->mes = $mes;
    }

    /**
     * @return mixed
     */
    public function getAnio()
    {
        return $this->anio;
    }

    /**
     * @param mixed $anio
     */
    public function setAnio($anio)
    {
        $this->anio = $anio;
    }

    public function __construct()
    {
        $this->fecha = new \DateTime();
        try {
            $this->data = $this->getHtmlContent();
        } catch (\Exception $e) {
        }
    }

    public function getDataMes($mes = null)
    {
        if ($mes) {
            try {
                return $this->getHtmlContent($mes, date('Y'));
            } catch (\Exception $e) {
                echo $e->getMessage();
            }
        }
        try {
            return $this->getHtmlContent();
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        return null;
    }

    public function getDataFecha(\DateTime $date, $previo = false)
    {
        $dia = $date->format('d');
        $mes = $date->format('m');
        $anio = $date->format('Y');

        try {
            $data = $this->getHtmlContent($mes, $anio);
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        if ($data) {
            $diaPrevio = null;
            $diaActual = null;

            foreach ($data->getAll() as $tipoCambioDia) {
                if ($tipoCambioDia->getDia() == $dia) {
                    $diaActual = $tipoCambioDia;
                } elseif ($tipoCambioDia->getDia() < $dia) {
                    $diaPrevio = $tipoCambioDia;
                }
            }

            if (!$diaActual && $previo) {
                return $diaPrevio;
            }

            return $diaActual;
        }

        return null;
    }

    /**
     * {@inheritdoc}
     */
    private function getHtmlContent($mes = null, $anio = null)
    {
        $content = file_get_contents($this->buildUrl($mes, $anio));

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
    private function parseTableRows(DOMNodeList $rows)
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
    private function parseColumnGroup(DOMNodeList $columns)
    {
        $data = new TipoCambioCollection();
        //Día  Compra  Venta  | Día  Compra   Venta | Día  Compra   Venta | Día  Compra Venta
        //1	   3.259   3.261  | 2    3.262    3.265 | 3	   3.257    3.259 | 6    3.249  3.250
        //7	   3.250   3.252  | 8    3.253    3.257 | 9	   3.254    3.256 | 10   3.258  3.260
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

    private function buildUrl($mes, $anio)
    {
        if ($mes || $anio) {
            if (!in_array($mes, range(1, 12))) {
                throw new \InvalidArgumentException('Mes inválido');
            }
            if ($anio > date('Y')) {
                throw new \InvalidArgumentException('El año no debe ser mayor al actual');
            }

            return $this->url."?mes={$mes}&anho={$anio}";
        }

        return $this->url;
    }
}
