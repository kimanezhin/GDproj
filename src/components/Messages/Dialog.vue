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

  },
  
  created() {
    this.changeDialog();
    this.$eventHub.$on("dialogChanged", this.changeDialog);
    this.$eventHub.$on("messageSend", this.changeDialog)
  },
  beforeDestroy() {
     this.$eventHub.$off("dialogChanged", this.changeDialog);
    this.$eventHub.$off("messageSend", this.changeDialog)
  
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


.messages {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: inherit;
  /* overflow-y: scroll; */
  overflow-x: hidden;
}


</style>
