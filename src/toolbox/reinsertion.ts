import { Chromosome } from "../../index";
import { random, range, shuffle } from "lodash";

function pure<T>(
    _parents: Chromosome<T>[],
    children: Chromosome<T>[],
    mutants: Chromosome<T>[],
    _leftovers: Chromosome<T>[],
    populationSize: number
): Chromosome<T>[] {
    return fitToPopulationSize(
        children.concat(mutants),
        children,
        populationSize
    );
}

function elitism<T>(
    parents: Chromosome<T>[],
    children: Chromosome<T>[],
    mutants: Chromosome<T>[],
    leftovers: Chromosome<T>[],
    populationSize: number,
    survivalRate: number,
    preservePopulationSize: boolean = false
): Chromosome<T>[] {
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

function uniform<T>(
    parents: Chromosome<T>[],
    children: Chromosome<T>[],
    mutants: Chromosome<T>[],
    leftovers: Chromosome<T>[],
    populationSize: number,
    survivalRate: number,
    preservePopulationSize: boolean = false
): Chromosome<T>[] {
    const old = parents.concat(leftovers);
    const numSurvivors = Math.floor(populationSize * survivalRate);
    const survivors = shuffle(old).slice(0, numSurvivors);
    const newPopulation = survivors.concat(children).concat(mutants);
    return preservePopulationSize
        ? fitToPopulationSize(newPopulation, survivors, populationSize)
        : newPopulation;
}

function fitToPopulationSize<T>(
    population: Chromosome<T>[],
    fillWith: Chromosome<T>[],
    populationSize: number
): Chromosome<T>[] {
    const numToAdjustBy: number = populationSize - population.length;

    if (numToAdjustBy === 0) return population;
    if (numToAdjustBy < 0) return shuffle(population).slice(0, populationSize);

    return population.concat(
        range(0, numToAdjustBy).map(
            (): Chromosome<T> => fillWith[random(0, fillWith.length - 1)]
        )
    );
}

export const reinsertionStrategy = {
    pure,
    elitism,
    uniform,
};
