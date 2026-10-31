
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
const card = document.getElementById("player-card");
const message = document.getElementById("message");
const rollButton = document.getElementById("roll-button");

function saveGame() {
    localStorage.setItem("coins", coins);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function updateStats() {
    coinDisplay.textContent = coins;
    totalDisplay.textContent = inventory.length;

    let best = inventory.length
        ? Math.max(...inventory.map(p => p.ovr))
        : 0;

    bestDisplay.textContent = best;

    saveGame();
    renderInventory();
}

function rollPlayer() {
    if (coins < 10) {
        message.textContent = "Not enough coins!";
        return;
    }

    coins -= 10;

    let random = Math.random() * 100;
    let total = 0;
    let selected = players[0];

    for (let player of players) {
        total += player.chance;

        if (random < total) {
            selected = player;
            break;
        }
    }

    inventory.push({
        ...selected,
        id: Date.now() + Math.random()
    });

    card.innerHTML = `
        <div class="basketball">🏀</div>
        <h2>${selected.name}</h2>
        <h1>${selected.ovr} OVR</h1>
        <p>${selected.rarity}</p>
    `;

    card.className = "player-card " + selected.rarity.toLowerCase();

    message.textContent = `You pulled ${selected.name}!`;

    updateStats();
}

function sellPlayer(id) {
    let index = inventory.findIndex(p => p.id === id);

    if (index === -1) return;

    let player = inventory[index];

    let values = {
        Common: 5,
        Rare: 15,
        Epic: 35,
        Legendary: 75,
        Mythic: 150,
        GOAT: 500
    };

    coins += values[player.rarity];

    inventory.splice(index, 1);

    message.textContent = `Sold ${player.name}!`;

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
            <div>🏀</div>
            <h3>${player.name}</h3>
            <p>${player.ovr} OVR</p>
            <p>${player.rarity}</p>
            <button onclick="sellPlayer(${player.id})">
                Sell
            </button>
        </div>
    `).join("");
}

rollButton.addEventListener("click", rollPlayer);

updateStats();

