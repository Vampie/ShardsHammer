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
        // Multiply the cost of creating a hammer by the epic hammer cost multiplier.
        const hammerCost = 100 * this.epicHammerCostMultiplier;

        if (this.shards >= hammerCost) {
            if (this.shards >= 500) {
                // Create an epic hammer.
                this.epicHammerBonus += 0.25;
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
