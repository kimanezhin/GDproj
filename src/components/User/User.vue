<template>
  <div id="main">
    <Navbar/>
    <Logout/>
    <div class="row mr-0">
      <div class="col-2">
        <img :src="getImgUrl()" class="rounded avatar">
        <button @click="addUserToChannel" class="btn followButton btn-outline-primary">Follow</button>
        <button
          @click="sendMessage"
          class="btn followButton mt-1 btn-outline-secondary"
        >Отправить сообщение</button>
      </div>
      <div class="col-9">
        <div class="d-flex flex-column">
          <div class="user">{{lastName}} {{firstName}} {{middleName}}</div>
          <div class="line"></div>
          <div >
            <div class="tabs mt-3">
              <input type="radio" id="tab1" name="tab-control" checked>
              <input type="radio" id="tab2" name="tab-control">
              <input type="radio" id="tab3" name="tab-control">
              <input type="radio" id="tab4" name="tab-control">
              <ul>
                <li title="Features">
                  <label for="tab1" role="button">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10H20C20,13.32 17.32,16 14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4C14.43,4 14.86,4.05 15.27,4.14L16.88,2.54C15.96,2.18 15,2 14,2M20.59,3.58L14,10.17L11.62,7.79L10.21,9.21L14,13L22,5M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z"
                      ></path>
                    </svg>
                    <br>
                    <span>О себе</span>
                  </label>
                </li>
                <li title="Delivery Contents">
                  <label for="tab2" role="button">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z"
                      ></path>
                    </svg>
                    <br>
                    <span>Публикации</span>
                  </label>
                </li>
                <li title="Shipping">
                  <label for="tab3" role="button">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4M10,6L14,10L10,14V11H4V9H10M17,9.5H19.5L21.47,12H17M6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5M18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5Z"
                      ></path>
                    </svg>
                    <br>
                    <span>Учебные курсы</span>
                  </label>
                </li>
              </ul>

              <div class="slider">
                <div class="indicator"></div>
              </div>
              <div class="content">
                <section>
                  <div class="row">
                    <div class="col-3 categoriesAbout">Город:</div>
                    <div class="col-7 textAbout">{{city}}</div>
                  </div>

                  <div v-if="faculty" class="row">
                    <div class="col-3 categoriesAbout">Факультет:</div>
                    <div class="col-7 textAbout">{{faculty}}</div>
                  </div>

                  <div class="row">
                    <div class="col-3 categoriesAbout">Кафедра:</div>
                    <div class="col-7 textAbout"><a :href="'http://'+facultyUrl">{{facultyName}}</a></div>
                  </div>
                  <div class="row">
                    <div class="col-3 categoriesAbout">Адрес:</div>
                    <div class="col-7 textAbout">{{facultyAdress}}</div>
                  </div>

                  <div class="row text">
                    <div class="col-3 categoriesAbout">Почта:</div>
                    <div class="col-7 textAbout">{{email}}</div>
                  </div>
                </section>
                <section>Тут что нибудь появится</section>
                <section>Тут что нибудь появится</section>
              </div>
            </div>
          </div>

          <news
            flexBehaviour
            v-bind:forUser="parseInt(id)"
            class
            id="myNews"
            v-bind:posts="arr"
            :isMargin="false ||isMe()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./../Navbar";
import News from "./../News/News";
import { mapState, mapGetters } from "vuex";
import store from "../../store/store.js";
import Axios from "axios";
import addUserModal from "./../modals/addUserModal";
import Logout from "../Logout";
import sendMsg from "../Messages/SendMessageModal";
export default {
  data() {
    return {
      currentBlock: 1,
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      city: "",
      faculty: "",
      cityCode: "",
      imgPath: "",
      facultyAdress:'',
      facultyName:'',
      facultyUrl:''
    };
  },
  props: ["id"],
  computed: {
    ...mapGetters({
      arr: "GET_USER_POSTS",
      token: "GET_TOKEN"
    })
  },
  mounted() {
    let id = parseInt(this.id);




    if (!id) {
      Axios.post(
        this.$store.getters.GET_URL + "/authentication/me",
        {},
        { withCredentials: true }
      ).then(response => {
        id = response.data;
      });
    }
    let m = this.$store.getters.GET_MAP.get(id);
    
    if (!m) {
      this.$store
        .dispatch("GET_USERS", [id])
        .then(response => {
          m = response[0];
        })
        .then(response => {
          this.setFields(m);
        });
    } else {
      this.setFields(m);
    }


    // document.getElementById('main').style.height = window.innerHeight+"px"
    let main =  document.getElementById('main')
    if(main)
     main.style.height = document.querySelector('html').scrollHeight+"px";
     document.querySelector('body').style.height = document.querySelector('html').scrollHeight+"px";
  },
  methods: {
    isMe() {
      return parseInt(localStorage.getItem("myId")) == parseInt(this.id);
    },
    setFields(m) {
      this.faculty = m.faculty.path;
      this.email = m.email;
      this.city = m.faculty.campusName;
      this.firstName = m.firstName;
      this.lastName = m.lastName;
      this.middleName = m.middleName;
      this.cityCode = m.faculty.campusCode;
      this.facultyAdress = m.faculty.address;
      this.facultyName = m.faculty.name;
      this.facultyUrl = m.faculty.url;
    },
    sendMessage() {
      this.$modal.show(
        sendMsg,
        {
          id: parseInt(this.id)
        },
        {
          adaptive: true,
          height: "auto"
        }
      );
    },
    getImgUrl() {
      if(this.cityCode)
      return require("../../../img/" +this.cityCode + ".png");
    },
    addUserToChannel() {
      this.$modal.show(
        addUserModal,
        { hashId: this.id },
        {
          adaptive: true,
          height: "auto"
        }
      );
    },
  },

  watch: {
    id: function(newId) {
      location.reload();
    }
  },
  components: {
    Navbar,
    News,
    addUserModal,
    Logout
  }
};
</script>



