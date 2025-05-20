/** 
 * NPC class with pathfinding functionality
 * 
 * Override pickObjective() and isTileTraversable() for behavior.
 */
class PathfindingNPC extends NPC {

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     */
    constructor(x, y, speed) {
        super(x, y, speed)
        this.objective = null
        this.path = null
        this.timer = 0;
    }

    /**
     * Pick an objective for the destination (or null to revert to wandering logic)
     * 
     * @returns {?[number,number]}
     */
    pickObjective() {
        // This function should return with the objective position as [x, y] or null if the npc should not pathfind anywhere
    }

    /**
     * We need some kind of access to read the world so we know if we are allowed to traverse a tile,
     * this will likely change but lets pretend we pass some World object that gets passed around and has a function tileAt([x,y])
     * 
     * @param {World} world
     */
    pathfind(world) {
        this.objective = this.pickObjective()

        if (this.objective !== null) {
            if (Math.floor(this.x) == this.objective[0] && Math.floor(this.y) == this.objective[1]) return;
            // right now I'm assuming x,y as being tile position, but as floating point (since the sheared view makes it rather annoying to manage otherwise, if this needs to change we can change it)
            this.path = astar(([x, y]) => {
                return this.isTileTraversable(world.isTileLand([x, y]));
            }, [Math.floor(this.x), Math.floor(this.y)], this.objective);
        }
    }

    update(world) {
        if (this.path === null || this.path[0] === undefined) {
            this.timer += 10;
            if (this.timer > 1000 * 5.0 / this.speed) {
                this.pathfind(world)

                if (this.path === null || this.path[0] === undefined) {
                    this.wander();
                    this.timer = 0;
                }
            }
        } else {
            this.timer = 0;
            let [tx, ty] = this.path[0]
            let dist = Math.sqrt((this.x - tx) * (this.x - tx) + (this.y - ty) * (this.y - ty))
            let ux = (tx - this.x) / dist;
            let uy = (ty - this.y) / dist;

            let [u2x, u2y] = [0, 0];

            let d = Math.min(dist, this.speed / 60);
            let d2 = 0;

            // todo: because fp math do proper equality comparisons w/ epsilon
            if (Math.abs(this.x + ux * d - tx) < 0.05 && Math.abs(this.y + uy * d - ty) < 0.05) {
                this.path.shift(); // pop the first element from the array, so we move to the next point
                // console.log("shift")
                // console.log(this.path[0]);
            }

            // we only do this for one tile because we assume we don't travel more than a full tile in a frame
            // this makes sure that we don't slow down for every step in the path.
            if (d < this.speed / 60 && this.path[0] !== undefined) {
                let [t2x, t2y] = this.path[0];
                let [s2x, s2y] = [this.x + ux * d, this.y + uy * d];
                let dist2 = Math.sqrt((s2x - t2x) * (s2x - t2x) + (s2y - t2y) * (s2y - t2y))
                u2x = (t2x - s2x) / dist2
                u2y = (t2y - s2y) / dist2
                d2 = Math.min(dist2, this.speed / 60 - d)
            }

            this.move([ux * d + u2x * d2, uy * d + u2y * d2])
        }
    }

    // TODO: override wander() to prevent walking on untraversable tiles (consider if we want to think about that for all NPC's and not just pathfinding ones, might want to pull up some traversability stuff)

    /**
     * Override this to determine if a tile is traversable (the input type isn't known yet but this will be updated with that when it can be)
     * @param {*} tile 
     * @returns if the NPC can traverse the tile type
     */
    isTileTraversable(tile) {
        return true
    }
}

class PathfindingTestNpc extends PathfindingNPC {
    constructor(x, y, speed) {
        super(x, y, speed)
    }

    pickObjective() {
        return [Math.floor(this.x) + (get_random_int_between_inclusive(-20, 20)), Math.floor(this.y) + (get_random_int_between_inclusive(-20, 20))];
    }

    draw(p, [camera_x, camera_y]) {
        let [screen_x, screen_y] = p.worldToScreen(
            [this.x, this.y],
            [camera_x, camera_y]
        );
        p.push();

        // p.print(screen_x,screen_y);

        p.translate(0 - screen_x, screen_y);

        ///

        p.fill(255);

        p.circle(0, 0, 8);

        ///

        p.pop();

    }

    isTileTraversable(tile) {
        return tile == false;
    }
}

/**
 * A* graph node
 */
class AstarGraphNode {
    cameFrom
    position
    distance

    /**
     * Create a new A* graph node (only needed by the A* implementation)
     * 
     * @param {[number,number]} position 
     * @param {[number,number]} cameFrom 
     * @param {number} distance 
    */
    constructor(position, cameFrom, distance) {
        this.position = position
        this.cameFrom = cameFrom
        this.distance = distance
    }
}

/**
 * Calculate the heuristic parameter for the A* implementation
 * 
 * @param {[number, number]} position
 * @param {[number, number]} objective 
 * @returns {number}
 */
