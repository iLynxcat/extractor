// Adapted from: https://stackoverflow.com/a/33362966
export function filterAsync<T extends any = unknown>(
	input: T[],
	predicate: (value: T, index: number, arr: T[]) => Promise<boolean>
): Promise<T[]> {
	// Make a copy of the array, it might mutate by the time we've finished
	const array = Array.from(input);
	// Transform all the elements into an array of promises using the predicate
	// as the promise
	return (
		Promise.all(array.map((element, index) => predicate(element, index, array)))
			// Use the boolean result of the promises to call the underlying sync filter function
			.then((result) => {
				return array.filter((_, index) => {
					return result[index];
				});
			})
	);
}
