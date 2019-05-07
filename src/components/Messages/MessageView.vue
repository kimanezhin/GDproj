<template>
  <div>
    <NavBar/>
    <Logout/>
    <div class="col messageView">
      <div class="row findDialog d-flex flex-row">
        <div class="input-group mt-2">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск..."
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          >
          <div class="input-group-append">
            <button @click="createDialog" class="btn btn-outline-secondary" type="button">
              <font-awesome-icon icon="plus"/>
            </button>
          </div>
        </div>
      </div>
      <div class="row d-flex flex-column">
        <div
          class="row dialog p-1 d-flex flex-row m-0 mt-2 mb-2"
          style="height:60px;"
          v-for="dialog in messages"
          :key="dialog.data.user||dialog.data.group.id"
          v-on:click="openDialog(dialog)"
        >
          <img
            :src="getImgUrl(dialog.data.user||5051)"
            v-bind:alt="dialog.data.user||dialog.data.group.id"
            class="rounded ml-1 mt-1 mr-1 dialogImg"
            :name="dialog.data.user||dialog.data.group.id"
          >
          <div class="row d-flex flex-column m-0" style="width:85%;">
            <div class="row dialogName d-flex">
              {{getName(dialog.data.user)||dialog.data.group.name}}
              <div class="ml-auto time mt-1">{{transformTime(dialog.data.lastMessage.time)}}</div>
            </div>
            <div class="row dm">
              <img
                :src="getImgUrl(dialog.data.lastMessage.author)"
                v-bind:alt="5051"
                class="shortcut mr-1 mt-1"
                :name="5051"
              >
              <div class="toBreak">{{(dialog.data.lastMessage.body.markdown)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import NavBar from "../Navbar";
import _ from "lodash";
import Logout from "../Logout";
import moder from "./DialogModeration";
export default {
  components: {
    NavBar,
    Logout
  },
  data() {
    return {
      messages: []
    };
  },
  methods: {
    createDialog() {
      // localStorage.removeItem('currentDialog')
      this.$modal.show(
        moder,
        {
          Title:"Untitled",
          isNotCreation: false
        },
        {
          adaptive: true,
          height: "auto"
        }
      );
    },
    getImgUrl(id) {
      return require("../../../img/" + id + ".png");
    },
    openDialog(event) {
      let num = event.data.user || event.data.group.id;
      let tmp = event;
      //   if (tmp.data.user) tmp.data.user = this.getName(tmp.data.user);
      localStorage.setItem("currentDialog", JSON.stringify(tmp));
      this.$router.push("/dialog/" + num);
    },
    getName(id) {
      if (!id) return;
      if (!Number.isInteger(id)) return id;
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) return "";
      return m.firstName + " " + m.lastName;
    },
    transformTime(time) {
      //1861-08-13T00:00:08Z - not transformed
      //13.08.61 - transformed
      let tmp = time.split("-");
      tmp[2] = tmp[2].slice(0, 2);
      return tmp.reverse().join(".");
    }
  },

  mounted() {
    this.$store.dispatch("GET_ALL_MESSAGES", null).then(() => {
      this.messages = this.$store.getters.GET_MESSAGES;
    });
  }
};
</script>

<style scoped>
.toBreak {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* white-space: nowrap; */
  /* overflow: hidden; */
  max-width: 80%;
}
* {
  margin: 0;
}
.dialogName {
  font-weight: 500;
}

.dialogName,
.dm {
  width: 100%;
}
.messageView {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  margin-top: 20px;
  border: 2px solid #c8c8c8;
  /* height: 80%; */
  height: 700px;
  overflow-y: scroll;
}
.dialogImg {
  width: 41px;
  height: 41px;
  padding: 1px;
  border-radius: 50px;
}
.shortcut {
  width: 20px;
  height: 20px;
  border-radius: 50px;
}
.time {
  opacity: 0.8;
  font-size: 12px;
}
.dialog {
  border: 1px solid #c8c8c8;
  width: 100%;
}

.dialog:hover {
  background-color: #e7e6e6e0;
  cursor: pointer;
}
.findDialog {
}
</style>

