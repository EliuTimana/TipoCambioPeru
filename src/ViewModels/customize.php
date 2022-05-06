<?php


namespace EliuTimana\TipoCambioPeru\Entity;

/**
 * Interface CollectionInterface.
 */
interface CollectionInterface
{
    /**
     * @param TipoCambioDia $tipoCambioDia
     *
     * @return mixed
     */
    public function add(TipoCambioDia $tipoCambioDia);

    /**
     * @param TipoCambioCollection $collection
     */
    public function addAll(TipoCambioCollection $collection);

    /**
     * @param $position
     *
     * @return TipoCambioDia
     */
    public function get($position);

    public function clear();

    /**
     * @return bool
     */
    public function isEmpty();

    /**
     * @return int
     */
    public function count();

    /**
     * @return array
     */
    public function getAll();
}
