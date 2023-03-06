<template>
    <el-form ref="form" :model="form" label-width="120px" style="width: 400px;">
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
            编辑班级
        </el-header>
        <el-form-item label="班级名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="平时成绩百分比">
            <el-input-number v-model="form.usualPercentage" @change="handleUsualChange" :min="0" :max="1" :step="0.01"
                :precision="2" label="平时成绩百分比"></el-input-number>
        </el-form-item>
        <el-form-item label="期末成绩百分比">
            <el-input-number v-model="form.finalPercentage" @change="handleFinalChange" :min="0" :max="1" :step="0.01"
                :precision="2" label="平期末成绩百分比"></el-input-number>
        </el-form-item>
        <el-form-item label="学期">
            <el-select v-model="form.term" placeholder="请选择学期">
                <el-option v-for="item in termList" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="班级容量">
            <el-input-number v-model="form.capacity" :min="min" :max="1000" :step="1"
                label="平期末成绩百分比"></el-input-number>
        </el-form-item>
        <el-form-item label="课程状态">
            已结课
            <el-switch v-model="form.isClosed" active-color="#13ce66" inactive-color="#ff4949" active-value="0"
                inactive-value="1">
            </el-switch>
            进行中
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">确定修改</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { editClass } from "@/api/teacher/teacherCourse.js";

export default {
    data() {
        return {
            form: {
                id: 0,
                name: "",
                capacity: "",
                term: "",
                finalPercentage: 0.4,
                usualPercentage: 0.6,
                capacity: 1,
                isClosed: 0,
                isClosedLabel: "进行中"
            },
            min: 0,
            termList: [],
            classStatusMap: new Map([
                ["进行中", 0],
                ["已结课", 1]
            ])
        };
    },
    created: function () {
        console.log(this.$route.params.classData);
        this.form = this.$route.params.classData;
        this.min = this.form.capacity
        var now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        // 构造学期列表数据
        if (month >= 9) {
            this.termList = [
                year + "" + (year + 1) + "1",
                year + "" + (year + 1) + "2",
                (year - 1) + "" + (year) + "1",
                (year - 1) + "" + (year) + "2",
                (year + 1) + "" + (year + 2) + "1",
                (year + 1) + "" + (year + 2) + "2",
                (year - 2) + "" + (year - 1) + "1",
                (year - 2) + "" + (year - 1) + "2",
            ]
        } else {
            this.termList = [
                (year - 1) + "" + (year) + "1",
                (year - 1) + "" + (year) + "2",
                (year + 1) + "" + (year + 2) + "1",
                (year + 1) + "" + (year + 2) + "2",
                (year - 2) + "" + (year - 1) + "1",
                (year - 2) + "" + (year - 1) + "2",
                (year - 3) + "" + (year - 2) + "1",
                (year - 3) + "" + (year - 2) + "2",
            ]
        }

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
            editClass(this.form, header).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '修改成功!'
                    )
                })
                this.$router.push({
                    path: "/teacher/courseList",
                })
            })
        },
        handleUsualChange() {
            this.form.finalPercentage = (1 - this.form.usualPercentage).toFixed(2)
        },
        handleFinalChange() {
            this.form.usualPercentage = (1 - this.form.finalPercentage).toFixed(2)
        }

    }
}
</script>

<style>

</style>