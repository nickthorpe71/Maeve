"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reinsertionStrategy = void 0;
const lodash_1 = require("lodash");
function pure(_parents, children, mutants, _leftovers, populationSize) {
    return fitToPopulationSize(children.concat(mutants), children, populationSize);
}
function elitism(parents, children, mutants, leftovers, populationSize, survivalRate, preservePopulationSize = false) {
    const old = parents.concat(leftovers);
    const numSurvivors = Math.floor(populationSize * survivalRate);
    const survivors = old
        .sort((a, b) => a.fitness - b.fitness)
        .slice(0, numSurvivors);
    const newPopulation = survivors.concat(children).concat(mutants);
    return preservePopulationSize
        ? fitToPopulationSize(newPopulation, survivors, populationSize)
        : newPopulation;
}
function uniform(parents, children, mutants, leftovers, populationSize, survivalRate, preservePopulationSize = false) {
    const old = parents.concat(leftovers);
    const numSurvivors = Math.floor(populationSize * survivalRate);
    const survivors = (0, lodash_1.shuffle)(old).slice(0, numSurvivors);
    const newPopulation = survivors.concat(children).concat(mutants);
    return preservePopulationSize
        ? fitToPopulationSize(newPopulation, survivors, populationSize)
        : newPopulation;
}
function fitToPopulationSize(population, fillWith, populationSize) {
    const numToAdjustBy = populationSize - population.length;
    if (numToAdjustBy === 0)
        return population;
    if (numToAdjustBy < 0)
        return (0, lodash_1.shuffle)(population).slice(0, populationSize);
    return population.concat((0, lodash_1.range)(0, numToAdjustBy).map(() => fillWith[(0, lodash_1.random)(0, fillWith.length - 1)]));
}
exports.reinsertionStrategy = {
    pure,
    elitism,
    uniform,
};
