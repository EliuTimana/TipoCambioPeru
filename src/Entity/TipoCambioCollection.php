<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 17:07.
 */

namespace EliuTimana\TipoCambioPeru\Entity;

class TipoCambioCollection implements CollectionInterface
{
    private $items;

    public function __construct()
    {
        $this->items = [];
    }

    public function clear()
    {
        $this->items = [];
    }

    public function isEmpty()
    {
        return 0 === $this->count();
    }

    public function count()
    {
        return sizeof($this->items);
    }

    public function add(TipoCambioDia $tipoCambioDia)
    {
        $this->items[] = $tipoCambioDia;
    }

    public function addAll(TipoCambioCollection $collection)
    {
        $this->items = array_merge($this->items, $collection->getAll());
    }

    public function get($position)
    {
        return $this->items[$position];
    }

    public function getAll()
    {
        return $this->items;
    }
}
