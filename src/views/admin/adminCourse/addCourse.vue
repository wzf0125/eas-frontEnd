<template>
    <el-form ref="form" :model="form" label-width="80px" style="width: 500px;">
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold;">
            添加课程
        </el-header>
        <el-form-item label="课程号" style="margin-top: 10px;">
            <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开课单位">
            <el-select v-model="form.majorId" placeholder="请选择学院">
                <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.id"
                    @click.native="choiceMajor(item.id)">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-for="domain in form.allow" :label="'面向单位'" :key="domain.key">
            <el-select v-model="domain.majorId" placeholder="请选择学院">
                <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.id"
                    @click.native="choiceMajor(item.id)">
                </el-option>
            </el-select>
            <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removeDomain(domain)"
                style="margin-left: 10px" size="mini"></el-button>
            <el-checkbox-group v-model="domain.year">
                <el-checkbox v-for="year in yearList" :label="year" :key="year">{{ year }}</el-checkbox>
            </el-checkbox-group>

        </el-form-item>
        <el-form-item>
            <el-button @click="addDomain">添加面向学院</el-button>
            <el-button type="primary" @click="submit">确定添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getMajorList } from "@/api/admin/adminMajor.js";
import { addCourse } from "@/api/admin/adminCourse.js";

export default {
    data() {
        return {
            form: {
                name: "",
                number: "",
                majorId: "",
                year: "",
                allow: [{
                    majorId: '',
                    year: []
                }]
            },
            selectValue: "",
            majorList: [],
            selectMajor: 1,
            selectYear: "",
            yearList: []
        };
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
        var now = new Date();
        let year = now.getFullYear();
        console.log(year)
        let month = now.getMonth();
        if (month >= 9) {
            this.yearList = [
                year - 3, year - 2, year - 1, year,
            ]
        } else {
            this.yearList = [
                year - 4, year - 3, yrea - 2, year - 1
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
            addCourse(this.form, header).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '添加成功!'
                    )
                })
                this.$router.push({
                    path: "/admin/courseList",
                })
            })
        },
        removeDomain(item) {
            var index = this.form.allow.indexOf(item)
            if (index !== -1) {
                this.form.allow.splice(index, 1)
            }
        },
        addDomain() {
            this.form.allow.push({
                majorId: '',
                year: [],
                key: Date.now()
            });
        }
    }
}
</script>

<style>

</style>