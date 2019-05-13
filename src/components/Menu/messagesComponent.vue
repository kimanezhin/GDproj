<template>
  <div class>
    <div class="ml-4 title">messages</div>
    <div class="ml-2 smth">
      <div
        @click="openDialog(index)"
        v-for="(message, index) in messagesL"
        class="hrefOption"
        :key="index"
      >{{message.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentChannel: 1,
      active: true,
      messagesL: []
    };
  },
  methods: {
    openDialog(index) {
      
      localStorage.setItem(
        "currentDialog",
        JSON.stringify(this.messageList[index])
      );
      this.$router.push("/im");
    }
  },
  mounted() {
    this.$store.dispatch("GET_ALL_MESSAGES", null).then(() => {
      this.messagesL = this.messageList.map(x => {
        if (x.type === "userChat") {
          
          let user = this.userMap.get(parseInt(x.data.user));
          let tm = {
            name: user.firstName + " " + user.lastName
          };
          return tm;
        } else {
          return {
            name: x.data.group.name
          };
        }
      });
    });
  },
  computed: {
    messageList() {
      return this.$store.getters.GET_MESSAGES;
    },
    userMap() {
      return this.$store.getters.GET_MESSAGE_MAP;
    }
  },
  props: {
    messages: Array
  }
};
</script>
<style >
.hrefOption:hover {
  cursor: pointer;
}

.hrefOption{
  white-space: nowrap;
  overflow: hidden;
  
}

.smth {
  display: flex;
  flex-direction: column;
}
.current {
  color: black;
}

.simple {
  font-size: 50px !important;
}

.title,
.smth {
  font-size: 19px;
}
.title {
  color: #a2a2a2;
}

.smth > a {
  text-emphasis: none;
  text-decoration: none;

  color: black;
}
.first {
  font-size: 500px;
}
.second {
  font-size: 500px;
}
</style>