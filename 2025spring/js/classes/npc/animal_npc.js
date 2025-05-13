class AnimalNPC extends NPC{
    constructor(x,y,speed,imagePath){
        //speed is inversely related to the amount of seconds it takes between moves, 
        //imagePath takes in image as a path string
        super(x,y,speed);
        this.image = loadImage(imagePath);
        this.timer = 0;
    }
    draw(){
        //draw image at x, y
        push();
        imageMode(CENTER);
        image(this.image, this.x, this.y);
        //add tile width and height
        pop();
    }
    update(){
        this.timer += deltaTime;
        if (this.timer > 1000 * 5.0/speed){
            this.wander();
            this.timer = 0;
        }
    }
}
