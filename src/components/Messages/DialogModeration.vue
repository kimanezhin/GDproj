<template>
  <div class="d-flex flex-column">
    <div class="exitCross">
      <font-awesome-icon @click="simpleClose" icon="times"/>
    </div>
    <div class="header">Информация</div>

    <div v-if="!isPersonal || isNotCreation" class="title d-flex flex-row">
      <div class="subTitle">{{Title}}</div>
      <div v-if="isAdmin" class="edit">
        <font-awesome-icon id="editIcon" @click="editTitle" icon="pencil-alt"/>
        <font-awesome-icon id="saveIcon" @click="saveTitle" icon="check"/>
      </div>
    </div>
    <hr width="100%" size="4">
    <div class="usersCount">
      <div class="d-flex justify-content-around">
        <div @click="toRight" class="cl el justify-content-center d-flex flex-row">
          <div v-if="isNotCreation" class="people">Все участники:</div>
          <div v-else class="people">Личное сообщение</div>
          <div v-if="isNotCreation" class="num ml-1">{{usersCount}}</div>
        </div>
        <div @click="toLeft" class="cl el justify-content-center d-flex flex-row">
          <div v-if="isNotCreation" class="people">Администраторы:</div>
          <div v-else class="people">Беседа</div>
          <div v-if="isNotCreation" class="num ml-1">{{adminsCount}}</div>
        </div>
        <div class="slider slider-translate align-self-end"></div>
      </div>
    </div>
    <hr width="100%" size="4">
    <div v-if="isAdmin" class="input-group p-1">
      <div class="userInput">
        <multiselect
        v-model="selectedCountries"
        id="ajax"
        label="name"
        track-by="code"
        placeholder="Type to search"
        open-direction="bottom"
        :options="countries"
        :multiple="true"
        :isSpaceAllowed="true"
        :internal-search="true"
        :searchable="false"
        :loading="isLoading"
        :max-height="600"
        @search-change="asyncFind"
        >
        <template slot="tag" slot-scope="{ option, remove }">
          <span class="custom__tag">
            <span>{{ option.name }}</span>
            <span class="custom__remove" @click="remove(option)">❌</span>
          </span>
        </template>
        <template slot="clear" slot-scope="props">
          <div
          class="multiselect__clear"
          v-if="selectedCountries.length"
          @mousedown.prevent.stop="clearAll(props.search)"
          ></div>
        </template>
        <span slot="noResult">Oops! No elements found.</span>
      </multiselect>
    </div>

      <!-- <div class="input-group-append">
        <button class="btn btn-outline-secondary" @click="addUser" type="button">Добавить</button>
      </div>-->
    </div>
    <hr width="100%" size="4">

    <div class="moderation">
      <div v-if="isNotCreation" class="container">
        <Person
        v-for="(prs, index) in users"
        :key="prs[0]"
        v-on:changeAdmin="changeAdmin"
        v-on:deletePerson="deletePerson"
        :index="index"
        :id="parseInt(prs[0])"
        :user="prs[1]"
        :isAdmin="isAdmin"
        :vModel="prs[1].isAdmin"
        />
      </div>
    </div>
    <div class="footer p-2">
      <button
      v-if="isAdmin"
      class="btn btn-outline-primary mr-2 btn-block"
      @click="updateChannel"
      >Сохранить</button>
      <button
      v-if="isNotCreation"
      class="btn btn-outline-danger mr-2 btn-block"
      @click="leaveChannel"
      >Покинуть канал</button>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import multiselect from "vue-multiselect";
