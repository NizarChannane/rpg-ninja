import { gridCoord } from "./grid";

const nextPosition = (
	initialX: number, 
	initialY: number, 
	direction: string
): {x: number, y: number} => {
	let x = initialX;
	let y = initialY;
	const size = 16;

	if(direction === "left") {
		x -= size;
	} else if(direction === "right") {
		x += size;
	}else if(direction === "up") {
		y -= size;
	}else if(direction === "down") {
		y += size;
	}

	return {x,y}
};

export const isSpaceTaken = (
	currentX: number, 
	currentY: number, 
	direction: string,
	collisionObj: { [key: string]: boolean }
): boolean => {
	const {x, y} = nextPosition(currentX, currentY, direction);
	return collisionObj[`${x},${y}`] || false;
};

export const getMapBoundaries = (width: number, height: number) => {
	let mapBoundaries: { [key: string]: boolean } = {};

	//	corners
	for(let i = 0; i < width; i += width - 1) {
		for(let j = 0; j < height; j += height - 1) {
			mapBoundaries[gridCoord(i, j)] = true;
		}
	};

	// 	top boundary
	for(let i = 1; i < width - 1; i++) {
		mapBoundaries[gridCoord(i, -1)] = true;
	}

	// 	left boundary
	for(let i = 1; i < height - 1; i++) {
		mapBoundaries[gridCoord(0, i)] = true;
	}

	// 	right boundary
	for(let i = 1; i < height - 1; i++) {
		mapBoundaries[gridCoord((width - 1), i)] = true;
	}

	// 	bottom boundary
	for(let i = 1; i < width - 1; i++) {
		mapBoundaries[gridCoord(i, (height - 1))] = true;
	}

	return mapBoundaries;
};

export const getMapCollisions = (positions: number[][]) => {
	let mapCollisions: { [key: string]: boolean } = {};

	positions.map((position, _index) => {
		mapCollisions[gridCoord(position[0], position[1])] = true
	});

	return mapCollisions;
};

export const addCollision = (x: number, y: number, collisionObj: { [key: string]: boolean }) => {
	collisionObj[`${x},${y}`] = true;
};

export const removeCollision = (x: number, y: number, collisionObj: { [key: string]: boolean }) => {
	delete collisionObj[`${x},${y}`];
};

export const moveCollision = (previousX: number, previousY: number, direction: string, collisionObj: { [key: string]: boolean }) => {
	removeCollision(previousX, previousY, collisionObj);
	const {x, y} = nextPosition(previousX, previousY, direction);
	addCollision(x, y, collisionObj);
};