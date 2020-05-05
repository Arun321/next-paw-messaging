<template>
    <div id="login">
        <form class="login" @submit.prevent="login">
            <a href="/">Home</a>
            <tr>
                <td colspan=2>
                    <center><font size=4><b>Login Page</b></font></center>
                    <br></td>
            </tr>
            <tr>
                <td><label>Email:</label></td>
                <td><input required v-model="email" type="email" placeholder="Email"/></td>
            </tr>
            <tr>
                <td><label>Password:</label></td>
                <td><input required v-model="password" type="password" placeholder="Password"/></td>
            </tr>
            <tr>
                <td><input type="Reset"></td>
                <td>
                    <button type="submit" @click="login">Login</button>
                </td>
            </tr>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';


    export default {
        data() {
            return {
                email: "",
                password: ""
            }
        },
        methods: {
            login() {
                axios({
                    url: 'https://app.nextpaw.com/graph-api/secret',
                    method: 'post',
                    data: {
                        query: `{login(email:"testing.nextpawindia@gmail.com", password:"Nextpaw@india") {
                                     id
                                     first_name
                                     last_name
                                     token
                                     error
                                     message
                                   }}`
                    }
                }).then(response => this.loginSuccessful(response))
                    .catch((e) => console.log(e));
            },
            loginSuccessful(res) {
                console.log("loginSuccess")
                console.log(res)
                let data = res.data.data.login;

                data = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    id: data.id,
                    token: data.token
                };
                localStorage.setItem('user', JSON.stringify(data));
                this.error = false;
                location.href = '/';

                //this.$router.replace(this.$route.query.redirect || '/')
            },
            loginFailed() {
                this.error = 'Login failed!';
                localStorage.removeItem('id')
            }
        }
    }
</script>


<style scoped>

    .login {
        max-width: 380px;
        padding: 15px 35px 45px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;
        font-size: 16px;
        height: auto;
        padding: 10px;
    }
</style>

