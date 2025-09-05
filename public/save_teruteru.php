<?php
header('Content-Type: application/json');

require_once('../src/db_config.php');

if (!isset($_POST['image'])) {
    echo json_encode(['status' => 'error', 'message' => '画像データがありません。']);
    exit;
}

$imageData = $_POST['image'];
$imageData = str_replace('data:image/png;base64,', '', $imageData);
$imageData = base64_decode($imageData);

if ($imageData === false) {
    echo json_encode(['status' => 'error', 'message' => '不正な画像データです。']);
    exit;
}

// ファイル名を生成
$filename = uniqid('teruteru_', true) . '.png';
$uploadDir = 'teruteru_uploads/';
$filePath = $uploadDir . $filename;

// ファイル保存
if (file_put_contents($filePath, $imageData)) {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // DBにファイル名を保存
        $stmt = $pdo->prepare("INSERT INTO teruteru_bozus (image_filename) VALUES (?)");
        $stmt->execute([$filename]);

        echo json_encode(['status' => 'success', 'filename' => $filename]);
    } catch (PDOException $e) {
        // DBへの保存失敗時は、アップロードしたファイルを削除
        unlink($filePath);
        echo json_encode(['status' => 'error', 'message' => 'データベース保存に失敗しました。']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ファイル保存に失敗しました。']);
}
