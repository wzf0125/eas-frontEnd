<template>
    <div>
        <el-container class="page-table-ctn">
            <div style="justify-content: space-between;">
                <el-input v-model="keyWord" class="searchinput" placeholder="请输入课程名称/课程号" prefix-icon="el-icon-search"
                    clearable @input="mounted">
                    <el-button slot="append" class="searchbtn" @click="mounted">搜索</el-button>
                </el-input>
                <el-button type="primary" @click="addCourse">添加课程</el-button>
            </div>
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="number" label="课程号"></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="major" label="开设单位"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="getCourseInfo(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-button @click="editCourse(scope.row)" type="text" size="small">编辑</el-button>
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
import { getCourseList, deleteCourse } from "@/api/admin/adminCourse.js";
import { showSuccess } from '@/utils/utils';

export default {
    // 初始化方法
    created: function () {
        this.getlivestockInfo(1)
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyWord: ""
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
                    keyWord: this.keyWord
                },
            }
            getCourseList(param).then(res => {
                that.tableData = res.data.dataList;
                that.currentPage = num1;
                that.total = res.data.total
            });
        },
        // 搜索
        mounted() {
            this.getlivestockInfo(1);
        },
        // 删除课程
        deleteTeacher(id, name, number) {
            this.$confirm(
                "是否确定删除课程 " + name + " (" + number + ") ",
                "警告(删除课程同时会删除对应班级)", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let params = {
                    headers: {
                        Authorization: sessionStorage.getItem("Authorization"),
                    }
                }
                // 删除对应课程
                deleteCourse(id, params).then(res => {
                    // 删除成功后刷新页面
                    this.getlivestockInfo(this.currentPage)
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
        // 查看课程详情
        getCourseInfo(id) {
            this.$router.push({
                path: "/admin/courseInfo",
                query: {
                    cid: id
                }
            })
        },
        addCourse() {
            this.$router.push({
                path: "/admin/addCourse"
            })
        },
        editCourse(data) {
            this.$router.push({
                name: "编辑课程",
                params: {
                    courseData: data
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
  