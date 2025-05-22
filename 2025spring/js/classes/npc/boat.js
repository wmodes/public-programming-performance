const BUTT_OFFSET_X = 30;
const BUTT_OFFSET_Y = -41;
const SAIL_OFFSET_X = 14;
const SAIL_OFFSET_Y = -32;
class Boat extends PathfindingNPC {
  constructor(boatParts, x, y, speed) {
    super(x, y, speed);
    this.type = "boat";
    this.front = boatParts[0];
    this.midSail = boatParts[1];
    this.mid = boatParts[2];
    this.butt = boatParts[3];
    this.level = 1;
    this.speed = speed;

    this.prevX = x;
    this.prevY = y;
  }
  //
  pickObjective() {
    return [
      Math.floor(this.x) + get_random_int_between_inclusive(-20, 20),
      Math.floor(this.y) + get_random_int_between_inclusive(-20, 20),
    ];
  }

  isTileTraversable(tile) {
    return tile.isLand();
  }

  draw(p, [camera_x, camera_y]) {
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

    let [screen_x, screen_y] = p.worldToScreen(
      [this.x, this.y],
      [camera_x, camera_y]
    );
    let waveOffset = getWaterWaveOffset(screen_x, screen_y, p);

    p.push();
    p.translate(0 - screen_x, screen_y);
    p.imageMode(p.CENTER);

    if (this.prevX > this.x || this.prevY < this.y) p.scale(-1, 1);
    p.image(this.butt, BUTT_OFFSET_X, BUTT_OFFSET_Y + waveOffset);
    p.image(this.midSail, SAIL_OFFSET_X, SAIL_OFFSET_Y + waveOffset);
    p.image(this.front, 0, 0 + waveOffset);

    p.pop();

    this.prevX = this.x;
    this.prevY = this.y;
  }

  update(world) {
    super.update(world);

    world.npc_manager.forEachNpc((npc) => {
      if (npc.type && npc.type == "boat") {
        let distance = Math.sqrt((this.x - npc.x) ** 2 + (this.y - npc.y) ** 2);
        if (distance <= 1 && this != npc) {
          this.speed = 0;
          npc.speed = 0;
          world.soundEngine.playExplosion();
        }
      }
    });
  }
}
