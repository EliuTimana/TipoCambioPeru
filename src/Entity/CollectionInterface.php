<?php
/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/14/2018
 * Time: 17:12.
 */

namespace EliuTimana\TipoCambioPeru\Entity;

interface CollectionInterface
{
    public function add(TipoCambioDia $tipoCambioDia);

    public function addAll(TipoCambioCollection $collection);

    public function get($position);

    public function clear();

    public function isEmpty();

    public function count();

    public function getAll();
}
