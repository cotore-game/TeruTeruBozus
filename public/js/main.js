document.addEventListener('DOMContentLoaded', () => {
    // キャンバス要素の取得
    const canvasLayer1 = document.getElementById('teruteruCanvasLayer1');
    const canvasLayer2 = document.getElementById('teruteruCanvasLayer2');
    const ctx1 = canvasLayer1.getContext('2d', { willReadFrequently: true });
    const ctx2 = canvasLayer2.getContext('2d', { willReadFrequently: true });

    // UI要素の取得
    const saveButton = document.getElementById('saveButton');
    const colorPalette = document.querySelector('.color-palette');
    const customColorPicker = document.getElementById('customColorPicker');
    const penModeButton = document.getElementById('penMode');
    const eraserModeButton = document.getElementById('eraserMode');
    const penWidthSlider = document.getElementById('penWidth');
    const undoButton = document.getElementById('undoButton');
    const clearButton = document.getElementById('clearButton');
    const layer1Button = document.getElementById('layer1Button');
    const layer2Button = document.getElementById('layer2Button');

    // グローバル状態変数
    let activeCanvas = canvasLayer1;
    let activeCtx = ctx1;
    let currentDrawingMode = 'pen'; // 'pen' or 'eraser'
    let currentColor = '#000000';
    let penWidth = penWidthSlider.value;
    let isDrawing = false;
    let history = [[], []]; // 各レイヤーの操作履歴 (ImageDataを保存)
    const MAX_HISTORY = 10; // 履歴の最大数

    // キャンバスの初期設定
    [canvasLayer1, canvasLayer2].forEach(canvas => {
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = penWidth;
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
        if (history[currentLayerIndex].length > 1) { 
            history[currentLayerIndex].pop(); 
            activeCtx.putImageData(history[currentLayerIndex][history[currentLayerIndex].length - 1], 0, 0);
        } else if (history[currentLayerIndex].length === 1) {
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            history[currentLayerIndex] = [activeCtx.getImageData(0, 0, activeCanvas.width, activeCanvas.height)];
        }
    };

    // キャンバスをクリアする関数
    const clearCanvas = () => {
        if (confirm("現在のレイヤーの内容をすべて消去しますか？")) {
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
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
        isDrawing = true;
        const pos = getPos(e);
        activeCtx.beginPath();
        activeCtx.moveTo(pos.x, pos.y);
    };

    // 描画中
    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        activeCtx.lineTo(pos.x, pos.y);
        activeCtx.stroke();
    };

    // 描画終了
    const stopDrawing = () => {
        if (isDrawing) {
            saveHistory(); // 描画後に履歴を保存
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
            // モードがペンの場合は色を設定、消しゴムの場合はグローバルコンポジションを設定
            if (currentDrawingMode === 'pen') {
                activeCtx.globalCompositeOperation = 'source-over';
                activeCtx.strokeStyle = currentColor;
            } else {
                activeCtx.globalCompositeOperation = 'destination-out';
                activeCtx.strokeStyle = 'rgba(0,0,0,1)';
            }
        }
    });

    // カスタムカラーピッカーのイベントリスナー
    customColorPicker.addEventListener('input', (e) => {
        document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
        currentColor = e.target.value;
        activeCtx.strokeStyle = currentColor;
        if (currentDrawingMode === 'pen') {
            activeCtx.globalCompositeOperation = 'source-over';
            activeCtx.strokeStyle = currentColor;
        } else {
            activeCtx.globalCompositeOperation = 'destination-out';
            activeCtx.strokeStyle = 'rgba(0,0,0,1)';
        }
    });

    // 描画モード切り替え
    penModeButton.addEventListener('click', () => {
        currentDrawingMode = 'pen';
        penModeButton.classList.add('active');
        eraserModeButton.classList.remove('active');
        activeCtx.globalCompositeOperation = 'source-over'; // 通常の描画モード
        activeCtx.strokeStyle = currentColor;
    });

    eraserModeButton.addEventListener('click', () => {
        currentDrawingMode = 'eraser';
        eraserModeButton.classList.add('active');
        penModeButton.classList.remove('active');
        activeCtx.globalCompositeOperation = 'destination-out'; // 消しゴムモード
        activeCtx.strokeStyle = 'rgba(0,0,0,1)'; // 消しゴムは色に関わらず透明に
    });

    // ペンの太さ調整
    penWidthSlider.addEventListener('input', (e) => {
        penWidth = e.target.value;
        activeCtx.lineWidth = penWidth;
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
        activeCtx.lineWidth = penWidth;
        activeCtx.lineCap = 'round';
        if (currentDrawingMode === 'pen') {
            activeCtx.globalCompositeOperation = 'source-over';
            activeCtx.strokeStyle = currentColor;
        } else {
            activeCtx.globalCompositeOperation = 'destination-out';
            activeCtx.strokeStyle = 'rgba(0,0,0,1)';
        }
    };

    layer1Button.addEventListener('click', () => setActiveLayer(1));
    layer2Button.addEventListener('click', () => setActiveLayer(2));

    // 初期アクティブレイヤー設定
    setActiveLayer(1);

    // 投稿ボタンのクリックイベント
    saveButton.addEventListener('click', () => {
        if (confirm("投稿しますか？")) {
            const mergedCanvas = document.createElement('canvas');
            mergedCanvas.width = canvasLayer1.width;
            mergedCanvas.height = canvasLayer1.height;
            const mergedCtx = mergedCanvas.getContext('2d');
            mergedCtx.drawImage(canvasLayer1, 0, 0);
            mergedCtx.drawImage(canvasLayer2, 0, 0);

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
                    ctx1.clearRect(0, 0, canvasLayer1.width, canvasLayer1.height);
                    ctx2.clearRect(0, 0, canvasLayer2.width, canvasLayer2.height);
                    history = [[ctx1.getImageData(0,0,canvasLayer1.width,canvasLayer1.height)], [ctx2.getImageData(0,0,canvasLayer2.width,canvasLayer2.height)]];
                    setActiveLayer(1);
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
});
