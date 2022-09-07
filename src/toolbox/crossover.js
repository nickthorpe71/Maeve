"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossoverStrategy = void 0;
const lodash_1 = require("lodash");
/**
 * Specialized for real-valued chromosomes. May only be used on chromosomes of type number.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @param alpha number
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function wholeArithmetic(parent1, parent2, alpha) {
    const child1 = {
        genes: parent1.genes.map((gene, i) => alpha * Number(gene) + (1 - alpha) * Number(parent2.genes[i])),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2 = {
        genes: parent2.genes.map((gene, i) => alpha * Number(gene) + (1 - alpha) * Number(parent1.genes[i])),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    return [child1, child2];
}
/**
 * Works best with binary genotypes of small size.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function uniform(parent1, parent2, rate) {
    const child1 = {
        genes: parent1.genes.map((gene, i) => (0, lodash_1.random)() > rate ? gene : parent2.genes[i]),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2 = {
        genes: parent2.genes.map((gene, i) => (0, lodash_1.random)() > rate ? gene : parent1.genes[i]),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    return [child1, child2];
}
/**
 * Preserves permutation of genes.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function orderOne(parent1, parent2) {
    const limit = parent1.genes.length - 1;
    // get random range
    const [i1, i2] = [(0, lodash_1.random)(limit), (0, lodash_1.random)(limit)].sort((a, b) => a - b);
    const child1 = {
        genes: orderOneCreateChildHelper(parent1, parent2, i1, i2),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2 = {
        genes: orderOneCreateChildHelper(parent2, parent1, i1, i2),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    return [child1, child2];
}
function orderOneCreateChildHelper(parentA, parentB, i1, i2) {
    // take a slice of the genes from parentB using predetermined random range
    const parentBContribution = parentB.genes.slice(i1, i2);
    // determine which parentA genes are not in parentB contribution (no duplicates)
    const parentAContribution = parentA.genes.filter((gene) => parentBContribution.indexOf(gene) === -1);
    let parentASelector = 0;
    // create child genes using parentB slice and filling in remaining parentA genes in order
    const childGenes = Array(parentA.genes.length)
        .fill(null)
        .map((_, i) => i >= i1 && i < i2
        ? parentBContribution[i - i1]
        : parentAContribution[parentASelector++]);
    return childGenes;
}
/**
 * A simple crossover function for basic problems.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function singlePoint(parent1, parent2) {
    const crossoverPoint = (0, lodash_1.random)(parent1.size);
    const parent1FirstSection = parent1.genes.slice(0, crossoverPoint);
    const parent1SecondSection = parent1.genes.slice(crossoverPoint);
    const parent2FirstSection = parent2.genes.slice(0, crossoverPoint);
    const parent2SecondSection = parent2.genes.slice(crossoverPoint);
    const child1 = {
        genes: parent1FirstSection.concat(parent2SecondSection),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2 = {
        genes: parent2FirstSection.concat(parent1SecondSection),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    return [child1, child2];
}
exports.crossoverStrategy = {
    singlePoint,
    orderOne,
    uniform,
    wholeArithmetic,
};
