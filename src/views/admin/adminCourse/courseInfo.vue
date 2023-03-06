<template>
    <div>
        <el-container class="page-table-ctn">
            <el-header style="height: 100%;background-color: white;font-size: 30px;font-weight: bold; ">
                <el-button type="text" size="medium" icon="el-icon-back" @click="back"></el-button>
            </el-header>
            <el-header
                style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
                课程信息
            </el-header>
            <el-header style="height: 100%;background-color: white;">
                <div
                    style="display: flex;justify-content: space-between;font-size: large;font-weight: bold; height: 30px;">
                    <div style="display: flex;">课程id:&nbsp;
                        <div style="font-weight: normal;">{{ courseData.id }}</div>
                    </div>
                    <div style="display: flex;">课程号:&nbsp;
                        <div style="font-weight: normal;">{{ courseData.number }}</div>
                    </div>
                    <div style="display: flex;">课程名:&nbsp;
                        <div style="font-weight: normal;">{{ courseData.name }}</div>
                    </div>
                    <div style="display: flex;">开课单位:&nbsp;
                        <div style="font-weight: normal;">{{ courseData.major }}</div>
                    </div>
                </div>
                <div style="display: flex;height: 30px;">
                    <div style="font-weight: bold;">面向:</div>
                    <div style="display: flex;" v-for="item in allowMajor" :key="item.id">
                        {{ item.major }}(
                        <div style="display: flex;" v-for="i in item.year" :key="i">
                            {{ i }}级
                        </div>
                        )&nbsp;&nbsp;
                    </div>
                </div>
                <div>
                    <el-button type="primary" @click="addClass">添加班级</el-button>
                </div>
            </el-header>
            <el-header
                style="height: 100%;background-color: white;font-weight: bold; font-size: large;margin-top: 10px;">班级列表</el-header>
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="term" label="学期"></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="teacherName" label="授课教师"></el-table-column>
                <el-table-column prop="usualPercentage" label="平时成绩占比"></el-table-column>
                <el-table-column prop="finalPercentage" label="期末成绩占比"></el-table-column>
                <el-table-column prop="isClosedLabel" label="课程状态"></el-table-column>
                <el-table-column prop="surplus" label="课程容量"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="getClassInfo(scope.row.id)">查看</el-button>
                        <el-button type="text" size="small" @click="editClass(scope.row)">编辑</el-button>
                        <el-button @click="delClass(scope.row.id, scope.row.name)" type="text" size="small"
                            style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
                <slot></slot>
            </el-table>
        </el-container>
    </div>
</template>
  
<script>
import { getCourseInfo } from "@/api/admin/adminCourse.js";
import { deleteClass } from "@/api/admin/adminClass.js";
import { showSuccess } from '@/utils/utils';

export default {
    // 初始化方法
    created: function () {
        this.cid = this.$route.query.cid;
        this.getlivestockInfo(this.cid);
    },
    data() {
        return {
            tableData: [],
            courseData: {},
            allowMajor: [],
            keyWord: "",
            cid: 0,
            classStatusMap: new Map([
                [0, "进行中"],
                [1, "已结课"]
            ])
        }
    },
    methods: {
        // 请求获取数据
        getlivestockInfo(id) {
            var that = this
            let param = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                },
                params: {
                    keyWord: this.keyWord
                },
            }
            getCourseInfo(id, param).then(res => {
                console.log(res)
                that.tableData = res.data.classInfoList;
                that.tableData.forEach(e => {
                    e.isClosedLabel = this.classStatusMap.get(e.isClosed);
                    e.surplus = e.surplus + "/" + e.capacity
                })
                that.courseData = res.data.courseInfo;
                that.allowMajor = res.data.allowMajor;
                // that.total = res.data.total
            }).catch(err => {
                console.log(err)
            });
        },
        // 页面刷新
        mounted() {
            this.getlivestockInfo(1);
        },
        // 删除班级
        delClass(id, name) {
            this.$confirm(
                "是否确定删除班级 " + name,
                "警告(删除班级同时会删除对应学生)", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let params = {
                    headers: {
                        Authorization: sessionStorage.getItem("Authorization"),
                    }
                }
                // 删除对应班级
                deleteClass(id, params).then(res => {
                    // 删除成功后刷新页面
                    this.getlivestockInfo(this.cid)
                    const h = this.$createElement;
                    this.$notify.success({
                        title: '通知',
                        message: h(
                            'i', { style: 'color:teal' },
                            '删除成功!'
                        )
                    })
                })
            }).catch(() => {
                console.log("操作取消")
            })
        },
        // 查看班级详情
        getClassInfo(id) {
            this.$router.push({
                path: "/admin/classInfo",
                query: {
                    cid: id,
                    courseId: this.courseData.id
                }
            })
        },
        addClass() {
            this.$router.push({
                path: "/admin/addClass",
                query: {
                    courseId: this.courseData.id
                }
            })
        },
        editClass(data) {
            console.log(data.isClosed)
            this.$router.push({
                name: "编辑班级",
                params: {
                    classData: {
                        "id": data.id,
                        "isClosed": data.isClosed + "",
                        "term": data.term,
                        "usualPercentage": data.usualPercentage,
                        "finalPercentage": data.finalPercentage,
                        "capacity": data.capacity,
                        "name": data.name,
                        "courseId": this.courseData.id
                    }
                }
            })
        },
        back() {
            this.$router.push({
                path: "/admin/courseList"
            })
        }
    }
}
</script>

<style lang="less" scoped>
.page-table-ctn {
    >.el-table {
        width: auto;
        margin: 14px;
        border: 1px solid #ebeef5;
        border-bottom: unset;
    }

    >div>.el-input {
        width: 30%;
        margin: 0 14px;
        border: 1px solid #ebeef5;
        border-bottom: unset;
    }

    >.footer {
        height: 40px !important;

        .size-info {
            display: inline;
            font-size: 12px;
            color: #666666;
        }
    }
}
</style>
  