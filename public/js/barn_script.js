document.addEventListener('DOMContentLoaded', () => {
    const teruteruImg = document.getElementById('teruteru-img');
    const message = document.getElementById('message');
    
    // 画像が画面に表示されてからアニメーションを開始
    setTimeout(() => {
        teruteruImg.classList.add('burn');
    }, 1000); // 1秒後に燃焼開始

    // アニメーション完了後にメッセージとボタンを表示
    teruteruImg.addEventListener('transitionend', () => {
        message.classList.remove('hidden');
        homeButton.classList.remove('hidden');
    });
});
