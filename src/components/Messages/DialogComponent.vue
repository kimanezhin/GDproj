<template>
  <div class="rightSide" :class="{'col-8':onResizeEventHandler()>1000, 'col-12':onResizeEventHandler() <1000}">
    <div class="rightHeader abs">

          <div class="back ml-2 position-absolute">
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

      <div class="chatName text-center d-flex flex-column">
        <div class="chatNameInner">{{chatName}}</div>
        <div v-if="isGroup()" class="participants" @click="moderateGroup">{{count}} participants</div>
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
      screenWidth: 1200,
      count:''
    };
  },
  methods: {
    isGroup() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      return di.type === "groupChat";
    },
    counter() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      console.log(di)
      if(di.data.group)
      this.count =  Object.keys(di.data.group.users).length || 0;
    },
    setName() {
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      this.chatName =
        this.getName(di.data.user) || (di.data.group && di.data.group.name);
        this.counter();
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
      
      return this.screenWidth;
    },
    sendMessage() {
      let msg;
      let text = document.getElementById("msgInput").value;
      let di = JSON.parse(localStorage.getItem("currentDialog"));
      
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
          
          this.$eventHub.$emit('messageSend')
        })
        .catch(err => console.error(err));
    },
    onDialogChanged(){
      this.counter();
      this.setName();
    }
  },
  mounted() {
    this.setName();
    this.$eventHub.$on("dialogChanged", this.setName);
    this.$eventHub.$on('dialogListChanged', this.onDialogChanged)
    window.addEventListener("resize", this.onResizeEventHandler);
    
    this.onResizeEventHandler();
    this.counter();
  },
  beforeDestroy() {

    this.$eventHub.$off("dialogChanged", this.setName);
     this.$eventHub.$off('dialogListChanged', this.onDialogChanged)
    window.removeEventListener("resize", this.onResizeEventHandler);
  }
};
</script>

<style>

.custom__tag {
  display: inline-block;
  padding: 3px 12px;
  background: #d2d7ff;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  cursor: pointer;
}
</style>


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

.back {
  display: flex;
  flex-direction: row;
  color: #7e7e7e;
  fill: #7e7e7e;
  opacity: 0.7;
  margin-top: 5px;;
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
</style>