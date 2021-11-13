<?php

header ("Content-Type: Application/JSON");
echo file_get_contents("https://raw.githubusercontent.com/esdras-schonevald/free-db3/dev/db/stocklist.json");