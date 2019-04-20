<template>
    <div>
        我是login页面，我在待开发中。。。。{{ number }}
        <a-button></a-button>
        <div class="login-bd">
            <vue-particles color="#dedede"></vue-particles>
        </div>

    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';
    import { Button } from 'ant-design-vue';
    import VueParticles from 'vue-particles';

    Vue.component(Button.name, Button);
    Vue.use(VueParticles);
    @Component
    export default class Login extends Vue {
        number = 123
    }
</script>

<style scoped>
  .login-bd {
      position: absolute;
      width: 100%;
  }
</style>