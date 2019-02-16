<template>
    <div>
         <channels-component :channels="channels"></channels-component>
         <projects-component :projects="projects"></projects-component>
         <messages-component :messages="messages"></messages-component>
    </div>
</template>
<script>


import channelsComponent from './channelsComponent'
import messagesComponent from './messagesComponent'
import projectsComponent from './projectsComponent'
export default {
    data(){
        return{
            channels:['#general', '#notGeneral','#soci','#cs'],
            projects:['#grudina','#minorProject','#soci','#algosi'],
            messages:['Anna Androidovna','Darya Aiphonovna', 'Maria Konstantinovna'],
        }
    },
    //Uncommit later

    // props:{
    //     channels:Array,
    //     projects:Array,
    //     messages:Array
            
    // },
    components:{
        channelsComponent,
        projectsComponent,
        messagesComponent
    }
}
</script>