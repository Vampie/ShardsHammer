class HammerShards {
    constructor() {
        this.shards = 0;
        this.hammerCount = 0;
        this.hammerEpicCount = 0;
        this.prestigePoints = 0;
        this.epicHammerBonus = 0;
        this.hammerCost = 100;
        this.hammerEpicCost = 500;

    }

    #collectShards() {
        this.shards += Math.floor(Math.random() * 10) + 1;
    }

    collectShards() {
        this.#collectShards();
    }

    #createHammer() {
        // Multiply the cost of creating a hammer by the epic hammer cost multiplier.
        const hammerCost = this.hammerCost+(this.hammerCost * this.epicHammerBonus);;
        const hammerEpicCost = this.hammerEpicCost+(this.hammerEpicCost * this.epicHammerBonus);;

        if (this.shards >= hammerCost) {
            if (this.shards >= hammerEpicCost) {
                // Create an epic hammer.
                this.epicHammerBonus += 0.25;
                this.hammerEpicCount += 1;
            }

            this.hammerCount += 1;
            this.shards -= hammerCost;
        }
    }

    createHammer() {
        this.#createHammer();
    }

    #prestige() {
        // Multiply the cost of creating an epic hammer by 1 + the prestige points.
        this.epicHammerCostMultiplier += 0.25;

        this.prestigePoints += this.hammerCount;
        this.hammerCount = 0;
    }

    prestige() {
        this.#prestige();
    }

    // Calculates the cost of prestiging.
    calculatePrestigeCost() {
        return 100 * this.epicHammerCostMultiplier;
    }

    // Calculates the cost of creating both hammers.
    calculateTotalHammerCost() {
        return this.hammerCost + (this.hammerCost * this.epicHammerBonus);
    }

    calculateTotalHammerEpicCost() {
        return this.hammerEpicCost + (this.hammerEpicCost * this.epicHammerBonus);
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

    getEpicHammerBonus() {
        return this.epicHammerBonus;
    }

    getEpicHammerCostMultiplier() {
        return this.epicHammerBonus;
    }
}
