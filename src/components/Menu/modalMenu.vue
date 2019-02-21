<template>
  <div>
    <div class="container nameContainer">
      <h1>{{myName}}</h1>
    </div>
    <div class="container">
      <input type="text" class="form-control p-3 mb-2 mt-2" v-model="myName" v-on:keyup="changeName($event)">
    </div>
    <div class="container">
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item">
          <div class="nav-link active" v-on:click="setActive" id="tags">Tags</div>
        </li>
        <li class="nav-item">
          <div class="nav-link" v-on:click="setActive" id="people">People</div>
        </li>
      </ul>
    </div>
    <div class="container myList">
      <ul class = "list-group">
        <li class = "list-group-item">1</li>
        <li class = "list-group-item">2</li>
        <li class = "list-group-item">3</li>

      </ul>
    </div>
    <div  class="container d-flex align-items-end ">
        <button class = "btn btn-primary ml-auto">Сохранить</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myName: "Hello"
    };
  },
  methods: {
    changeName(event) {},
    setActive() {
      var first = document.getElementById("tags");
      var second = document.getElementById("people");
      if (first.classList.contains("active")) {
          this.setClasses(first,second);
      }
      else{
          this.setClasses(second,first);
      }
    },
    setClasses(first, second) {
      first.classList.remove("active");
      second.classList.add("active");
    }
  },
  mounted() {
    this.myName = this.$store.state.dataStorage.channels[
      parseInt(this.hashId)
    ].name;
  },
  props: ["hashId"]
};
</script>

<style scoped>
#tags:hover,#people:hover{
    cursor: pointer;
}
.myList{
    height: 120px;
    overflow-y: scroll;
}
.nameContainer {
  height: 40px;
}
input {
}
</style>