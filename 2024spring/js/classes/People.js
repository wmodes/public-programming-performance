
class Person{
  static time = 0;
  constructor(i, j){
    this.i = i;
    this.j = j;
    this.timer = floor(random(0, 100))
    this.updateDirection();
  }
  static drawPerson(i, j){
    for(let Index in people){
      if(people[Index].i === i && people[Index].j === j){
        let height = window.tiles.getHeight(i, j);
        let ratio = PersonImage.height/PersonImage.width;
        let tmpWidth = 20;
        image(PersonImage, -tmpWidth/2, -tmpWidth*ratio - height, tmpWidth, tmpWidth*ratio);
        return;
      }
    }
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
  checkMove(di, dj){
    if(!window.tiles.isIsland(this.i + di, this.j + dj)){
      this.updateDirection();
      return false;
    }
    let key = this.index;
    for (let key2 in people) {
      if(key !== key2){
        if(people[key].i + di === people[key2].i && people[key].j + dj === people[key2].j){
          this.updateDirection();
          return false;
        }
      }
    }
    return true;
  }
  static movePeople = function(){
    if (!keyIsDown(32)) {
      Person.time++;
      for(key in people){
        if((Person.time + people[key].timer) % 100 === 0){

          let tx = people[key].i + people[key].dx*10;
          let ty = people[key].j + people[key].dy*10;

          let minDist = Infinity;
          let rx = 0;
          let ry = 0;
          let sqDist = function(x1, y1, x2, y2){
            return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
          }
          for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
              let d = sqDist(people[key].i + i, people[key].j + j, tx, ty);
              if(d < minDist && people[key].checkMove(i, j)){
                minDist = d;
                rx = i;
                ry = j;
              }
            }
          }
          people[key].i += rx;
          people[key].j += ry;
        }
      }
    }
  }
}



function addPerson(i,j) {
  for(key in people){
    if(people[key].i === i && people[key].j === j){
      people.splice(key, 1);
      for(let I = 0; I < people.length; I++){
        people[I].index = I;
      }
      return;
    }
  }
  let tmp = new Person(i, j);
  tmp.index = people.length;
  people.push(tmp);

}
// function movePeople(){
// }





