<?php

namespace <namespace>;

use <fullClassName>;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method <className>|null find($id, $lockMode = null, $lockVersion = null)
 * @method <className>|null findOneBy(array $criteria, array $orderBy = null)
 * @method <className>[]    findAll()
 * @method <className>[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class <className>Repository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, <className>::class);
    }
}
