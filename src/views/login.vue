<template>
    <el-container class="login-contain">
        <el-header>
            <div style="" class="head-text">
                <i class="el-icon-s-home" style=""></i>
                教务系统
            </div>
        </el-header>
        <el-main>
            <el-card class="login-module">
                <div slot="header" class="clearfix">
                    <span style="text-align: center; font-size: 20px; font-family: Microsoft YaHei">
                        <p><i class="el-icon-office-building" style="margin-right: 18px"></i>登陆</p>
                    </span>
                </div>
                <div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="学号" prop="id">
                            <el-input v-model.number="ruleForm.number" prefix-icon="el-icon-lollipop"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password
                                prefix-icon="el-icon-ice-cream-round"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="type">
                            <el-radio-group v-model="ruleForm.type">
                                <el-radio label="0">学生</el-radio>
                                <el-radio label="1">老师</el-radio>
                                <el-radio label="2">教务处</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" @click="sumbit('ruleForm')">登陆</el-button>
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
import { login } from "../api/common";

export default {
    data() {
        return {
            ruleForm: {
                number: null,
                password: null,
                type: "0",
            },
            rules: {
                number: [
                    { required: true, message: '请输入学号', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' },
                    { min: 9, max: 11, message: '学号格式错误', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 50, message: '密码格式错误', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
            }
        };
    },
    methods: {
        sumbit(data) {
            const that = this
            that.$refs[data].validate((valid) => {
                if (valid) {
                    let check = false
                    let bane = null
                }
                const data = {
                    number: that.ruleForm.number,
                    password: that.ruleForm.password,
                    type: that.ruleForm.type
                }
                // 登录
                login(data).then(res => {
                    sessionStorage.setItem("Authorization", res.data.token)
                    sessionStorage.setItem("name", res.data.name)
                    sessionStorage.setItem("number", res.data.number)
                    const h = this.$createElement;
                    this.$notify.success({
                        title: '通知',
                        message: h(
                            'i', { style: 'color:teal' },
                            '登录成功!'
                        )
                    })
                    switch (this.ruleForm.type) {
                        case "0":
                            this.$router.push("/student")
                            break;
                        case "1":
                            this.$router.push("/teacher")
                            break;
                        case "2":
                            this.$router.push("/admin")
                            break;
                    }
                    // console.log(sessionStorage.getItem("Authorization"))
                }).catch((res) => {
                    console.log(res)
                });

            })
        }
    }

}
</script>

<style scoped>
/* .login-contain{

} */

.login-module {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 550px;
    transform: translate(-50%, -50%);
    /*width: 380px;*/
    /*height: 325px;*/
    margin-top: 60px;
    /*border: none;*/
    position: absolute;
    text-align: center;
}

.head-text {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: #333;
    line-height: 60px;
    text-align: center;
    font-size: 25px;
    font-weight: bolder
}
</style>
