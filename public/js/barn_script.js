document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const teruteruImages = document.querySelectorAll('.teruteru-image');
    const message = document.getElementById('message');
    
    // 燃焼アニメーションの開始
    setTimeout(() => {
        body.classList.add('burning');
        teruteruImages.forEach((img, index) => {
            // 個々のてるてる坊主の燃焼開始をランダムに遅延させる
            setTimeout(() => {
                img.classList.add('burn');
            }, 500 * index);
        });
    }, 1000); // 1秒後に燃焼開始

    // すべてのてるてる坊主が燃え尽きた後に処理
    let burnedCount = 0;
    const totalImages = teruteruImages.length;
    
    teruteruImages.forEach(img => {
        img.addEventListener('transitionend', () => {
            burnedCount++;
            if (burnedCount === totalImages) {
                // すべてのてるてる坊主が燃え尽きた
                body.classList.remove('burning');
                message.classList.remove('hidden');
            }
        }, { once: true });
    });

    // ボタンクリックでホームへ戻る
    homeButton.addEventListener('click', () => {
        window.location.href = 'teruteru_maker.php';
    });
});
