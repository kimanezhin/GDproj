<template>
  <div >
    <h2>Channels</h2>
 
    <ul class="list-group">
      <li
        class="list-group-item listHash"
        v-for="(item, i) in currentList"
        :tabindex="i"
        :key="i"
        @click="selectHash($event)"
      >
        {{item.name}}
        <p-check
          name="check"
          class="myCheck p-round p-default p-smooth p-bigger"
          color="primary"
          v-model="checked[i]"
        ></p-check>
      </li>
    </ul>
    <button class="btn btn-secondary" @click="updateChannel">Сохранить</button>
  
  </div>

</template>

<script>
import _ from 'lodash'
export default {
  components: {},
  data() {
    return {
      checked: []
    };
  },
  methods: {
    selectHash(event) {},
    updateChannel() {
      let changed = [];
      
      let currentId = parseInt(this.hashId);
      let copy = this.currentList;
      let tmp = copy.map((elem, i) => {
        if (this.checked[i] && !elem.people.includes(currentId)) {
          elem.people.push(currentId);
          changed.push(true);
        } else if (!this.checked[i] && elem.people.includes(currentId)) {
            
             elem.people = _.without(elem.people,currentId)
          changed.push(true);
        } else changed.push(true);
        
        return elem;
      });

      tmp.forEach((elem, i) => {
        if (changed[i]) this.$store.dispatch("UPDATE_CHANNEL", elem);
      });
        this.$emit('close')
    },
    setAvalibleChannels() {
        this.checked = []
      this.currentList.forEach(element => {
        console.log(element);
        if (element.people.includes(parseInt(this.hashId)))
          this.checked.push(true);
        else this.checked.push(false);
      });
    }
  },
  computed: {
    currentList() {
      return this.$store.getters.GET_CHANNELS;
    },
    listLength() {
      return this.currentList.length;
    }
  },
  mounted() {
    if (this.currentList.length == 0) this.$store.dispatch("GET_ALL_CHANNELS");

    this.setAvalibleChannels();
  },
  props: ["hashId"],
  watch: {
    listLength: function(oldL, newL) {
      this.setAvalibleChannels();
    }
  }
};
</script>
<style scoped>
.cl {
  height: 40px;
  width: 50%;
  text-align: center;
  z-index: 10;
  font-weight: 600;
  font-size: 22px;
}
.cl:hover {
  cursor: pointer;
}
.slider {
  left: 50%;
  z-index: 9;
  position: absolute;
  background-color: #428bff;
  width: 30%;
  margin-left: 10%;
  margin-right: 10%;

  height: 5px;
  transition: 0.3s ease;
}

.slider-translate {
  transform: translateX(-170%);
  transition: 0.3s ease;
}

.myCheck {
  float: right;
}
button {
  float: right;
  margin: 10px;
}
li:focus {
  border: none !important;

  -webkit-box-shadow: none;
  box-shadow: none;
}

li {
  border: none !important;
}
ul {
  height: 200px;
}
ul {
  overflow: hidden;
  overflow-y: scroll;
}

li:hover {
  cursor: pointer;
}
#tags:hover,
#people:hover {
  cursor: pointer;
}
.nameContainer {
  height: 40px;
}
</style>


<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";
</style>
