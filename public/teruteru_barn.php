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
        <div class="teruteru-barn">
            <img id="teruteru-img" src="teruteru_uploads/<?php echo htmlspecialchars($_GET['img'] ?? ''); ?>" alt="てるてる坊主">
        </div>
        <div class="fire-container">
            <div class="fire"></div>
            <div class="smoke"></div>
        </div>
        <p id="message" class="hidden">天に還りました。新しいてるてる坊主を描きましょう。</p>
        <button id="home-button" class="hidden">新しいてるてる坊主を描く</button>
    </div>
    <script src="js/barn_script.js"></script>
</body>
</html>
