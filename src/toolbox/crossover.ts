import Chromosome from "../modules/Chromosome";
import { random } from "lodash";

/**
 * Specialized for real-valued chromosomes. May only be used on chromosomes of type number.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @param alpha number
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function wholeArithmetic<T>(
    parent1: Chromosome<T>,
    parent2: Chromosome<T>,
    alpha: number
) {
    const child1 = {
        genes: parent1.genes.map(
            (gene, i) =>
                alpha * Number(gene) + (1 - alpha) * Number(parent2.genes[i])
        ),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2 = {
        genes: parent2.genes.map(
            (gene, i) =>
                alpha * Number(gene) + (1 - alpha) * Number(parent1.genes[i])
        ),
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
function uniform<T>(
    parent1: Chromosome<T>,
    parent2: Chromosome<T>,
    rate: number
): Chromosome<T>[] {
    const child1: Chromosome<T> = {
        genes: parent1.genes.map((gene, i) =>
            random() > rate ? gene : parent2.genes[i]
        ),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2: Chromosome<T> = {
        genes: parent2.genes.map((gene, i) =>
            random() > rate ? gene : parent1.genes[i]
        ),
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
function orderOne<T>(
    parent1: Chromosome<T>,
    parent2: Chromosome<T>
): Chromosome<T>[] {
    const limit = parent1.genes.length - 1;
    // get random range
    const [i1, i2] = [random(limit), random(limit)].sort((a, b) => a - b);
    const child1: Chromosome<T> = {
        genes: orderOneCreateChildHelper<T>(parent1, parent2, i1, i2),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2: Chromosome<T> = {
        genes: orderOneCreateChildHelper<T>(parent2, parent1, i1, i2),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    return [child1, child2];
}
function orderOneCreateChildHelper<T>(
    parentA: Chromosome<T>,
    parentB: Chromosome<T>,
    i1: number,
    i2: number
) {
    // take a slice of the genes from parentB using predetermined random range
    const parentBContribution: T[] = parentB.genes.slice(i1, i2);

    // determine which parentA genes are not in parentB contribution (no duplicates)
    const parentAContribution: T[] = parentA.genes.filter(
        (gene) => parentBContribution.indexOf(gene) === -1
    );

    let parentASelector: number = 0;
    // create child genes using parentB slice and filling in remaining parentA genes in order
    const childGenes: Array<T> = Array(parentA.genes.length)
        .fill(null)
        .map((_, i) =>
            i >= i1 && i < i2
                ? parentBContribution[i - i1]
                : parentAContribution[parentASelector++]
        );

    return childGenes;
}

/**
 * A simple crossover function for basic problems.
 * @param parent1 Chromosome<T>
 * @param parent2 Chromosome<T>
 * @returns [Chromosome<T>, Chromosome<T>]
 */
function singlePoint<T>(parent1: Chromosome<T>, parent2: Chromosome<T>) {
    const crossoverPoint = random(parent1.size);

    const parent1FirstSection = parent1.genes.slice(0, crossoverPoint);
    const parent1SecondSection = parent1.genes.slice(crossoverPoint);
    const parent2FirstSection = parent2.genes.slice(0, crossoverPoint);
    const parent2SecondSection = parent2.genes.slice(crossoverPoint);

    const child1: Chromosome<T> = {
        genes: parent1FirstSection.concat(parent2SecondSection),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };
    const child2: Chromosome<T> = {
        genes: parent2FirstSection.concat(parent1SecondSection),
        size: parent1.size,
        fitness: 0,
        age: 0,
    };

    return [child1, child2];
}

export const crossoverStrategy = {
    singlePoint,
    orderOne,
    uniform,
    wholeArithmetic,
};
