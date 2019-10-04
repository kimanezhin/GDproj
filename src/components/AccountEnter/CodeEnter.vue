<template>
  <div>
    <div id="wrapper">
      <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Введите код</h1>
        <div id="container" class="form-row d-flex flex-row justify-content-between">
          <input
            v-for="(val,index) in code"
            :name="index"
            v-model="code[index]"
            @input="validate"
            @keyup.delete="deleteAndGoLeft"
            @keyup.left="goLeft"
            @keydown.right="goRight"
            :key="index"
            type="text"
            class="form-control number col-2"
          />
        </div>
      </form>
    </div>

    <div class="notify bar-top" id="checkMail" data-notification-status="success">{{message}}</div>
  </div>
</template>

<script>
import Axios from "axios";
import multiselect from "vue-multiselect";
export default {
  components: {
    multiselect
  },
  name: "Login",
  data() {
    return {
      code: ["", "", "", "", "", ""],
      currentInterval: -1,
      message: ""
    };
  },

  mounted() {
    let cur = document.getElementsByName(0)[0];
    this.currentInterval = setInterval(() => {
      Axios.post(
        this.$store.getters.GET_URL + "/authentication/me",
        {},
        { withCredentials: true }
      ).then(() => {
        this.$router.push("/feed");
      });
    }, 5000);
    cur.focus();
  },
  beforeDestroy() {
    clearInterval(this.currentInterval);
    localStorage.removeItem("currentMail");
  },
  methods: {
    showNotification(event, code) {
      let status, type;
      code = parseInt(code);
      if (code == 403) {
        status = "error";
        type = "bottom-right";
        this.message =
          "Произошла ошибка! Вы ввели неверный код, попробуйте еще раз.";
        this.code = ["", "", "", "", "", ""];
        document.getElementsByName("0")[0].focus();
      } else if (code == 400) {
        status = "error";
        type = "bottom-right";
        this.message = "Произошла ошибка! Файлы cookie не были установлены.";
      } else if (code == 498) {
        this.message = "Текущая сессия не активна, попробуйте еще раз.";
        setTimeout(() => {
          this.$router.push("/registration");
        }, 4000);
      } else {
        return;
      }

      $(".notify")
        .removeClass()
        .addClass(type + " " + status)
        .addClass("do-show");

      // event.preventDefault();
      setTimeout(function() {
        $(document.getElementById("checkMail"))
          .removeClass()
          .addClass("notify")
          .addClass("bar-top");
      }, 5000);
    },

    deleteAndGoLeft(event) {
      // if(event.target.value.length == 0)
      // return;

      let currNum = parseInt(event.target.name);
      this.code[currNum] = "";

      this.goLeft();
    },
    goLeft() {
      let currNum = parseInt(event.target.name);
      let cur = document.getElementsByName(currNum)[0];

      // cur.blur();
      let nextNum = currNum - 1;

      let next = document.getElementsByName(nextNum)[0];
      if (next) next.focus();
    },
    goRight() {
      let currNum = parseInt(event.target.name);
      let cur = document.getElementsByName(currNum)[0];

      // cur.blur();
      let nextNum = currNum + 1;

      let next = document.getElementsByName(nextNum)[0];
      if (next) next.focus();
      else this.sendCode();
    },
    validate(event) {
      let currNum = parseInt(event.target.name);

      event.target.value = event.target.value.replace(/\s/g, "");
      if (!Number.isInteger(parseInt(event.target.value))) {
        this.code[currNum] = "";
        event.target.value = "";

        return;
      }
      if (event.target.value.length == 6) {
        let value = event.target.value;
        value = value.split("").map(x => parseInt(x));
        if (value.every(Number.isInteger)) {
          for (let i = 0; i < 6; ++i) {
            this.code[i] = value[i];
          }

          this.sendCode();
          return;
        }
      }
      if (event.target.value.length > 1) event.target.value = event.data;
      let x = parseInt(event.data);
      if (x != 0 && !x) {
        this.code[currNum] = "";
        return;
      }
      this.code[currNum] = x;
      this.goRight();
    },
    sendCode(event) {
      let codeNum = this.code.join("");
      if (codeNum.length != 6) return;

      let code = parseInt(codeNum);

      this.$store
        .dispatch("VERIFY_CODE", code)
        .then(response => {
          console.log(response);
          // this.$router.push("/feed");
        })
        .catch(err => {
          let status = err.response.status;

          this.showNotification(event, status);
        });
    }
  }
};
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container > input {
  font-weight: 600 !important;
  font-size: 22px;
  max-width: 50px;
}
.number {
  text-align: center;
}
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

@media screen and (max-width: 1000px) {
  /* #container > input { */
  /* max-width: 45px; */
  /* } */

  .form-signin {
    /* width: 100%; */
    /* max-width: 70%; */
  }
}
@media screen and (max-width: 780px) {
  .form-signin {
    /* width: 100%; */
    /* max-width: 80%; */
  }
}

@media screen and (max-width: 700px) {
  #container > input {
    /* max-width: 35px; */
    /* font-size: 20px; */
  }
  .form-signin {
    /* width: 100%; */
    /* max-width: 70%; */
  }
}

@media screen and (max-width: 340px) {
  #container > input {
    max-width: 35px;
    font-size: 20px;
  }
  .form-signin {
    width: 100%;
    max-width: 90%;
  }
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
    slide-in-left 1s ease-in-out reverse forwards 5s;
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
  animation: slide-show 1s forwards, slide-show 1s reverse forwards 3s;
}

.bar-top[data-notification-status="success"] {
  background-color: #66bb6a;
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>