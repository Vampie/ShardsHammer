// Create a new instance of the HammerShards class (loads the saved game, if any).
const game = new HammerShards();

// Add event listeners to the buttons.
document.getElementById('collectShardsButton').addEventListener('click', () => { game.collectShards(); updateUI() });
document.getElementById('createHammerButton').addEventListener('click', () => {
    const isEpic = game.createHammer();
    document.getElementById('message').textContent = isEpic ? `Lucky! Epic hammer found: +${percent(RULES.epicBonus)} shards per click.` : '';
    updateUI();
});
document.getElementById('buyEpicHammerButton').addEventListener('click', () => { game.buyEpicHammer(); updateUI() });
document.getElementById('prestigeButton').addEventListener('click', () => {
    // Prestige wipes shards and hammers, so ask first: one misclick on mobile would cost the whole run.
    if (confirm(`Prestige for ${game.getPrestigeGain()} prestige points? Your shards and hammers reset to 0. Epic hammers stay.`)) {
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
    const [minClick, maxClick] = game.getClickRange();
    setText('shards', number(game.getShards()));
    setText('clickRange', `${number(minClick)} – ${number(maxClick)}`);

    setText('hammerCount', game.getHammerCount());
    setText('hammerEffect', `+${RULES.shardsPerHammer} shard per click each\nTotal: +${game.getHammerCount() * RULES.shardsPerHammer} per click`);
    setText('hammerCost', number(game.calculateTotalHammerCost()));

    setText('hammerEpicCount', game.getHammerEpicCount());
    setText('epicEffect', `+${percent(RULES.epicBonus)} shards each\nTotal: +${percent(game.getEpicHammerBonus())}\nLucky drop: ${percent(game.getEpicChance())} per hammer bought`);
    setText('hammerEpicCost', number(game.calculateTotalHammerEpicCost()));

    setText('prestigePoints', game.getPrestigePoints());
    setText('prestigeEffect', `+${percent(RULES.prestigeBonus)} shards each, forever\nTotal: +${percent(game.getPrestigeBonus())}`);
    setText('prestigeGain', game.getPrestigeGain());

    // Disable the buttons if they need to be disabled.
    document.getElementById('createHammerButton').disabled = game.calculateTotalHammerCost() > game.getShards();
    document.getElementById('buyEpicHammerButton').disabled = game.calculateTotalHammerEpicCost() > game.getShards();
    document.getElementById('prestigeButton').disabled = game.getPrestigeGain() === 0;

    updateInfo();
    updateStats();
}

function updateInfo() {
    const [minClick, maxClick] = game.getClickRange();
    const hammers = game.getHammerCount();
    document.getElementById('info').innerHTML = `
        <h3>Collect Shards</h3>
        <p>A click gives 1–10 shards, plus ${RULES.shardsPerHammer} per hammer, times your epic and prestige bonus.
            Right now: <b>${number(minClick)} – ${number(maxClick)}</b> shards per click.</p>
        <h3 class="hammer">Hammer</h3>
        <p>Each hammer gives +${RULES.shardsPerHammer} shard per click. You have ${hammers}: <b>+${hammers * RULES.shardsPerHammer}</b> per click.
            Every hammer makes the next one ${percent(RULES.hammerCostGrowth - 1)} more expensive. Hammers reset when you prestige.</p>
        <h3 class="epic">Epic Hammer</h3>
        <p>Each epic hammer gives +${percent(RULES.epicBonus)} shards per click (you: <b>+${percent(game.getEpicHammerBonus())}</b>).
            Buy one for <b>${number(game.calculateTotalHammerEpicCost())}</b> shards; every epic hammer you own makes the next one
            ${percent(RULES.epicCostGrowth - 1)} more expensive. Or get lucky: every hammer you buy has a
            <b>${percent(game.getEpicChance())}</b> chance to drop one for free. Epic hammers stay when you prestige.</p>
        <h3 class="prestige">Prestige Points</h3>
        <p>Prestige resets your shards and hammers and gives 1 prestige point per hammer (now: <b>+${game.getPrestigeGain()}</b>).
            Prestige points are never spent. Each one gives +${percent(RULES.prestigeBonus)} shards per click
            (you: <b>+${percent(game.getPrestigeBonus())}</b>) and +${percent(RULES.epicChancePerPrestige)} lucky drop chance,
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
        ['Epic hammers bought', number(run.epicHammersBought), number(life.epicHammersBought)],
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
