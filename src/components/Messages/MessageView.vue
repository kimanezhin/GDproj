<template>
  <div class="wrapper" @resize="onResizeEventHandler">
    <div class="cnt">
      <NavBar style="position:absolute"/>
      <Logout/>
      <div class="content-wrapper row">
        <div
          class="leftSide"
          :class="{'col-4':onResizeEventHandler() > 1000, 'col-12':onResizeEventHandler() < 1000}"
        >
          <div class="leftHeader d-flex flex-row justify-content-between">
            <div class="subHeader font-weight-bold">Messages</div>
            <div class="newMessage">
              <font-awesome-icon @click="addChat" id="ed" icon="edit"/>
            </div>
          </div>

          <div class="leftBody">
            <transition-group name="list" tag="p">
              <UserCard
                v-for="(item) in messages"
                :key="parseInt(item.data.user||-1*item.data.group.id)"
                :id="parseInt(item.data.user||-1)"
                v-on:openDialog="openDialog"
                :dialog="item"
              />
            </transition-group>
          </div>
        </div>
        <!-- <div class="rightSide col-8"> -->
        <co v-if="isOpened && onResizeEventHandler() > 1000"/>
        <!-- </div> -->
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
import Dialog from "./Dialog";
import co from "./DialogComponent";
import UserCard from "./UserCard";
export default {
  components: {
    NavBar,
    Logout,
    Dialog,
    co,
    UserCard
  },
  data() {
    return {
      messages: [],
      isOpened: false,
      screenWidth: 1200,
      imgPath: ""
    };
  },
  methods: {

    addChat() {
      // this.messages.unshift(mes);
      this.createDialog();
    },
    createDialog() {
      // localStorage.removeItem('currentDialog')
      this.$modal.show(
        moder,
        {
          Title: "Untitled",
          isNotCreation: false
        },
        {
          adaptive: true,
          height: "auto"
        },
        {
          "before-close": event => {},
          edited: () => {}
        }
      );
    },
    onResizeEventHandler() {
      // innerwidth - 88
      this.screenWidth = window.innerWidth + 91;
      return this.screenWidth;
      // console.log('a')
    },
    openDialog(event) {
      let num = event.data.user || event.data.group.id;
      let tmp = event;
      //   if (tmp.data.user) tmp.data.user = this.getName(tmp.data.user);
      localStorage.setItem("currentDialog", JSON.stringify(tmp));
      this.$eventHub.$emit("dialogChanged");
      this.isOpened = true;
      if (this.screenWidth < 1000) this.$router.push("/dialog/" + num);
    },
    onDialogListChanged() {

      this.$store.dispatch("GET_ALL_MESSAGES", null).then(() => {
        let arr = this.$store.getters.GET_MESSAGES;
        this.messages = []
          this.messages = arr;
        if (localStorage.getItem("currentDialog")) this.isOpened = true;
      }).catch((err) => {console.log(err)})
      if (localStorage.getItem("currentDialog")) this.isOpened = true;
    }
  },

  mounted() {
    this.onDialogListChanged();
    document.getElementsByClassName("cnt")[0].style.height =
      document.querySelector("html").scrollHeight + "px";
    console.log(document.getElementsByClassName("wrapper")[0]);
    window.addEventListener("resize", this.onResizeEventHandler);
    this.$eventHub.$on("dialogListChanged", this.onDialogListChanged);
    this.$eventHub.$on('messageSend',this.onDialogListChanged);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEventHandler);
    this.$eventHub.$off("dialogListChanged", this.onDialogListChanged);
    this.$eventHub.$off('messageSend',this.onDialogListChanged);
  }
};
</script>


<style>
* {
}
.list-move {
  transition: transform 0.5s;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}

html {
  height: 100vh;
  background-color: #eff0ef;
}
.chatNameInner {
  line-height: 2;
  font-weight: 600;
  font-size: 17.5px;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10%;
  margin-left: 10%;
  width: 80%;
  margin-right: 0;
}

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
.messageCardImg {
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

.lastMessage,
.date {
  font-size: 12px;
  color: #7f7f7f;
}
.leftBody {
  /* overflow-y: scroll;/ */
}

.rightSide,
.leftSide {
  height: 100%;
}

.leftSide {
  font-weight: 500;
  box-sizing: border-box;
}
.subHeader {
  padding: 12px 20px;
  font-size: 17.5px;
  font-weight: 600;
}

.newMessage {
  color: #428bff;
  margin-top: 12px;
  font-size: 18px;
  margin-right: 10px;
}

#ed:hover {
  color: #2478ff;
  cursor: pointer;
}

.rightBody {
  height: 80%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.leftBody {
  height: 87%;
  overflow-y: scroll;
}

.leftHeader,
.rightHeader {
  height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);

  width: 100%;
  margin: 0;
  padding: 0;
}
.rightSide {
  border-left: 1px solid rgba(0, 0, 0, 0.125);
}
.leftSide,
.rightSide {
  padding: 0;
}

.leftHeader {
  border-right: none;
}

.rightHeader {
  border-left: none;
}
.content-wrapper {
  background-color: white;
  height: 80vh;
  display: flex;
  width: 80%;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-top: 50px;
  border-radius: 5px;
}

.cnt {
  background-color: #eff0ef;
  position: relative;

  width: 100%;
  height: auto;
  display: flex;
}

.wrapper {
  width: 100%;
  height: auto;
}
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

@media screen and(max-width:1000px) {
  .leftSide {
    max-width: 100% !important;
  }
}

.dialog:hover {
  background-color: #e7e6e6e0;
  cursor: pointer;
}
.findDialog {
}
</style>

