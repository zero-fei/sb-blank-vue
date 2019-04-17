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
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;
    }

</style>