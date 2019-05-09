<template>
  <div>
    <!-- <div class="dialogView"> -->
    <div class="row">
      <!-- <div class="row header">
          <div class="back ml-2" @click="returnBack">
            <div class="chevron">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 1000 1000"
                enable-background="new 0 0 1000 1000"
                xml:space="preserve"
              >
                <metadata>Svg Vector Icons : http://www.onlinewebfonts.com/icon</metadata>
                <g>
                  <path
                    d="M981.9,283c5.2-5.2,8.1-12.1,8.1-19.4c0-7.3-2.8-14.2-8-19.3c-10.7-10.7-28-10.7-38.7-0.1L498.9,686.4L56.8,244.2c-10.7-10.7-28.1-10.7-38.7,0c-5.2,5.2-8,12.1-8,19.4c0,7.3,2.8,14.2,8,19.4l480,479.9l0.9,0.9L981.9,283z"
                  ></path>
                </g>
              </svg>
            </div>
            <div class="backText">Назад</div>
          </div>

          <div class="name d-flex flex-column">
            <div
              class="font-weight-bold"
            >{{getName(currentDialog.data.user)||currentDialog.data.group.name}}</div>
            <div
              @click="moderateDialog"
              class="participants"
              v-if="currentDialog.type == 'groupChat'"
            >{{counter}} participants</div>
          </div>

          <div class="options mr-3">
            <font-awesome-icon class="mb-1 mr-1" icon="ellipsis-h"/>
          </div>
      </div>-->
      <!-- <hr width="100%"> -->
      <!-- <div class="row dialog"> -->
      <div class="messages">
        <Message
          class="sm"
          v-for="msg in messages"
          :Text="msg.body.markdown"
          :key="msg.id"
          :Time="transformTime(msg.time)"
          :isItMe="checkAuthor(msg.author)"
          :Author="getName(msg.author)"
          :AuthorId="parseInt(msg.author)"
        />
        <!-- <Message class="sm" :Text="s" :Time="s" :isItMe="false"/> -->
      </div>
      <!-- </div> -->
      <!-- <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Напишите сообщение.."
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
            id="msgInput"
          >
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="sendMessage">Send</button>
          </div>
      </div>-->
    </div>
    <!-- </div> -->
  </div>
</template>
<script>
import Navbar from "../Navbar";
import Logout from "../Logout";
import Message from "./Message";
import moder from "./DialogModeration";

export default {
  data() {
    return {
      s: "Hello",
      messages: []
    };
  },
  components: {
    Navbar,
    Logout,
    Message
  },
  methods: {
    moderateDialog() {
      this.$modal.show(
        moder,
        {
          Title: this.currentDialog.data.group.name
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
    sendMessage() {
      let msg;
      let text = document.getElementById("msgInput").value;

      if (this.currentDialog.type == "groupChat") {
        msg = {
          group: this.currentDialog.data.group.id,
          body: {
            markdown: text
          }
        };
      } else {
        msg = {
          body: {
            markdown: text
          },
          user: parseInt(this.currentDialog.data.user)
        };
      }
      this.$store
        .dispatch("SEND_MSG", msg)
        .then(() => {
          document.getElementById("msgInput").value = "";
        })
        .catch(err => console.error(err));
    },
    checkAuthor(id) {
      // console.log(this.$store.getters.GET_ID, id)
      return localStorage.getItem("myId") == id;
    },
    transformTime(time) {
      let tmp = time.split("-");
      tmp[2] = tmp[2].slice(0, 2);
      return tmp.reverse().join(".");
    },
    scrollEvent(event) {
      console.log(event);
    },
    returnBack() {
      this.$router.push("/im");
    },
    changeDialog() {
      if (this.currentMap.size == 0) {
        let m = JSON.parse(localStorage.getItem("myMap"));

        this.$store.commit("SET_MESSAGE_MAP", m);
      }
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      let id = parseInt(di.data.user || di.data.group.id);
      
      let request = {
        id: id,
        type: di.type
      };
      
      this.$store
        .dispatch("GET_DIALOG", request)
        .then(dialog => {
          this.messages = dialog;
        })
        .then(() => {
          let i = document.getElementsByClassName("rightBody")[0];
          i.scrollTop = i.scrollHeight - i.offsetHeight;
        });
    },
    getName(id) {
      if (!id) return null;
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
        });
      }
      return m.firstName + " " + m.lastName;
    },
    updateMessages(msg){
      this.changeDialog();
    }
  },
  props: ["id"],
  created() {
    this.changeDialog();
    this.$eventHub.$on('dialogChanged', this.changeDialog)
   
  },
  computed: {
    currentDialog() {
      return JSON.parse(localStorage.getItem("currentDialog"));
    },
    currentMap() {
      return this.$store.getters.GET_MESSAGE_MAP;
    },
    counter() {
      return Object.entries(this.currentDialog.data.group.users).length;
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
}

.participants {
  text-align: center;
  font-weight: 500;
  color: #7e7e7e;
}

.participants:hover {
  cursor: pointer;
  text-decoration: underline;
}

.sm {
  width: 100% !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

.messages {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: inherit;
  /* overflow-y: scroll; */
  overflow-x: hidden;
}
.dialog {
  max-height: 500px;
  min-height: 500px;
  width: 100%;
}
.dialogView {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  border: 1px solid #c8c8c8;
  width: 50%;
  height: 80%;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 0;
  width: 100%;
}

.header > * {
  margin-top: 5px;
}
.back {
  display: flex;
  flex-direction: row;
  color: #7e7e7e;
  fill: #7e7e7e;
  opacity: 0.7;
}

.back:hover {
  cursor: pointer;
  opacity: 1;
}

.chevron {
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
  transform-origin: 50% 70%;
}

.options {
  font-size: 25px;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  max-width: 30%;
}
.options:hover {
  cursor: pointer;
  color: rgba(0, 0, 255);
}
</style>
