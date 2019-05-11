<template>
  <div class = "d-flex flex-row">
    <slide>
          <transition name="slide">
      <router-link :to = "myId"> 
        <font-awesome-icon icon="user" class="mt-1 mr-2"/>
        <span>Моя страница</span>
      </router-link>
          </transition>
      <router-link to="/feed">
        <font-awesome-icon icon="newspaper" class="mt-1 mr-2"/>
        <span>Новости</span>
      </router-link>
      <router-link to = "/im">
        <font-awesome-icon icon="envelope" class="mt-1 mr-2"/>
        <span>Сообщения</span>
      </router-link>
      <a href>
        <font-awesome-icon icon="project-diagram" class="mt-1 mr-2"/>
        <span>Проекты</span>
      </a>
      <a href>
        <font-awesome-icon icon="cog" class="mt-1 mr-2"/>
        <span>Настройки</span>
      </a>
    </slide>
  </div>
</template>

<script>
import { Slide } from "vue-burger-menu";
import Axios from 'axios';
export default {
  components: {
    Slide
  },
  data(){
    return{
      myId:''
    }
  },
  mounted(){
    if(!localStorage.getItem('myId'))
      this.$store.dispatch('SET_MY_ID').then(() => {
    this.myId = '/user/'+localStorage.getItem('myId')    
      })
    this.myId = '/user/'+localStorage.getItem('myId')    
  }
}
</script>

<style>
*{
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
}
  .bm-overlay {
      background:white;
    }

.bm-burger-button {
  position: relative !important;
  width: 30px !important;
  height: 30px !important;
  top: 10px !important;
  left: 10px !important;
  cursor: pointer;
}

.bm-burger-bars {
  /* background-color: #373a47; */
  background-color: #373a47;
}



.line-style {
  position: absolute;
  height: 19%;
  left: 0;
  right: 0;
}

@media screen and (max-width: 1200px) {
 .bm-burger-bars{
   background-color: white;
 } 
}
</style>

<style scoped>

textarea{
  margin-right:30%;
  resize:none;
  height:50px;
  border:2px solid black;
  margin-left: 3px;
}

nav > span {
  color: white;
  font-weight: 700;
  margin-left: 10px;

  font-size: 20px;
}
nav > a {
  text-decoration: none;
  color: #b8b7ad;
}

nav > a:hover {
  color: #c94e50;
}
nav > a > i {
  margin-top: 50px;
}
.navLink {
  color: white;
  font-weight: 600;
  font-size: 25px;
}
img {
  width: 50px;
  height: 50px;
}
.nb {
  height: 8vh;
  background-color: #373a47;
  width:100% !important;
}
#name {
  color: white;
  font-weight: 600;
  font-size: 18px;
}





</style>
