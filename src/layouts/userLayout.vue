<template>
    <div>
        <div>
            <router-view></router-view>
        </div>
        <div class="foot">
            Copyright &copy; 2019 {{ team }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "userLayout",
        data() {
            return {
                team: '联合研发小分队'
            }
        },
        mounted() {
            console.info('--mounted--')
        },
        destroyed() {
            console.info('--destroyed--')
        }
    }
</script>

<style scoped>
    .foot {
        text-align: center;
        position: absolute;
        width: 100%;
        bottom: 5%;
    }

</style>