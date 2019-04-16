<template>
    <div>
        <h1>home</h1>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    export default {
        name: "home",
        data(){
            return {
                msg: '我是home组件'
            }
        }
    }
</script>

<style scoped>

</style>