<template>
  <div>
    <Navbar class = "d-flex position-absolute "/>
    <div id="wrapper">
      <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Настройки</h1>
        <div class="form-row">
          <div class="form-group col-md-4">
            <label for="inputEmail4">Имя</label>
            <input
              v-model="firstName"
              required
              type="text"
              class="form-control"
              id="firstName"
              placeholder="Имя"
            >
          </div>
          <div class="form-group col-md-4">
            <label for="inputPassword4">Фамилия</label>
            <input
              v-model="lastName"
              required
              type="text"
              class="form-control"
              id="lastName"
              placeholder="Фамилия"
            >
          </div>
          <div class="form-group col-md-4">
            <label for="inputPassword4">Отчество</label>
            <input
              v-model="middleName"
              required
              type="text"
              class="form-control"
              id="middleName"
              placeholder="Отчество"
            >
          </div>
        </div>
        <div>
          <label class="typo__label" for="ajax">Факультет</label>
          <multiselect
            v-model="selectedCountries"
            id="ajax"
            label="name"
            track-by="code"
            placeholder="Type to search"
            open-direction="bottom"
            :options="countries"
            :multiple="true"
            :isSpaceAllowed="true"
            :internal-search="true"
            :searchable="false"
            :loading="isLoading"
            :max-height="600"
            @search-change="asyncFind"
          >
            <template slot="tag" slot-scope="{ option, remove }">
              <span class="custom__tag">
                <span>{{ option.name }}</span>
                <span class="custom__remove" @click="remove(option)">❌</span>
              </span>
            </template>
            <template slot="clear" slot-scope="props">
              <div
                class="multiselect__clear"
                v-if="selectedCountries.length"
                @mousedown.prevent.stop="clearAll(props.search)"
              ></div>
            </template>
            <span slot="noResult">Oops! No elements found.</span>
          </multiselect>
        </div>

        <button @click="register" type="submit" class="btn mt-2 btn-primary btn-block">Сохранить</button>
        <button
          @click="leaveAllSessions"
          type="submit"
          class="btn mt-2 btn-danger btn-block"
        >Завершить все сессии</button>
        <div class="notify bar-top" id="checkMail" data-notification-status="success">{{message}}</div>
      </form>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import Navbar from '../Navbar'
import multiselect from "vue-multiselect";
export default {
  components: {
    multiselect,
    Navbar
  },
  name: "Login",
  data() {
    return {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      
      selectedCountries: [],
      countries: [],
      isLoading: false,
      timeToRequest: 500,
      currentTimeout: -1,
      email: "",
      message: ""
    };
  },
  mounted() {
    let myId = parseInt(localStorage.getItem("myId"));
    let usr =
      this.$store.getters.GET_MAP.get(myId) ||
      this.$store.getters.GET_MESSAGE_MAP.get(myId);
    if (usr) {
      this.firstName = usr.firstName;
      this.middleName = usr.middleName;
      this.lastName = usr.lastName;
      this.selectedCountries = this.transformFaculty(usr.faculty);
    }
  },
  methods: {
    leaveAllSessions() {
      this.$store.dispatch("DEACTIVATE_ALL").
        then(() => {
          this.$router.push("/login");
        }).catch(() => {
          this.$router.push("/login");
        });
    },

    showNotification(event, notification) {
      event.preventDefault();

      let status, type;

      if (notification === "error") {
        status = "error";
        type = "bottom-right";
        this.message =
          "Произошла ошибка! Возможно, вы пробуете изменить неизменяемые поля";
      } else {
        status = "notify";
        type = "top-left";
        this.message = "Настройки успешно обновлены! ";
      }

      $(".notify")
        .removeClass()
        .addClass(type + " " + status)
        .addClass("do-show");

      event.preventDefault();
      setTimeout(function() {
        $(document.getElementById("checkMail"))
          .removeClass()
          .addClass("notify")
          .addClass("bar-top");
      }, 5000);
    },
    transformFaculty(usr) {
      let faculty = {
        name: usr.name,
        code: usr.url
      };
      return [faculty];
    },

    limitText(count) {
      return `and ${count} other countries`;
    },

    asyncFind(query) {
      this.timeToRequest = 500;
      this.isLoading = true;
      if (this.currentTimeout != -1) clearTimeout(this.currentTimeout);
      let i = setTimeout(() => {
        this.$store.dispatch("GET_FACULTY", query).then(response => {
          this.countries = response;
          this.isLoading = false;
        });
      }, this.timeToRequest);
      this.currentTimeout = i;
    },
    clearAll() {
      this.selectedCountries = [];
    },
    register(event) {
      let faculty = this.selectedCountries[0].code;
      let user = {
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        faculty: faculty
      };
      this.$store
        .dispatch("UPDATE_USER", user)
        .then(response => {
          this.showNotification(event, "success");
        })
        .catch(err => {
          this.showNotification(event, "error");
        });
    }
  },
  watch: {
    selectedCountries(neww, old) {
      if (neww.length > 1)
        this.selectedCountries = this.selectedCountries.pop();
    }
  }
};
</script>


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#wrapper {
  height: 100vh;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.title {
  font-size: 16px;
}

