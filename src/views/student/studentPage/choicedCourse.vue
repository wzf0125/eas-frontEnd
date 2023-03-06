<template>
    <div>
        <el-container class="page-table-ctn">
            <el-header
                style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
                我的课表
            </el-header>
            <el-header style="height: 100%;background-color: white;">
                <div style="justify-content: space-between;">
                    <el-select v-model="term" placeholder="请选择学期">
                        <el-option v-for="item in termList" :key="item" :label="item" :value="item"
                            @click.native="choiceTerm(item)">
                        </el-option>
                    </el-select>
                    <el-input v-model="keyWord" class="searchinput" placeholder="请输入课程名称/课程号"
                        prefix-icon="el-icon-search" clearable @input="mounted">
                        <el-button slot="append" class="searchbtn" @click="mounted">搜索</el-button>
                    </el-input>
                </div>
            </el-header>
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="班级id"></el-table-column>
                <el-table-column prop="courseNumber" label="课程号"></el-table-column>
                <el-table-column prop="courseName" label="课程名称"></el-table-column>
                <el-table-column prop="courseName" label="开课单位"></el-table-column>
                <el-table-column prop="term" label="学期"></el-table-column>
                <el-table-column prop="name" label="班级名称"></el-table-column>
                <el-table-column prop="teacherName" label="授课教师"></el-table-column>
                <el-table-column prop="capacityLabel" label="人数"></el-table-column>
                <el-table-column prop="id" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="cancel(scope.row.id)" type="text" size="small"
                            style="color: red;">退课</el-button>
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
import { cancel, getStudentClassList } from "@/api/student/studentClass.js";
export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyWord: "",
            termList: [],
            term: "",
            rowMap: new Map(),
            classList: [],
        }
    },
    // 初始化方法
    created: function () {
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
        this.term = this.termList[0]
        this.getlivestockInfo(1)

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
            let params = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                },
                params: {
                    currentPage: num1,
                    pageSize: this.pageSize,
                    term: this.term,
                    keyWord: this.keyWord
                }
            }
            getStudentClassList(params).then(res => {
                let temp = []
                res.data.dataList.forEach(e => {
                    temp.push({
                        id: e.id,
                        courseName: e.courseName,
                        courseNumber: e.courseNumber,
                        name: e.name,
                        surplus: e.surplus,
                        capacity: e.capacity,
                        capacityLabel: e.surplus + "/" + e.capacity,
                        term: e.term,
                        teacherName: e.teacherName
                    })
                    console.log(this.tableData)
                });
                this.tableData = temp
                this.total = res.data.total
            })
        },
        // 页面刷新
        mounted() {
            this.getlivestockInfo(1);
        },
        choiceTerm(term) {
            this.term = term;
            this.getlivestockInfo(1);
        },
        cancel(id) {
            let param = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                }
            }
            cancel(id, param).then(res => {
                const h = this.$createElement;
                this.$notify.success({
                    title: '通知',
                    message: h(
                        'i', { style: 'color:teal' },
                        '退课成功!'
                    )
                })
                this.getlivestockInfo(1);
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

    >.el-header>div>.el-input {
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
  