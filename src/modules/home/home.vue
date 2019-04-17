<template>
    <div>
        <h1>{{ title }}</h1>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "home",
        computed: mapState({
            title: (state) => state.home.title
        }),
        data(){
            return {
                msg: '我是home组件'
            }
        }
    }
</script>

<style scoped>

</style>