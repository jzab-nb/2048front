<template>
  <div class="myBody">
    <div id="heads">
      <h1 class="title">{{title}}</h1>
      <div class="score">
        <div class="score-title">得分</div>
        <div class="score-body" id="now-score">{{gameData.score}}</div>
      </div>
      <div class="score">
        <div class="score-title">最高分</div>
        <div class="score-body" id="best-score">{{gameData.max_score}}</div>
      </div>
    </div>
    <div id="begin-games" @mousedown="startGames" @mouseup="updateBlocks">
      开始新游戏
    </div>
    <div id="games">
      <div class="line">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div class="line">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div class="line">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div class="line">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div v-for="block in gameData.blocks" class="block" :class="block.classObj" :style="block.activateStyle">{{block.num}}</div>
    </div>
  </div>

</template>

<script>
import css from "../assets/css/game.css";
import {GameData} from "../assets/js/game.js"

let gameData = new GameData();

export default {
  created() {
    this.keyDown();
    this.keyUp();
  },
  name: "Main",
  components: {},
  data:()=> {
    return {
      title: "2048",
      gameData
    };
  },
  methods:{
    startGames(){
      gameData.startGame(this);
      console.log(gameData);
    },
    updateBlocks(){
      gameData.updateBlocks();
    },
    keyDown(){
      document.onkeydown = (event) => {
        //W:87 D:68 S:83 A:65
        //上:33 右:35 下:34 左:36
        console.log(event.keyCode);
        // if(flag){
          switch(event.keyCode){
            case 38:
            case 87:gameData.move(0);break;
            case 39:
            case 68:gameData.move(1);break;
            case 40:
            case 83:gameData.move(2);break;
            case 37:
            case 65:gameData.move(3);break;
          }
        // }
      }
    },
    keyUp(){
      document.onkeyup = (event) => {
        switch(event.keyCode){
          case 38:
          case 39:
          case 40:
          case 37:
          case 87:
          case 68:
          case 83:
          case 65: gameData.updateBlocks();
        }
      }
    }
  }
}
</script>
<style>

</style>
