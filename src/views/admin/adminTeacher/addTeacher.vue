<template>
    <el-form ref="form" :model="form" label-width="80px" style="width: 500px;">
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold;">
            添加教师
        </el-header>
        <el-form-item label="教师工号" style="margin-top: 10px;">
            <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="教师密码">
            <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="所属学院">
            <el-select v-model="selectValue" placeholder="请选择学院">
                <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.id"
                    @click.native="choiceMajor(item.id)">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">确定添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getMajorList } from "@/api/admin/adminMajor.js";
import { addTeacher } from "@/api/admin/adminTeacher.js";

export default {
    data() {
        return {
            form: {
                name: "",
                number: "",
                password: "",
                major: ""
            },
            selectValue: "",
            majorList: [],
            selectMajor: 1
        }
    },
    created: function () {
        let param = {
            headers: {
                Authorization: sessionStorage.getItem("Authorization"),
            }
        }
        getMajorList(param).then(res => {
            this.majorList = res.data
        })
    },
    methods: {
        choiceMajor(id) {
            this.selectMajor = id;
            this.form.major = id;
        },
        submit() {
            let header = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                }
            }
            console.log(this.form)
            addTeacher(this.form, header).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '添加成功!'
                    )
                })
                this.$router.push({
                    path: "/admin/teacherList",
                })
            })
        }
    }
}
</script>

<style>

</style>