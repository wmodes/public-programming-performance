class AnimalNPC extends NPC{
    constructor(x,y,speed,imagePath){
        //speed is inversely related to the amount of seconds it takes between moves, 
        //imagePath takes in image as a path string
        super(x,y,speed);
        this.image = imagePath;
        this.timer = 0;
    }
    draw(p, [camera_x, camera_y]){
        let [screen_x, screen_y] = p.worldToScreen(
            [this.x, this.y],
            [camera_x, camera_y]
        );
        p.push();
        
        p.print(screen_x,screen_y);

        p.translate(0 - screen_x, screen_y);
        
        ///
    
        p.image(this.image,0,0);

        ///
    
        p.pop();
    
    }
    update(){
        this.timer += 10;
        if (this.timer > 1000 * 5.0/this.speed){
            this.wander();
            this.timer = 0;
        }
    }
}
