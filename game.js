// Create a new instance of the HammerShards class (loads the saved game, if any).
const game = new HammerShards();

// Add event listeners to the buttons.
document.getElementById('collectShardsButton').addEventListener('click', () => { game.collectShards(); updateUI() });
document.getElementById('createHammerButton').addEventListener('click', () => {
    const isEpic = game.createHammer();
    document.getElementById('message').textContent = isEpic ? `Epic hammer found! +${percent(RULES.epicBonus)} shards per click.` : '';
    updateUI();
});
document.getElementById('prestigeButton').addEventListener('click', () => {
    // Prestige wipes shards and hammers, so ask first: one misclick on mobile would cost the whole run.
    if (confirm(`Prestige for ${game.getPrestigeGain()} prestige points? Your shards and hammers reset to 0.`)) {
        game.prestige();
        updateUI();
    }
});

// Update the UI every second, so the time stats keep ticking.
setInterval(updateUI, 1000);
updateUI();

function number(n) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function percent(n) {
    return number(n * 100) + '%';
}

function duration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    return hours ? `${hours}h ${minutes}m` : `${minutes}m ${totalSeconds % 60}s`;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

// Update the UI.
function updateUI() {
    setText('shards', number(game.getShards()));
    setText('hammerCount', game.getHammerCount());
    setText('hammerEpicCount', game.getHammerEpicCount());
    setText('prestigePoints', game.getPrestigePoints());
    setText('epicHammerBonus', '+' + percent(game.getEpicHammerBonus()));
    setText('hammerCost', number(game.calculateTotalHammerCost()));
    setText('epicChance', percent(game.getEpicChance()));

    // Disable the buttons if they need to be disabled.
    document.getElementById('createHammerButton').disabled = game.calculateTotalHammerCost() > game.getShards();
    document.getElementById('prestigeButton').disabled = game.getPrestigeGain() === 0;

    updateInfo();
    updateStats();
}

function updateInfo() {
    const hammers = game.getHammerCount();
    const hammerShards = hammers * RULES.shardsPerHammer;
    const multiplier = game.getMultiplier();
    document.getElementById('info').innerHTML = `
        <h3>Collect Shards</h3>
        <p>A click gives 1–10 shards, plus ${RULES.shardsPerHammer} per hammer, times your epic and prestige bonus.
            Right now: <b>${number((1 + hammerShards) * multiplier)} – ${number((10 + hammerShards) * multiplier)}</b> shards per click.</p>
        <h3>Hammer</h3>
        <p>Each hammer gives +${RULES.shardsPerHammer} shard per click. You have ${hammers}: <b>+${hammerShards}</b> per click.
            Every hammer makes the next one ${percent(RULES.hammerCostGrowth - 1)} more expensive. Hammers reset when you prestige.</p>
        <h3>Epic Hammer</h3>
        <p>Every hammer you buy has a small chance to also give an epic hammer: now <b>${percent(game.getEpicChance())}</b>.
            Each epic hammer gives +${percent(RULES.epicBonus)} shards per click (you: <b>+${percent(game.getEpicHammerBonus())}</b>).
            Epic hammers stay when you prestige.</p>
        <h3>Prestige Points</h3>
        <p>Prestige resets your shards and hammers and gives 1 prestige point per hammer (now: <b>+${game.getPrestigeGain()}</b>).
            Prestige points are never spent. Each one gives +${percent(RULES.prestigeBonus)} shards per click
            (you: <b>+${percent(game.getPrestigeBonus())}</b>) and +${percent(RULES.epicChancePerPrestige)} epic chance,
            from ${percent(RULES.epicBaseChance)} up to ${percent(RULES.epicMaxChance)}.</p>`;
}

function updateStats() {
    const run = game.run;
    const life = game.lifetime;
    const average = stats => number(stats.clicks ? stats.shardsCollected / stats.clicks : 0);
    const rows = [
        ['Clicks', number(run.clicks), number(life.clicks)],
        ['Shards collected', number(run.shardsCollected), number(life.shardsCollected)],
        ['Shards spent', number(run.shardsSpent), number(life.shardsSpent)],
        ['Avg shards per click', average(run), average(life)],
        ['Best click', number(run.bestClick), number(life.bestClick)],
        ['Hammers bought', number(run.hammersBought), number(life.hammersBought)],
        ['Epic hammers found', number(run.epicHammersFound), number(life.epicHammersFound)],
        ['Epic hammers expected', number(run.epicHammersExpected), number(life.epicHammersExpected)],
        ['Prestiges', '–', number(life.prestiges)],
        ['Best prestige', '–', number(life.bestPrestige) + ' PP'],
        ['Time since start', duration(Date.now() - run.startedAt), duration(Date.now() - life.startedAt)],
    ];
    document.getElementById('statsBody').innerHTML = rows
        .map(([label, runValue, lifeValue]) => `<tr><th scope="row">${label}</th><td>${runValue}</td><td>${lifeValue}</td></tr>`)
        .join('');
}
