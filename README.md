# Rayleigh

Open source, extendable, versatile framework for prototyping and applying genetic algorithms.

A framework to use parameterized inputs to create and utilize genetic algorithms easily. The idea is it's easy to experiment with different parameters, observe the results, then when you've found the parameters that work best for your solution, run the framework in performance mode to calculate at a very efficient rate.

## Install

```
npm install rayleigh
```

## Examples

#### OneMax

The goal of one max is to create an array of 1s, the more 1's in the array the higher the fitness. This is a very simple example to show how easy it can be to set up a genetic algorithm.

```js
import Rayleigh, { genotype, Chromosome, Problem } from "rayleigh";

const chromosomeLength = 100;

const problemDefinition: Problem<number> = {
    genotype: () => genotype.binary(chromosomeLength),
    fitnessFunction: (chromosome: Chromosome<number>) =>
        chromosome.genes.reduce((acc, curr) => acc + curr, 0) /
        chromosomeLength,
    terminationCriteria: (bestFitnessChromosome: Chromosome<number>) =>
        bestFitnessChromosome.fitness >= 0.6,
};

Rayleigh(problemDefinition, {
    showLogStream: true,
    hyperParams: {
        populationSize: 200,
        mutationProbability: 0.05,
    },
});
```

#### Knapsack

The knapsack problem is a problem in combinatorial optimization: Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.

```js
import Rayleigh, {
    FrameworkOptions,
    HyperParameters,
    genotype,
    selectionStrategy,
    crossoverStrategy,
    mutationStrategy,
    Chromosome,
    Problem,
} from "rayleigh";

const itemValues = [6, 5, 8, 9, 6, 7, 3, 1, 2, 6];
const itemWeights = [10, 6, 8, 7, 10, 9, 7, 11, 6, 8];
const weightLimit = 40;

function fitnessFunction(chromosome: Chromosome<number>): number {
    const totalCargoProfit = chromosome.genes
        .map((gene, i) => itemValues[i] * gene)
        .reduce((acc, curr) => acc + curr, 0);

    const totalCargoWeight = chromosome.genes
        .map((gene, index) => gene * itemWeights[index])
        .reduce((acc, curr) => acc + curr, 0);

    return totalCargoWeight > weightLimit ? 0 : totalCargoProfit;
}

function terminationCriteria(
    _: Chromosome<number>,
    generation: number
): boolean {
    return generation >= 500;
}

const problemDefinition: Problem<number> = {
    genotype: () => genotype.binary(10),
    fitnessFunction,
    terminationCriteria,
};

const hyperParams: HyperParameters = {
    populationSize: 200,
    mutationProbability: 0.05,
};

// In options we can specify which strategies we want to use
// for each step in our genetic algorithm.
const options: FrameworkOptions<number> = {
    showLogStream: true,
    hyperParams,
    crossoverFunction: (
        parent1: Chromosome<number>,
        parent2: Chromosome<number>
    ) => crossoverStrategy.uniform(parent1, parent2, 0.5),
    mutationFunction: mutationStrategy.scramble,
    selectionFunction: (
        population: Chromosome<number>[],
        selectionRate: number
    ) => selectionStrategy.tournament(population, selectionRate, 10),
    selectionRate: 0.8,
};

async function main() {
    const result = await Rayleigh(problemDefinition, options);
    const cargoWeights = [10, 6, 8, 7, 10, 9, 7, 11, 6, 8];
    const bestSolution: Chromosome<number> = result.best as Chromosome<number>;
    const totalCargoWeight = bestSolution.genes
        .map((gene, index) => gene * cargoWeights[index])
        .reduce((acc, curr) => acc + curr, 0);
    console.log("Weight is:", totalCargoWeight);
    console.log("Stats:", Object.entries(result.stats).slice(0, 10));
}

main();

```

#### Train a artificial neural network

```js

```

### Problem Definition

-   list defaults and give examples

#### Genotypes

#### Fitness

#### Termination Criteria

### Hyper Params

-   list defaults and give examples

### Framework Options

-   list defaults and give examples

### Strategies

-   list defaults and give examples

#### Crossover

#### Selection

#### Mutation

#### Reinsertion

## Road Map

-   [ ] add ANN capabilities / matrix genotype
-   [ ] add tree genotypes
-   [ ] performance
-   [ ] benchmark / profile
-   [ ] extract parts to c t increase efficiency

## Keep in touch

-   [Twitter](https://twitter.com/LostOneStudios)
-   [Instagram](https://www.instagram.com/nickt.dev)
