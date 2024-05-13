
/**
 * Ripple obj
 * @class 
 */
class Ripple {
    /**
     * @constructor 
     * @param {number} i i coordinate of ripple center
     * @param {number} j j coordinate of ripple center
     */
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.maxRadius = 10;
        this.currentRadius = 0;
        this.maxHeight = 10;
        this.currentHeight = this.maxHeight;
        this.speed = 0.1; // range of 0 to 1
    }
    /**
     * @returns {undefined}
     */
    update() {
        this.currentRadius += this.speed * this.maxRadius;
        this.currentHeight -= this.height * this.maxHeight;
        for (let i = this.i - this.maxRadius; i < this.i + this.currentRadius; i++) {
            for (let j = this.j - this.maxRadius; j < this.j + this.maxRadius; j++) {
                let distFromCenter = distance(this.i, this.j, i, j);
                let distanceFromRipple = abs(distFromCenter - this.currentRadius);
                rippleYOffsets[[i, j]] = constrain(lerp(this.currentHeight, 0, distanceFromRipple), 0, this.currentHeight);
            }
        }
    }
}