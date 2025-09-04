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
        <div class="canvas-container">
            <canvas id="teruteruCanvas"></canvas>
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