<style>
#myNews {
  /* margin-top: 5%; */
}


html {
  height: 100vh;
  background-color: #fff;
}

.line {
  height: 2px;
  width: 67%;
  background-color: #707070;
  /* position: absolute;
  top:12%;
  left: 1.5%; */
}
.user {
  font-weight: 500;

  font-size: 20px;
}

.followButton {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
}

.avatar {
  padding: 10%;
  width: 100%;
  max-width: 270px;
  min-width: 70px;
}

.side {
  margin-right: 2000px;
}
.infoBlock {
  font-weight: 600;
  margin-left: 30px;
  margin-top: 10px;
  background-color: white;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  line-height: 25px;
  -webkit-box-shadow: 0 2px 0 rgba(90, 97, 105, 0.11),
    0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06),
    0 7px 70px rgba(90, 97, 105, 0.1);
  box-shadow: 0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12),
    0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1);
}

.infoBlock > p {
  padding: 5px;
}

.infoBlock > p::before {
  content: "-";
  font-size: 20px;
}

.textSemiBold {
  padding: 5px;
}

.block {
  width: 200px;
  height: 70px;
  font-weight: 600;
  font-size: 20px;
  background-color: white;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  vertical-align: middle;
  line-height: 70px;
  text-align: center;
  -webkit-box-shadow: 0 2px 0 rgba(90, 97, 105, 0.11),
    0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06),
    0 7px 70px rgba(90, 97, 105, 0.1);
  box-shadow: 0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12),
    0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1);
}

.block:hover {
  cursor: pointer;
  background-color: rgba(247, 245, 245, 0.603);
}

.myButton {
  background-color: #8f93a3;
  color: whitesmoke;
  font-weight: 500;
  width: 330px;
  height: 140px;
}

.myButton:hover {
  color: inherit;
}

.myButton:focus {
  border-top: 0;
  border-right: 0;
  border-left: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}

#main {
  background-color: white;
}
.categoriesAbout {
  font-weight: 600;
}

@import "https://fonts.googleapis.com/css?family=Montserrat:400,700|Raleway:300,400";
/* colors */
/* tab setting */
/* breakpoints */
/* selectors relative to radio inputs */

