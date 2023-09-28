import { HammerShards } from './HammerShards.js';

const game = new HammerShards();

function updateUI() {
    // Check if the HTML elements exist before trying to set their innerHTML.
    const shardsElement = document.getElementById('shards');
    const hammerCountElement = document.getElementById('hammerCount');
    const prestigePointsElement = document.getElementById('prestigePoints');
    const epicHammerBonusElement = document.getElementById('epicHammerBonus');
    const createHammerButton = document.getElementById('createHammerButton');
    const prestigeButton = document.getElementById('prestigeButton');

    if (shardsElement) {
        shardsElement.innerHTML = game.getShards().toFixed(2);
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

    // Disable the buttons if they need to be disabled.
    createHammerButton.disabled = game.isButtonDisabled('createHammerButton');
    prestigeButton.disabled = game.isButtonDisabled('prestigeButton');
}

// Add event listeners to the buttons.
document.getElementById('collectShardsButton').addEventListener('click', () => game.collectShards());
document.getElementById('createHammerButton').addEventListener('click', () => game.createHammer());
document.getElementById('prestigeButton').addEventListener('click', () => game.prestige());

// Update the UI every second.
setInterval(updateUI, 1000);
