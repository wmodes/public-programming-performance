let SAIL_OFFSET_X = 14;
let SAIL_OFFSET_Y = -32;
class Boat extends PathfindingNPC {
  constructor(p, boatParts, x, y, speed) {
    super(x, y, speed);
    this.p = p;
    this.front = boatParts[0];
    this.midSail = boatParts[1];
    this.mid = boatParts[2];
    this.level = 1;
  }

  draw() {
    // Note: in its current implementation, the tile that the boat spawns on will
    // have the boat FRONT on it, and the middle/end pieces will be placed behind it.
    // For example: if you place a boat at [0,0], the boat front will be placed at that point,
    // and the following pieces will be placed at an offset from that tile.

    // function getWaterWaveOffset was copied from island.js
    // which was written by WontonsofDMG
    function getWaterWaveOffset(i, j, p) {
      // Use frameCount if available, else fallback to millis
      let t =
        typeof p.frameCount !== "undefined" ? p.frameCount : p.millis() * 0.06;
      // Sine wave for smooth up/down motion
      return Math.sin(t * 0.05 + i * 0.7 + j * 0.9) * 4;
    }
    let waveOffset = getWaterWaveOffset(this.x, this.y, this.p);

    this.p.push();
    this.p.imageMode(this.p.CENTER);
    this.p.image(this.midSail, SAIL_OFFSET_X, SAIL_OFFSET_Y + waveOffset);
    this.p.image(this.front, 0, 0 + waveOffset);
    this.p.pop();
  }
}
