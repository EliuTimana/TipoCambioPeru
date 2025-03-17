<?php

use EliuTimana\TipoCambioPeru\Entity\TipoCambioCollection;
use EliuTimana\TipoCambioPeru\Entity\TipoCambioDia;

/**
 * Created by PhpStorm.
 * User: Eliu
 * Date: 03/15/2018
 * Time: 13:51
 */
class TipoCambioCollectionTest extends \PHPUnit\Framework\TestCase
{
    /**@var TipoCambioCollection $collection */
    private $collection;

    protected function setUp()
    {
        parent::setUp();
        $this->collection = new TipoCambioCollection();
    }

    public function testConstructCreatesEmptyArray()
    {
        $this->assertCount(0, $this->collection);
    }

    public function testAddMethodInsertsObject()
    {
        $this->collection->add(new TipoCambioDia());
        $this->collection->add(new TipoCambioDia());
        $this->collection->add(new TipoCambioDia());

        $this->assertTrue($this->collection->count() === 3);

        return $this->collection;
    }

    public function testCollectionContainsObject()
    {
        $object = new TipoCambioDia();
        $this->collection->add($object);

        $this->assertContains($object, $this->collection->getAll());
    }

    /**
     * @depends testAddMethodInsertsObject
     */
    public function testClearMethod(TipoCambioCollection $collection)
    {
        $collection->clear();
        $this->assertEquals(0, $collection->count());
    }


}