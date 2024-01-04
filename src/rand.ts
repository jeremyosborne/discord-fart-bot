/**
 * Take an array of positive integers, where the integers
 * represent the weight or probability of the element being chosen.
 * The weights are inversely proportional to each other, where the
 * lower weights (1, 2, 3...) are more common than the higher weights
 * (100, 101, 20000...).
 *
 * The array of weights do not need to be sorted.
 *
 * @returns the index of the choice. `null` should only be returned if
 * the function is used incorrectly and with bad data (for example: weights
 * that do not add up to a positibe number, oddities with Infinity, etc).
 */
export const choiceWeightedInverse = (
    weights: Array<number>,
): number | null => {
    const totalInverseWeight = weights.reduce(
        (acc, weight) => acc + 1 / weight,
        0,
    );
    const randomValue = Math.random() * totalInverseWeight;
    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += 1 / weights[i];
        if (randomValue <= cumulativeWeight) {
            return i;
        }
    }

    // If no index is found (shouldn't happen if the weights sum to a positive value),
    // return null to handle the edge case.
    return null;
};
