<template>
    <div>
        <h1>{{ title }}</h1>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
     computed: {
       ...mapState([
           'title'
       ])
     },
      data() {
          return {
              msg: '欢迎登录'
          }
      }
    }
</script>

<style scoped>

</style>