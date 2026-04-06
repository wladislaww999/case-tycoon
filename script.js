// Ждем, пока Telegram SDK будет готов
window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    
    // Пытаемся развернуть
    if (tg) {
        tg.ready();
        tg.expand();
    }

    let balance = 100;

    // Список предметов
    const items = [
        { name: 'iPhone 17 PM', img: 'iphone17promax.png', rarity: 'mythic' },
        { name: 'MacBook Pro', img: 'macbook.png', rarity: 'mythic' },
        { name: 'iPhone 17', img: 'iphone17.png', rarity: 'rare' },
        { name: 'iPad Pro', img: 'ipad.png', rarity: 'rare' },
        { name: 'Apple Watch', img: 'applew.png', rarity: 'rare' },
        { name: 'USDT Crypto', img: 'usdt.png', rarity: 'special' },
        { name: 'TG Prem (1y)', img: 'tgprem.png', rarity: 'special' },
        { name: 'TG Stars (5k)', img: 'tgstars.png', rarity: 'special' },
        { name: 'Cash Pack', img: 'coin.png', rarity: 'common' }
    ];

    // Выносим функции в глобальную видимость, чтобы кнопки их видели
    window.addTicketsBatch = function() {
        balance += 10;
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.innerText = balance;
        }
        
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    };

    window.startSpin = function() {
        const messages = [
            "🏦 Хранилище закрыто! Листинг откроет замки. Копи коины!",
            "🚀 Ракета заправляется... Кейсы станут доступны сразу после листинга!",
            "💎 Слишком много золота! Таможня задерживает поставку до запуска токена.",
            "⏳ Терпение, Тайкун! Сейчас время фармить, время открывать придет позже.",
            "🚧 Идут технические работы по погрузке призов. Ожидай листинг!"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        if (tg && tg.showAlert) {
            tg.showAlert(randomMessage);
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('warning');
            }
        } else {
            alert(randomMessage);
        }
    };

    window.toggleInfo = function() {
        const modal = document.getElementById('info-modal');
        if (modal) {
            modal.style.display = (modal.style.display === "block") ? "none" : "block";
        }
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    };
});
