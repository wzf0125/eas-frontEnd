<template>
    <el-header>
        <span>{{ number }}</span>
        <span>{{ name }}</span>
        <el-button @click="logout" class="logout" szi="small" round>退出</el-button>
    </el-header>
</template>

<script>
import { logout } from "@/api/common";

export default {
    data() {
        return {
            name: "",
            number: ""
        }
    },
    created: function () {
        this.name = sessionStorage.getItem("name")
        this.number = sessionStorage.getItem("number")
    },
    methods: {
        logout() {
            let config = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                },
            };
            logout(config).then((res) => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '退出登录成功!'
                    )
                })
                this.$router.push("/login")
            }).catch((err) => {

            });
        }
    }
}
</script>

<style scoped>
.el-header {
    line-height: 55px;
    text-align: right;
    font-size: 12px;
}

.el-header>* {
    margin-left: 10px;
    font-size: large;
}

.logout {
    margin-right: -30px;
    font-size: 13px;
}
</style>
