export const gridCell = (n: number): number => {
	return n * 16;
};

export const gridCoord = (x: number, y: number): string => {
	return `${gridCell(x)},${gridCell(y)}`;
};