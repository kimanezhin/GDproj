<template>
  <div id="main" @scroll="paginataion($event)">
    <Navbar id="nv"></Navbar>
    <Logout/>
    <div class="row">
      <div class="col-md-2 mt-5" id="menu">
        
      </div>
      
      <div class="col-md-4">
      <multiselect
        v-model="value"
        tag-placeholder="Add this as new tag"
        placeholder="Search a tag"
        label="name"
        track-by="code"
        :options="options"
        :internalSearch="false"
        :multiple="true"
        :taggable="false"
        :max-height="600"
        :searchable="false"
      ></multiselect>
      </div>
      <news-column
        :isAnonymous="true"
        :class="{'marginTop': isMargin}"
        v-bind:forUser="parseInt(forUser)"
        v-bind:columnNum="0"
        :query="query"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import newsColumn from "../News/newsColumn";
import { mapState, mapGetters } from "vuex";
import Navbar from "../Navbar";
import Logout from "../Logout";
import DropDown from "../News/DropDown";
import Multiselect from "vue-multiselect";
export default {
  props: {
    isMargin: {
      type: Boolean,
      default: true
    },
    forUser: {
      type: Number
    },
  },
  components: {

    Navbar,
    newsColumn,
    DropDown,
    Logout,
    Multiselect
  },
  data() {
    return { 
      arr: [],
      loading: false,
      options:[],
      value:[],
      query:''
    };
  },
  computed: {
    ...mapGetters({
      // arr: "GET_POSTS",
      token: "GET_TOKEN"
    }),
    myArr() {
      return this.$store.getters.GET_POSTS;
    }
  },

  methods: {
    pagination(event) {
      let wrapper = event.target.scrollingElement,
        offsetHeight = wrapper.offsetHeight,
        scrollHeight = wrapper.scrollHeight,
        scrollTop = wrapper.scrollTop,
        actualHeight = scrollHeight - offsetHeight;
      if (actualHeight - scrollTop <= 2 && !this.loading) {
        this.loading = true;
        let arr = this.$store.getters.GET_POSTS;

        let index = arr[arr.length - 1].postId;
        let promise;
        if (!localStorage.getItem("channel")) {
          promise = this.$store.dispatch("FETCH_DATA", index);
        } else {
          let id = parseInt(JSON.parse(localStorage.getItem("channel")).id);
          let data = {
            direction: "backward",
            limit: 20,
            exclusiveFrom: index,
            request: id
          };
          let request = {
            type: true,
            request: data
          };

          promise = this.$store.dispatch("UPDATE_POSTS", request);
        }
        promise
          .then(response => {
            if (response) {
              console.log("update!");
              this.$eventHub.$emit("feed-updated");
            }
            this.loading = false;
          })
          .catch(() => {
            console.log("some troubles in pagination");
            this.loading = false;
          });
      }
    },

  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.pagination);
   
  },
  mounted() {
    
   this.value = [{
    code:this.query,
    name:this.query
   }]
    window.addEventListener("scroll", this.pagination);
    this.resize();
    document.activeElement.blur();
  },
  watch:{
      value(neww, old){
        let arr = []
          for(let i of neww)
          {
            arr.push(i.name)
          }
          this.$eventHub.$emit('queryChanged', arr)
      }

  },
  created(){
    this.query = localStorage.getItem('query')||'';
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
h1,
p {
  text-align: initial !important;
}

html {
  height: 100vh;
  background-color: #fff;
}
</style>

<style scoped>
#drop {
  display: none;
}

.exit:hover {
  cursor: pointer;
}

#submitButton {
  margin-right: 2%;
  margin-bottom: 1%;
}

/* .listP-enter-active,
.listP-leave-active {
  transition: all 1s;
}
.listP-enter, .listP-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.listP-move {
  transition: transform 1s;
} */

read-more[less-str] {
  color: red;
  text-emphasis: none;
  text-decoration: none;
}

.find {
  height: 7vh;
  display: flex;
  flex-direction: row;
  margin-left: 20%;
  margin-top: 10px;
  width: 30vw;
}

.findBox {
  border: 2px solid black;
  width: 20vw;
}
/* .text {
  width: 25vw;
} */
div {
  max-width: 100%;
}
.postHeader {
  display: flex;
}
img {
  width: 51px;
  height: 51px;
}
.title,
.smth {
  font-size: 30px;
}
.title {
  color: #a2a2a2;
}
.smth {
  display: flex;
  flex-direction: column;
}
.smth > a {
  text-emphasis: none;
  text-decoration: none;
}

.sub-header {
  width: 100%;
  height: 50px;
  background-color: #373a47;
  margin-top: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.icon {
  /* justify-self: flex-end; */
  width: 35px;
  height: 35px;
  fill: white;
  stroke: white;
  stroke-width: 5;
  margin-right: 1%;
  margin-left: auto;
}

.openButton {
  margin-left: auto;
  color: white;
}

.channel-name:hover {
  cursor: pointer;
}

#main {
  background: #fff;
}

#sendIco {
  font-size: 30px;
  color: rgb(45, 49, 49);
}
.newPost {
  margin-left: 20vw;
  margin-top: 5vh;
  width: 61vw;
  display: flex;
  flex-direction: row;
}

.newPostBottom {
  margin-left: 25%;
  flex-direction: row;
  display: flex;
  width: 52vw;
  justify-content: space-between;
}

#newPostButton {
  background-color: #373a47;
  border-radius: 30px;
}

@media screen and (max-width: 1200px) {
  #menu {
    display: none;
  }

  .exit {
    display: none;
  }
  #drop {
    display: initial;
  }
  div {
    margin: 0;
  }

  .text {
    width: 100vw;
  }

  .post {
    width: 55vw;
  }
}
</style>
