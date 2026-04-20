// Инициализация Supabase
const SUPABASE_URL = 'https://lfuyzmlkdwjivaxxcir.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXl6bWxka3dqaXd2YXh4Y2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjkyMzYsImV4cCI6MjA5MDIwNTIzNn0.1eR2hatEDe4vPYZc_wSNYtEha1dTmVtlT1onNYzvhDQ';
const ADSGRAM_BLOCK_ID = '28176';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    if (tg) { 
        tg.ready(); 
        tg.expand(); 
    }

    let balance = 0;

    async function syncData() {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;
        try {
            let { data: dbUser } = await supabaseClient.from('users').select('*').eq('tg_id', user.id).single();
            if (!dbUser) {
                const inviterId = tg.initDataUnsafe.start_param ? parseInt(tg.initDataUnsafe.start_param) : null;
                const { data: newUser } = await supabaseClient.from('users').insert([{ 
                    tg_id: user.id, username: user.username || 'Игрок', balance: 100, inviter_id: inviterId 
                }]).select().single();
                dbUser = newUser;
            }
            if (dbUser) {
                balance = dbUser.balance;
                const balanceEl = document.getElementById('balance');
                if (balanceEl) balanceEl.innerText = balance.toLocaleString();
            }
        } catch (e) { console.error("Ошибка синхронизации:", e); }
    }

    syncData();

    window.addTicketsBatch = function() {
        const user = tg.initDataUnsafe?.user;
        if (!user || !window.Adsgram) return;
        const btn = document.querySelector('.blue-btn');
        if (btn) btn.disabled = true;
        const AdController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        AdController.show().then(async () => {
            await supabaseClient.rpc('claim_ad_reward', { user_id: user.id });
            await syncData();
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            if (btn) btn.disabled = false;
        }).catch(() => { if (btn) btn.disabled = false; });
    };

    // --- УЛУЧШЕННЫЕ ЗАДАНИЯ ---
    window.renderTasks = async function() {
        const container = document.getElementById('task-list');
        if (!container) return;
        container.innerHTML = "<div style='text-align:center;'>Загрузка...</div>";
        const user = tg.initDataUnsafe?.user;
        if (!user) return;

        try {
            const { data: allTasks } = await supabaseClient.from('tasks').select('*').order('id', { ascending: true });
            const { data: doneTasks } = await supabaseClient.from('user_tasks').select('task_key').eq('user_tg_id', user.id);
            const doneKeys = doneTasks ? doneTasks.map(t => t.task_key) : [];

            if (!allTasks) return;

            container.innerHTML = allTasks.map(t => {
                const isDone = doneKeys.includes(t.key);
                let finalLink = t.link;

                // Если задание про друзей — делаем кнопку-поделиться с рефералкой
                if (t.key.includes('invite')) {
                    finalLink = `https://t.me/share/url?url=https://t.me/CaseTycoon_bot?start=${user.id}&text=Заходи в Case Tycoon!`;
                }

                return `
                    <div class="loot-item" style="opacity: ${isDone ? '0.6' : '1'};">
                        <div style="flex:1">
                            <div style="font-weight:700;">${t.title}</div>
                            <div style="color: #ffd700; font-weight: 900;">+${t.reward.toLocaleString()} 🪙</div>
                        </div>
                        <button class="action-btn" 
                            style="width: auto; padding: 8px 15px; ${isDone ? 'background: #444;' : ''}"
                            onclick="${isDone ? '' : `window.doTask('${t.key}', '${finalLink}')`}" 
                            ${isDone ? 'disabled' : ''}>
                            ${isDone ? 'ГОТОВО' : 'ВЫПОЛНИТЬ'}
                        </button>
                    </div>
                `;
            }).join('');
        } catch (err) { console.error(err); }
    };

    window.doTask = async function(key, link) {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;

        // Если это соцсеть или приглашение — открываем ссылку
        if (link && link !== '#') {
            tg.openTelegramLink(link);
        }

        tg.showAlert("Проверка... Награда будет начислена через 5 секунд");

        setTimeout(async () => {
            const { data } = await supabaseClient.rpc('claim_task_reward', { u_id: user.id, t_key: key });
            if (data?.success) {
                await syncData();
                window.renderTasks();
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('success');
                tg.showAlert(`✅ Выполнено! +${data.reward} 🪙`);
            } else {
                tg.showAlert(data?.message || "Условие не выполнено");
            }
        }, 5000);
    };

    window.toggleModal = function(id) {
        const m = document.getElementById(id);
        if (!m) return;
        const isOpen = m.style.display === "block";
        m.style.display = isOpen ? "none" : "block";
        if (!isOpen) {
            if (id === 'tasks-modal') window.renderTasks();
            if (id === 'leaderboard-modal') renderLeaderboard();
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    };

    window.toggleInfo = () => window.toggleModal('info-modal');
    window.toggleTasks = () => window.toggleModal('tasks-modal');
    window.toggleLeaderboard = () => window.toggleModal('leaderboard-modal');
    window.toggleReferral = () => window.toggleModal('referral-modal');

    window.startSpin = function() {
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
        const msgs = ["🏦 Хранилище закрыто!", "🚀 Ракета заправляется...", "💎 Ожидай листинг!"];
        tg.showAlert(msgs[Math.floor(Math.random() * msgs.length)]);
    };

    async function renderLeaderboard() {
        const container = document.getElementById('leader-list');
        if (!container) return;
        const { data: tops } = await supabaseClient.from('users').select('username, balance').order('balance', { ascending: false }).limit(10);
        if (!tops) return;
        container.innerHTML = tops.map((l, i) => `
            <div class="loot-item">
                <div class="rank-num ${i < 3 ? 'top-' + (i+1) : ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</div>
                <div style="flex:1; font-weight:700;">${l.username}</div>
                <div style="font-weight:900;">${l.balance.toLocaleString()} 🪙</div>
            </div>
        `).join('');
    }

    window.copyLink = function() {
        const userId = tg.initDataUnsafe?.user?.id || '0';
        const link = `https://t.me/CaseTycoon_bot?start=${userId}`;
        const i = document.createElement("input");
        i.value = link; document.body.appendChild(i); i.select();
        document.execCommand("copy"); document.body.removeChild(i);
        tg.showAlert("✅ Ссылка скопирована!");
    };
});
