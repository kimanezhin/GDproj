<template>
  <div>
    <div id="wrapper">
      <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Введите код</h1>
        <div class="form-row d-flex flex-row justify-content-between">
          <input
            v-model="code[0]"
            name="0"
            @input="validate"
            type="text"
            class="form-control number col-2"
          >
          <input
            v-model="code[1]"
            @input="validate"
            name="1"
            type="text"
            class="form-control number col-2"
          >
          <input
            v-model="code[2]"
            @input="validate"
            name="2"
            type="text"
            class="form-control number col-2"
          >
          <input
            v-model="code[3]"
            @input="validate"
            name="3"
            type="text"
            class="form-control number col-2"
          >
          <input
            v-model="code[4]"
            @input="validate"
            name="4"
            type="text"
            class="form-control number col-2"
          >
          <input
            v-model="code[5]"
            @input="validate"
            name="5"
            type="text"
            class="form-control number col-2"
          >
        </div>
      </form>
    </div>
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
      id: "",

      reg: false,
      selectedCountries: [],
      countries: [],
      code: ["", "", "", "", "", ""],
      isLoading: false,
      timeToRequest: 500,
      currentTimeout: -1
    };
  },

  mounted() {
    let cur = document.getElementsByName(0)[0];

    cur.focus();
  },
  methods: {
    validate(event) {
      let x = parseInt(event.data);
      if (x != 0 && !x) {
        this.code[parseInt(event.target.name)] = "";
        return;
      }
      this.code[parseInt(event.target.name)] = x;
      let cur = document.getElementsByName(event.target.name)[0];

      cur.blur();
      let nextNum = parseInt(event.target.name) + 1;

      let next = document.getElementsByName(nextNum)[0];

      if (event.data == "") return;
      if (next) {
        next.focus();
      } else {
        let code = parseInt(this.code.join(""));
        console.log(code);
        this.$store
          .dispatch("VERIFY_CODE", code)
          .then(() => {
            console.log("good");
            this.$router.push("/feed");
          })
          .catch(() => {
            console.log("aa");
          });
      }
    },
    setTimer() {},
    limitText(count) {
      return `and ${count} other countries`;
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





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.number {
  text-align: center;
  font-weight: 500;
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