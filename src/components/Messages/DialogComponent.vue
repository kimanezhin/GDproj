<template>
  <div class="rightSide" :class="{'col-8':onResizeEventHandler()>1000, 'col-12':onResizeEventHandler() <1000}">
    <div class="rightHeader">
      <div class="chatName text-center d-flex flex-column">
        <div class="chatNameInner">{{chatName}}</div>
        <div v-if="isGroup()" class="participants" @click="moderateGroup">{{counter()}} participants</div>
      </div>
    </div>
    <div class="rightBody">
      <Dialog v-if="isOpened"/>
    </div>
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        placeholder="Напишите сообщение.."
        aria-label="Recipient's username"
        aria-describedby="button-addon2"
        @keydown.enter="sendMessage"
        id="msgInput"
      >
      <div class="input-group-append">
        <button class="btn btn-outline-primary" type="button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>
<script>
import Dialog from "./Dialog";
import moder from "./DialogModeration";
export default {
  components: {
    Dialog
  },
  data() {
    return {
      chatName: "",
      isOpened: true,
      screenWidth: 1200
    };
  },
  methods: {
    isGroup() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      console.log(di.type === "groupChat");
      return di.type === "groupChat";
    },
    counter() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      return Object.keys(di.data.group.users).length || 0;
    },
    setName() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      this.chatName =
        this.getName(di.data.user) || (di.data.group && di.data.group.name);
    },
    moderateGroup() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      this.$modal.show(
        moder,
        {
          Title: di.data.group.name
        },
        {
          adaptive: true,
          height: "auto"
        }
      );
    },
    getName(id) {
      if (!id) return null;
      id = parseInt(id);

      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);

      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
        });
      }
      return m.firstName + " " + m.lastName;
    },
    onResizeEventHandler() {
      this.screenWidth = window.innerWidth + 91;
      console.log(this.screenWidth)
      return this.screenWidth;
    },
    sendMessage() {
      let msg;
      let text = document.getElementById("msgInput").value;
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      console.log(di);
      if (di.type == "groupChat") {
        msg = {
          group: di.data.group.id,
          body: {
            markdown: text
          }
        };
      } else {
        msg = {
          body: {
            markdown: text
          },
          user: parseInt(di.data.user)
        };
      }
      this.$store
        .dispatch("SEND_MSG", msg)
        .then(() => {
          document.getElementById("msgInput").value = "";
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    this.setName();
    this.$eventHub.$on("dialogChanged", this.setName);
    window.addEventListener("resize", this.onResizeEventHandler);
    
    this.onResizeEventHandler();
  },
  beforeDestroy() {
    this.$eventHub.$off("dialogChanged", this.setName);
    window.removeEventListener("resize", this.onResizeEventHandler);
  }
};
</script>

<style scoped>
.participants {
  text-align: center;
  font-weight: 550;
  color: #7e7e7e;
  font-size: 14px;
}

.participants:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>