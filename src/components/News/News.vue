<template >
  <div id="resizable" class="row d-flex" :class="flexBehaviour">
    <div
      id="imgCol"
      :class="{'margin':!forUser, 'smallMargin':forUser}"
      class="col-md-12 col-sm-12 mt-4"
    >
      <post-editor v-if="isThisUser"/>
      <news-column
        style="margin-top:75px;"
        v-bind:forUser="parseInt(forUser)"
        v-bind:columnNum="0"
      />
    </div>
    <div class="col-md-4 ml-5 col-sm-12 text mt-4">
      <div v-if="!isDataFetched && !isUserDataFetched && !isNotLast" id="ld" class="loading">
        <div class="loadText">{{ Loading}}</div>
        <!-- <img src="https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif" alt=""> -->
      </div>

      <!-- <news-column v-bind:forUser = "parseInt(forUser)" id="second" class="ml-0" v-bind:columnNum="1"/> -->
    </div>
  </div>
</template>

<script>
import newsColumn from "./newsColumn";
import postEditor from "./postEditor";
import store from "./../../store/store.js";
import Axios from "axios";
export default {
  data() {
    return {
      Loading: "Loading",
      isThisUser: true
    };
  },
  props: {
    posts: {
      type: Array,
      default: function() {
        return [];
      },
      isMargin: {
        type: Boolean,
        default: true
      }
    },
    flexBehaviour: {
      type: String,
      default: "justify-content-around"
    },
    forUser: {
      type: Number
    }
  },
  computed: {
    isDataFetched() {
      return this.$store.state.dataStorage.isDataFetched;
    },
    isUserDataFetched() {
      return this.$store.state.dataStorage.isUserDataFetched;
    },
    isNotLast() {
      return this.$store.state.dataStorage.isNotLast;
    },
    screenWidth() {
      return window.outerWidth;
    }
  },
  components: {
    newsColumn,
    postEditor
  },
  mounted() {
    this.enableLoading();
     let i = parseInt(localStorage.getItem('myId'))
        this.isThisUser = i == this.forUser;
    if (!this.forUser) this.isThisUser = true;
    // else
      // Axios.post(
      //   this.$store.getters.GET_URL + "/authentication/me",
      //   {},
      //   { withCredentials: true }
      // ).then(resp => {
       
      // });
  },
  methods: {
    enableLoading() {
      var count = 1;
      let i = setInterval(() => {
        if (count % 4 != 0) {
          this.Loading += ".";
        } else {
          this.Loading = this.Loading.split("")
            .slice(0, this.Loading.length - 3)
            .join("");
        }
        count++;
      }, 400);
    }
  }
};
</script>
<style scoped>
#imgCol {
  min-width: 51px;
}

.margin {
  margin-left: 200px;
}

.smallMargin {
  /* margin-left: 100px; */
}
.loadText {
  font-size: 36px;
  font-weight: 500;
}
.loading {
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 600px) {
  .margin {
    margin-left: 10px;
  }
}

@media screen and (max-width: 1200px) {
  .margin {
    margin-left: 0;
  }
}
</style>
