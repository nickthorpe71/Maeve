import Chromosome, { cloneChromosome } from "../modules/Chromosome";
import { shuffle, sum, range } from "lodash";

/**
 * Shuffles all genes in a chromosome. Can apply to most genotypes and preserves the size and permutation of a chromosome.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function scramble<T>(chromosome: Chromosome<T>): Chromosome<T> {
    const chromosomeClone: Chromosome<T> = cloneChromosome<T>(chromosome);
    const newGenes = shuffle(chromosomeClone.genes);
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}

/**
 * Applies a bitwise XOR to all genes or with a specified probability (p) of genes in a chromosome. Simple and effective but only applies to binary genotypes.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function bitFlip(
    chromosome: Chromosome<number>,
    p: number = 1
): Chromosome<number> {
    const chromosomeClone: Chromosome<number> =
        cloneChromosome<number>(chromosome);
    const newGenes =
        p === 1
            ? chromosome.genes.map((gene) => gene ^ 1)
            : chromosome.genes.map((gene) =>
                  Math.random() < p ? gene ^ 1 : gene
              );
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}

/**
 * Specifically meant mutation of real number genotype chromosomes. Generates gaussian random numbers based on the provided chromosome. The idea is that you can slightly adjust a chromosome without changing it too much.
 * @param chromosome - chromosome to mutate
 * @returns mutated chromosome
 */
function gaussian(chromosome: Chromosome<number>): Chromosome<number> {
    const chromosomeClone: Chromosome<number> =
        cloneChromosome<number>(chromosome);
    const mean = sum(chromosome.genes) / chromosome.genes.length;

    const sigma =
        sum(chromosome.genes.map((gene) => (mean - gene) ** 2)) /
        chromosome.genes.length;

    const newGenes = chromosome.genes.map((gene) => randomNormal(gene, sigma));
    chromosomeClone.genes = newGenes;
    return chromosomeClone;
}
function randomNormal(mean: number, variance: number) {
    return (
        sum(
            range(0, 6).map(
                (_) =>
                    mean + Math.random() * variance + Math.random() * -variance
            )
        ) / 6
    );
}

export const mutationStrategy = {
    scramble,
    bitFlip,
    gaussian,
};

const testCH: Chromosome<number> = {
    genes: [1.2, 2.3, 3.4, 4.5],
    fitness: 0,
    size: 4,
    age: 0,
};

gaussian(testCH);
