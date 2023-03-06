<template>
    <div>
        <el-container class="page-table-ctn">
            <el-header
                style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
                学生信息({{ sname }} {{ snumber }})
            </el-header>
            <el-table :data="tableData" border>
                <el-table-column prop="id" sortable label="id"></el-table-column>
                <el-table-column prop="courseName" sortable label="课程名"></el-table-column>
                <el-table-column prop="className" sortable label="班级"></el-table-column>
                <el-table-column prop="term" sortable label="学期"></el-table-column>
                <el-table-column prop="usualScore" sortable label="平时成绩"></el-table-column>
                <el-table-column prop="finalScore" sortable label="期末成绩"></el-table-column>
                <el-table-column prop="score" sortable label="最终成绩"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEditTable(scope.row)">编辑</el-button>
                        <el-button @click="deleteStudent(scope.row.id, scope.row.className)" type="text" size="small"
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
            <el-footer class="footer">
                <!-- 分页器 -->
                <div style="margin-top:15px;">
                    <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
  
<script>
import { getStudentInfo } from "@/api/admin/adminStudent.js";
import { deleteClassStudent } from "@/api/admin/adminClass.js";
import { showSuccess } from '@/utils/utils';
import { editScore } from "@/api/admin/adminStudent.js";
export default {
    // 初始化方法
    created: function () {
        this.id = this.$route.query.sid;
        this.sname = this.$route.query.sname;
        this.snumber = this.$route.query.snumber;
        this.getlivestockInfo(1)
    },
    data() {
        return {
            id: 1,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyWord: "",
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
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
            this.getlivestockInfo(this.currentPage)
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getlivestockInfo(val)
        },
        // 请求获取数据
        getlivestockInfo(num1) {
            var that = this
            let param = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                },
                params: {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                },
            }
            getStudentInfo(this.id, param).then(res => {
                that.tableData = res.data.dataList;
                that.currentPage = num1;
                that.total = res.data.total
            });
        },
        // 删除学生
        deleteStudent(id, name) {
            this.$confirm(
                "是否确定从班级 " + name + "中移除学生 " + this.sname,
                "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let params = {
                    headers: {
                        Authorization: sessionStorage.getItem("Authorization"),
                    }
                }
                // 删除对应学生
                deleteClassStudent(id, params).then(res => {
                    // 删除成功后刷新页面
                    this.getlivestockInfo(this.currentPage)
                })
            }).catch(() => {
                console.log("操作取消")
            })
        },
        addStudent() {
            this.$router.push({
                path: "/admin/addStudent"
            })
        },
        editStudent(id, name, number, major, year) {
            console.log(id, name, number, major, year)
            this.$router.push({
                name: "编辑学生",
                params: {
                    studentData: {
                        id: id,
                        number: number,
                        major: major,
                        name: name,
                        year: year
                    }
                }
            })
        },
        showEditTable(data) {
            this.dialogFormVisible = true
            this.editForm = {
                id: data.id,
                usualScore: data.usualScore,
                finalScore: data.finalScore,
                title: "正在编辑 " + data.courseName + " (" + data.className + ") 的成绩"
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
                this.getlivestockInfo(1);
                this.dialogFormVisible = false;
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
  