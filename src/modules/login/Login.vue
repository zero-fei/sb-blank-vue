<template>
    <div>
        <template>
            <Form :form="form" @submit="handleSubmit" class="login-form">
                <FormItem>
                    <AInput
                            v-decorator="[
                                'username',
                                { rules: [{ required: true, message: 'Please input your username!' }]}
                            ]"
                            placeholder="admin"
                    >
                        <Icon
                                slot="prefix"
                                type="user"
                                style="color:rgba(0,0,0,.25)"
                        />
                    </AInput>
                </FormItem>
                <FormItem>
                    <AInput
                            v-decorator="[
                                'password',
                                { rules: [{ required: true, message: 'Please input your Password!' }]}
                            ]"
                            placeholder="password"
                    >
                        <Icon
                                slot="prefix"
                                type="lock"
                                style="color:rgba(0,0,0,.25)"
                        />
                    </AInput>
                </FormItem>
                <FormItem>
                    <Button
                            type="primary"
                            html-type="submit"
                            class="login-form-button"
                    >
                        登录
                    </Button>
                </FormItem>
            </Form>
        </template>
        <template class="login-bd">
            <vue-particles color="#dedede"></vue-particles>
        </template>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueParticles from 'vue-particles';
    import { Form, Input, Icon, Button } from 'ant-design-vue';

    Vue.use(VueParticles);

    const hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    };

    const FormItem = Form.Item;

    // 注册使用组件
    const components = { Form, FormItem, AInput: Input , Icon, Button };

    export default {
        components,
        data() {
            return {
                form: Form.createForm(this),
                hasErrors,
            }
        },
        mounted() {

        },
        methods: {
            userNameError () {
                const { getFieldError, isFieldTouched } = this.form;
                return isFieldTouched('userName') && getFieldError('userName');
            },
            passwordError () {
                const { getFieldError, isFieldTouched } = this.form;
                return isFieldTouched('password') && getFieldError('password');
            },
            handleSubmit  (e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                    }
                });
            },
        }

    }
</script>

<style scoped>
    .login-bd {
        position: absolute;
        width: 100%;
    }
    .login-form {
        max-width: 300px;
        position: absolute;
        left: 44%;
        top: 30%;
    }
    .login-form-forgot {
        float: right;
    }
    .login-form-button {
        width: 100%;
    }
</style>