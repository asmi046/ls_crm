<template>
    <div v-show = "errorMsgVisible" :class =  "{errorMsgOk:errorMsgOk}" class = "errorMsg">
            {{errorMsg}}
    </div>
</template>

<script>
export default {
    props : [
       "errorMsgVisible",
       "errorMsgOk",
       "errorMsg"
    ]
}
</script>

<style>

</style>