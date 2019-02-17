<template>
  <div class>
    <div class="ml-4 title">messages</div>
    <div class="ml-2 smth">
      <a href="#" 
       v-for="(message, index) in messages" :key="index">{{message}}</a>//TODO:
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            currentChannel:1,
            active:true
        }
    },
  props: {
    messages: Array
  }
};
</script>
<style >
.smth {
  display: flex;
  flex-direction: column;
}
.current{
color:black;
}

.simple{
font-size: 50px !important;
}

.title,
.smth {
  font-size: 19px;
}
.title {
  color: #a2a2a2;
}

.smth > a {
  text-emphasis: none;
  text-decoration: none;

  color: black;
}
.first{
font-size: 500px;
}
.second{
font-size: 500px;
}
</style>