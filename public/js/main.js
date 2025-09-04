document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('teruteruCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveButton');

    let isDrawing = false;
    
    // キャンバスの初期設定
    canvas.width = 300;
    canvas.height = 300;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    // マウス/タッチイベント
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || e.touches[0].clientX) - rect.left,
            y: (e.clientY || e.touches[0].clientY) - rect.top
        };
    };

    const startDrawing = (e) => {
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // 投稿ボタンのクリックイベント
    saveButton.addEventListener('click', () => {
        if (confirm("投稿しますか？")) {
            const imageDataURL = canvas.toDataURL('image/png');
            
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
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
                    // ページの再読み込みなどで最新のリストを表示する
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
