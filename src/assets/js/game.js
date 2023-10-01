let colorMap = {
  2   : {color:[0,0,0,1],bgc:[254,184,184,1],shadow:0},
  4   : {color:[0,0,0,1],bgc:[212,212,161,1],shadow:0},
  8   : {color:[0,0,0,1],bgc:[181,226,128,1],shadow:0},
  16  : {color:[0,0,0,1],bgc:[82, 231, 119, 1],shadow:20},
  32  : {color:[0,0,0,1],bgc:[25, 146, 112,1],shadow:20},
  64  : {color:[0,0,0,1],bgc:[8, 75, 131,1],shadow:25},
  128 : {color:[0,0,0,1],bgc:[100, 31, 128,1],shadow:25},
  256 : {color:[255, 255, 255,1],bgc:[224, 240, 9,1],shadow:30},
  512 : {color:[255, 255, 255,1],bgc:[115, 138, 0,1],shadow:30},
  1024: {color:[255, 255, 255,1],bgc:[5, 0, 0,1],shadow:30},
  2048: {color:[0,0,0,1],bgc:[255, 255, 255,1],shadow:40},
  get(key,default_val=null){
    if(this[key] != null){
      return this[key];
    }else{
      return default_val;
    }
  }
}

export class Block{

  // 构造一个方块
  constructor(num,x,y,status,color,bgc,shadow) {
    this.num = num;
    // 是出现还是合成
    this.classObj = {
      "block-new": "new"===status,
      "block-appear": "appear"===status
    };
    // 方块阴影
    shadow = colorMap.get(num,{shadow:0}).shadow;
    // 方块颜色和背景色
    if(color==null){
      color= colorMap.get(num,{color:[0,0,0,1]}).color;
    }
    if(bgc==null){
      bgc= colorMap.get(num,{bgc:[255,255,255,1]}).bgc;
    }
    // 设置样式,位置计算得出
    this.activateStyle = {
      top : x*100+(2*x+1)*8.75+"px",
      left : y*100+(2*y+1)*8.75+"px",
      color: `RGBA(${color})`,
      backgroundColor: `RGBA(${bgc})`,
      "box-shadow": `0 0 ${shadow}px RGBA(${bgc})`
    }
  }

  move(x,y){
    this.activateStyle["top"] = x*100+(2*x+1)*8.75+"px";
    this.activateStyle["left"] = y*100+(2*y+1)*8.75+"px";
  }
}

export class GameData{
  constructor() {
    this.score = 0;
    this.max_score = 0;
    this.blocks = [];
    this.data = [
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null]
    ];
  }

  startGame(){
    this.data = [
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null],
      [null,null,null,null]
    ];
    this.blocks = [];
    this.blocksCache = [];
    this.deleteCache = []
    this.newBlock(2);
    this.newBlock(2);
    this.score = 0;
    this.max_score = 0;
  }

  newBlock(val){
    let empetyCell = []
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        if(this.data[i][j] == null) empetyCell.push([i,j]);
      }
    }
    let [ci,cj] = empetyCell[
      Math.round(Math.random()*(empetyCell.length-1))
    ];
    if(val===null || val===undefined){
      val = [2,2,4,4][Math.round(Math.random()*3)];
    }
    this.data[ci][cj] = new Block(val,ci,cj,"appear");
    this.blocksCache.push(this.data[ci][cj]);
  }

  updateBlocks(){
    console.log("===================")
    this.blocks = this.blocks.concat(this.blocksCache);
    console.log(this.blocks);
    for(let block of this.deleteCache){
      console.log("删除-"+this.blocks.indexOf(block));
      this.blocks.splice(this.blocks.indexOf(block),1);
    }
    this.deleteCache = [];
    this.blocksCache = [];
    console.log(this.blocks);
  }

  move(direction){
    // 上右下左的移动
    switch (direction){
      case 0: this.moveUp();break ;
      case 1: break;
      case 2: break;
      case 3: break;
    }
    this.newBlock();
    // console.log(this.data);
  }

  moveUp(){
    // 取出一列
    for(let j in this.data){
      // 两个指针,默认指向前两位
      let front_i = 1;
      // 后指针不能指向空,
      let last_i = 0;
      // 两个相邻则进行合并尝试
      while(front_i<4){
        // 前指针指向空,前指针自增,退出循环
        if(this.data[front_i][j] == null) {front_i++;continue;}
        // 后指针指向空,把前指针的块移动过去
        if(this.data[last_i][j] == null){
          this.data[last_i][j] = this.data[front_i][j];
          this.data[last_i][j].move(last_i,j);
          this.data[front_i][j] = null;
          front_i = last_i+1;
          continue;
        }
        // 前后指针指向的块不相邻,移动到相邻
        if(front_i !== last_i+1){
          this.data[last_i+1][j] = this.data[front_i][j];
          this.data[last_i+1][j].move(last_i+1,j);
          this.data[front_i][j] = null;
          front_i = last_i+1;
        }
        // 能合并
        if(this.data[last_i][j].num === this.data[front_i][j].num){
          this.deleteCache.push(this.data[front_i][j]);
          this.deleteCache.push(this.data[last_i][j]);
          this.data[last_i][j] = new Block(this.data[front_i][j].num*2,last_i,j,"new");
          this.data[front_i][j].move(last_i,j);
          this.data[front_i][j] = null;
          continue;
        }
        // 不能合并
        last_i = front_i;
        front_i++;
      }
    }
  }
}