.tabs {
  /* -webkit-transform: translateX(-50%); */
  /* transform: translateX(-50%); */
  position: relative;
  background: white;
  /* padding: 50px; */
  /* padding-bottom: 80px; */
  width: 70%;
  height: 250px;
  /* box-shadow: 0 1px 20px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); */
  /* border: 3px solid rgb(110, 207, 236); */
  border-radius: 50px;
  min-width: 240px;
  box-sizing: border-box;
}
.tabs input[name="tab-control"] {
  display: none;
}
.tabs .content section h2,
.tabs ul li label {
  font-weight: bold;
  font-size: 18px;
  color: #428bff;
}
.tabs ul {
  list-style-type: none;
  padding-left: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  margin-bottom: 10px;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: flex-end;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.tabs ul li {
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 33%;
  padding: 0 10px;
  text-align: center;
}
.tabs ul li label {
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  color: #929daf;
  padding: 5px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.tabs ul li label br {
  display: none;
}
.tabs ul li label svg {
  fill: #929daf;
  height: 1.2em;
  vertical-align: bottom;
  margin-right: 0.2em;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.tabs ul li label:hover,
.tabs ul li label:focus,
.tabs ul li label:active {
  outline: 0;
  color: #bec5cf;
}
.tabs ul li label:hover svg,
.tabs ul li label:focus svg,
.tabs ul li label:active svg {
  fill: #bec5cf;
}
.tabs .slider {
  position: relative;
  width: 33%;
  -webkit-transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
  transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
}

.tabs .slider .indicator {
  position: relative;
  width: 90px;
  max-width: 100%;
  margin: 0 auto;
  height: 4px;
  background: #428bff;
  border-radius: 1px;
}
.tabs .content {
  margin-top: 30px;
}
.content {
  margin-left: 30px;
}

@media screen and (max-width: 1100px) {
    .tabs {
    margin-bottom: 50px;
  }
  .categoriesAbout {
    margin-right: 10%;
  }
  
}

.tabs .content section {
  display: none;
  -webkit-animation-name: content;
  animation-name: content;
  -webkit-animation-direction: normal;
  animation-direction: normal;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  line-height: 1.4;
}
.tabs .content section h2 {
  color: #428bff;
  display: none;
}
.tabs .content section h2::after {
  content: "";
  position: relative;
  display: block;
  width: 30px;
  height: 3px;
  background: #428bff;
  margin-top: 5px;
  left: 1px;
}
.tabs
  input[name="tab-control"]:nth-of-type(1):checked
  ~ ul
  > li:nth-child(1)
  > label {
  cursor: default;
  color: #428bff;
}
.tabs
  input[name="tab-control"]:nth-of-type(1):checked
  ~ ul
  > li:nth-child(1)
  > label
  svg {
  fill: #428bff;
}
@media (max-width: 600px) {
  .tabs
    input[name="tab-control"]:nth-of-type(1):checked
    ~ ul
    > li:nth-child(1)
    > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ .slider {
  -webkit-transform: translateX(0%);
  transform: translateX(0%);
}
.tabs
  input[name="tab-control"]:nth-of-type(1):checked
  ~ .content
  > section:nth-child(1) {
  display: block;
}
.tabs
  input[name="tab-control"]:nth-of-type(2):checked
  ~ ul
  > li:nth-child(2)
  > label {
  cursor: default;
  color: #428bff;
}
.tabs
  input[name="tab-control"]:nth-of-type(2):checked
  ~ ul
  > li:nth-child(2)
  > label
  svg {
  fill: #428bff;
}
@media (max-width: 600px) {
  .tabs
    input[name="tab-control"]:nth-of-type(2):checked
    ~ ul
    > li:nth-child(2)
    > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ .slider {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.tabs
  input[name="tab-control"]:nth-of-type(2):checked
  ~ .content
  > section:nth-child(2) {
  display: block;
}
.tabs
  input[name="tab-control"]:nth-of-type(3):checked
  ~ ul
  > li:nth-child(3)
  > label {
  cursor: default;
  color: #428bff;
}
.tabs
  input[name="tab-control"]:nth-of-type(3):checked
  ~ ul
  > li:nth-child(3)
  > label
  svg {
  fill: #428bff;
}
@media (max-width: 600px) {
  .tabs
    input[name="tab-control"]:nth-of-type(3):checked
    ~ ul
    > li:nth-child(3)
    > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ .slider {
  -webkit-transform: translateX(200%);
  transform: translateX(200%);
}
.tabs
  input[name="tab-control"]:nth-of-type(3):checked
  ~ .content
  > section:nth-child(3) {
  display: block;
}
.tabs
  input[name="tab-control"]:nth-of-type(4):checked
  ~ ul
  > li:nth-child(4)
  > label {
  cursor: default;
  color: #428bff;
}
.tabs
  input[name="tab-control"]:nth-of-type(4):checked
  ~ ul
  > li:nth-child(4)
  > label
  svg {
  fill: #428bff;
}
@media (max-width: 600px) {
  .tabs
    input[name="tab-control"]:nth-of-type(4):checked
    ~ ul
    > li:nth-child(4)
    > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(4):checked ~ .slider {
  -webkit-transform: translateX(300%);
  transform: translateX(300%);
}
.tabs
  input[name="tab-control"]:nth-of-type(4):checked
  ~ .content
  > section:nth-child(4) {
  display: block;
}
@-webkit-keyframes content {
  from {
    opacity: 0;
    -webkit-transform: translateY(5%);
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0%);
    transform: translateY(0%);
  }
}
@keyframes content {
  from {
    opacity: 0;
    -webkit-transform: translateY(5%);
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0%);
    transform: translateY(0%);
  }
}
@media (max-width: 1000px) {
  .tabs ul li label {
    white-space: initial;
  }
  .tabs ul li label br {
    display: initial;
  }
  .tabs ul li label svg {
    height: 1.5em;
  }
}

@media (max-width: 750px) {
  .tabs {
    margin-bottom: 50px;
  }
  .categoriesAbout {
    margin-right: 10%;
  }
}

@media (max-width: 830px) {
  #myNews {
    /* margin-top: 10%; */
  }
}

@media (max-width: 600px) {
  .user {
    font-size: 20px;
    margin-left: 4%;
  }

  #myNews {
    margin-top: 0;
  }
  .tabs ul li label {
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 0;
  }
  .tabs ul li label span {
    display: none;
  }
  .tabs .slider {
    display: none;
  }
  .tabs .content {
    margin-top: 20px;
  }
  .tabs .content section h2 {
    display: block;
  }
}
</style>
