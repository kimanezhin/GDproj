<template>
  <div class="exit" @click="logOut">Log out</div>
</template>

<script>
export default {
  methods: {
    logOut() {
      this.$store.dispatch("LOG_OUT").then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style>

.exit {
  font-weight: 600;
  /* margin-left: 98%; */
  /* float: right; */
  font-size: 30px;
  top: 65px;
  position: absolute;
  right: -0.8em;
  /* margin: 0; */
  margin-left: 99%;
  -webkit-transform: rotate(-90deg); /* разворот текста для разных браузеров */
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
