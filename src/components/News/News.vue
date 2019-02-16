<template >
  <div class = "row">
    <div class="col-md-4 col-sm-12 mt-4">
      <post-editor/>
      <news-column  v-bind:posts= "posts"/>
    </div>
    <div class="col-md-4 col-sm-12 text mt-4">
      <news-column class = "ml-md-5 ml-0"  v-bind:posts= "posts"/>
    </div>
  </div>
</template>

<script>
import newsColumn from "./newsColumn";
import postEditor from "./postEditor";
export default {
  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    newsColumn,
    postEditor
  },
  methods: {
    getPosts(i) {
      return this.arr.filter(post => parseInt(post.num) == i);
    }
  }
};
</script>
<style scoped>
</style>
