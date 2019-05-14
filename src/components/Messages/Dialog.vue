<template>
  <div>
    <div class="row">
      <div class="messages">
        <Message
          class="sm"
          v-for="msg in messages"
          :Text="msg.body.markdown"
          :key="msg.id"
          :Time="transformTime(msg.time)"
          :isItMe="checkAuthor(msg.author)"
          :AuthorId="parseInt(msg.author)"
        />
      </div>
    </div>
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

    checkAuthor(id) {
      
      return localStorage.getItem("myId") == id;
    },
    transformTime(time) {
      let tmp = time.split("-");
      tmp[2] = tmp[2].slice(0, 2);
      return tmp.reverse().join(".");
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
          if (i) i.scrollTop = i.scrollHeight - i.offsetHeight;
        });
    },
    getName(id) {
      if (!id) return null;
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
        });
        m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      }
      return m.firstName + " " + m.lastName;
    },
    updateMessages(msg) {
      this.changeDialog();
    },
    updateDialog(){
      this.changeDialog();
    }
  },
  
  created() {
    this.changeDialog();
    this.$eventHub.$on("dialogChanged", this.changeDialog);
    this.$eventHub.$on("messageSend", this.updateDialog)
  },
  computed: {
    currentDialog() {
      return JSON.parse(localStorage.getItem("currentDialog"));
    },
    currentMap() {
      return this.$store.getters.GET_MESSAGE_MAP;
    },
  }
};
</script>

<style scoped>
* {
  margin: 0;
}

@media screen and(max-width: 1000px) {
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
