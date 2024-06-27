type TdirectionUpdates = {
	[x: string]: [string, number];
};

export const directions = {
	up: "up",
	down: "down",
	left: "left",
	right: "right",
};

export const directionUpdates: TdirectionUpdates = {
	[directions.up]: ["y", -1],
	[directions.down]: ["y", 1],
	[directions.left]: ["x", -1],
	[directions.right]: ["x", 1]
};