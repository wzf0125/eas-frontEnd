<template>
    <div>
        <el-container class="page-table-ctn">
            <el-header style="height: 100%;background-color: white;font-size: 30px;font-weight: bold; ">
                <el-button type="text" size="medium" icon="el-icon-back" @click="back"></el-button>
            </el-header>
            <el-header
                style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
                班级信息
            </el-header>
            <el-header style="height: 100%;background-color: white;">
                <div
                    style="display: flex;justify-content: space-between;font-size: large;font-weight: bold; height: 30px;">
                    <div style="display: flex;">班级id:
                        <div style="font-weight: normal;">{{ classData.id }}</div>
                    </div>
                    <div style="display: flex;">班级名称:
                        <div style="font-weight: normal;">{{ classData.name }}</div>
                    </div>
                    <div style="display: flex;">学期:
                        <div style="font-weight: normal;">{{ classData.term }}</div>
                    </div>
                    <div style="display: flex;">授课教师:
                        <div style="font-weight: normal;">{{ classData.teacherName }}</div>
                    </div>
                    <div style="display: flex;">班级容量:
                        <div style="font-weight: normal;">{{ classData.surplus }} / {{ classData.capacity }}</div>
                    </div>
                </div>
                <div style="display: flex;height: 30px;">
                    <div style="font-weight: bold;">上课时间: </div>
                    <div style="display: flex;">
                        {{ dateDict.get(classTime.week) }} (
                        <div style="display: flex;" v-for="(item, index) in classTime.lesson" :key="item">
                            <template v-if="index > 0">-</template>{{ item }}
                        </div>节
                        )&nbsp;&nbsp;
                    </div>
                </div>
                <div>
                    <el-button type="primary" @click="addStudent2Class">添加学生</el-button>
                </div>
            </el-header>
            <!-- <div style="justify-content: space-between;">
                <el-input v-model="keyWord" class="searchinput" placeholder="请输入课程名称/课程号" prefix-icon="el-icon-search"
                    clearable>
                    <el-button slot="append" class="searchbtn" @click="mounted()">搜索</el-button>
                </el-input>
                <el-button type="primary">添加课程</el-button>
            </div> -->
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="数据编号"></el-table-column>
                <el-table-column prop="number" label="学号" width="150px"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="usualScore" label="平时成绩"></el-table-column>
                <el-table-column prop="finalScore" label="期末成绩"></el-table-column>
                <el-table-column prop="score" label="总成绩"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditTable(scope.row)">编辑</el-button>
                        <el-button @click="deleteStudent(scope.row.id, scope.row.name)" type="text" size="small"
                            style="color: red;">删除</el-button>
                    </template>
                </el-table-column>

                <slot></slot>
            </el-table>
            <el-dialog :title="editForm.title" :visible.sync="dialogFormVisible">
                <el-form :model="editForm">
                    <el-form-item label="平时成绩" :label-width="formLabelWidth">
                        <el-input v-model="editForm.usualScore" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="期末成绩" :label-width="formLabelWidth">
                        <el-input v-model="editForm.finalScore" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmEdit">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>
  
<script>
import { getClassInfo, addStudent2Class, deleteClassStudent } from "@/api/admin/adminClass.js";
import { showSuccess } from '@/utils/utils';
import { editScore } from "@/api/admin/adminStudent.js";
export default {
    // 初始化方法
    created: function () {
        this.cid = this.$route.query.cid;
        this.backId = this.$route.query.courseId
        this.getlivestockInfo(this.cid);
    },
    data() {
        return {
            tableData: [],
            classData: {},
            allowMajor: [],
            classTime: {},
            keyWord: "",
            cid: 0,
            dateDict: new Map([
                [1, "周一"],
                [2, "周二"],
                [3, "周三"],
                [4, "周四"],
                [5, "周五"],
                [6, "周六"],
                [7, "周日"]
            ]),
            editForm: {
                id: 0,
                usualScore: 0,
                finalScore: 1,
                title: ""
            },
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '120px'
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
            getClassInfo(id, param).then(res => {
                console.log(res)
                that.tableData = res.data.studentList;
                that.classData = res.data;
                that.classTime = res.data.classTime;
                // that.total = res.data.total
            }).catch(err => {
                console.log(err)
            });
        },
        // 页面刷新
        mounted() {
            this.getlivestockInfo(this.cid);
        },
        // 删除教师
        deleteStudent(id, name) {
            this.$confirm(
                "是否从班级移除学生 " + name,
                "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let param = {
                    headers: {
                        Authorization: sessionStorage.getItem("Authorization"),
                    }
                }
                deleteClassStudent(id, param).then(res => {
                    const h = this.$createElement;
                    this.$notify.success({
                        title: '通知',
                        message: h(
                            'i', { style: 'color:teal' },
                            '删除成功!'
                        )
                    })
                    this.getlivestockInfo(this.cid)
                })
            }).catch(() => {
                console.log("操作取消")
            })
        },
        // 查看学生详情
        getClassInfo(id) {
            this.$router.push({
                path: "/admin/classInfo",
                query: {
                    cid: id
                }
            })
        },
        // 向班级中添加学生
        addStudent2Class() {
            this.$prompt('请输入学生学号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /.{11}/,
                inputErrorMessage: '学号格式不正确'
            }).then(({ value }) => {
                let param = {
                    headers: {
                        Authorization: sessionStorage.getItem("Authorization"),
                    }
                }
                let data = {
                    "number": value,
                    "classId": this.classData.id
                }
                addStudent2Class(data, param).then(res => {
                    const h = this.$createElement;
                    this.$notify.success({
                        title: '通知',
                        message: h(
                            'i', { style: 'color:teal' },
                            '添加成功!'
                        )
                    })
                    this.getlivestockInfo(this.cid);
                })
            }).catch(() => {
            });
        },
        showEditTable(data) {
            this.dialogFormVisible = true
            this.editForm = {
                id: data.id,
                usualScore: data.usualScore,
                finalScore: data.finalScore,
                title: "正在编辑" + data.name + "(" + data.number + ")的成绩"
            }
        },
        confirmEdit() {
            let param = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                }
            }
            editScore(this.editForm, param).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '编辑成功!'
                    )
                })
                this.getlivestockInfo(this.cid);
                this.dialogFormVisible = false;
            })
        },
        back() {
            this.$router.push({
                path: "/admin/courseInfo",
                query: {
                    cid: this.backId
                }
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
  