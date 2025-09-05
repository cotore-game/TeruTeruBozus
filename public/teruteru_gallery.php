<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>みんなのてるてる坊主</title>
    <link rel="stylesheet" href="css/gallery_style.css">
</head>
<body>
    <div class="sky">
        <div class="sun-moon"></div>
    </div>
    
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
                    echo '<img class="teruteru-image" src="teruteru_uploads/' . htmlspecialchars($teruteru['image_filename']) . '" alt="みんなのてるてる坊主">';
                }
            }

        } catch (PDOException $e) {
            echo "エラー: " . $e->getMessage();
        }
        ?>
    </div>

    <script src="js/gallery_main.js"></script>
</body>
</html>
