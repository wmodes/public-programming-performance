class NPC {
    constructor(x,y,speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    draw(){

    }
    move(arr){
        //takes in an arr that is an x,y pair 
        this.x += arr[0];
        this.y += arr[1];
    }
    update(){
        
    }
}

