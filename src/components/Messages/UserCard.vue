<template>
  <div>
    <div
      class="messageCard d-flex flex-row"      
      v-on:click="openDialog"
    >
      <div class="messageCardImg col-3 d-flex align-content-center align-items-center">
        <img
          :src="imgUrl"
          v-bind:alt="id"
          :name="dialog.data.user||dialog.data.group.id"
        >
      </div>
      <div class="messageCardBody col-9 d-flex flex-column">
        <div class="userName mt-1 d-flex flex-row">
          <div class="name">{{name || myName}}</div>
          <div
            v-if="dialog.data.lastMessage"
            class="date ml-auto"
          >{{time}}</div>
        </div>
        <div
          v-if="dialog.data.lastMessage"
          class="lastMessage"
        >{{lastMessageAuthor }}: {{lastMessage}}</div>
        <div v-else class="lastMessage">Беседа создана!</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: -1
    },
    dialog: {
      type: Object
    }
  },
  data() {
    return {
      lastMessageAuthor: "",
      // lastMessage: "",
      time: "",
      imgUrl: "",
      name: ""
    };
  },
  computed:{
    myName(){
      return this.dialog.data.group.name
    },
    lastMessage(){
      if(this.dialog.data.lastMessage)
        return this.dialog.data.lastMessage.body.markdown;
      return ''
    }
  },
  mounted() {
    // this.id = this.dialog.data.user || -1;
    this.getName(this.id);
    if(this.dialog.data.lastMessage)
      {
        this.transformTime(this.dialog.data.lastMessage.time);
        this.getLastMessageAuthor(this.dialog.data.lastMessage.author);
        // this.lastMessage = this.dialog.data.lastMessage.body.markdown
      }
    this.getImgUrl(this.dialog.data.user || -1);
    
  },
  methods: {
    openDialog() {
      this.$emit("openDialog", this.dialog);
    },
    getName(id) {
      if (id == -1) {
        // Case of groupchat
        // this.name = this.dialog.data.group.name;
        this.name = ""
        return;
      } else if (!id) return;
      if (!Number.isInteger(id)) return id;
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response[0]]);
          console.log(response,id)
          this.name = response[0].firstName + " " + response[0].lastName;
        });
      } else this.name = m.firstName + " " + m.lastName;
    },
    transformTime(time) {
      //1861-08-13T00:00:08Z - not transformed
      //13.08.61 - transformed
      let tmp = time.split("-");
      let clock = time.split("T")[1].split(":");

      tmp[2] = tmp[2].slice(0, 2);
      let timeString = clock[0] + ":" + clock[1] + ", ";
      this.time = tmp[2] + "." + tmp[1];
    },
    getImgUrl(id) {
      if(id == -1)
      {
        this.imgUrl =require("../../../img/" + "5051" + ".png");
        return;
      }
      if (!id) return null;

      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response[0]]);
          if (response[0])
            this.imgUrl = require("../../../img/" +
              response[0].faculty.campusCode +
              ".png");
        });
      } else if (!m) {
        this.imgUrl = require("../../../img/" + "5051" + ".png");
      } else {
        this.imgUrl = require("../../../img/" + m.faculty.campusCode + ".png");
      }
    },
    getLastMessageAuthor(id) {
      console.log(id)
      if (!id) return null;
      // id = parseInt(id);
      let me = parseInt(localStorage.getItem("myId"));
      if (parseInt(id) == me) 
      {
        this.lastMessageAuthor =  "You";
        return;
      }
      // console.log(id, this.$store.getters.GET_MESSAGE_MAP)
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);

      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response[0]]);
          console.log(response)
          this.lastMessageAuthor = response[0].firstName;
        });
      } else {
        this.lastMessageAuthor = m.firstName;
      }
    }
  }
};
</script>

<style>
.name,
.lastMessage {
  white-space: nowrap;
  overflow: hidden;
  text-align: initial !important;
}
.messageCard {
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.messageCard:hover {
  cursor: pointer;
  background-color: #f4f6f9;
}

.messageCardImg > img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}
.messageCardBody {
  padding-left: 0;
}
.userName {
  font-size: 14px;
}
</style>
