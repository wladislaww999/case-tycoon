// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // РАЗВЕРНУТЬ НА ВЕСЬ ЭКРАН СРАЗУ

let balance = 100;

const items = [
    { name: 'iPhone 15 Pro', img: 'iphone.png', rarity: 'mythic' },
    { name: 'Dyson Airwrap', img: 'dyson.png', rarity: 'mythic' },
    { name: 'Apple Watch 9', img: 'apple-watch.png', rarity: 'rare' },
    { name: '100 🎫', img: 'ticket-gold.png', rarity: 'common' },
    { name: '50 🎫', img: 'ticket-gold.png', rarity: 'common' }
];

function addTicketsBatch() {
    balance += 10;
    document.getElementById('balance').innerText = balance;
}

function startSpin() {
    if (balance < 10) {
        alert("Недостаточно тикетов! Нужно 10 🎫");
        return;
    }

    balance -= 10;
    document.getElementById('balance').innerText = balance;

    const zone = document.getElementById('display-zone');
    zone.innerHTML = `
        <div class="roulette-wrapper">
            <div class="roulette-line" id="line"></div>
        </div>
    `;
    
    const line = document.getElementById('line');
    let tapeContent = "";
    
    for(let i=0; i<80; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const imgTag = (item.img && item.img.includes('.png')) 
            ? `<img src="${item.img}">` 
            : `<div style="font-size:40px">🎫</div>`;
        tapeContent += `<div class="item-card ${item.rarity}">${imgTag}</div>`;
    }
    line.innerHTML = tapeContent;

    setTimeout(() => {
        line.style.left = "-7500px"; 
    }, 50);

    setTimeout(() => {
        const winAmount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        alert(`Почти! Выпало: ${winAmount} Билетов 🎫`);
        balance += winAmount;
        // Вместо полной перезагрузки, просто возвращаем кейс, чтобы экран не "прыгал"
        zone.innerHTML = '<img src="bronze-case-real.png" class="main-case-img" id="case-img" alt="Case">';
        document.getElementById('balance').innerText = balance;
    }, 5500);
}

function toggleInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}
