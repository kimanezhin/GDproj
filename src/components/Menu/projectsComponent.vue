<template>
  <div>
    <div class="ml-4 title">projects</div>
    <div class="ml-2 smth">
      <a
        href="#"
        :class="{}"
        :content="project"
        v-for="project in projects"
        :key="project.num"
      >{{project}}</a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    projects: Array
  }
};
</script>
<style>
.smth {
  display: flex;
  flex-direction: column;
}
.current {
  color: black;
}

.simple {
  font-size: 50px !important;
}

.title,
.smth {
  font-size: 19px;
}
.title {
  color: #a2a2a2;
}

.smth > a {
  text-emphasis: none;
  text-decoration: none;

  color: black;
}
.first {
  font-size: 500px;
}
.second {
  font-size: 500px;
}
</style>
