/**
 * @file PathfindingNPC.js
 * Extends NPC with pathfinding behavior using A*.
 * Includes placeholder for A* pathfinding function.
 */

class PathfindingNPC extends NPC {
    /**
     * Create a new pathfinding NPC.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} speed - Movement speed.
     */
    constructor(x, y, speed) {
      super(x, y, speed);
      this.objective = null;
      this.path = null;
    }
  
    // Choose an objective for the NPC to path toward (override in subclass)
    pickObjective() {
      // Should return an [x, y] pair or null
    }
  
    /**
     * Perform pathfinding toward the current objective.
     * Placeholder — expects access to world.tileAt(x, y).
     */
    pathfind() {
      // Stub
    }
  
    /**
     * Determine if the tile is traversable.
     * Subclasses should override this.
     * @param {*} tile - Tile object or data.
     * @returns {boolean} Whether the tile can be moved onto.
     */
    isTileTraversable(tile) {
      return true;
    }
}
  
/**
 * Perform A* pathfinding from a position to an objective in a world.
 * @param {Object} world - World object with tileAt(x, y).
 * @param {[number, number]} position - Start position [x, y].
 * @param {[number, number]} objective - Goal position [x, y].
 * @param {Function} heuristicFunction - Heuristic function taking (a, b).
 */
function astar(world, position, objective, heuristicFunction) {
    // Stub
}
  