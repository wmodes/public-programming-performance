class AnimalNPC extends NPC{
    constructor(x,y,speed,imageArr){
        //speed is inversely related to the amount of seconds it takes between moves, 
        //imagePath takes in image as a path string
        super(x,y,speed);
        this.imageArr = imageArr;
        this.timer = 0;
        this.currentFrame = 0;
        this.direction = 0;
        this.updateImage();
    }
    wander(){
        let temp = super.wander();
        this.direction = temp;
        this.updateImage();
    }
    draw(p, [camera_x, camera_y]){
        let [screen_x, screen_y] = p.worldToScreen(
            [this.x, this.y],
            [camera_x, camera_y]
        );
        p.push();

        p.translate(0 - screen_x, screen_y);
        //p.print(this.currImage);

        p.image(this.currImage,0,0);

        p.pop();
    
    }
    update(){
        this.timer += 10;
        if (this.timer > 1000 * 5.0/this.speed){
            this.wander();
            this.timer = 0;
        }
        if (this.timer % 150 == 0){
            this.nextFrame();
        }
    }
    nextFrame(){
        this.currentFrame += 1;
        if (this.currentFrame >= this.imageArr[0].length){
            this.currentFrame = 0;
        } 
        this.updateImage();
    }
    updateImage(){
       
        this.currImage = this.imageArr[this.direction][this.currentFrame];
    }
}
