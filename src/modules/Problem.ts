import Chromosome from "./Chromosome";

export default interface Problem<T> {
    genotype: () => Chromosome<T>;
    fitnessFunction: (chromosome: Chromosome<T>) => number;
    terminationCriteria: (
        bestFitness: Chromosome<T>,
        generation: number,
        temperature: number
    ) => boolean;
}
