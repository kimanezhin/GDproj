<template>
  <div class="d-flex flex-column">
    <div class="exitCross">
      <font-awesome-icon @click="simpleClose" icon="times"/>
    </div>
    <div class="header">Информация</div>

    <div class="title d-flex flex-row">
      <div class="subTitle">{{Title}}</div>
      <div class="edit">
        <font-awesome-icon id="editIcon" @click="editTitle" icon="pencil-alt"/>
        <font-awesome-icon id="saveIcon" @click="saveTitle" icon="check"/>
      </div>
    </div>
    <hr width="100%" size="4">
    <div class="usersCount">
      <div class="d-flex justify-content-around">
        <div @click="toRight" class="cl el justify-content-center d-flex flex-row">
          <div class="people">Все участники:</div>
          <div class="num ml-1">{{usersCount}}</div>
        </div>
        <div @click="toLeft" class="cl el justify-content-center d-flex flex-row">
          <div class="people">Администраторы:</div>
          <div class="num ml-1">{{adminsCount}}</div>
        </div>
        <div class="slider slider-translate align-self-end"></div>
      </div>
    </div>
    <hr width="100%" size="4">
    <div v-if="isAdmin" class="input-group p-1">
      <input
        type="text"
        class="form-control"
        id="userId"
        placeholder="Введите ID "
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
      >
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" @click="addUser" type="button">Добавить</button>
      </div>
    </div>
    <hr width="100%" size="4">

    <div class="moderation">
      <div v-for="(prs, index) in users" :key="prs[0]" class="person">
        <div class="d-flex flex-row">
          <div class="ava">
            <img class="rounded m-2" :src="getImgUrl(prs[0])" alt>
          </div>
          <div class="mt-2 d-flex flex-column font-weight-bold">{{getName(prs[0])}}</div>
          <div
            v-if="isAdmin"
            class="option ml-auto mr-4 mt-2"
            @mouseover="showMenu(index)"
            @mouseleave="hideMenu(index)"
          >
            <div class="popUp">
              <div class="admin d-flex flex-row">
                <div class="boxTitle">Администратор :</div>
                <div class="box ml-1" @click="changeAdmin(prs[0])">
                  <p-check
                    name="check"
                    class="pretty p-switch p-fill state p-success"
                    color="success"
                    v-model="prs[1].isAdmin"
                  ></p-check>
                </div>
              </div>
              <div class="deleteFromGroup">
                Удалить
                <font-awesome-icon @click="deletePerson((prs[0]))" icon="times"/>
              </div>
            </div>
            <font-awesome-icon icon="chevron-down"/>
          </div>
        </div>
        <hr width="100%">
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
export default {
  data() {
    return {
      textBefore: "",
      currentDialog: {},
      users: [],
      notFilteredUsers: [],
      myMap: "",
      adminsCount: 0,
      usersCount: 0,
      imgPath:""
    };
  },
  computed: {
    isAdmin() {
      let id = parseInt(localStorage.getItem("myId"));
      console.log(this.myMap);
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
    simpleClose() {
      this.$emit("close");
    },
    isNotMe(num) {
      let id = parseInt(localStorage.getItem("myId"));
      num = parseInt(num);
      console.log(num, id);
      return num != id;
    },
    addUser() {
      let id = document.getElementById("userId");
      let val = id.value;
      if (!_.find(this.users, n => n[0] == val)) {
        this.users.push([
          val,
          {
            isAdmin: false
          }
        ]);
        _.set(
          this.currentDialog,
          "data.group.users." + val + ".isAdmin",
          false
        );
        console.log(this.currentDialog);
      }
      id.value = "";
      this.usersCount += 1;
    },
    toRight() {
      this.users = this.notFilteredUsers;
      this.arePeopleSelected = !this.arePeopleSelected;
      document
        .getElementsByClassName("slider")[0]
        .classList.add("slider-translate");

      // document.getElementsByClassName("cl")[0].style.color = "#428bff";
    },
    toLeft() {
      this.users = this.notFilteredUsers.filter(x => x[1].isAdmin);
      this.arePeopleSelected = !this.arePeopleSelected;
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
      // console.log(event)
      _.update(
        this.currentDialog,
        "data.group.users." + event + ".isAdmin",
        n => {
          return !n;
        }
      );
      this.countAdmins();
    },
    deletePerson(event) {
      _.unset(this.currentDialog, "data.group.users." + event);
      this.usersCount -= 1;
      this.countAdmins();
    },
    leaveChannel() {
      this.$store
        .dispatch("LEAVE_CHANNEL", parseInt(this.currentDialog.data.group.id))
        .then(() => {
          this.$emit("close");
          this.$router.push("/im");
        })
        .catch(err => {
          console.log(err);
        });
    },

    updateChannel() {
      console.log(this.currentDialog.data.group);
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
      console.log(event);
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
          console.log(response)
          this.$store.commit("ADD_TO_MAP", [id, response]);
        });
      }
      return m.firstName + " " + m.lastName;
    },
    getImgUrl(id) {
      if (!id) return null;
      console.log(this.$store.getters.GET_MESSAGE_MAP)
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
        });
        m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      }
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
  }
};
</script>

<style scoped>
.num {
  color: #939393;
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

.deleteFromGroup > * {
  font-size: 20px;
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
.deleteFromGroup > *:hover {
  color: #1c58d8;
}

.popUp {
  padding: 5px;
  position: absolute;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  width: 300px;
  background-color: white;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
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

.option {
  font-size: 20px;
}

.option:hover {
  cursor: pointer;
  opacity: 0.7;
}

.ava > img {
  width: 40px;
  height: 40px;
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