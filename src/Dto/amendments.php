<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 17:07.
 */

namespace EliuTimana\TipoCambioPeru\Entity;

/**
 * Class TipoCambioCollection.
 */
class TipoCambioCollection implements CollectionInterface, \Countable
{
    /**
     * @var array
     */
    private $items;

    /**
     * TipoCambioCollection constructor.
     */
    public function __construct()
    {
        $this->items = [];
    }

    public function clear()
    {
        $this->items = [];
    }

    /**
     * @return bool
     */
    public function isEmpty()
    {
        return 0 === $this->count();
    }

    /**
     * @return int
     */
    public function count()
    {
        return sizeof($this->items);
    }

    /**
     * @param TipoCambioDia $tipoCambioDia
     *
     * @return TipoCambioCollection
     */
    public function add(TipoCambioDia $tipoCambioDia)
    {
        $this->items[] = $tipoCambioDia;

        return $this;
    }

    /**
     * @param TipoCambioCollection $collection
     */
    public function addAll(TipoCambioCollection $collection)
    {
        $this->items = array_merge($this->items, $collection->getAll());
    }

    /**
     * @param $position
     *
     * @return TipoCambioDia
     */
    public function get($position)
    {
        return $this->items[$position];
    }

    /**
     * @return TipoCambioDia[]
     */
    public function getAll()
    {
        return $this->items;
    }
}
