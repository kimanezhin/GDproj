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
        v-for="(item, i) in currentList"
        :tabindex="i"
        :key="i"
        @click="selectHash($event)"
      >
        {{item}}
        <p-check
          name="check"
          class="myCheck p-round p-default p-smooth p-bigger"
          color="primary"
          v-model="checked[i]"
        ></p-check>
      </li>
    </ul>
    
    <button class="btn btn-danger" v-if="hashId != -1">Удалить</button>
    <button class="btn btn-secondary" @click="updateChannel">Сохранить</button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      myName: "Hello",
      channelId: -1,
      tagChecks: [],
      peopleChecks: [],
      value: "Choose tags",
      arePeopleSelected: true,
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
      ],
      avaliblePeople: [5051, 9, 42, 228],
      avalibleTags: [
        "ялюблюсвоюработу",
        "ильяСоси",
        "пи",
        "костяСоси",
        "иадсосет"
      ]
    };
  },
  methods: {
    updateChannel() {
      if (this.channelId != -1) {
        this.$store
          .dispatch("UPDATE_CHANNEL", {
            people: this.avaliblePeople.filter((item, i) => {
              return this.peopleChecks[i] == true;
            }),
            name: this.myName,
            id: this.channelId,
            tags: this.avalibleTags.filter((item, i) => {
              return this.tagChecks[i] == true;
            })
          })
          .then(() => {
            this.$emit("close");
          });
      } else {
        console.log(this.channelId);
        console.log({
          people: this.avaliblePeople.filter((item, i) => {
            return this.peopleChecks[i] == true;
          }),
          name: this.myName,
          tags: this.avalibleTags.filter((item, i) => {
            return this.tagChecks[i] == true;
          })
        });
        this.$store.dispatch("CREATE_CHANNEL", {
          people: this.avaliblePeople.filter((item, i) => {
            return this.peopleChecks[i] == true;
          }),
          name: this.myName,
          tags: this.avalibleTags.filter((item, i) => {
            return this.tagChecks[i] == true;
          })
        });
      }
    },
    toRight() {
      this.arePeopleSelected = !this.arePeopleSelected;
      document
        .getElementsByClassName("slider")[0]
        .classList.add("slider-translate");
      document.getElementsByClassName("cl")[1].style.color = "black";
      document.getElementsByClassName("cl")[0].style.color = "#428bff";
    },
    toLeft() {
      this.arePeopleSelected = !this.arePeopleSelected;
      document
        .getElementsByClassName("slider")[0]
        .classList.remove("slider-translate");
      document.getElementsByClassName("cl")[0].style.color = "black";
      document.getElementsByClassName("cl")[1].style.color = "#428bff";
    },
    selectHash(event) {
      this.menu[0].list[event.target.tabIndex].check = !this.menu[0].list[
        event.target.tabIndex
      ].check; //TODO: apply to the new list
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
  computed: {
    myChannels() {
      return this.$store.getters.GET_CHANNELS;
    },
    people() {
      return this.myChannels[this.hashId][0].people;
    },
    tags() {
      return this.myChannels[this.hashId][0].tags;
    },
    currentList() {
      return this.arePeopleSelected ? this.avaliblePeople : this.avalibleTags;
    },
    checked() {
      return this.arePeopleSelected ? this.peopleChecks : this.tagChecks;
    }
  },
  mounted() {
    if (this.hashId == -1) this.myName = "#newChannelName";
    else {
      this.avaliblePeople.forEach(element => {
        if (this.myChannels[this.hashId].people.includes(element)) {
          this.peopleChecks.push(true);
        } else this.peopleChecks.push(false);
      });

      this.avalibleTags.forEach(element => {
        if (this.myChannels[this.hashId].tags.includes(element)) {
          this.tagChecks.push(true);
        } else this.tagChecks.push(false);
      });
      this.myName = this.myChannels[this.hashId].name;
      this.channelId = this.myChannels[this.hashId].id;
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
