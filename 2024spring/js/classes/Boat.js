
/**
 * boat object
 * @class 
 */
class Boat {
  static time = 0;
  /**
   * @constructor 
   * @param {number} x x coordinate to render to
   * @param {number} y y coordinate to rener to 
   */
  constructor(x, y) {
      this.timer = floor(random(0, 100))
      this.x = x;
      this.y = y;
      this.tiles = {};
      this.color = Math.random();
      this.dist = 0;
      this.lastUpdateTime = 0;
      this.heading = "N";
      this.index = -1;
      this.updateDirection();
  }

  updateDirection(){
    let d;
    let dx;
    let dy;
    do
    {
    dx = random(-1, 1);
    dy = random(-1, 1);
    d = dist(0, 0, dx, dy);
    } while(d === 0)
    this.dx = dx/d;
    this.dy = dy/d;
  }


  /**
   * @param {number} i x coordinate to add to
   * @param {number} j y coordinate to add to
   * @returns {void}
   */
  addBoatTile(i, j) {
      let tmpDist = dist(this.x, this.y, i, j);
      //this.tiles.push({i:i - this.x, j:j - this.y, dist: tmpDist});
      let I = i - this.x;
      let J = j - this.y;
      let key = [I, J];
      this.tiles[key] = { i: i - this.x, j: j - this.y, dist: tmpDist };
      //this.tiles.push({ i: i - this.x, j: j - this.y, dist: tmpDist });
      if (tmpDist > this.dist) {
          this.dist = tmpDist;
      }
  }

  boatTiles = {};
  // boatTiles[[i, j]] = 1;

  
  checkMove(di, dj){
    for(let key in this.tiles){
      if(window.tiles.isIsland(this.x + this.tiles[key].i + di, this.y + this.tiles[key].j + dj)){
        this.updateDirection();
        return false;
      }
    }
    for(let key in this.tiles){
      let I = this.x + this.tiles[key].i + di;
      let J = this.y + this.tiles[key].j + dj;
      for (let o = 0; o < boats.length; o++) {
        if(o !== this.index){
          for (let key2 in boats[o].tiles) {
            let I2 = boats[o].x + boats[o].tiles[key2].i;
            let J2 = boats[o].y + boats[o].tiles[key2].j;
            if(I === I2 && J === J2){
              this.updateDirection();
              return false;
            }
          }
      }
      }
    }
    return true;
  }
  

