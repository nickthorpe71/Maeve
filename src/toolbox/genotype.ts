import { Chromosome } from "../../index";
import { range, shuffle } from "lodash";

/**
 * Creates a random binary chromosome. Binary genotypes are versatile. Example: use each gene to represent the presence or absence single characteristic.
 * @param size - size of the chromosome
 * @returns Chromosome<T>
 */
function binary(size: number): Chromosome<number> {
    const newChromosome: Chromosome<number> = {
        genes: range(0, size).map(() => (Math.random() < 0.5 ? 0 : 1)),
        size: size,
        fitness: 0,
        age: 0,
    };

    return newChromosome;
}

/**
 * Creates a random chromosome from given pool. This is a permutation genotype. Permutation genotypes are especially effective for scheduling problems or finding paths in a finite set of problems. Permutation genotypes are also called combinatorial optimization, which look for ordered solutions.
 * @param size - size of the chromosome
 * @param pool - pool of possible values for each gene
 * @returns Chromosome<T>
 */
function permutation<T>(size: number, pool: T[]): Chromosome<T> {
    const newChromosome: Chromosome<T> = {
        genes: Array.from(new Set(shuffle(pool))).slice(0, size),
        size,
        fitness: 0,
        age: 0,
    };

    return newChromosome;
}

function realValue() {}

/**
 * Creates a random chromosome from given pool.
 * @param size - size of the chromosome
 * @param pool - pool of possible values for each gene
 * @returns Chromosome<T>
 */
function general<T>(size: number, pool: T[]): Chromosome<T> {
    const newChromosome: Chromosome<T> = {
        genes: shuffle(pool).slice(0, size),
        size,
        fitness: 0,
        age: 0,
    };

    return newChromosome;
}

function graph() {}

function neuralNetwork() {}

export const genotype = {
    binary,
    permutation,
    general,
};
