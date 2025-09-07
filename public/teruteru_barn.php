<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>てるてる坊主のお焚き上げ</title>
    <link rel="stylesheet" href="css/barn_style.css">
</head>
<body>
    <div class="container">
        <h2>お焚き上げ</h2>
        <p>てるてる坊主は役目を果たしました。これより天に還します。</p>
        <div class="teruteru-list">
            <?php
            require_once('../src/db_config.php');

            try {
                $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $stmt = $pdo->query("SELECT image_filename FROM teruteru_bozus ORDER BY posted_at DESC");
                $teruterus = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (empty($teruterus)) {
                    echo "<p>燃やすてるてる坊主がいませんでした。</p>";
                } else {
                    foreach ($teruterus as $teruteru) {
                        echo '<img class="teruteru-image" src="teruteru_uploads/' . htmlspecialchars($teruteru['image_filename']) . '" alt="てるてる坊主">';
                    }
                }

            } catch (PDOException $e) {
                echo "エラー: " . $e->getMessage();
            }
            ?>
        </div>
        <div class="fire-container">
            <div class="fire"></div>
            <div class="smoke"></div>
        </div>
        <p id="message" class="hidden">天に還りました。ばいばい...てるてる...(泣)</p>
    </div>
    <script src="js/barn_script.js"></script>
</body>
</html>
