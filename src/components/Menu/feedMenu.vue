<template>
  <div>
    <channels-component class = "mt-2" :channels="channels"></channels-component>
    <messages-component class = "mt-2" :messages="messages"></messages-component>
  </div>
</template>
<script>
import channelsComponent from "./channelsComponent";
import messagesComponent from "./messagesComponent";
export default {
  data() {
    return {
      projects: ["BSEPRoj", "minorProject", "ADSproj"],
      messages: ["Manezhin Konstantin", "Kostyuchenko Ilya", "Rednikina Darya", "Mikhaleva Anna"]
    };
  },

  computed: {
    channels() {
      return this.$store.state.dataStorage.channels.map(item => item.name);
    }
  },

  //Uncommit later

  // props:{
      // channels:Array,
  //     projects:Array,
  //     messages:Array

  // },
  components: {
    channelsComponent,
    messagesComponent
  }
};
</script>