  static moveBoats = function(){
    if (!keyIsDown(32)) {
      Boat.time++;
      for(let I = 0; I < boats.length; I++){
        if((Boat.time + boats[I].timer) % 100 === 0){

          let tx = boats[I].x + boats[I].dx*10;
          let ty = boats[I].y + boats[I].dy*10;

          let minDist = Infinity;
          let rx = 0;
          let ry = 0;
          let sqDist = function(x1, y1, x2, y2){
            return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
          }
          for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
              let d = sqDist(boats[I].x + i, boats[I].y + j, tx, ty);
              if(d < minDist && boats[I].checkMove(i, j)){
                minDist = d;
                rx = i;
                ry = j;
              }
            }
          }
          boats[I].x += rx;
          boats[I].y += ry;
        }
      }
    }
  }

  static drawBoats(i, j){
    for(let I = 0; I < boats.length; I++){
      //for(let O = 0; O < boats[I].tiles.length; O++){
      // if(i === boats[I].x && j === boats[I].y){
      //     // Cole is here
      //     boats[I].drawBoat();
      // }
      for(let key in boats[I].tiles){
        if(i === boats[I].x + boats[I].tiles[key].i && j === boats[I].y + boats[I].tiles[key].j){
          // Cole is here
          boats[I].drawBoat(i, j);
        }
      }
    }
  }

  /**
   * Function to get a boats height
   * @function GetBoatHeight gets a sum of tile heights and devides them by the number of tiles to get the average
   * @returns {number} height of boat in pixels
   * @author {Aidan}
   */
  getBoatHeight(){
    let totalHeight = 0;
    let count = 0;
    for(let key in this.tiles){
      let tile = this.tiles[key];
      totalHeight += window.tiles.getHeight(this.x + tile.i, this.y + tile.j);
      count++;
    }
    return totalHeight/count;
  }

  /**
   * @function drawBoat renders a boat to the canvas
   * @returns {void}
   * @author James, Jaxon, Cole
   * James is here! And then Cole was here (and Jaxon in spirit)!
   * @description
   * Draws a trapezoidal boat shape with a front face, side face, and top face.
   * Based on surrounding boat tiles, it will expand to connect to other tiles of this boat.
   */
  drawBoat(x, y) {
    let boatHeight = this.getBoatHeight() + 3;
    let topHeight = 20 + boatHeight; // boat height
    
    let drawTile = (i, j) => { 
      push();
      // Find adjacent tiles and adjust the boat shape accordingly
      let lx = 0, tx = 0;
      if (`${i-1},${j}` in this.tiles) {
        lx = tw / 2;
      }
      if (`${i},${j-1}` in this.tiles) {
        tx = th;
      }
      // front face
      fill("#65350f");
      beginShape();
      vertex(-10/16 * tw - tx, -2/16 * th - tx / 2);
      vertex(-11/16 * tw - tx, -3/16 * th - boatHeight - tx / 2);
      vertex(2/8 * tw, 6/8 * th - boatHeight);
      vertex(1/8 * tw, 5/8 * th);
      endShape();
    
      // side face
      fill("#4F330E")
      beginShape();
      vertex(10/16 * tw + lx, 2/16 * th - lx / 2);
      vertex(12/16 * tw + lx, 4/16 * th - boatHeight - lx / 2);
      vertex(2/8 * tw, 6/8 * th - boatHeight);
      vertex(1/8 * tw, 5/8 * th);
      endShape();
    
      // top face
      fill("#3f301d")
      beginShape();
      vertex(-11/16 * tw - tx, -3/16 * th - boatHeight - tx / 2);
      vertex(-3/16 * tw + lx - tx, -11/16 * th - boatHeight - lx / 2 - tx / 2);
      vertex(12/16 * tw + lx, 4/16 * th - boatHeight - lx / 2);
      vertex(4/16 * tw, 12/16 * th - boatHeight);
      endShape();
      pop();
    }
    drawTile(x - this.x, y - this.y);
  }
}


/**
* Function checks if two i,j coordanates are adjacent (no diagonals)
* @function isAdjacent 
* @param {number}
* @param {number}
* @param {number}
* @param {number}
* @author Aidan
*/
var isAdjacent = function(i1, j1, i2, j2) {
if(j1 === j2){
  if(i1 === i2 + 1 || i1 === i2 - 1){
    return true;
  }
}
if(i1 === i2){
  if(j1 === j2 + 1 || j1 === j2 - 1){
    return true;
  }
}
return false;
}

var isOn = function(i1, j1, i2, j2) {
return j1 === j2 && i1 === i2;
}


/**
* @function addBoat
* @author Aidan
* @param {number}
*/
var addBoat = function (i, j) {
  //console.log(i + ", " + j + ", " + boats.length);
  for (let o = 0; o < boats.length; o++) {
    //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
    if (dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4) {
      //for(let p = 0; p < boats[o].tiles.length; p++){
      for (let key in boats[o].tiles) {
        if (isOn(i, j, boats[o].x + boats[o].tiles[key].i, boats[o].y + boats[o].tiles[key].j)) {
          delete boats[o].tiles[key];
          splitBoat(o);
          let tmp = Object.keys(boats[o].tiles);
          if(tmp.length === 0){
            //console.log("test");
            boats.splice(o, 1);
          }
          return;
        }
      }
    }
  }
  for (let o = 0; o < boats.length; o++) {
    //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
    if (dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4) {
      //for(let p = 0; p < boats[o].tiles.length; p++){
      for (let key in boats[o].tiles) {
        if (isAdjacent(i, j, boats[o].x + boats[o].tiles[key].i, boats[o].y + boats[o].tiles[key].j)) {
          boats[o].addBoatTile(i, j);
          return;
        }
      }
    }
  }
  let tmp = new Boat(i, j);
  tmp.addBoatTile(i, j);
  tmp.index = boats.length;
  boats.push(tmp);

}

