<?php

namespace <namespace>;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="<table_name>")
 * @ORM\Entity(repositoryClass="<repository>")
 * @ORM\HasLifecycleCallbacks()
 */
class <EntityName>
{
    /**
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private int $id;

<members>


    public function getId() : ?int
    {
        return $this->id;
    }

<getsetters>

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedTimeNow() : self
    {
        $this->updatedTime = new DateTimeImmutable();

        return $this;
    }
}
