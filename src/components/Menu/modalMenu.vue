<template>
  <div>
    <h2>{{myName}}</h2>
    <div class="container">
      <input type="text" class="form-control" v-model="myName">
    </div>
    <div class="d-flex">
      <div @click="toRight" class="cl el">Hashtags</div>
      <div @click="toLeft" class="cl el">People</div>
      <div class="slider align-self-end"></div>
    </div>
    <ul class="list-group">
      <li
        class="list-group-item listHash"
        v-for="(item, i) in menu[0].list"
        :tabindex="i"
        :key="item.id"
        @click="selectHash($event)"
      >
        {{item.name}}
        <p-check
          name="check"
          class="myCheck p-round p-default p-smooth p-bigger"
          color="primary"
          v-model="item.check"
        ></p-check>
      </li>
    </ul>
    <button class="btn btn-danger" v-if = "hashId != -1">Удалить</button>
    <button class="btn btn-secondary">Сохранить</button>
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
              name: "#someHash",
              check: false
            },
            {
              id: 2,
              name: "#someHash",
              check: false
            },
            {
              id: 3,
              name: "#someHash",
              check: false
            },
            {
              id: 4,
              name: "#someHash",
              check: false
            },
            {
              id: 5,
              name: "#someHash",
              check: false
            },
            {
              id: 6,
              name: "#someHash",
              check: false
            },
            {
              id: 7,
              name: "#someHash",
              check: false
            },
            {
              id: 8,
              name: "#someHash",
              check: false
            },
            {
              id: 9,
              name: "#someHash",
              check: false
            },
            {
              id: 10,
              name: "#someHash",
              check: false
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
    toRight() {
      document
        .getElementsByClassName("slider")[0]
        .classList.add("slider-translate");
      document.getElementsByClassName("cl")[1].style.color = "black";
      document.getElementsByClassName("cl")[0].style.color = "#428bff";
    },
    toLeft() {
      document
        .getElementsByClassName("slider")[0]
        .classList.remove("slider-translate");
      document.getElementsByClassName("cl")[0].style.color = "black";
      document.getElementsByClassName("cl")[1].style.color = "#428bff";
    },
    selectHash(event) {
      this.menu[0].list[event.target.tabIndex].check = !this.menu[0].list[
        event.target.tabIndex
      ].check;
    },
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
    if (this.hashId == -1) this.myName = "#newChannelName";
    else {
      this.myName = this.$store.state.dataStorage.channels[
        parseInt(this.hashId)
      ].name;
    }
  },
  props: ["hashId"]
};
</script>

<style scoped>
.cl {
  height: 40px;
  width: 50%;
  text-align: center;
  z-index: 10;
  font-weight: 600;
  font-size: 22px;
}
.cl:hover {
  cursor: pointer;
}
.slider {
  left: 50%;
  z-index: 9;
  position: absolute;
  background-color: #428bff;
  width: 30%;
  margin-left: 10%;
  margin-right: 10%;

  height: 5px;
  transition: 0.3s ease;
}

.slider-translate {
  transform: translateX(-170%);
  transition: 0.3s ease;
}

.myCheck {
  float: right;
}
button {
  float: right;
  margin: 10px;
}
li:focus {
  border: none !important;

  -webkit-box-shadow: none;
  box-shadow: none;
}

li {
  border: none !important;
}
ul {
  height: 200px;
}
ul {
  overflow: hidden;
  overflow-y: scroll;
}

li:hover {
  cursor: pointer;
}
#tags:hover,
#people:hover {
  cursor: pointer;
}
.nameContainer {
  height: 40px;
}
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>
