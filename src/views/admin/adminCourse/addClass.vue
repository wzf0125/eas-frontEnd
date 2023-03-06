<template>
    <el-form ref="form" :model="form" label-width="120px" style="width: 400px;">
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold;">
            添加班级
        </el-header>
        <el-form-item label="班级名称" style="margin-top: 10px;">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="班级容量">
            <el-input-number v-model="form.capacity" :min="1" :max="2000">
            </el-input-number>
        </el-form-item>
        <el-form-item label="学期">
            <el-select v-model="form.term" placeholder="请选择学期">
                <el-option v-for="item in termList" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="教师工号">
            <el-input v-model="form.teacherNumber"></el-input>
        </el-form-item>
        <el-form-item label="平时成绩百分比">
            <el-input-number v-model="form.usualPercentage" @change="handleUsualChange" :min="0" :max="1" :step="0.01"
                :precision="2" label="平时成绩百分比"></el-input-number>
        </el-form-item>
        <el-form-item label="期末成绩百分比">
            <el-input-number v-model="form.finalPercentage" @change="handleFinalChange" :min="0" :max="1" :step="0.01"
                :precision="2" label="平期末成绩百分比"></el-input-number>
        </el-form-item>
        <el-form-item label="上课时间">
            <div style="display: flex;width:200%;">
                <el-select v-model="form.classTime.week" placeholder="请选择星期">
                    <el-option v-for="item in weekValueList" :key="item" :label="weekValueMap.get(item)" :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="form.classTime.lesson" multiple="" placeholder="请选择节数"
                    style="margin-left: 10px;width: 50%; " multiple-limit=4>
                    <el-option v-for="item in lessonValueList" :key="item" :label="lessonValueMap.get(item)"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">确定添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getMajorList } from "@/api/admin/adminMajor.js";
import { addClass } from "@/api/admin/adminClass.js";

export default {
    data() {
        return {
            form: {
                courseId: 0,
                name: "",
                capacity: "",
                term: "",
                teacherNumber: "",
                finalPercentage: 0.4,
                usualPercentage: 0.6,
                classTime: {
                    week: "",
                    lesson: []
                }
            },
            weekValueList: [1, 2, 3, 4, 5, 6, 7],
            weekValueMap: new Map([
                [1, "星期一"],
                [2, "星期二"],
                [3, "星期三"],
                [4, "星期四"],
                [5, "星期五"],
                [6, "星期六"],
                [7, "星期日"],
            ]),
            lessonValueList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            lessonValueMap: new Map([
                [1, "第一节"],
                [2, "第二节"],
                [3, "第三节"],
                [4, "第四节"],
                [5, "第五节"],
                [6, "第六节"],
                [7, "第七节"],
                [8, "第八节"],
                [9, "第九节"],
                [10, "第十节"],
                [11, "第十一节"],
                [12, "第十二节"],
                [13, "第十三节"],
                [14, "第十四节"],
                [15, "第十五节"],
            ]),
            termList: []
        }
    },
    created: function () {
        this.form.courseId = this.$route.query.courseId;

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
            this.form.major = id;
        },
        choiceYear(year) {
            this.selectYear = year;
            this.form.year = year;
        },
        submit() {
            let header = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                }
            }
            console.log(this.form)
            addClass(this.form, header).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '添加成功!'
                    )
                })
                this.$router.push({
                    path: "/admin/courseInfo",
                    query: {
                        cid: this.form.courseId
                    }
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

<style scoped>
.el-input {
    width: 300px;
}
</style>