                $params["<snake>{$i}"] = $dto->get<camel>() ? $dto->get<camel>()->format(self::DATETIME_FORMAT) : null;
