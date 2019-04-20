<template>
    <div>
        <h1>{{ title }}</h1>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';
    import { Button, Form, Input } from 'ant-design-vue';
    import VueParticles from 'vue-particles';
    Vue.use(VueParticles);

    @Component({
        Button, Form, Input
    })
    export default class Home extends Vue {
        mouted() {

        }
    }
</script>

<style scoped>

</style>