function astarHeuristic([px, py], [ox, oy]) {
    return (ox - px) * (ox - px) + (oy - py) * (oy - py);
}

/**
 * @typedef {Object} AstarReachable
 * @property {[number, number]} position
 * @property {[number, number]} from
 * @property {number} distance
 */

/**
 * Push the reachable undiscovered locations on the A* grid from a tile
 * 
 * @param {function([number, number]): boolean} traversabilityFunction Function which tests to see if a tile can be traversed 
 * @param {Array.<AstarReachable>} possibleSpacesArray 
 * @param {Map.<[number,number],AstarGraphNode>} graph 
 * @param {[number,number]} position
 */
function astarPushReachables(traversabilityFunction, possibleSpacesArray, graph, [px, py]) {
    if (graph[[px - 1, py]] === undefined && traversabilityFunction([px - 1, py])) {
        possibleSpacesArray.push({ position: [px - 1, py], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px - 1, py]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py]] === undefined && traversabilityFunction([px + 1, py])) {
        possibleSpacesArray.push({ position: [px + 1, py], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px + 1, py]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px, py - 1]] === undefined && traversabilityFunction([px, py - 1])) {
        possibleSpacesArray.push({ position: [px, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px, py + 1]] === undefined && traversabilityFunction([px, py + 1])) {
        possibleSpacesArray.push({ position: [px, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }

    // diagonals (once this is working maybe we can see the effect of using sqrt(2) for the added distance on diagonals)
    // also need to decide if we want to filter out diagonals where you have a sort of #. formation.
    //                                                                                 .#
    if (graph[[px - 1, py - 1]] === undefined && traversabilityFunction([px - 1, py - 1])) {
        possibleSpacesArray.push({ position: [px - 1, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px - 1, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py + 1]] === undefined && traversabilityFunction([px + 1, py + 1])) {
        possibleSpacesArray.push({ position: [px + 1, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px + 1, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py - 1]] === undefined && traversabilityFunction([px + 1, py - 1])) {
        possibleSpacesArray.push({ position: [px + 1, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px + 1, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px - 1, py + 1]] === undefined && traversabilityFunction([px - 1, py + 1])) {
        possibleSpacesArray.push({ position: [px - 1, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1 });
        graph[[px - 1, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
}

/**
 * Select and remove the best space from the list of discovered unexplored spaces
 * 
 * @param {Array.<AstarReachable>} possibleSpacesArray 
 * @param {[number, number]} objective 
 * @returns {AstarReachable}
 */
function astarPopBestSpace(possibleSpacesArray, objective) {
    let bestSpaceIndex = 0;
    let bestValue = Infinity;
    for (let i = 0; i < possibleSpacesArray.length; i++) {
        let space = possibleSpacesArray[i];
        let h = astarHeuristic(space.position, objective);
        let g = space.distance;
        let f = h + g;
        if (f < bestValue) {
            bestSpaceIndex = i;
            bestValue = f;
        }
    }

    let bestSpace = possibleSpacesArray.splice(bestSpaceIndex, 1)[0];
    return bestSpace;
}

/**
 * @type {number}
 * Max distance for A* to travel before giving up
 */
const ASTAR_MAX_TRAVERSABILITY_DISTANCE = 50;

// traversabilityFunction is function([x, y]) -> bool
// TODO: since world is infinite, prevent us from getting stuck by making a max distance
/**
 * 
 * @param {function([number, number]): boolean} traversabilityFunction Test for if a position is traversable
 * @param {[number, number]} position Starting point 
 * @param {[number, number]} objective Destination
 * @returns {Array.<[number, number]>} The path from starting point to objective
 */
function astar(traversabilityFunction, position, objective) {
    let startingPoint = new AstarGraphNode(position, null, 0)
    let graph = {}
    graph[position] = startingPoint;

    let possibleSpaces = []
    astarPushReachables(traversabilityFunction, possibleSpaces, graph, position);

    // path will be a list of points from source to destination (movements)
    let path = []

    while (possibleSpaces.length > 0) {
        bestSpace = astarPopBestSpace(possibleSpaces, objective);
        graph[bestSpace.position] = new AstarGraphNode(bestSpace.position, bestSpace.from, bestSpace.distance);
        if (bestSpace.position == objective) {
            break;
        }

        let distance = Math.max(Math.abs(bestSpace.position[0] - position[0]), Math.abs(bestSpace.position[1] - position[1]))
        if (distance < ASTAR_MAX_TRAVERSABILITY_DISTANCE) {
            astarPushReachables(traversabilityFunction, possibleSpaces, graph, bestSpace.position);
        }
    }

    let objectiveNode = graph[objective];
    if (objectiveNode === undefined) {
        return null; // no path
    }

    let node = objectiveNode;
    while (node != startingPoint) {
        path.unshift(node.position);
        node = graph[node.cameFrom];
    }

    return path;
}
