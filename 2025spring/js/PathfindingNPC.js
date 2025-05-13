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
     * this will likely change but lets pretend we pass some World object that gets passed around and has a function tileAt(x,y)
     */
    pathfind() {

    }

    // subclasses should override this and check if the tile is traversable
    isTileTraversable(tile) {
        return true
    }
}

function astar(world, position, objective, heuristicFunction) {
    
}