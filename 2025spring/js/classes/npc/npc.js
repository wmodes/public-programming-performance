class NPC {
    constructor(x,y,speed){
        //
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    draw(p, [camera_x, camera_y]){

    }
    move(arr){
        //takes in an arr that is an x,y pair 
        this.x += arr[0];
        this.y += arr[1];
    }
    update(){

    }
    wander(){
        this.move([
            Math.pow(-1,get_random_int_between_inclusive(0,1)),
            Math.pow(-1,get_random_int_between_inclusive(0,1))])
    }
}

function get_random_int_between_inclusive(x,y){
    return Math.floor(Math.random() * (y + 1 - x)) + x
    
}