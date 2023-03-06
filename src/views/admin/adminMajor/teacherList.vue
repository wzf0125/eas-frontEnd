<template>
    <div>
        <el-container class="page-table-ctn">
            <div style="justify-content: space-between;">
                <el-select v-model="selectValue" placeholder="请选择学院">
                    <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.id"
                        @click.native="choiceMajor(item.id)">
                    </el-option>
                </el-select>
                <el-input v-model="keyWord" class="searchinput" placeholder="请输入教师姓名/工号" prefix-icon="el-icon-search"
                    clearable @input="mounted">
                    <el-button slot="append" class="searchbtn" @click="mounted()">搜索</el-button>
                </el-input>
                <el-button type="primary" @click="addTeacher">添加教师</el-button>
            </div>
            <el-table :data="tableData" border>
                <el-table-column prop="id" sortable label="id"></el-table-column>
                <el-table-column prop="name" sortable label="姓名"></el-table-column>
                <el-table-column prop="number" sortable label="工号"></el-table-column>
                <el-table-column prop="major" sortable label="学院"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="getTeacherCourse(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small"
                            @click="editTeacher(scope.row.id, scope.row.name, scope.row.number, scope.row.major)">编辑</el-button>
                        <el-button @click="deleteTeacher(scope.row.id, scope.row.name, scope.row.number)" type="text"
                            size="small" style="color: red;">删除</el-button>
                    </template>
                </el-table-column>

                <slot></slot>
            </el-table>
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
import { getTeacherList, deleteTeacher } from "@/api/admin/adminTeacher.js";
import { showSuccess } from '@/utils/utils';
import { getMajorList, getMajorTeacherList } from "@/api/admin/adminMajor.js";

export default {
    // 初始化方法
    created: function () {
        let param = {
            headers: {
                Authorization: sessionStorage.getItem("Authorization"),
            }
        }
        getMajorList(param).then(res => {
            console.log(res)
            this.majorList = res.data
            this.selectValue = res.data[0].major
            this.selectMajor = res.data[0].id
            this.getlivestockInfo(1)
        })

    },
    data() {
        return {
            selectValue: "",
            majorList: [],
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyWord: "",
            selectMajor: 1
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
                    keyWord: this.keyWord,
                },
            }
            getMajorTeacherList(this.selectMajor, param).then(res => {
                that.tableData = res.data.dataList;
                that.currentPage = num1;
                that.total = res.data.total
            });
        },
        // 页面刷新
        mounted() {

            this.getlivestockInfo(1);
        },
        // 删除教师
        deleteTeacher(id, name, number) {
            this.$confirm(
                "是否确定删除教师 " + name + " (" + number + ") ",
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
                // 删除对应教师
                deleteTeacher(id, params).then(res => {
                    // 删除成功后刷新页面
                    this.getlivestockInfo(this.currentPage);
                })
            }).catch(() => {
                console.log("操作取消")
            })
        },
        // 查看教师课程详情
        getTeacherCourse(id) {
            this.$router.push({
                path: "/admin/teacherCourseList",
                query: {
                    tid: id
                }
            })
        },
        choiceMajor(id) {
            this.selectMajor = id;
            this.getlivestockInfo(1);
        },
        addTeacher() {
            this.$router.push({
                path: "/admin/addTeacher"
            })
        },
        editTeacher(id, name, number, major) {
            console.log(id, name, number, major)
            this.$router.push({
                name: "编辑教师",
                params: {
                    teacherData: {
                        id: id,
                        number: number,
                        major: major,
                        name: name
                    }
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

    >div>.el-select {
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
  