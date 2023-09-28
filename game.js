// Create a new instance of the HammerShards class.
const game = new HammerShards();

// Update the UI every second.
//setInterval(updateUI, 1000);

// Add event listeners to the buttons.
document.getElementById('collectShardsButton').addEventListener('click', () => { game.collectShards(); updateUI() });
document.getElementById('createHammerButton').addEventListener('click', () => { game.createHammer(); updateUI() });
document.getElementById('prestigeButton').addEventListener('click', () => { game.prestige(); updateUI() });

// Update the UI.
function updateUI() {
  // Check if the HTML elements exist before trying to set their innerHTML.
  const shardsElement = document.getElementById('shards');
  const hammerCountElement = document.getElementById('hammerCount');
    const hammerEpicCountElement = document.getElementById('hammerEpicCount');
  const prestigePointsElement = document.getElementById('prestigePoints');
  const epicHammerBonusElement = document.getElementById('epicHammerBonus');
  const createHammerButton = document.getElementById('createHammerButton');
  const prestigeButton = document.getElementById('prestigeButton');
    const hammerCostElement = document.getElementById('hammerCost');
    const hammerEpicCostElement = document.getElementById('hammerEpicCost');

  if (shardsElement) {
    shardsElement.innerHTML = game.getShards().toFixed(2);
  }

  if (hammerCountElement) {
    hammerCountElement.innerHTML = game.getHammerCount();
  }

    if (hammerEpicCountElement) {
        hammerEpicCountElement.innerHTML = game.getHammerEpicCount();
    }

  if (prestigePointsElement) {
    prestigePointsElement.innerHTML = game.getPrestigePoints();
  }

  if (epicHammerBonusElement) {
    epicHammerBonusElement.innerHTML = game.getEpicHammerBonus();
  }
    if (hammerCostElement) {
        hammerCostElement.innerHTML = game.calculateTotalHammerCost();
    }
    if (hammerEpicCostElement) {
        hammerEpicCostElement.innerHTML = game.calculateTotalHammerEpicCost();
    }
  // Disable the buttons if they need to be disabled.
  createHammerButton.disabled = game.calculateTotalHammerCost() > game.getShards();
  prestigeButton.disabled = game.getHammerCount() === 0;
}
