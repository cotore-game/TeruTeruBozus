document.addEventListener('DOMContentLoaded', () => {
    // キャンバス要素の取得
    const canvasLayer1 = document.getElementById('teruteruCanvasLayer1');
    const canvasLayer2 = document.getElementById('teruteruCanvasLayer2');
    const ctx1 = canvasLayer1.getContext('2d');
    const ctx2 = canvasLayer2.getContext('2d');

    // UI要素の取得
    const saveButton = document.getElementById('saveButton');
    const colorPalette = document.querySelector('.color-palette');
    const customColorPicker = document.getElementById('customColorPicker');
    const drawModeButton = document.getElementById('drawMode');
    const fillModeButton = document.getElementById('fillMode');
    const undoButton = document.getElementById('undoButton');
    const clearButton = document.getElementById('clearButton');
    const layer1Button = document.getElementById('layer1Button');
    const layer2Button = document.getElementById('layer2Button');

    // グローバル状態変数
    let activeCanvas = canvasLayer1;
    let activeCtx = ctx1;
    let currentDrawingMode = 'draw'; // 'draw' or 'fill'
    let currentColor = '#000000';
    let isDrawing = false;
    let history = [[], []]; // 各レイヤーの操作履歴 (ImageDataを保存)
    const MAX_HISTORY = 10; // 履歴の最大数

    // キャンバスの初期設定
    [canvasLayer1, canvasLayer2].forEach(canvas => {
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
    });

    // レイヤー初期化時に透明にする
    ctx1.clearRect(0, 0, canvasLayer1.width, canvasLayer1.height);
    ctx2.clearRect(0, 0, canvasLayer2.width, canvasLayer2.height);

    // 履歴を保存する関数
    const saveHistory = () => {
        const currentLayerIndex = activeCanvas === canvasLayer1 ? 0 : 1;
        if (history[currentLayerIndex].length >= MAX_HISTORY) {
            history[currentLayerIndex].shift(); // 古い履歴を削除
        }
        history[currentLayerIndex].push(activeCtx.getImageData(0, 0, activeCanvas.width, activeCanvas.height));
    };

    // 初期状態を履歴に保存
    saveHistory();

    // 履歴から元に戻す関数
    const undo = () => {
        const currentLayerIndex = activeCanvas === canvasLayer1 ? 0 : 1;
        if (history[currentLayerIndex].length > 1) { // 少なくとも1つ前の状態がある場合
            history[currentLayerIndex].pop(); // 現在の状態を削除
            activeCtx.putImageData(history[currentLayerIndex][history[currentLayerIndex].length - 1], 0, 0);
        } else if (history[currentLayerIndex].length === 1) {
            // 最初の状態（クリア状態）に戻す
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            history[currentLayerIndex] = [activeCtx.getImageData(0, 0, activeCanvas.width, activeCanvas.height)];
        }
    };

    // キャンバスをクリアする関数
    const clearCanvas = () => {
        if (confirm("現在のレイヤーの内容をすべて消去しますか？")) {
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            // 履歴もクリア状態にする
            const currentLayerIndex = activeCanvas === canvasLayer1 ? 0 : 1;
            history[currentLayerIndex] = [activeCtx.getImageData(0, 0, activeCanvas.width, activeCanvas.height)];
        }
    };


    // マウス/タッチ座標の取得
    const getPos = (e) => {
        const rect = activeCanvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    // 描画開始
    const startDrawing = (e) => {
        e.preventDefault(); // スクロール防止
        isDrawing = true;
        const pos = getPos(e);
        if (currentDrawingMode === 'draw') {
            activeCtx.beginPath();
            activeCtx.moveTo(pos.x, pos.y);
        } else if (currentDrawingMode === 'fill') {
            floodFill(activeCtx, pos.x, pos.y, hexToRgba(currentColor));
            saveHistory(); // 塗りつぶし後に履歴を保存
        }
    };

    // 描画中
    const draw = (e) => {
        if (!isDrawing || currentDrawingMode === 'fill') return; // 塗りつぶしモードでは描画しない
        e.preventDefault();
        const pos = getPos(e);
        activeCtx.lineTo(pos.x, pos.y);
        activeCtx.stroke();
    };

    // 描画終了
    const stopDrawing = () => {
        if (isDrawing && currentDrawingMode === 'draw') {
            saveHistory(); // フリーハンド描画後に履歴を保存
        }
        isDrawing = false;
    };

    // イベントリスナー設定
    [canvasLayer1, canvasLayer2].forEach(canvas => {
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
    });

    // カラーパレットのイベントリスナー
    colorPalette.addEventListener('click', (e) => {
        const targetColorBox = e.target.closest('.color-box');
        if (targetColorBox) {
            document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
            targetColorBox.classList.add('active');
            currentColor = targetColorBox.dataset.color;
            activeCtx.strokeStyle = currentColor;
        }
    });

    // カスタムカラーピッカーのイベントリスナー
    customColorPicker.addEventListener('input', (e) => {
        document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
        currentColor = e.target.value;
        activeCtx.strokeStyle = currentColor;
    });

    // 描画モード切り替え
    drawModeButton.addEventListener('click', () => {
        currentDrawingMode = 'draw';
        drawModeButton.classList.add('active');
        fillModeButton.classList.remove('active');
        [canvasLayer1, canvasLayer2].forEach(canvas => canvas.style.cursor = 'crosshair');
    });

    fillModeButton.addEventListener('click', () => {
        currentDrawingMode = 'fill';
        fillModeButton.classList.add('active');
        drawModeButton.classList.remove('active');
        [canvasLayer1, canvasLayer2].forEach(canvas => canvas.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'%23000\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-12h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z\'/%3E%3C/svg%3E") 12 12, auto');
    });

    // 元に戻すボタン
    undoButton.addEventListener('click', undo);

    // 全消去ボタン
    clearButton.addEventListener('click', clearCanvas);

    // レイヤー切り替え
    const setActiveLayer = (layerNum) => {
        if (layerNum === 1) {
            activeCanvas = canvasLayer1;
            activeCtx = ctx1;
            layer1Button.classList.add('active');
            layer2Button.classList.remove('active');
            canvasLayer1.style.zIndex = 2; // アクティブレイヤーを上にする
            canvasLayer2.style.zIndex = 1;
        } else {
            activeCanvas = canvasLayer2;
            activeCtx = ctx2;
            layer2Button.classList.add('active');
            layer1Button.classList.remove('active');
            canvasLayer2.style.zIndex = 2; // アクティブレイヤーを上にする
            canvasLayer1.style.zIndex = 1;
        }
        // 現在の色と描画スタイルをアクティブコンテキストに適用
        activeCtx.strokeStyle = currentColor;
        activeCtx.lineWidth = 4;
        activeCtx.lineCap = 'round';
    };

    layer1Button.addEventListener('click', () => setActiveLayer(1));
    layer2Button.addEventListener('click', () => setActiveLayer(2));

    // 初期アクティブレイヤー設定
    setActiveLayer(1);

    // 投稿ボタンのクリックイベント
    saveButton.addEventListener('click', () => {
        if (confirm("投稿しますか？")) {
            // 2つのレイヤーを統合するための新しいキャンバスを作成
            const mergedCanvas = document.createElement('canvas');
            mergedCanvas.width = canvasLayer1.width;
            mergedCanvas.height = canvasLayer1.height;
            const mergedCtx = mergedCanvas.getContext('2d');

            // レイヤー1を描画
            mergedCtx.drawImage(canvasLayer1, 0, 0);
            // レイヤー2を描画（レイヤー1の上に重ねる）
            mergedCtx.drawImage(canvasLayer2, 0, 0);

            // 統合された画像を透過PNGとして取得
            const imageDataURL = mergedCanvas.toDataURL('image/png');
            
            fetch('save_teruteru.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'image=' + encodeURIComponent(imageDataURL)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('投稿しました！');
                    // 両方のキャンバスをクリアし、履歴もリセット
                    ctx1.clearRect(0, 0, canvasLayer1.width, canvasLayer1.height);
                    ctx2.clearRect(0, 0, canvasLayer2.width, canvasLayer2.height);
                    history = [[ctx1.getImageData(0,0,canvasLayer1.width,canvasLayer1.height)], [ctx2.getImageData(0,0,canvasLayer2.width,canvasLayer2.height)]];
                    setActiveLayer(1); // レイヤー1をアクティブに戻す
                    location.reload(); 
                } else {
                    alert('投稿に失敗しました: ' + data.message);
                }
            })
            .catch(error => {
                console.error('通信エラー:', error);
                alert('通信に失敗しました。');
            });
        }
    });


    // --- 塗りつぶし (Flood Fill Algorithm) の実装 ---
    // 参考: https://www.mikechambers.com/blog/2010/06/27/html5-canvas-and-javascript-image-fill-tool/

    function floodFill(ctx, x, y, fillColor) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        const startPos = (y * width + x) * 4;
        const startColor = [data[startPos], data[startPos + 1], data[startPos + 2], data[startPos + 3]];

        // 塗りつぶし色が開始色と同じ場合は何もしない
        if (
            startColor[0] === fillColor[0] &&
            startColor[1] === fillColor[1] &&
            startColor[2] === fillColor[2] &&
            startColor[3] === fillColor[3]
        ) {
            return;
        }

        const q = [[x, y]]; // 塗りつぶし領域のキュー
        let pixel;
        let reachLeft, reachRight;

        while (q.length) {
            pixel = q.pop();
            x = pixel[0];
            y = pixel[1];

            let curPos = (y * width + x) * 4;
            // 上端に到達、または現在の色が異なる場合は次のピクセルへ
            while (y >= 0 && matchColor(curPos, startColor, data)) {
                curPos -= width * 4;
                y--;
            }

            curPos += width * 4;
            y++;
            reachLeft = false;
            reachRight = false;

            while (y < height && matchColor(curPos, startColor, data)) {
                setColor(curPos, fillColor, data);

                if (x > 0) {
                    if (matchColor(curPos - 4, startColor, data)) {
                        if (!reachLeft) {
                            q.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < width - 1) {
                    if (matchColor(curPos + 4, startColor, data)) {
                        if (!reachRight) {
                            q.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                curPos += width * 4;
                y++;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function matchColor(pos, color, data) {
        // アルファ値を考慮して色を比較
        // 許容誤差を設定することも可能 (例: Math.abs(data[pos] - color[0]) < tolerance)
        return data[pos] === color[0] &&
               data[pos + 1] === color[1] &&
               data[pos + 2] === color[2] &&
               data[pos + 3] === color[3];
    }

    function setColor(pos, color, data) {
        data[pos] = color[0];
        data[pos + 1] = color[1];
        data[pos + 2] = color[2];
        data[pos + 3] = color[3];
    }

    // HexカラーコードをRGBA配列に変換
    function hexToRgba(hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255]; // アルファ値は常に255 (不透明)
        }
        throw new Error('Bad Hex');
    }

    // 初期設定でレイヤー1をアクティブにする
    setActiveLayer(1);
});
