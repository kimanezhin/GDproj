<template>
  <div>
    <channels-component class = "mt-2" :channels="channels"></channels-component>
    <projects-component class = "mt-2" :projects="projects"></projects-component>
    <messages-component class = "mt-2" :messages="messages"></messages-component>
  </div>
</template>
<script>
import channelsComponent from "./channelsComponent";
import messagesComponent from "./messagesComponent";
import projectsComponent from "./projectsComponent";
export default {
  data() {
    return {
      projects: ["BSEPRoj", "minorProject", "ADSproj"],
      messages: ["Manezhin Konstantin", "Kostyuchenko Ilya", "Rednikina Darya", "Mikhaleva Anna"]
    };
  },

  computed: {
    channels() {
      //   const condition = new RegExp("", "i");
      return this.$store.state.dataStorage.channels.map(item => item.name);
    }
  },
  //Uncommit later

  // props:{
  //     channels:Array,
  //     projects:Array,
  //     messages:Array

  // },
  components: {
    channelsComponent,
    projectsComponent,
    messagesComponent
  }
};
</script>