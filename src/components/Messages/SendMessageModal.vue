<template>
    <div>
        <div class="header">
            Новое сообщение
        </div>

        <div class="mainPart">

            <textarea class = "form-control msg" rows="10">

            </textarea>
        <div class="container">
        <button @click="sendMessage" class = "btn mt-1 mb-1 btn-outline-primary btn-lg btn-block">Отправить!</button>
        </div>
        </div>




    </div>
</template>

<script>
export default {
    props:{
        id:{
            type:Number
        }
    },
    methods: {
        sendMessage(){
            let val = document.getElementsByClassName('msg')[0].value
            let obj = {
                body:{
                    markdown: val
                },
                user:this.id
            }

            this.$store.dispatch("SEND_MSG", obj).then(() =>{
                this.$emit('close')
            })
        }
    },
}
</script>

<style scoped>
.header{
    height: 50px;
    width: 100%;
    background-color: #428bff;
    color: white;
    line-height: 2;
    font-weight: 500;
    text-align: center;
    font-size: 20px;

}

.msg{
    width: 100%;
}
</style>
