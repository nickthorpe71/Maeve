import { sleep, chunkEvery } from "../../utils/index";
import { range, flatten } from "lodash";
import logger from "../../utils/logger";

import Problem from "./modules/Problem";
import Chromosome, { stringifyChromosome } from "./modules/Chromosome";

import { selectionStrategy } from "./toolbox/selection";
import { crossoverStrategy } from "./toolbox/crossover";
import { mutationStrategy } from "./toolbox/mutation";
import { reinsertionStrategy } from "./toolbox/reinsertion";

import StatsCache, { IStatsCache, IStatsEntry } from "./services/statsCache";

// Statistics cache for keeping track generational statistics.
function updateStats<T>(
    statsCache: IStatsCache,
    population: Chromosome<T>[],
    generation: number
) {
    const stats: IStatsEntry = {
        best: population[0],
        worst: population[population.length - 1],
        average:
            population.reduce((acc, curr) => acc + curr.fitness, 0) /
            population.length,
    };
    return StatsCache.insert(statsCache, `gen_${generation}`, stats);
}

/**
 * Creates a random population of chromosomes.
 */
function initialPopulation<T>(
    chromosome: Chromosome<T>,
    size: number
): Chromosome<T>[] {
    return range(0, size).map(() => chromosome);
}

/**
 * Process of evaluating the population.
 */
function evaluate<T>(
    population: Chromosome<T>[],
    fitnessFunction: Function
): Chromosome<T>[] {
    const populationClone = population.slice(); // for immutability
    return populationClone
        .map((chromosome: Chromosome<T>) => {
            chromosome.fitness = fitnessFunction(chromosome);
            chromosome.age = chromosome.age + 1;
            return chromosome;
        })
        .sort(
            (
                aChromosome: Chromosome<T>,
                bChromosome: Chromosome<T>
            ): number => {
                return bChromosome.fitness - aChromosome.fitness;
            }
        );
}

/**
 * Process of selecting the best parents to breed. In this case, selection is simply pairing adjacent parents.
 */
function selection<T>(
    population: Chromosome<T>[],
    selectionFunction: (
        population: Chromosome<T>[],
        numToSelect: number
    ) => Chromosome<T>[] = selectionStrategy.elitism,
    selectionRate: number
): { parents: Chromosome<T>[][]; leftovers: Chromosome<T>[] } {
    const populationSize = population.length;
    let populationClone = population.slice(); // for immutability

    const roundedPopulationSize = Math.round(populationSize * selectionRate);
    // Make sure we have enough parents to make pairs
    const numParents =
        roundedPopulationSize % 2 === 0
            ? roundedPopulationSize
            : roundedPopulationSize + 1;

    const selectedParents = selectionFunction(populationClone, numParents);
    const parents = chunkEvery(selectedParents, 2);
    const leftovers = populationClone.splice(numParents);

    return { parents, leftovers };
}

/**
 * Process of breeding (crossover) the population. Two parents create two children to preserve population size.
 */
function crossover<T>(
    matchedPopulation: Chromosome<T>[][],
    crossoverFunction: Function = crossoverStrategy.singlePoint
): Chromosome<T>[] {
    const halfPopulationSize = matchedPopulation.length;
    let populationClone = matchedPopulation.slice(); // for immutability
    let newPopulation: Chromosome<T>[] = [];
    for (let i = 0; i < halfPopulationSize; i++) {
        const parentA: Chromosome<T> = populationClone[0][0];
        const parentB: Chromosome<T> = populationClone[0][1];
        const children: Chromosome<T>[] = crossoverFunction(parentA, parentB);
        newPopulation.push(children[0]);
        newPopulation.push(children[1]);
        populationClone.splice(0, 1);
    }
    return newPopulation;
}

/**
 * Process of mutating the population.
 */
function mutation<T>(
    population: Chromosome<T>[],
    mutationFunction: Function = mutationStrategy.scramble,
    mutationProbability: number
): Chromosome<T>[] {
    const numToMutate = Math.floor(mutationProbability * population.length);
    return range(0, numToMutate).map((i) => mutationFunction(population[i]));
}

