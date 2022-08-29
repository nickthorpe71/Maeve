export interface Chromosome<T> {
    genes: T[];
    size: number;
    fitness: number;
    age: number;
}

export function cloneChromosome<T>(chromosome: Chromosome<T>): Chromosome<T> {
    return {
        genes: chromosome.genes.slice(),
        size: chromosome.size,
        fitness: chromosome.fitness,
        age: chromosome.age,
    };
}

export function stringifyChromosome<T>(chromosome: Chromosome<T>): string {
    return `\nChromosome:\n - Genes: ${chromosome.genes}\n - Size: ${chromosome.size}\n - Fitness: ${chromosome.fitness}\n - Age: ${chromosome.age}`;
}
