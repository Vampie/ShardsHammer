class HammerShards {
    constructor() {
        this.shards = 0;
        this.hammerCount = 0;
        this.prestigePoints = 0;
        this.epicHammerBonus = 0;
        this.epicHammerCostMultiplier = 1;
    }

    collectShards() {
        // Multiply the number of shards collected by the epic hammer bonus.
        this.shards += Math.floor(Math.random() * 10) + 1;
        this.shards *= 1 + this.epicHammerBonus;
    }

    createHammer() {
        // Multiply the cost of creating a hammer by 1 + the epic hammer bonus.
        const hammerCost = 100 * (1 + this.epicHammerBonus);

        if (this.shards >= hammerCost) {
            if (this.shards >= 500) {
                // Create an epic hammer.
                this.epicHammerBonus += 0.25;
                this.epicHammerCostMultiplier += 0.25;
            }

            this.hammerCount += 1;
            this.shards -= hammerCost;
        }
    }

    prestige() {
        // Multiply the cost of creating an epic hammer by 1 + the prestige points.
        this.epicHammerCostMultiplier += 0.25;

        this.prestigePoints += this.hammerCount;
        this.hammerCount = 0;
    }

    getShards() {
        return this.shards;
    }

    getHammerCount() {
        return this.hammerCount;
    }

    getPrestigePoints() {
        return this.prestigePoints;
    }

    getEpicHammerBonus() {
        return this.epicHammerBonus;
    }

    getEpicHammerCostMultiplier() {
        return this.epicHammerCostMultiplier;
    }
}

const game = new HammerShards();

function updateUI() {
    // Check if the HTML elements exist before trying to set their innerHTML.
    const shardsElement = document.getElementById('shards');
    const hammerCountElement = document.getElementById('hammer-count');
    const prestigePointsElement = document.getElementById('prestige-points');
    const epicHammerBonusElement = document.getElementById('epic-hammer-bonus');

    if (shardsElement) {
        shardsElement.innerHTML = game.getShards();
    }

    if (hammerCountElement) {
        hammerCountElement.innerHTML = game.getHammerCount();
    }

    if (prestigePointsElement) {
        prestigePointsElement.innerHTML = game.getPrestigePoints();
    }

    if (epicHammerBonusElement) {
        epicHammerBonusElement.innerHTML = game.getEpicHammerBonus();
    }

    // Disable the buttons if they can't use them.
    const collectShardsButton = document.getElementById('collect-shards-button');
    collectShardsButton.disabled = game.getShards() === 0;

    const createHammerButton = document.getElementById('create-hammer-button');
    createHammerButton.disabled = game.getShards() < 100 * (1 + game.getEpicHammerBonus());

    const prestigeButton = document.getElementById('prestige-button');
    prestigeButton.disabled = game.getHammerCount() === 0;
}

function collectShards() {
    game.collectShards();
    updateUI();
}

function createHammer() {
    game.createHammer();
    updateUI();
}

function prestige() {
    game.prestige();
    updateUI();
}

// Update the UI once the page has loaded.
document.addEventListener('DOMContentLoaded', updateUI);

// Add event listeners to the buttons.
document.getElementById('collect-shards-button').addEventListener('click', collectShards);
document.getElementById('create-hammer-button').addEventListener('click', createHammer);
document.getElementById('prestige-button').addEventListener('click', prestige);
