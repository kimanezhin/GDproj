<template>
  <div class="person">
    <div class="d-flex flex-row">
      <div class="ava">
        <img class="rounded m-2" :src="imgUrl" alt>
      </div>
      <div class="mt-2 d-flex flex-column font-weight-bold">{{name}}</div>
      <div
        v-if="isAdmin"
        class="option ml-auto mr-4 mt-2"
        @mouseover="showMenu(index)"
        @mouseleave="hideMenu(index)"
      >
        <div class="popUp">
          <div class="admin d-flex flex-row">
            <div class="boxTitle">Администратор :</div>
            <div class="box ml-1" @click="changeAdmin(id)">
              <p-check
                v-if="disableOnAdmin(id)"
                name="check"
                class="pretty p-switch p-fill state p-success"
                color="success"
                v-model="vModelData"
              ></p-check>
              <p-check
                v-else
                name="check"
                class="pretty p-switch p-fill state p-success"
                color="success"
                v-model="vModelData"
                disabled
              ></p-check>
            </div>
          </div>
          <div v-if="disableOnAdmin(id)" class="deleteFromGroup">
            Удалить
            <font-awesome-icon @click="deletePerson(id)" icon="times"/>
          </div>
        </div>
        <font-awesome-icon icon="chevron-down"/>
      </div>
    </div>
    <hr width="100%">
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    },
    user: {
      type: Object
    },
    isAdmin: {
      type: Boolean
    },
    vModel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: "",
      imgUrl: "",
      vModelData:false,
    };
  },
  mounted() {
      this.vModelData = this.
      vModel
    this.getImgUrl(this.id);
    this.getName(this.id);
  },
  methods: {
    disableOnAdmin(id) {
      return parseInt(id) != parseInt(localStorage.getItem("myId"));
    },
    changeAdmin(id) {
      this.$emit("changeAdmin", id);
    },
    deletePerson(id) {
      
      this.$emit("deletePerson", id);
    },
    getImgUrl(id) {
      if (!id) return null;
      id = parseInt(id);
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response.data]);
          console.log(response)
          if (!response) {
            this.imgUrl = require("../../../img/" + 5051 + ".png");
          } else
            this.imgUrl = require("../../../img/" +
              response[0].faculty.campusCode +
              ".png");
        });
        m = this.$store.getters.GET_MESSAGE_MAP.get(id);
      }
      if (!m) {
        this.imgUrl = require("../../../img/" + 5051 + ".png");
      } else
        this.imgUrl = require("../../../img/" + m.faculty.campusCode + ".png");
    },
    getName(id) {
      if (!id) return null;
      id = parseInt(id);
      let m = this.$store.getters.GET_MESSAGE_MAP.get(id);

      if (!m) {
        this.$store.dispatch("GET_USERS", [id]).then(response => {
          this.$store.commit("ADD_TO_MAP", [id, response[0]]);
          this.name = response[0].firstName + " " + response[0].lastName;
        });
      } else this.name = m.firstName + " " + m.lastName;
    },
    showMenu(event) {
      let popUp = document.getElementsByClassName("popUp")[event];
      //  setTimeout(() => {

      popUp.style.opacity = "1";
      // }, 1);
    },
    hideMenu(event) {
      let elem = document.getElementsByClassName("popUp")[event];
      elem.style.opacity = "0";
    }
  }
};
</script>

<style>
.ava > img {
  width: 40px;
  height: 40px;
}

.option {
  font-size: 20px;
}

.option:hover {
  cursor: pointer;
  opacity: 0.7;
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

.deleteFromGroup > * {
  font-size: 20px;
}

.deleteFromGroup > *:hover {
  color: #1c58d8;
}
</style>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>