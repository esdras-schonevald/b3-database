<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DONE</title>
    <style>
        body{
            overflow: hidden;
            background-color: black;
        }

        .generator{
            padding: 30px;
            position: fixed;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background-image:linear-gradient(to bottom left, rgba(45,100,30,0.2), rgba(45,30,100,0.8));
            color: whitesmoke;
            z-index: 1;
        }

    </style>
</head>
<body>
    <div class="generator">
        <center>
            <h1>DB3 - GENERATOR</h1>
            <h4>your stock list file is done!</h4>

            <br><br><br>
            <label id="lab_file" for="file">Downloading 100%<br><small>Congratulations! Your database is updated.</small></label><br>
            <progress id="file" value="1000" max="1000">&nbsp;</progress>
            <br><br><br>
            <a id="stocklist" href="<?= yaml_parse_file(__DIR__ . "/../../config.yaml")["stock"]["server"]["url"] ?>">View File</a>
        </center>
    </div>

</body>
</html>