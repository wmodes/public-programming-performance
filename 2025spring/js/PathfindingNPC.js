class PathfindingNPC extends NPC {
    constructor(x, y, speed) {
        super(x, y, speed)
        this.objective = null
        this.path = null
    }

    pickObjective() {
        // This function should return with the objective position as [x, y] or null if the npc should not pathfind anywhere
    }

    /**
     * We need some kind of access to read the world so we know if we are allowed to traverse a tile,
     * this will likely change but lets pretend we pass some World object that gets passed around and has a function tileAt([x,y])
     */
    pathfind(world) {
        this.objective = this.pickObjective()
        if (this.objective !== null) {
            // right now I'm assuming x,y as being tile position, but as floating point (since the sheared view makes it rather annoying to manage otherwise, if this needs to change we can change it)
            this.path = astar(([x, y]) => this.isTileTraversable(world.tileAt([x, y])), [Math.floor(this.x), Math.floor(this.y)]);
        }
    }

    update() {
        if (this.path === null || this.path[0] === undefined) {
            this.wander()
        } else {
            let [tx, ty] = this.path[0]
            let dist = Math.sqrt((this.x - tx) * (this.x - tx) + (this.y - ty) * (this.y - ty))
            let ux = (tx - this.x) / dist;
            let uy = (ty - this.y) / dist;

            let [u2x, u2y] = [0,0];

            let d = min(dist, this.speed);
            let d2 = 0;

            // todo: because fp math do proper equality comparisons w/ epsilon
            if (this.x + ux * d == tx && this.y + uy * d == ty) {
                this.path.shift(); // pop the first element from the array, so we move to the next point
            }

            // we only do this for one tile because we assume we don't travel more than a full tile in a frame
            // this makes sure that we don't slow down for every step in the path.
            if (d < this.speed && this.path[0] !== undefined) {
                let [t2x, t2y] = this.path[0];
                let [s2x, s2y] = [this.x + ux * d, this.y + uy * d];
                let dist2 = Math.sqrt((s2x - t2x) * (s2x - t2x) + (s2y - t2y) * (s2y - t2y))
                u2x = (t2x - s2x) / dist2
                u2y = (t2y - s2y) / dist2
                d2 = min(dist2, this.speed - d)
            }

            this.move([ux * d + u2x * d2, uy * d + u2y * d2])
        }
    }

    // TODO: override wander() to prevent walking on untraversable tiles (consider if we want to think about that for all NPC's and not just pathfinding ones, might want to pull up some traversability stuff)

    // subclasses should override this and check if the tile is traversable
    isTileTraversable(tile) {
        return true
    }
}

class AstarGraphNode {
    cameFrom
    position
    distance

    constructor(position, cameFrom, distance) {
        this.position = position
        this.cameFrom = cameFrom
        this.distance = distance
    }
}

function astarHeuristic([px, py], [ox, oy]) {
    return (ox - px) * (ox - px) + (oy - py) * (oy - py);
}


function astarPushReachables(traversabilityFunction, possibleSpacesArray, graph, [px, py]) {
    if (graph[[px - 1, py]] === undefined && traversabilityFunction([px - 1, py])) {
        possibleSpacesArray.push({position: [px - 1, py], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px - 1, py]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py]] === undefined && traversabilityFunction([px + 1, py])) {
        possibleSpacesArray.push({position: [px + 1, py], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px + 1, py]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px, py - 1]] === undefined && traversabilityFunction([px, py - 1])) {
        possibleSpacesArray.push({position: [px, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px, py + 1]] === undefined && traversabilityFunction([px, py + 1])) {
        possibleSpacesArray.push({position: [px, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }

    // diagonals (once this is working maybe we can see the effect of using sqrt(2) for the added distance on diagonals)
    // also need to decide if we want to filter out diagonals where you have a sort of #. formation.
    //                                                                                 .#
    if (graph[[px - 1, py - 1]] === undefined && traversabilityFunction([px - 1, py - 1])) {
        possibleSpacesArray.push({position: [px - 1, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px - 1, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py + 1]] === undefined && traversabilityFunction([px + 1, py + 1])) {
        possibleSpacesArray.push({position: [px + 1, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px + 1, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px + 1, py - 1]] === undefined && traversabilityFunction([px + 1, py - 1])) {
        possibleSpacesArray.push({position: [px + 1, py - 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px + 1, py - 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
    if (graph[[px - 1, py + 1]] === undefined && traversabilityFunction([px - 1, py + 1])) {
        possibleSpacesArray.push({position: [px - 1, py + 1], from: [px, py], distance: graph[[px, py]].distance + 1});
        graph[[px - 1, py + 1]] = null; // different from undefined, used to make sure that we don't touch the same tile multiple times.
    }
}

function astarPopBestSpace(possibleSpacesArray, objective) {
    let bestSpaceIndex = 0;
    let bestValue = Infinity;
    for (let i = 0 ; i < possibleSpacesArray.length ; i++) {
        let space = possibleSpaces[i];
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

const ASTAR_MAX_TRAVERSABILITY_DISTANCE = 100;

// traversabilityFunction is function([x, y]) -> bool
// TODO: since world is infinite, prevent us from getting stuck by making a max distance
function astar(traversabilityFunction, position, objective) {
    let startingPoint = new AstarGraphNode(position, null, 0)
    let graph = {}
    graph[position] = startingPoint;

    let possibleSpaces = []
    astarPushReachables(traversabilityFunction, possibleSpaces, graph, position);

    // path will be a list of points from source to destination (movements)
    let path = []

    while (possibleSpaces.length > 0) {
        let bestSpace = astarPopBestSpace(possibleSpaces, objective);
        graph[bestSpace.position] = new AstarGraphNode(bestSpace.position, bestSpace.from, bestSpace.distance);
        if (bestSpace.position == objective) {
            break;
        }

        let distance = max(abs(bestSpace.position[0] - position[0]), abs(bestSpace.position[1] - position[1]))
        if (distance > ASTAR_MAX_TRAVERSABILITY_DISTANCE) {
            astarPushReachables(traversabilityFunction, possibleSpaces, graph, bestSpace.position);
        }
    }

    let objectiveNode = graph[bestSpace.position];
    if (objectiveNode === undefined) {
        return null; // no path
    }

    let node = objectiveNode;
    while (node != startingPoint) {
        path.unshift(node.position);
        node = node.cameFrom;
    }

    return path;
}