/**
 * Reinsertion function for the population.
 */
function reinsertion<T>(
    reinsertionFunction: Function = reinsertionStrategy.pure,
    parents: Chromosome<T>[],
    children: Chromosome<T>[],
    mutants: Chromosome<T>[],
    leftovers: Chromosome<T>[],
    populationSize: number
): Chromosome<T>[] {
    return reinsertionFunction(
        parents,
        children,
        mutants,
        leftovers,
        populationSize
    );
}

/**
 * Evolves the population towards the best solution.
 */
async function evolve<T>(
    population: Chromosome<T>[],
    problem: Problem<T>,
    generation: number,
    lastMaxFitness: number,
    temperature: number,
    options: FrameworkOptions<T>,
    startTime: number,
    statsCache: IStatsCache
): Promise<{ [key: string]: Chromosome<T> | IStatsCache }> {
    const populationClone = population.slice(); // for immutability
    const evaluatedPopulation = evaluate<T>(
        populationClone,
        problem.fitnessFunction
    );
    const updatesStats: IStatsCache = updateStats(
        statsCache,
        evaluatedPopulation,
        generation
    );
    const best = evaluatedPopulation[0];
    const bestFitness = problem.fitnessFunction(best);
    const newTemperature =
        (1 - options.hyperParams.coolingRate) *
        (temperature + (bestFitness - lastMaxFitness));

    if (options.showLogStream)
        logger.info(`Current best fitness is: ${bestFitness}`);

    if (problem.terminationCriteria(best, generation, newTemperature)) {
        const endTime = Date.now();
        logger.info(
            `Time Taken to execute = ${(endTime - startTime) / 1000} seconds`
        );
        logger.info(stringifyChromosome(best));
        return { best: best, stats: updatesStats };
    } else {
        await sleep(0.001); // sleep 1 microsecond to give JS heap time to reallocate memory / prevent max call stack error

        const { parents, leftovers } = selection<T>(
            populationClone,
            options.selectionFunction,
            options.selectionRate || 1
        );
        const children = crossover<T>(parents, options.crossoverFunction);
        const mutants = mutation<T>(
            populationClone,
            options.mutationFunction,
            options.hyperParams.mutationProbability
        );
        const newPopulation = reinsertion(
            options.reinsertionFunction,
            flatten(parents),
            children,
            mutants,
            leftovers,
            populationClone.length
        );

        return evolve<T>(
            newPopulation,
            problem,
            generation + 1,
            bestFitness,
            newTemperature,
            options,
            startTime,
            updatesStats
        );
    }
}

/**
 * Initializes the population and evolves it.
 */
export default async function run<T>(
    problem: Problem<T>,
    options: FrameworkOptions<T>
): Promise<{ [key: string]: Chromosome<T> | IStatsCache }> {
    const startTime = Date.now();
    const population = initialPopulation<T>(
        problem.genotype(),
        options.hyperParams.populationSize
    );
    const statsCache: IStatsCache = StatsCache.createCache();
    const generation = 0;
    const lastMaxFitness = 0;
    const temperature = 0;
    return await evolve<T>(
        population,
        problem,
        generation,
        lastMaxFitness,
        temperature,
        options,
        startTime,
        statsCache
    );
}

export interface FrameworkOptions<T> {
    showLogStream?: boolean;
    hyperParams: HyperParameters;
    crossoverFunction?: Function;
    mutationFunction?: (chromosome: Chromosome<T>) => Chromosome<T>;
    selectionFunction?: (
        population: Chromosome<T>[],
        numToSelect: number,
        tournamentSize?: number
    ) => Chromosome<T>[];
    selectionRate?: number;
    reinsertionFunction?: Function;
}

export interface HyperParameters {
    populationSize: number;
    mutationProbability: number;
    coolingRate: number;
}

// exports
export { selectionStrategy } from "./toolbox/selection";
export { crossoverStrategy } from "./toolbox/crossover";
export { mutationStrategy } from "./toolbox/mutation";
export { reinsertionStrategy } from "./toolbox/reinsertion";
export { genotype } from "./toolbox/genotype";
