<template>
  <div>
    <div id="wrapper">
      <form class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input
          id="inputEmail"
          class="form-control mb-3"
          placeholder="Email address"
          required
          autofocus
          v-model="id"
        >

        <input
          class="button btn btn-lg btn-primary btn-block"
          v-on:click="signIn"
          type="submit"
          data-type="top-left"
          data-status="success"
          value="Sign in"
        >
        <p class="mt-5 mb-3 text-muted">&copy; 2018-2019</p>
      </form>

      <div
        class="notify bar-top"
        id="checkMail"
        data-notification-status="success"
      >Вам на почту была отправлена ссылка для входа. Проверьте, пожалуйста, Ваш почтовый ящик.</div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      id: "",
    };
  },
  mounted() {
    let i = window.location.href;
    let index = i.lastIndexOf('#');
    let qIndex = i.lastIndexOf('?')
    if(qIndex!=-1)
      return;
     i = i.split('')
     i.splice(index,0,"?")
    window.location.href = i.join('');
    // .join("")
  },
  methods: {
    signIn(event) {
      this.$store.dispatch("SET_ID", this.id);
      
      this.showNotification(event.target.value);
    },
    showNotification(email) {
      var pattern = /^\w+@{1}(edu.)?(hse.ru){1}$/;
      var email = $(document.getElementById("inputEmail")).val();

      // if (pattern.test(email))
      if (false) {
        event.preventDefault();

        //   $('.button').removeClass('is-active');
        //   $(this).addClass('is-active');
        //   $('.button').removeClass('is-active');

        $(".notify")
          .removeClass()
          .addClass("top-left" + " notify")
          .addClass("do-show");

        event.preventDefault();
        setTimeout(function() {
          $(document.getElementById("checkMail"))
            .removeClass()
            .addClass("notify")
            .addClass("bar-top");
        }, 5900);
      }

      //TODO: Here should be /authenticate

      this.$store
        .dispatch("AUTH_REQUEST", email)
        .then(
          response => {
            // if(response.data.isRegistred)

            if (response == "registered") {
              this.$router.push("/code");
            } else if (response === "canRegister") {
              localStorage.setItem("currentMail", email);
              this.$router.push("/registration");
            } else if (response === "invalid") {
            }
          }
          // else
        )
        .catch(err => {
          console.log(err, "Unable to login");
        });
    }
  }
};
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

h1,
p {
  text-align: center;
}

.form-signin {
  width: 100%;
  max-width: 330px;
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
