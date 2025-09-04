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
                    <div class="color-box active" data-color="#000000" style="background-color: #000000;"></div>
                    <div class="color-box" data-color="#FFFFFF" style="background-color: #FFFFFF;"></div>
                    <div class="color-box" data-color="#FF0000" style="background-color: #FF0000;"></div>
                    <div class="color-box" data-color="#0000FF" style="background-color: #0000FF;"></div>
                    <div class="color-box" data-color="#008000" style="background-color: #008000;"></div>
                    <div class="color-box" data-color="#FFFF00" style="background-color: #FFFF00;"></div>
                    <div class="color-box" data-color="#FFA500" style="background-color: #FFA500;"></div>
                    <div class="color-box" data-color="#800080" style="background-color: #800080;"></div>
                    <div class="color-box" data-color="#A52A2A" style="background-color: #A52A2A;"></div>
                    <div class="color-box" data-color="#FFC0CB" style="background-color: #FFC0CB;"></div>
                    <input type="color" id="customColorPicker" value="#000000">
                </div>
                <div class="drawing-tools">
                    <button id="penMode" class="tool-button active">ペン</button>
                    <button id="eraserMode" class="tool-button">消しゴム</button>
                    <label for="penWidth">太さ:</label>
                    <input type="range" id="penWidth" min="1" max="20" value="4">
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
            <canvas id="teruteruCanvasLayer1" class="drawing-canvas" will-read-frequently="true"></canvas>
            <canvas id="teruteruCanvasLayer2" class="drawing-canvas" will-read-frequently="true"></canvas>
        </div>
        <button id="saveButton">投稿する</button>
    </div>
    
    <hr>
    
    <a href="teruteru_gallery.php" class="gallery-button">みんなのてるてる坊主ギャラリーへ</a>

    <script src="js/main.js"></script>
</body>
</html>
