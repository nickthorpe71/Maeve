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

/**
 * Creates a random chromosome from where each gene is between the given range.
 * @param size - size of the chromosome
 * @param max - maximum value for each gene (inclusive)
 * @param min - min value for each gene (inclusive)
 */
function realValue(size: number, max: number, min: number): Chromosome<number> {
    const newChromosome: Chromosome<number> = {
        genes: range(0, size).map(() =>
            Math.floor(Math.random() * (max - min + 1) + min)
        ),
        size: size,
        fitness: 0,
        age: 0,
    };

    return newChromosome;
}

/**
 * Creates a random chromosome from where each gene is a value between 0 and 1.
 * @param size - size of the chromosome
 */
function weights(size: number): Chromosome<number> {
    const newChromosome: Chromosome<number> = {
        genes: range(0, size).map(() => Math.random()),
        size: size,
        fitness: 0,
        age: 0,
    };

    return newChromosome;
}

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

export const genotype = {
    binary,
    realValue,
    permutation,
    general,
};
