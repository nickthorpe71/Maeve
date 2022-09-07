"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionStrategy = void 0;
const lodash_1 = require("lodash");
function elitism(population, numToSelect) {
    return population.slice(0, numToSelect);
}
function random(population, numToSelect) {
    const shuffledPopulation = (0, lodash_1.shuffle)(population);
    return shuffledPopulation.slice(0, numToSelect);
}
function tournament(population, numToSelect, tournamentSize) {
    return (0, lodash_1.range)(0, numToSelect).map(() => {
        const tournament = (0, lodash_1.shuffle)(population).slice(0, tournamentSize);
        return (0, lodash_1.maxBy)(tournament, (chromosome) => chromosome.fitness);
    });
}
function tournamentNoDuplicates(population, numToSelect, tournamentSize) {
    let selected = new Set();
    return Array.from(tournamentHelper(population, numToSelect, tournamentSize, selected));
}
function tournamentHelper(population, numToSelect, tournamentSize, selected) {
    if (selected.size === numToSelect) {
        return selected;
    }
    const selectedClone = new Set(selected); // for immutability
    const tournament = (0, lodash_1.shuffle)(population).slice(0, tournamentSize);
    const chosen = (0, lodash_1.maxBy)(tournament, (chromosome) => chromosome.fitness);
    return tournamentHelper(population, numToSelect, tournamentSize, selectedClone.add(chosen));
}
function roulette(population, numToSelect) {
    const sumFitness = population
        .map((chromosome) => chromosome.fitness)
        .reduce((acc, fitness) => acc + fitness, 0);
    return (0, lodash_1.range)(0, numToSelect).map(() => {
        const random = Math.random() * sumFitness;
        let sum = 0;
        let result = population[0];
        for (const chromosome of population) {
            sum += chromosome.fitness;
            if (sum > random) {
                result = chromosome;
            }
        }
        return result;
    });
}
exports.selectionStrategy = {
    elitism,
    random,
    tournament,
    tournamentNoDuplicates,
    roulette,
};
