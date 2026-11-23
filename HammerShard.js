// Game balance. The info panel reads these too, so its text always matches the game.
const RULES = {
    hammerBaseCost: 100,
    hammerCostGrowth: 1.1,          // every hammer this run makes the next one 10% more expensive
    shardsPerHammer: 1,             // extra shards per click, per hammer
    epicBaseCost: 500,
    epicCostGrowth: 1.5,            // every epic hammer owned (bought or found) makes the next one 50% more expensive
    epicBonus: 0.25,                // +25% shards per click, per epic hammer
    prestigeBonus: 0.05,            // +5% shards per click, per prestige point
    epicBaseChance: 0.005,          // 0.5% chance per hammer bought
    epicChancePerPrestige: 0.0005,  // +0.05% per lifetime prestige point
    epicMaxChance: 0.1,
};

const SAVE_KEY = 'hammerShardsSave';

function newStats() {
    return {
        clicks: 0,
        shardsCollected: 0,
        shardsSpent: 0,
        bestClick: 0,
        hammersBought: 0,
        epicHammersBought: 0,
        epicHammersFound: 0,
        epicHammersExpected: 0,
        startedAt: Date.now(),
    };
}

class HammerShards {
    constructor() {
        this.shards = 0;
        this.hammerCount = 0;
        this.hammerEpicCount = 0;
        this.prestigePoints = 0;
        this.run = newStats();
        this.lifetime = { ...newStats(), prestiges: 0, bestPrestige: 0 };
        this.#load();
    }

    #collectShards() {
        const base = Math.floor(Math.random() * 10) + 1;
        const gained = (base + this.hammerCount * RULES.shardsPerHammer) * this.getMultiplier();
        this.shards += gained;
        this.#track('clicks', 1);
        this.#track('shardsCollected', gained);
        this.run.bestClick = Math.max(this.run.bestClick, gained);
        this.lifetime.bestClick = Math.max(this.lifetime.bestClick, gained);
        this.save();
    }

    collectShards() {
        this.#collectShards();
    }

    // Returns true when the purchase also gave an epic hammer.
    #createHammer() {
        const hammerCost = this.calculateTotalHammerCost();
        if (this.shards < hammerCost) {
            return false;
        }

        const epicChance = this.getEpicChance();
        this.shards -= hammerCost;
        this.hammerCount += 1;
        this.#track('shardsSpent', hammerCost);
        this.#track('hammersBought', 1);
        this.#track('epicHammersExpected', epicChance);

        const isEpic = Math.random() < epicChance;
        if (isEpic) {
            this.hammerEpicCount += 1;
            this.#track('epicHammersFound', 1);
        }
        this.save();
        return isEpic;
    }

    createHammer() {
        return this.#createHammer();
    }

    #buyEpicHammer() {
        const epicCost = this.calculateTotalHammerEpicCost();
        if (this.shards < epicCost) {
            return;
        }

        this.shards -= epicCost;
        this.hammerEpicCount += 1;
        this.#track('shardsSpent', epicCost);
        this.#track('epicHammersBought', 1);
        this.save();
    }

    buyEpicHammer() {
        this.#buyEpicHammer();
    }

    // Trades this run's shards and hammers for permanent prestige points. Epic hammers stay.
    #prestige() {
        const gained = this.getPrestigeGain();
        if (gained === 0) {
            return;
        }

        this.prestigePoints += gained;
        this.lifetime.prestiges += 1;
        this.lifetime.bestPrestige = Math.max(this.lifetime.bestPrestige, gained);
        this.shards = 0;
        this.hammerCount = 0;
        this.run = newStats();
        this.save();
    }

    prestige() {
        this.#prestige();
    }

    #track(stat, amount) {
        this.run[stat] += amount;
        this.lifetime[stat] += amount;
    }

    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this));
        } catch {
            // Storage blocked (e.g. private mode): the game still runs, it just does not save.
        }
    }

    #load() {
        try {
            const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
            if (saved) {
                // Merge over the defaults, so stats added in later versions start at 0.
                Object.assign(this, saved, {
                    run: { ...this.run, ...saved.run },
                    lifetime: { ...this.lifetime, ...saved.lifetime },
                });
            }
        } catch {
            // Corrupt or unreadable save: start fresh.
        }
    }

    calculateTotalHammerCost() {
        return Math.round(RULES.hammerBaseCost * RULES.hammerCostGrowth ** this.hammerCount);
    }

    calculateTotalHammerEpicCost() {
        return Math.round(RULES.epicBaseCost * RULES.epicCostGrowth ** this.hammerEpicCount);
    }

    // Lowest and highest shards a click gives right now.
    getClickRange() {
        const hammerShards = this.hammerCount * RULES.shardsPerHammer;
        return [1, 10].map(base => (base + hammerShards) * this.getMultiplier());
    }

    // Everything a click gives is multiplied by this.
    getMultiplier() {
        return (1 + this.getEpicHammerBonus()) * (1 + this.getPrestigeBonus());
    }

    getEpicHammerBonus() {
        return this.hammerEpicCount * RULES.epicBonus;
    }

    getPrestigeBonus() {
        return this.prestigePoints * RULES.prestigeBonus;
    }

    // Prestige points are never spent, so prestigePoints is the lifetime total.
    getEpicChance() {
        return Math.min(RULES.epicMaxChance, RULES.epicBaseChance + this.prestigePoints * RULES.epicChancePerPrestige);
    }

    getPrestigeGain() {
        return this.hammerCount;
    }

    getShards() {
        return this.shards;
    }

    getHammerCount() {
        return this.hammerCount;
    }

    getHammerEpicCount() {
        return this.hammerEpicCount;
    }

    getPrestigePoints() {
        return this.prestigePoints;
    }
}
