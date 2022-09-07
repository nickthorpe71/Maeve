"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genotype = exports.reinsertionStrategy = exports.mutationStrategy = exports.crossoverStrategy = exports.selectionStrategy = void 0;
const index_1 = require("./src/utils/index");
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("./src/utils/logger"));
const Chromosome_1 = require("./src/modules/Chromosome");
const selection_1 = require("./src/toolbox/selection");
const crossover_1 = require("./src/toolbox/crossover");
const mutation_1 = require("./src/toolbox/mutation");
const reinsertion_1 = require("./src/toolbox/reinsertion");
const statsCache_1 = __importDefault(require("./src/services/statsCache"));
// Statistics cache for keeping track generational statistics.
function updateStats(statsCache, population, generation) {
    const stats = {
        best: population[0],
        worst: population[population.length - 1],
        average: population.reduce((acc, curr) => acc + curr.fitness, 0) /
            population.length,
    };
    return statsCache_1.default.insert(statsCache, `gen_${generation}`, stats);
}
/**
 * Creates a random population of chromosomes.
 */
function initialPopulation(chromosome, size) {
    return (0, lodash_1.range)(0, size).map(() => chromosome);
}
/**
 * Process of evaluating the population.
 */
function evaluate(population, fitnessFunction) {
    const populationClone = population.slice(); // for immutability
    return populationClone
        .map((chromosome) => {
        chromosome.fitness = fitnessFunction(chromosome);
        chromosome.age = chromosome.age + 1;
        return chromosome;
    })
        .sort((aChromosome, bChromosome) => {
        return bChromosome.fitness - aChromosome.fitness;
    });
}
/**
 * Process of selecting the best parents to breed. In this case, selection is simply pairing adjacent parents.
 */
function selection(population, selectionFunction = selection_1.selectionStrategy.elitism, selectionRate) {
    const populationSize = population.length;
    let populationClone = population.slice(); // for immutability
    const roundedPopulationSize = Math.round(populationSize * selectionRate);
    // Make sure we have enough parents to make pairs
    const numParents = roundedPopulationSize % 2 === 0
        ? roundedPopulationSize
        : roundedPopulationSize + 1;
    const selectedParents = selectionFunction(populationClone, numParents);
    const parents = (0, index_1.chunkEvery)(selectedParents, 2);
    const leftovers = populationClone.splice(numParents);
    return { parents, leftovers };
}
/**
 * Process of breeding (crossover) the population. Two parents create two children to preserve population size.
 */
function crossover(matchedPopulation, crossoverFunction = crossover_1.crossoverStrategy.singlePoint) {
    const halfPopulationSize = matchedPopulation.length;
    let populationClone = matchedPopulation.slice(); // for immutability
    let newPopulation = [];
    for (let i = 0; i < halfPopulationSize; i++) {
        const parentA = populationClone[0][0];
        const parentB = populationClone[0][1];
        const children = crossoverFunction(parentA, parentB);
        newPopulation.push(children[0]);
        newPopulation.push(children[1]);
        populationClone.splice(0, 1);
    }
    return newPopulation;
}
/**
 * Process of mutating the population.
 */
function mutation(population, mutationFunction = mutation_1.mutationStrategy.scramble, mutationProbability) {
    const numToMutate = Math.floor(mutationProbability * population.length);
    return (0, lodash_1.range)(0, numToMutate).map((i) => mutationFunction(population[i]));
}
/**
 * Reinsertion function for the population.
 */
function reinsertion(reinsertionFunction = reinsertion_1.reinsertionStrategy.pure, parents, children, mutants, leftovers, populationSize) {
    return reinsertionFunction(parents, children, mutants, leftovers, populationSize);
}
/**
 * Evolves the population towards the best solution.
 */
function evolve(population, problem, generation, lastMaxFitness, temperature, options, startTime, statsCache) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.hyperParams.coolingRate)
            options.hyperParams.coolingRate = 1;
        const populationClone = population.slice(); // for immutability
        const evaluatedPopulation = evaluate(populationClone, problem.fitnessFunction);
        const updatesStats = updateStats(statsCache, evaluatedPopulation, generation);
        const best = evaluatedPopulation[0];
        const bestFitness = problem.fitnessFunction(best);
        const newTemperature = (1 - options.hyperParams.coolingRate) *
            (temperature + (bestFitness - lastMaxFitness));
        if (options.showLogStream)
            logger_1.default.info(`Current best fitness is: ${bestFitness}`);
        if (problem.terminationCriteria(best, generation, newTemperature)) {
            const endTime = Date.now();
            logger_1.default.info(`Time Taken to execute = ${(endTime - startTime) / 1000} seconds`);
            logger_1.default.info((0, Chromosome_1.stringifyChromosome)(best));
            return { best: best, stats: updatesStats };
        }
        else {
            yield (0, index_1.sleep)(0.001); // sleep 1 microsecond to give JS heap time to reallocate memory / prevent max call stack error
            const { parents, leftovers } = selection(populationClone, options.selectionFunction, options.selectionRate || 1);
            const children = crossover(parents, options.crossoverFunction);
            const mutants = mutation(populationClone, options.mutationFunction, options.hyperParams.mutationProbability);
            const newPopulation = reinsertion(options.reinsertionFunction, (0, lodash_1.flatten)(parents), children, mutants, leftovers, populationClone.length);
            return evolve(newPopulation, problem, generation + 1, bestFitness, newTemperature, options, startTime, updatesStats);
        }
    });
}
/**
 * Initializes the population and evolves it.
 */
function run(problem, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        const population = initialPopulation(problem.genotype(), options.hyperParams.populationSize);
        const statsCache = statsCache_1.default.createCache();
        const generation = 0;
        const lastMaxFitness = 0;
        const temperature = 0;
        return yield evolve(population, problem, generation, lastMaxFitness, temperature, options, startTime, statsCache);
    });
}
exports.default = run;
// EXPORTS
// Tools
var selection_2 = require("./src/toolbox/selection");
Object.defineProperty(exports, "selectionStrategy", { enumerable: true, get: function () { return selection_2.selectionStrategy; } });
var crossover_2 = require("./src/toolbox/crossover");
Object.defineProperty(exports, "crossoverStrategy", { enumerable: true, get: function () { return crossover_2.crossoverStrategy; } });
var mutation_2 = require("./src/toolbox/mutation");
Object.defineProperty(exports, "mutationStrategy", { enumerable: true, get: function () { return mutation_2.mutationStrategy; } });
var reinsertion_2 = require("./src/toolbox/reinsertion");
Object.defineProperty(exports, "reinsertionStrategy", { enumerable: true, get: function () { return reinsertion_2.reinsertionStrategy; } });
var genotype_1 = require("./src/toolbox/genotype");
Object.defineProperty(exports, "genotype", { enumerable: true, get: function () { return genotype_1.genotype; } });
// Modules
__exportStar(require("./src/modules/Chromosome"), exports);
__exportStar(require("./src/modules/Problem"), exports);
