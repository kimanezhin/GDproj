<template>
  <div class="con">
      <div @click="goToAuthor" :class="{'authorRight':isItMe, 'authorLeft':!isItMe}">
          {{Author}}
      </div>
    <div :class="{'message-orange':isItMe, 'message-blue':!isItMe}">
      <p v-html="makeMarked(Text)" class="message-content"></p>
      <div
        :class="{ 
            'message-timestamp-left' :isItMe, 'message-timestamp-right':!isItMe}"
      >{{Time}}</div>
    </div>
  </div>
</template>

<script>
import marked from "marked";
export default {
  components: {
    marked
  },
  props: {
    Text: {
      type: String,
      default: ""
    },
    Time: {
      type: String,
      default: "00:00"
    },
    isItMe: {
      type: Boolean
    },
    Author:{
        type: String,
        default:""
    },
    AuthorId:{
      type:Number,
      default:5051
    }
  },
  data() {
    return {
      data: "",
      sender: ""
    };
  },
  methods: {
    makeMarked(text) {
      return marked(text);
    },
    goToAuthor(){
      this.$router.push('/user/'+this.AuthorId);
    }
  }
};
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400);


.authorLeft{
 position: relative;
  margin-left: 20px;
}
.authorLeft, .authorRight{
    font-weight: 500;
    
}
.authorLeft:hover, .authorRight:hover{
  text-decoration: underline;
  cursor: pointer;
}
.authorRight{
position: relative;
  margin-left: calc(70%);
}

.container {
  width: 100%;
  padding: 10px;
}

.message-blue {
  position: relative;
  margin-left: 20px;
  margin-bottom: 10px;
  padding: 10px;
 background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,114,255,1) 0%, rgba(0,132,255,1) 90% );
 color: white;
 
 
 
 /* background-color: #609cfc; */
 min-width: 20%;
  max-width: 50%;
  
  min-height: 50px;
  text-align: left;
  font: 400 0.9em "Open Sans", sans-serif;
  border: 1px solid #428bff;
  border-radius: 10px;
}

.imgRight {
  position: relative;
  margin-bottom: 10px;
  margin-left: calc(100% - 30px);
}

.imgLeft {
  position: relative;
  margin-left: 20px;
  margin-bottom: 10px;
}

.message-orange {
  position: relative;
  margin-bottom: 10px;
  margin-left: calc(50% - 15px);
  /* margin-left: 70%; */
  padding: 10px;
  background-color: #ecedef;
  width: 50%;
  min-width: 10%;
  min-height: 50px;
  text-align: left;
  font: 400 0.9em "Open Sans", sans-serif;
  border: 1px solid #ecedef;
  border-radius: 10px;
}

.message-content {
  padding: 0px;
  margin: 0;
  word-break: break-all;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
}

.message-timestamp-left, .message-timestamp-right{
  color: white;
}

.message-timestamp-right {
  position: absolute;
  font-size: 0.85em;
  font-weight: 500;
  bottom: 5px;
  right: 5px;
  
}

.message-timestamp-left {
  position: absolute;
  font-size: 0.85em;
  font-weight: 500;
  bottom: 5px;
  left: 5px;
  color: #7F7F7F;
}

.message-blue:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 15px solid  radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,114,255,1) 0%, rgba(0,132,255,1) 90% );
 ;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  top: 0;
  left: -15px;
}

.message-blue:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 17px solid  radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,114,255,1) 0%, rgba(0,132,255,1) 90% );

  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  top: -1px;
  left: -17px;
}

.message-orange:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  /* border-bottom: 15px solid #ecedef; */
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  bottom: 0;
  right: -15px;
}

.message-orange:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  /* border-bottom: 17px solid #ecedef; */
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  bottom: -1px;
  right: -17px;
}
</style>


