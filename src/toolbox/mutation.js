"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationStrategy = void 0;
const index_1 = require("../../index");
const lodash_1 = require("lodash");
/**
 * Shuffles all genes in a chromosome. Can apply to most genotypes and preserves the size and permutation of a chromosome.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function scramble(chromosome) {
    const chromosomeClone = (0, index_1.cloneChromosome)(chromosome);
    const newGenes = (0, lodash_1.shuffle)(chromosomeClone.genes);
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}
/**
 * Applies a bitwise XOR to all genes or with a specified probability (p) of genes in a chromosome. Simple and effective but only applies to binary genotypes.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function bitFlip(chromosome, p = 1) {
    const chromosomeClone = (0, index_1.cloneChromosome)(chromosome);
    const newGenes = p === 1
        ? chromosome.genes.map((gene) => gene ^ 1)
        : chromosome.genes.map((gene) => Math.random() < p ? gene ^ 1 : gene);
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}
/**
 * Specifically meant mutation of real number genotype chromosomes. Generates gaussian random numbers based on the provided chromosome. The idea is that you can slightly adjust a chromosome without changing it too much.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function gaussian(chromosome) {
    const chromosomeClone = (0, index_1.cloneChromosome)(chromosome);
    const mean = (0, lodash_1.sum)(chromosome.genes) / chromosome.genes.length;
    const sigma = (0, lodash_1.sum)(chromosome.genes.map((gene) => Math.pow((mean - gene), 2))) /
        chromosome.genes.length;
    const newGenes = chromosome.genes.map((gene) => randomNormal(gene, sigma));
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}
function randomNormal(mean, variance) {
    return ((0, lodash_1.sum)((0, lodash_1.range)(0, 6).map((_) => mean + Math.random() * variance + Math.random() * -variance)) / 6);
}
exports.mutationStrategy = {
    scramble,
    bitFlip,
    gaussian,
};
