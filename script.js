const tg = window.Telegram.WebApp;
tg.expand(); 

let balance = 100;

const items = [
    { name: 'iPhone 17 PM', img: 'iphone17promax.png', rarity: 'mythic' },
    { name: 'MacBook Pro', img: 'macbook.png', rarity: 'mythic' },
    { name: 'iPhone 17', img: 'iphone17.png', rarity: 'rare' },
    { name: 'iPad Pro', img: 'ipad.png', rarity: 'rare' },
    { name: 'Apple Watch', img: 'applew.png', rarity: 'rare' },
    { name: 'USDT', img: 'usdt.png', rarity: 'special' },
    { name: 'TG Premium', img: 'tgprem.png', rarity: 'special' },
    { name: 'TG Stars', img: 'tgstars.png', rarity: 'special' },
    { name: 'Cash Pack', img: 'dollar.png', rarity: 'common' }
];

function addTicketsBatch() {
    balance += 10;
    document.getElementById('balance').innerText = balance;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function startSpin() {
    if (balance < 100) {
        tg.showAlert("Недостаточно средств! Нужно 100 $");
        return;
    }

    balance -= 100;
    document.getElementById('balance').innerText = balance;

    const zone = document.getElementById('display-zone');
    zone.innerHTML = `<div class="roulette-wrapper"><div class="roulette-line" id="line"></div></div>`;
    
    const line = document.getElementById('line');
    let tapeContent = "";
    
    for(let i=0; i<80; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        tapeContent += `
            <div class="item-card ${item.rarity}">
                <img src="${item.img}">
                <p>${item.name}</p>
            </div>`;
    }
    line.innerHTML = tapeContent;

    setTimeout(() => {
        line.style.left = "-7500px"; 
    }, 50);

    setTimeout(() => {
        // МАТЕМАТИКА: ВЫПАДАЕТ ОТ 50 ДО 70
        const winAmount = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
        tg.showAlert(`Почти! Выпал предмет: Набор Валюты \n\nЗачислено: ${winAmount} $`);
        
        balance += winAmount;
        document.getElementById('balance').innerText = balance;
        
        zone.innerHTML = '<img src="casetycoon.png" class="main-case-img" id="case-img" alt="Case">';
    }, 5500);
}

function toggleInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}
