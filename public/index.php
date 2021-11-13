<?php

header ("Content-Type: Application/JSON");
echo file_get_contents("../db/stocklist.json");