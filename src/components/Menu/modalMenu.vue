<template>
  <div>
    <div class="container nameContainer">
      <h1>{{myName}}</h1>
    </div>
    <div class="container">
      <input
        type="text"
        class="form-control p-3 mb-2 mt-2"
        v-model="myName"
        v-on:keyup="changeName($event)"
      >
    </div>
    <div class="container d-flex justify-content-center">
      <div class="mt-1">
        <v-selectmenu
          :data="menu"
         
          title="Helo"
          :multiple="true"
          key-field="id"
          show-field="name"
          v-model="value"
        ></v-selectmenu>
      </div>
    </div>
    <!-- <div class="container d-flex align-items-end" style="margin-top:210px;">
      <button class="btn btn-outline-secondary" id="save">Сохранить</button>
      <button class="btn btn-outline-danger ml-5" id="delete">Удалить</button>
    </div> -->
    <div class = "container-fluid d-flex mt-5 mr-5 justify-content-end">
      <button class = "btn btn-outline-primary">Сохранить</button>
      <button class = "btn btn-outline-danger ml-2">Удалить канал</button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      myName: "Hello",
      value: "Choose tags",

      menu: [
        {
          title: "Tags",
          list: [
            {
              id: 1,
              name: "#someHash"
            },
            {
              id: 2,
              name: "#someHash"
            },
            {
              id: 3,
              name: "#someHash"
            },
            {
              id: 4,
              name: "#someHash"
            },
            {
              id: 5,
              name: "#someHash"
            }
          ]
        },
        {
          title: "People",
          list: [
            {
              id: 6,
              name: "#someHash"
            },
            {
              id: 7,
              name: "#someHash"
            },
            {
              id: 8,
              name: "#someHash"
            },
            {
              id: 9,
              name: "#someHash"
            },
            {
              id: 10,
              name: "#someHash"
            }
          ]
        }
      ]
    };
  },
  methods: {
    changeName(event) {},
    setActive() {
      var first = document.getElementById("tags");
      var second = document.getElementById("people");
      if (first.classList.contains("active")) {
        this.setClasses(first, second);
      } else {
        this.setClasses(second, first);
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
#tags:hover,
#people:hover {
  cursor: pointer;
}
.myList {
  height: 200px;
  overflow-y: scroll;
}
.nameContainer {
  height: 40px;
}
</style>