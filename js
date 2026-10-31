
const players = [
    { name: "Role Player", ovr: 55, rarity: "Common", chance: 40 },
    { name: "Starter", ovr: 65, rarity: "Common", chance: 25 },
    { name: "Jamal Murray", ovr: 80, rarity: "Rare", chance: 15 },
    { name: "De'Aaron Fox", ovr: 85, rarity: "Epic", chance: 10 },
    { name: "Luka Doncic", ovr: 92, rarity: "Legendary", chance: 6 },
    { name: "LeBron James", ovr: 96, rarity: "Mythic", chance: 3 },
    { name: "Stephen Curry", ovr: 99, rarity: "GOAT", chance: 1 }
];

let coins = Number(localStorage.getItem("coins")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const coinDisplay = document.getElementById("coins");
const bestDisplay = document.getElementById("best");
const totalDisplay = document.getElementById("total");
const inventoryDisplay = document.getElementById("inventory");
const result = document.getElementById("result");
const message = document.getElementById("message");
const rollButton = document.getElementById("roll-button");

const sellValues = {
    Common: 5,
    Rare: 15,
    Epic: 35,
    Legendary: 75,
    Mythic: 150,
    GOAT: 500
};

function saveGame() {
    localStorage.setItem("coins", coins);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function updateStats() {
    coinDisplay.textContent = coins;
    totalDisplay.textContent = inventory.length;

    const best = inventory.length
        ? Math.max(...inventory.map(p => p.ovr))
        : 0;

    bestDisplay.textContent = best;

    saveGame();
    renderInventory();
}

function getRandomPlayer() {
    let random = Math.random() * 100;
    let total = 0;

    for (const player of players) {
        total += player.chance;

        if (random < total) {
            return player;
        }
    }

    return players[0];
}

function rollPlayer() {
    if (coins < 10) {
        message.textContent = "Not enough coins!";
        return;
    }

    rollButton.disabled = true;
    coins -= 10;

    message.textContent = "Rolling...";

    result.innerHTML = `
        <div class="player-card">
            <div class="basketball">🏀</div>
            <h2>???</h2>
            <div class="ovr">?</div>
            <p class="rarity">UNKNOWN</p>
        </div>
    `;

    updateStats();

    setTimeout(() => {
        const selected = getRandomPlayer();

        const newPlayer = {
            ...selected,
            id: Date.now() + Math.random()
        };

        inventory.push(newPlayer);

        result.innerHTML = `
            <div class="player-card ${selected.rarity.toLowerCase()}">
                <div class="basketball">🏀</div>
                <h2>${selected.name}</h2>
                <div class="ovr">${selected.ovr}</div>
                <p class="rarity">${selected.rarity.toUpperCase()}</p>
            </div>
        `;

        message.textContent = `You pulled ${selected.name}!`;

        rollButton.disabled = false;
        updateStats();

    }, 700);
}

function sellPlayer(id) {
    const index = inventory.findIndex(p => p.id === id);

    if (index === -1) return;

    const player = inventory[index];

    coins += sellValues[player.rarity];

    inventory.splice(index, 1);

    message.textContent = `Sold ${player.name} for ${sellValues[player.rarity]} coins!`;

    updateStats();
}

function renderInventory() {
    if (inventory.length === 0) {
        inventoryDisplay.innerHTML =
            '<p class="empty">Your collection is empty.</p>';
        return;
    }

    inventoryDisplay.innerHTML = inventory.map(player => `
        <div class="player-item ${player.rarity.toLowerCase()}">
            <div class="basketball">🏀</div>
            <h3>${player.name}</h3>
            <p>${player.ovr} OVR</p>
            <p>${player.rarity}</p>
            <button data-id="${player.id}">Sell (${sellValues[player.rarity]})</button>
        </div>
    `).join("");
}

rollButton.addEventListener("click", rollPlayer);

inventoryDisplay.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");

    if (!button) return;

    sellPlayer(Number(button.dataset.id));
});

updateStats();
