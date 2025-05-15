/**
 * @file NPC.js
 * Defines a simple NPC class with wandering behavior.
 * Includes utility for random integer generation.
 */

class NPC {
    /**
     * Create a new NPC.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} speed - Movement speed (not used directly yet).
     */
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.speed = speed;
    }
  
    // Draw the NPC (currently a stub)
    draw() { }
  
    /**
     * Move the NPC by a delta.
     * @param {[number, number]} arr - Delta x and y.
     */
    move(arr) {
      this.x += arr[0];
      this.y += arr[1];
    }
  
    // Update the NPC (currently a stub)
    update() { }
  
    // Move randomly in a cardinal direction
    wander() {
        let arr = [[0,1],[0,-1],[1,0],[-1,0]]
        
      this.move(arr[get_random_int_between_inclusive(0,3)]);
    }
}
  
/**
 * Return a random integer between x and y (inclusive).
 * @param {number} x - Minimum value.
 * @param {number} y - Maximum value.
 * @returns {number} Random integer between x and y.
 */
function get_random_int_between_inclusive(x, y) {
return Math.floor(Math.random() * (y + 1 - x)) + x;
}
  