document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const teruteruImages = document.querySelectorAll('.teruteru-image');
    
    // 1. 天気を「晴れ」か「雨」にランダムに決定
    const conditions = ['clear', 'rain'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // 2. ローカル時刻で時間帯を決定
    const now = new Date();
    const hours = now.getHours();
    let timeOfDay = '';
    
    if (hours >= 6 && hours < 18) {
        timeOfDay = 'day'; // 昼 (6:00 - 17:59)
    } else {
        timeOfDay = 'night'; // 夜 (18:00 - 5:59)
    }
    
    // 3. ボディにクラスを付与してCSSを適用
    body.classList.add(timeOfDay, randomCondition);
    
    // 4. 雨の場合はパーティクルを動的に生成
    if (randomCondition === 'rain') {
        const rainCount = 100;
        for (let i = 0; i < rainCount; i++) {
            const rainDrop = document.createElement('div');
            rainDrop.classList.add('rain-particle');
            rainDrop.style.left = `${Math.random() * 100}vw`;
            rainDrop.style.animationDuration = `${0.5 + Math.random()}s`;
            rainDrop.style.animationDelay = `${Math.random() * 2}s`;
            body.appendChild(rainDrop);
        }
    }
});
