export function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * max + min);
}

export function randFloat(min: number, max: number): number {
    return Math.random() * max + min;
}

export function range(start: number, end: number): number[] {
    let newRange = [];
    for (let i = start; i <= end; i++) {
        newRange.push(i);
    }
    return newRange;
}

export function sleep(ms: number): any {
    return new Promise((resolve: Function) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function chunkEvery<T>(array: T[], size: number): T[][] {
    let chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export function shuffleArray<T>(array: T[]): T[] {
    const arrayClone = array.slice(); // for immutability
    let currentIndex = arrayClone.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arrayClone[currentIndex], arrayClone[randomIndex]] = [
            arrayClone[randomIndex],
            arrayClone[currentIndex],
        ];
    }

    return arrayClone;
}
