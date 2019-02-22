<template>
  <div>
    <transition-group name="list" tag="p">
      <div class="mb-4 post" v-for="post in posts" :key="post.postId">
        <div class="postHeader mb-1">
          <img src="../../../img/chern.jpg" alt>
          <div class="align-self-end ml-3 font-weight-bold">{{post.name}}</div>
          <div class="align-self-end mr-3 ml-auto font-weight-bold">01.01.2019</div>
        </div>
        <div class="text">
          <div class="transit" v-readMore:300="post.postBody"></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    checkPosts() {
      
    }
  },
  mounted() {
   
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 1s;
}
.text {
  width: 35vw;
}
div {
  max-width: 100%;
}
.postHeader {
  display: flex;
}
img {
  width: 51px;
  height: 51px;
}



@media screen and (max-width: 1200px) {
  #menu {
    display: none;
  }
  div {
    /* margin: 0; */
  }

  .text {
    width: 100vw;
   
  }

  .post {
    width: 85vw;
   
  }
  .transit{
       width: 85vw;
   
  }
}
</style>
