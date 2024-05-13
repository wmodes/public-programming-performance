
/**
 * boat object
 * @class 
 */
class Boat {
    static updateInterval = 250
    static headingMomentum = 0.9
    /**
     * @constructor 
     * @param {number} x x coordinate to render to
     * @param {number} y y coordinate to rener to 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tiles = {};
        this.color = color(Math.random() * 255);
        this.dist = 0;
        this.lastUpdateTime = 0;
        this.heading = "N";
    }

    /**
     * @returns {undefined}
     */
    draw() {

    }

    /**
     * @returns {void}
     */
    update() {
        if (millis() - this.lastUpdateTime > Boat.updateInterval) {
            return;
        }
        this.lastUpdateTime = millis();
        if (random() > Boat.headingMomentum) {
            // Change Heading
        }

        // Move

    }

    /**
     * @param {number} i x coordinate to add to
     * @param {number} j y coordinate to add to
     * @returns {void}
     */
    addBoatTile(i, j) {
        let tmpDist = dist(this.x, this.y, i, j);
        //this.tiles.push({i:i - this.x, j:j - this.y, dist: tmpDist});
        this.tiles[[i - this.x, j - this.y]] = { i: i - this.x, j: j - this.y, dist: tmpDist };
        if (tmpDist > this.dist) {
            this.dist = tmpDist;
        }
    }

    boatTiles = {};
    // boatTiles[[i, j]] = 1;

    /*
    checkMove(di, dj){
      for(let tile in this.tiles){
        if(isIsland(this.x + tile.i + di, this.y + tile.j + dj)){
          return false;
        }
      }
      return true;
    }
    */

}

/**
 * @function addBoat
 * @author Aiden
 * @param {number}
 */
var addBoat = function (i, j) {
    for (let o = 0; o < boats.length; o++) {
      //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
      if (dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4) {
        //for(let p = 0; p < boats[o].tiles.length; p++){
        for (let tile in boats[o].tiles) {
          let I = tile.i;
          let J = tile.j;
  
          if (isAdjacent(i, j, boats[o].x + tile.i, boats[o].y + tile.j)) {
            boats[o].addBoatTile(i, j);
            return;
          }
        }
      }
    }
    let tmp = new Boat(i, j);
    tmp.addBoatTile(i, j);
    boats.push(tmp);
  }