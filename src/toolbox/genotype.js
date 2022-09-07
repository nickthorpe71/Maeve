"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genotype = void 0;
const lodash_1 = require("lodash");
/**
 * Creates a random binary chromosome. Binary genotypes are versatile. Example: use each gene to represent the presence or absence single characteristic.
 * @param size - size of the chromosome
 * @returns Chromosome<T>
 */
function binary(size) {
    const newChromosome = {
        genes: (0, lodash_1.range)(0, size).map(() => (Math.random() < 0.5 ? 0 : 1)),
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
function permutation(size, pool) {
    const newChromosome = {
        genes: Array.from(new Set((0, lodash_1.shuffle)(pool))).slice(0, size),
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
function realValue(size, max, min) {
    const newChromosome = {
        genes: (0, lodash_1.range)(0, size).map(() => Math.floor(Math.random() * (max - min + 1) + min)),
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
function weights(size) {
    const newChromosome = {
        genes: (0, lodash_1.range)(0, size).map(() => Math.random()),
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
function general(size, pool) {
    const newChromosome = {
        genes: (0, lodash_1.shuffle)(pool).slice(0, size),
        size,
        fitness: 0,
        age: 0,
    };
    return newChromosome;
}
function graph() { }
exports.genotype = {
    binary,
    realValue,
    weights,
    permutation,
    general,
};
