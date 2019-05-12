<template>
  <div>
    <div class="container p-2" style="word-wrap: break-word; ">
      <h2>{{myName}}</h2>
    </div>
    <div class="container">
      <input type="text" class="form-control" v-model="myName">
    </div>
    <div class="container selectable mt-2">
      <div class="d-flex">
        <div @click="toRight" class="cl el">Hashtags</div>
        <div @click="toLeft" class="cl el">People</div>
        <div class="slider align-self-end"></div>
      </div>
      <input
        placeholder="Search"
        type="text"
        @input="findEntered($event)"
        class="form-control mb-2"
      >
      <ul class="list-group">
        <li
          class="list-group-item listHash"
          v-for="(item, i) in currentList"
          :tabindex="i"
          :key="i"
          @click="selectHash($event)"
        >
          {{applyHash(item)}}
          <p-check
            name="check"
            class="myCheck p-round p-default p-smooth p-bigger"
            color="primary"
            v-model="checked[i]"
          ></p-check>
        </li>
      </ul>
    </div>
    <button class="btn btn-danger" @click="deleteChannel" v-if="hashId != -1">Удалить</button>
    <button class="btn btn-secondary" @click="updateChannel">Сохранить</button>
    <div
      class="notify bar-top"
      id="checkMail"
      data-notification-status="error"
    >Достигнуто максимальное количество каналов!</div>
  </div>
</template>

<script>
import Axios from "axios";
import _ from "lodash";
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
      menu: [],
      searchPeople: "",
      searchTags: "",
      peopleId: [],
      constPeople: [],
      constTags: [],
      avaliblePeople: [],
      avalibleTags: []
    };
  },
  methods: {
    applyHash(smth) {
      return this.arePeopleSelected ? smth : "#" + smth;
    },
    findEntered(event) {
      let currentStr = event.srcElement.value.toLowerCase();
      if (this.arePeopleSelected) {
        this.avaliblePeople = this.constPeople.filter(x => {
          return _.startsWith(x.toLowerCase(), currentStr) || currentStr == "";
        });
      } else {
        this.avalibleTags = this.constTags.filter(x => {
          return (
            _.startsWith(x.toLowerCase(), currentStr) ||
            _.startsWith("#" + x.toLowerCase(), currentStr) ||
            currentStr === ""
          );
        });
      }
    },
    deleteChannel() {
      this.$store.dispatch("DELETE_CHANNEL", this.channelId).then(() => {
        // if(this.channelId == localStorage.getItem('currentChannel'))
        if (this.hashId == localStorage.getItem("currentChannel")) {
          let a = this.$store.getters.GET_CHANNELS;
          if (this.hashId == 0 && a.length > 0) {
            let tmp = a[1];
            this.$store.dispatch("CHANGE_CHANNEL", tmp);
          } else if (a.length > this.hashId + 1) {
            this.$store.dispatch("CHANGE_CHANNEL", a[this.hashId + 1]);
          } else if (this.hashId == a.length - 1) {
          }
        }
        this.$emit("close");
      });
    },

    showNotification() {
      console.log("a");
      $(".notify")
        .removeClass()
        .addClass("bottom-right" + " " + "error")
        .addClass("do-show");

      event.preventDefault();
      setTimeout(function() {
        $(document.getElementById("checkMail"))
          .removeClass()
          .addClass("notify")
          .addClass("bar-top");
      }, 5000);
    },

    updateChannel() {
      if (this.channelId != -1) {
        let newChan = {
          people: this.peopleId.filter((item, i) => {
            return this.peopleChecks[i] == true;
          }),
          name: this.myName,
          id: this.channelId,
          tags: this.avalibleTags.filter((item, i) => {
            return this.tagChecks[i] == true;
          })
        };

        this.$store.dispatch("UPDATE_CHANNEL", newChan).then(() => {
          this.$store.dispatch("CHANGE_CHANNEL", newChan);
          this.$emit("close");
        });
      } else {
        let newChan = {
          people: this.peopleId.filter((item, i) => {
            return this.peopleChecks[i] == true;
          }),
          name: this.myName,
          tags: this.avalibleTags.filter((item, i) => {
            return this.tagChecks[i] == true;
          })
        };
        this.$store
          .dispatch("CREATE_CHANNEL", newChan)
          .then(() => {
            if (localStorage.getItem("currentChannel") == 0) {
              this.$store.dispatch("CHANGE_CHANNEL", newChan);
            }
            this.$emit("close");
          })
          .catch(err => {
            if (parseInt(err.response.status) == 406) {
              this.showNotification();
              setTimeout(() =>{
                this.$emit("close");
              }, 4500)
            }
            
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
      // if(this.arePeopleSelected)
      // this.checked[event.target.tabIndex] = !this.checked[event.target.tabIndex]
      //TODO: apply to the new list
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
    myPosts() {
      return this.$store.getters.GET_POSTS;
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
    this.$store.dispatch("FETCH_DATA");

    Axios.post(
      this.$store.getters.GET_URL + "/users/all",
      {},
      { withCredentials: true }
    )
      .then(response => {
        response.data.forEach(elem => {
          if (!this.peopleId.includes(elem.id)) {
            this.avaliblePeople.push(elem.lastName + " " + elem.firstName);
            this.constPeople.push(elem.lastName + " " + elem.firstName);
            this.peopleId.push(elem.id);
          }
        });
      })
      .then(() => {
        if (this.hashId == -1) this.myName = "newChannelName";
        else {
          this.peopleId.forEach(element => {
            if (this.myChannels[this.hashId].people.includes(element)) {
              this.peopleChecks.push(true);
            } else this.peopleChecks.push(false);
          });

          this.constTags.forEach(element => {
            if (this.myChannels[this.hashId].tags.includes(element)) {
              this.tagChecks.push(true);
            } else this.tagChecks.push(false);
          });
          this.myName = this.myChannels[this.hashId].name;
          this.channelId = this.myChannels[this.hashId].id;
        }
      });
  },
  props: ["hashId"],
  watch: {
    myPosts(newVal, oldVal) {
      this.avalibleTags = [];
      this.constTags = [];
      if (this.myPosts)
        this.$nextTick(() => {
          newVal.forEach(elem => {
            elem.tags.forEach(tag => {
              if (!this.avalibleTags.includes(tag)) {
                this.avalibleTags.push(tag);
                this.constTags.push(tag);
              }
            });
          });
          if (this.hashId >= 0)
            this.constTags.forEach(element => {
              if (this.myChannels[this.hashId].tags.includes(element)) {
                this.tagChecks.push(true);
              } else this.tagChecks.push(false);
            });
        });
    }
  }
};
</script>

<style scoped>
.selectable {
}
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

.bottom-right {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20px;
  color: #fff;
  line-height: 1.3;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
  max-width: 350px;
  margin: 20px;
  bottom: 0;
  right: 0;
  transform: translateX(420px);
  background-color: #ef5350;
}
@keyframes slide-in-right {
  to {
    transform: translateX(0);
  }
}
.bottom-right.do-show {
  animation: slide-in-right 1s ease-in-out forwards,
    slide-in-right 1s ease-in-out reverse forwards 4s;
}

.bottom-right[data-notification-status="error"] {
  background-color: #ef5350;
}
.bottom-right[data-notification-status="error"]:before {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  min-width: 30px;
  margin-right: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016' fill='%23C61512'/%3E%3Cpath d='M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z' fill='%23C61512'/%3E%3C/svg%3E")
    center / cover no-repeat;
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

.bar-top {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20px;
  color: #fff;
  line-height: 1.3;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
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