import sendMsg from "./SendMessageModal";
import Person from "./PersonInModeration";
export default {
  components: {
    multiselect,
    Person
  },
  data() {
    return {
      textBefore: "",
      currentDialog: {},
      users: [],
      notFilteredUsers: [],
      myMap: "",
      adminsCount: 0,
      usersCount: 0,
      imgPath: "",
      isLoading: false,
      countries: [],
      selectedCountries: [],
      isPersonal: true
    };
  },
  computed: {
    isAdmin() {
      let id = parseInt(localStorage.getItem("myId"));

      if (!this.myMap || this.myMap.size == 0 || !this.myMap.get(id))
        return !this.isNotCreation;
      return this.myMap.get(id).isAdmin;
    }
  },
  props: {
    Title: {
      type: String,
      default: ""
    },
    isNotCreation: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.isNotCreation)
      this.currentDialog = JSON.parse(localStorage.getItem("currentDialog"));
    else {
      this.currentDialog = {
        type: "groupChat",
        data: {
          group: {
            users: {},
            name: "Untitled"
          }
        }
      };
    }
    let me = parseInt(localStorage.getItem("myId"));
    this.users = Object.entries(this.currentDialog.data.group.users) || [
    [me, { isAdmin: true }]
    ];

    if (this.myMap == "") {
      this.myMap = new Map(
        Object.entries(this.currentDialog.data.group.users).map(x => [
          parseInt(x[0]),
          x[1]
          ])
        );
    }

    this.countAdmins();
    this.usersCount = this.users.length;
    this.notFilteredUsers = this.users;
  },
  methods: {
    disableOnAdmin(id) {
      return parseInt(id) != parseInt(localStorage.getItem("myId"));
    },
    asyncFind(query) {
      this.$store.dispatch("FIND_USERS", query).then(response => {
        this.countries = response;
      });
    },
    simpleClose() {
      this.$emit("close");
    },
    isNotMe(num) {
      let id = parseInt(localStorage.getItem("myId"));
      num = parseInt(num);

      return num != id;
    },
    addUser(val) {
      // let id = document.getElementById("userId");
      // let val = id.value;

      let usr = [
      val,
      {
        isAdmin: false
      }
      ]
      if(this.isPersonal)
          this.users.push(usr);

      
        if(!this.isPersonal)
          this.notFilteredUsers.push(usr) 

        this.currentDialog.data.group.users[val] = new Object({
          isAdmin: false
        });
        
      this.usersCount += 1;
    },
    sendMessage(id) {
      this.$modal.show(
        sendMsg,
        {
          id: parseInt(id)
        },
        {
          adaptive: true,
          height: "auto"
        }
        );
    },

    toRight() {
      this.isPersonal = true;
      if (this.selectedCountries.length > 1 && !this.isNotCreation)
        this.selectedCountries = [this.selectedCountries.pop()];
      this.users = this.notFilteredUsers;
      this.arePeopleSelected = !this.arePeopleSelected;
      document
      .getElementsByClassName("slider")[0]
      .classList.add("slider-translate");

      // document.getElementsByClassName("cl")[0].style.color = "#428bff";
    },


    toLeft() {
      this.isPersonal = false;
      this.users = this.notFilteredUsers.filter(x => x[1].isAdmin);
      this.arePeopleSelected = !this.arePeopleSelected;
      console.log(this.users)
      document
      .getElementsByClassName("slider")[0]
      .classList.remove("slider-translate");

      // document.getElementsByClassName("cl")[1].style.color = "#428bff";
    },
    countAdmins() {

      let n = this.users.reduce((sum, curr, index) => {
        if (curr[1].isAdmin) sum += 1;
        return sum;
      }, 0);


      this.adminsCount = n;
    },
    changeAdmin(event) {
      console.log("a");
      let index;
      for(let i in this.users)
      {
        if(parseInt(this.users[i][0]) == parseInt(event))
        {
          this.users[i][1].isAdmin = !this.users[i][1].isAdmin
          index = i;
          break;
        }
      }

      _.update(
        this.currentDialog,
        "data.group.users." + event + ".isAdmin",
        n => {
          return this.users[index][1].isAdmin;
        }
        );
      this.countAdmins();
    },
    deletePerson(event) {
      console.log(event)
      _.unset(this.currentDialog, "data.group.users." + event);

      _.remove(this.users, x => {
        return x[0] == parseInt(event);
      });
      _.remove(this.notFilteredUsers, x => {
        return x[0] == parseInt(event);
      });
      this.usersCount -= 1;
      this.countAdmins();
    },
    leaveChannel() {
      this.$store
      .dispatch("LEAVE_CHANNEL", parseInt(this.currentDialog.data.group.id))
      .then(() => {
        this.$emit("close");
        this.$router.push("/im");
        localStorage.removeItem('currentDialog')
      })
      .catch(err => {
        console.log(err);
      });
    },

    updateChannel() {
      _.set(
        this.currentDialog,
        "data.group.users." + localStorage.getItem("myId") + ".isAdmin",
        true
        );
      if (this.isPersonal && this.adminsCount == 0) {
        this.$store
        .dispatch("GET_USERCHAT", this.selectedCountries[0].code)
        .then(response => {
          this.$emit("close");
          localStorage.setItem("currentDialog", response);
          this.$router.push("/im");
        })
        .catch(() => {
          this.sendMessage(this.selectedCountries[0].code);
          this.$emit("close");
          this.$router.push("/im");
        });
        return;
      }
      let tmp = {
        operation: this.isNotCreation ? "update" : "create",
        data: this.currentDialog.data.group
      };

      this.$store.dispatch("UPDATE_DIALOG", tmp).then(() => {
        localStorage.setItem(
          "currentDialog",
          JSON.stringify(this.currentDialog)
          );

        this.$emit("close");
      });
    },
    showMenu(event) {
      let popUp = document.getElementsByClassName("popUp")[event];
      //  setTimeout(() => {

        popUp.style.opacity = "1";
      // }, 1);
    },
    hideMenu(event) {
      let elem = document.getElementsByClassName("popUp")[event];
      elem.style.opacity = "0";
    },
    getName(id) {
      if (!id) return null;
      id = parseInt(id);
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);

      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response]);
        });
      }
      return m.firstName + " " + m.lastName;
    },
    getImgUrl(id) {
      if (!id) return null;
      id = parseInt(id);
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
        });
        m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      }
      if (!m) return require("../../../img/" + 5051 + ".png");
      return require("../../../img/" + m.faculty.campusCode + ".png");
    },
    saveTitle() {
      let ch = document.getElementById("saveIcon");
      let ed = document.getElementById("editIcon");
      let title = document.getElementById("edittable").value;

      let tmp = document.getElementsByClassName("subTitle")[0];
      tmp.innerHTML = title;
      ch.style.display = "none";
      ed.style.display = "block";
      this.currentDialog.data.group.name = title;
    },
    editTitle() {
      let tmp = document.getElementsByClassName("subTitle")[0];
      let val = tmp.innerHTML;
      let ch = document.getElementById("saveIcon");
      let ed = document.getElementById("editIcon");
      this.textBefore = val;
      tmp.innerHTML = "<textarea id = 'edittable'></textarea>";
      let area = document.getElementById("edittable");
      area.value = val;

      ch.style.display = "block";
      ed.style.display = "none";
    }
  },
  watch: {
    selectedCountries(neww, old) {
      if (neww.length > old.length) {

        this.addUser(neww[neww.length - 1].code);
        console.log(neww.length, old.length)
      }
      else {
        console.log(neww, old)
        let person = _.differenceBy(old, neww,'code')[0]
        
        this.deletePerson(person.code)
      }
      if (!this.isPersonal || this.adminsCount != 0) {
        return;
      }


      if (neww.length > 1) this.selectedCountries = [neww.pop()];
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.num {
  color: #939393;
}

.userInput {
  margin-right: auto;
  margin-left: auto;
  width: 100%;
}

.exitCross {
  position: absolute;
  right: 0;
  margin-right: 10px;
  margin-top: 10px;
  top: 10;
  color: white;
  font-size: 15px;
}

.textCenter {
  text-align: center;
}

.cl {
  height: 40px;
  width: 50%;
  text-align: center;
  z-index: 10;
  font-weight: 600;
  font-size: 15px;
}
.cl:hover {
  cursor: pointer;
}
.slider {
  left: 57.5%;
  z-index: 9;
  position: absolute;
  background-color: #428bff;
  width: 15%;
  margin-left: 10%;
  margin-right: 10%;

  height: 5px;
  transition: 0.3s ease;
}

.slider-translate {
  transform: translateX(-340%);
  transition: 0.3s ease;
}

.header {
  text-align: center;
  background-color: #1c58d8;
  width: 100%;
  height: 50px;
  font-size: 30px;
  font-weight: 600;
  padding-left: 5px;
  color: white;
}

#saveIcon {
  display: none;
}
.title {
  font-size: 30px;
  margin-left: 10px;
}

.moderation {
  height: 300px;
  /* background-color: #ecedef; */
  overflow-y: scroll;
}

.edit {
  margin-left: 10px;
}

.edit:hover {
  cursor: pointer;
  color: rgba(28, 88, 216, 0.603);
}

.footer {
}
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>