var splitBoat = function(I){
  let boat = boats[I];


  let tmp = Object.keys(boat.tiles);
  if(tmp.length === 0){
    return;
  }

let chunks = [];
let chunkIndex = 0;


for(let currentKey of tmp){

  let flag = false;
  for(let chunk of chunks){
    if(currentKey in chunk){
      flag = true;
      break;
    }
  }
  if(flag){
    continue;
  }
  
  let stack = {};
  stack[currentKey] = boat.tiles[currentKey];
  let skeys = Object.keys(stack);
  let slen = skeys.length;

  chunks.push({});
  chunkIndex = chunks.length - 1;

  while(slen !== 0){
    skeys = Object.keys(stack);
    for(let key of skeys){
      let tile = boat.tiles[key];
      let k = [];
      k.push([tile.i + 1, tile.j]);
      k.push([tile.i - 1, tile.j]);
      k.push([tile.i, tile.j + 1]);
      k.push([tile.i, tile.j - 1]);


      for(let K of k){
        if(boat.tiles[K] && !stack[K] && !chunks[chunkIndex][K]){
          stack[K] = boat.tiles[K];
        }
      }
      chunks[chunkIndex][key] = stack[key];
      delete stack[key];
    }
    skeys = Object.keys(stack);
    slen = skeys.length;
  }

  for(let key in boat.tiles){
    boat.tiles[key].flag = false;
  }
  for(let chunk of chunks){
    for(let key in chunk){
      boat.tiles[key].flag = true;
    }
  }
}

if(chunks.length > 1){
  for(let chunk of chunks){
    let ckeys = Object.keys(chunk);
    clen = ckeys.length;
    if(clen <= 0){
      continue;
    }
    let startTile = chunk[ckeys[0]];
    let newBoat = new Boat(boat.x + startTile.i, boat.y + startTile.j);
    for(let key in chunk){
      let tile = chunk[key];
      newBoat.addBoatTile(boat.x + tile.i, boat.y + tile.j);
    }
    newBoat.index = boats.length;
    boats.push(newBoat);
  }
  boats.splice(I, 1);
  for(let i = 0; i < boats.length; i++){
    boats[i].index = i;
  }
}
//console.log(boats.length);

}

// /*
// /**
// * @function drawBoat renders a boat to the canvas
// * @returns {void}
// * @author James
// *  James is here!
// *  Lets start with drawing the new boats instead of the lawn chairs
// *  I'm gonna try to make a 1 tile boat here:
// *  This code is straight from chat gpt
// *  I'm gonna try to make it smaller and map it to a tile. 
// */
// function drawBoat() {

//   let boatHeight = getBoatHeight();
//   // basic boat shape v1.0
//   let TopHeight = 20; // boat height
//   // front face
//   fill("#65350f");
//   beginShape();
//   vertex(-10 / 16 * tw, -2 / 16 * th); // 0
//   vertex(-10 / 16 * tw, -2 / 16 * th - TopHeight); // 0^
//   vertex(1 / 8 * tw, 5 / 8 * th - TopHeight); // 3^
//   vertex(1 / 8 * tw, 5 / 8 * th); // 3
//   endShape();

//   // side face
//   fill("#3c280d")
//   beginShape();
//   vertex(10 / 16 * tw, 2 / 16 * th); // 2
//   vertex(10 / 16 * tw, 2 / 16 * th - TopHeight); // 2^
//   vertex(1 / 8 * tw, 5 / 8 * th - TopHeight); // 3^
//   vertex(1 / 8 * tw, 5 / 8 * th); // 3
//   endShape();

//   // top face
//   fill("#3f301d")
//   beginShape();
//   vertex(-10 / 16 * tw, -2 / 16 * th - TopHeight); // 0
//   vertex(-1 / 8 * tw, -5 / 8 * th - TopHeight); // 1
//   vertex(10 / 16 * tw, 2 / 16 * th - TopHeight); // 2
//   vertex(1 / 8 * tw, 5 / 8 * th - TopHeight); // 3
//   endShape();
// }
// */
