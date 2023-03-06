<template>
    <el-form ref="form" :model="form" label-width="80px" style="width: 400px;">
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
            编辑课程
        </el-header>
        <el-form-item label="课程号">
            <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开课单位">
            <el-select v-model="form.major" placeholder="请选择学院">
                <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.major"
                    @click.native="choiceMajor(item.id)">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">确定修改</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getMajorList } from "@/api/admin/adminMajor.js";
import { editCourse } from "@/api/admin/adminCourse.js";

export default {
    data() {
        return {
            form: {
                id: "",
                name: "",
                number: "",
                major: "",
            },
            selectValue: "",
            majorList: [],
            yearList: []
        };
    },
    created: function () {
        console.log(this.$route.params.courseData);
        this.form = this.$route.params.courseData;
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
        },
        choiceYear(year) {
            this.selectYear = year;
        },
        submit() {
            let header = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                }
            }
            console.log(this.form)
            editCourse(this.form, header).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '修改成功!'
                    )
                })
                this.$router.push({
                    path: "/admin/courseList",
                })
            })
        },
    }
}
</script>

<style>

</style>