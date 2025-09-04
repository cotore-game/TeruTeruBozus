<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>てるてる坊主メーカー</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>てるてる坊主メーカー</h1>
    <div class="main-container">
        <div class="drawing-controls">
            <div class="palette-and-tools">
                <div class="color-palette">
                    <div class="color-box active" data-color="#000000"></div>
                    <div class="color-box" data-color="#FFFFFF"></div>
                    <div class="color-box" data-color="#FF0000"></div>
                    <div class="color-box" data-color="#0000FF"></div>
                    <div class="color-box" data-color="#008000"></div>
                    <div class="color-box" data-color="#FFFF00"></div>
                    <div class="color-box" data-color="#FFA500"></div>
                    <div class="color-box" data-color="#800080"></div>
                    <div class="color-box" data-color="#A52A2A"></div>
                    <div class="color-box" data-color="#FFC0CB"></div>
                    <input type="color" id="customColorPicker" value="#000000">
                </div>
                <div class="drawing-tools">
                    <button id="drawMode" class="tool-button active">フリーハンド</button>
                    <button id="fillMode" class="tool-button">塗りつぶし</button>
                    <button id="undoButton">元に戻す</button>
                    <button id="clearButton">全消去</button>
                </div>
            </div>
            <div class="layer-controls">
                <span>レイヤー: </span>
                <button id="layer1Button" class="layer-button active">レイヤー1</button>
                <button id="layer2Button" class="layer-button">レイヤー2</button>
            </div>
        </div>

        <div class="canvas-container">
            <canvas id="teruteruCanvasLayer1" class="drawing-canvas"></canvas>
            <canvas id="teruteruCanvasLayer2" class="drawing-canvas"></canvas>
        </div>
        <button id="saveButton">投稿する</button>
    </div>
    
    <hr>
    
    <h2>みんなのてるてる坊主</h2>
    <div class="teruteru-list">
        <?php
        require_once('../src/db_config.php');

        try {
            $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $stmt = $pdo->query("SELECT image_filename FROM teruteru_bozus ORDER BY posted_at DESC");
            $teruterus = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($teruterus)) {
                echo "<p>まだ誰も投稿していません。最初のてるてる坊主を描いてみよう！</p>";
            } else {
                foreach ($teruterus as $teruteru) {
                    echo '<img src="teruteru_uploads/' . htmlspecialchars($teruteru['image_filename']) . '" alt="みんなのてるてる坊主">';
                }
            }

        } catch (PDOException $e) {
            echo "エラー: " . $e->getMessage();
        }
        ?>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
