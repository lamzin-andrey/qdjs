<?php

declare(strict_types=1);

namespace <namespace>;

use <dto>;
use <repository>;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\Exception as DoctrineDbalDriverException;
use Doctrine\DBAL\Exception as DoctrineDbalException;
use Exception;
use InvalidArgumentException;
use RuntimeException;
use Doctrine\DBAL\ParameterType;

class <className>
{
    private const DATETIME_FORMAT = 'Y-m-d H:i:s';
    private Connection $dbConnection;
    private <repositoryClass> $<repositoryField>;

    public function __construct(
        Connection $dbConnection,
        RegistryInterface $registry,
        PbiPolicyFormRepository $<repositoryField>,
        DatetimeUtils $datetimeUtils
    ) {
        $this->dbConnection = $dbConnection;
        $this-><repositoryField> = $<repositoryField>;
    }

    /**
     * @throws DoctrineDbalDriverException
     * @throws DoctrineDbalException
     * @throws RuntimeException
     * @throws Exception
     */
    public function getBatch(DateTimeImmutable $startDay, DateTimeImmutable $endDay): ListDto
    {
        $dto = $this->getListDto($startDay, $endDay);

        return $dto;
    }

    /**
     * @throws DoctrineDbalDriverException
     * @throws DoctrineDbalException
     */
    private function getListDto(DateTimeInterface $startDate, DateTimeInterface $endDate): PolicyFormListDto
    {
        $sql = 'SELECT 
                        <sqlFieldsFragment>
                FROM `<table>` AS f
                LEFT JOIN     `table2` AS t
                    ON t.id = f.auto_owner_id
                
                WHERE 
                 f.created_time >= :startDate
                 AND f.created_time <  :endDate
                 GROUP BY f.id
                ORDER BY 
                f.id ASC;';

        $params = [
            'startDate' => $startDate->format(self::DATETIME_FORMAT),
            'endDate' => $endDate->format(self::DATETIME_FORMAT),
        ];

        $raw = $this->dbConnection->executeQuery($sql, $params)->fetchAllAssociative();

        $result = new ListDto([]); // TODO set list DTO class
        $items = [];
        foreach ($raw as $dbRow) {
            $item = new <dtoClass>((int)$dbRow['id']);
            // $item->setUserId((int)$dbRow['user_id']);
            <setters>
            $items[] = $item;
        }

        $result->setItems($items);

        return $result;
    }

    /**
     * @throws Exception
     * @throws DoctrineDbalDriverException
     * @throws DoctrineDbalException
     */
    public function processPart(DateTimeImmutable $dateStart, DateTimeImmutable $dateEnd): void
    {
        $policyFormListDto = $this->getBatch($dateStart, $dateEnd);

        if (count($listDto->getItems()) > 0) {
            $this->insertBatch($listDto);
        }
    }

    /**
     * @throws InternalServerErrorException
     * @throws NotFoundException
     * @throws InvalidArgumentException
     * @throws DoctrineDbalException
     * @throws DoctrineDbalDriverException
     */
    private function insertBatch(ListDto $listDto): void
    {
        if (0 === count($listDto->getItems())) {
            return;
        }
        $this-><memberRepository>->insertBatch($listDto);
    }
    
    /**
     * @throws InternalServerErrorException
     * @throws NotFoundException
     * @throws InvalidArgumentException
     * @throws DoctrineDbalException
     * @throws DoctrineDbalDriverException
     */
    private function insertBatchForRepository(ListDto $listDto): void
    {
        $list = $listDto->getItems();
        $parts = array_chunk($list, 100);
        foreach ($parts as $list) {
            $conn = $this->getEntityManager()->getConnection();
            $params = [];
            $types = [];
            $values = [];
            $sql = 'INSERT INTO <table_name> 
                (
                    <snake_insert_fields>
                )
                VALUES {values}
                ON DUPLICATE KEY UPDATE `form_id` = `form_id`';
            $i = 1;
            foreach ($list as $dto) {
                $values[] = "(
                -- :user_id{$i},
                --:form_id{$i},
                <snake_insert_places>
			)";

                // $params["form_created_time{$i}"] = $dto->getFormCreatedTime() ? $dto->getFormCreatedTime()->format(self::DATETIME_FORMAT) : null;
                // $params["form_updated_time{$i}"] = $dto->getFormUpdatedTime() ? $dto->getFormUpdatedTime()->format(self::DATETIME_FORMAT) : null;
                // $params["is_owner_policyholder{$i}"] = $dto->getIsOwnerPolicyholder();
                // $types["is_owner_policyholder{$i}"] = ParameterType::BOOLEAN;
                <params_fragment>
                ++$i;
            }

            $inserts = implode(',', $values);
            $sql = str_replace('{values}', $inserts, $sql);
            $conn->executeQuery($sql, $params, $types);
        }
    }
}