.bottom-right {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20px;
  color: #fff;
  line-height: 1.3;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
  max-width: 350px;
  margin: 20px;
  bottom: 0;
  right: 0;
  transform: translateX(420px);
  background-color: #ef5350;
}
@keyframes slide-in-right {
  to {
    transform: translateX(0);
  }
}
.bottom-right.do-show {
  animation: slide-in-right 1s ease-in-out forwards,
    slide-in-right 1s ease-in-out reverse forwards 4s;
}

.bottom-right[data-notification-status="error"] {
  background-color: #ef5350;
}
.bottom-right[data-notification-status="error"]:before {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  min-width: 30px;
  margin-right: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016' fill='%23C61512'/%3E%3Cpath d='M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z' fill='%23C61512'/%3E%3C/svg%3E")
    center / cover no-repeat;
}

h1,
p {
  text-align: center;
}

.form-signin {
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
@keyframes fade-in {
  from {
    visibility: hidden;
    opacity: 0;
  }
  to {
    visibility: visible;
    opacity: 1;
  }
}
@keyframes slide-show {
  to {
    transform: translateY(0);
  }
}

.button {
  padding: 15px 20px;
  border: 2px solid white;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: white;
}
.button:hover,
.button.is-active {
  color: #be93c5;
  /* background-color: #0033FF; */
}
.top-left {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20px;
  color: #fff;
  line-height: 1.3;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
  max-width: 350px;
  margin: 20px;
  top: 0;
  left: 0;
  transform: translateX(-420px);
}
@keyframes slide-in-left {
  to {
    transform: translateX(0);
  }
}
.top-left.do-show {
  animation: slide-in-left 1s ease-in-out forwards,
    slide-in-left 1s ease-in-out reverse forwards 4s;
}

.top-left[data-notification-status="success"] {
  background-color: #66bb6a;
}
.top-left[data-notification-status="success"]:before {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  min-width: 30px;
  margin-right: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016' fill='%2339813C'/%3E%3Cpath d='M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z' fill='%2339813C'/%3E%3C/svg%3E")
    center / cover no-repeat;
}

.bar-top {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 20px;
  color: #fff;
  line-height: 1.3;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
}
.bar-top.do-show {
  animation: slide-show 1s forwards, slide-show 1s reverse forwards 1s;
}

.bar-top[data-notification-status="success"] {
  background-color: #66bb6a;
}
.custom__tag {
  display: inline-block;
  padding: 3px 12px;
  background: #d2d7ff;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  cursor: pointer;
}
.bar-top[data-notification-status="success"]:before {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  min-width: 30px;
  margin-right: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016' fill='%2339813C'/%3E%3Cpath d='M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z' fill='%2339813C'/%3E%3C/svg%3E")
    center / cover no-repeat;
}
</style>

