<template>
  <div>
    <el-container class="page-table-ctn">
      <div style="justify-content: space-between;">
        <el-input v-model="keyWord" class="searchinput" placeholder="请输入教师姓名/工号" prefix-icon="el-icon-search" clearable>
          <el-button slot="append" class="searchbtn" @click="mounted()">搜索</el-button>
        </el-input>
      </div>
      <el-table :data="tableData" :span-method="objectSpanMethod" border>
        <el-table-column prop="id" label="课程id"></el-table-column>
        <el-table-column prop="number" label="课程号"></el-table-column>
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="major" label="开课单位"></el-table-column>
        <el-table-column prop="className" label="班级名称"></el-table-column>
        <el-table-column prop="term" label="学期"></el-table-column>
        <el-table-column prop="id" label="操作">
          <template slot-scope="scope">
            <el-button @click="getClassInfo(scope.row.classId)" type="text" size="small">查看</el-button>
            <el-button @click="delClass(scope.row.classId, scope.row.className)" type="text" size="small"
              style="color: red;">删除</el-button>
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
import { getTeacherCourseList } from "@/api/admin/adminTeacher.js";
import { showSuccess } from '@/utils/utils';
import { deleteClass } from "@/api/admin/adminClass.js";


export default {
  // 初始化方法
  created: function () {
    this.tid = this.$route.query.tid
    this.getlivestockInfo(1)
  },
  data() {
    return {
      tid: 0,
      rowMap: new Map(),
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
      this.rowMap = new Map();
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
      getTeacherCourseList(this.tid, param).then(res => {
        let dataList = []
        let index = 0;
        res.data.dataList.forEach(i => {
          let flag = true;
          i.classList.forEach(j => {
            if (flag) {
              this.rowMap.set(index, {
                "index": index,
                "rowspan": i.classList.length
              });
              flag = false;
            }
            dataList.push(
              {
                "id": i.id,
                "number": i.number,
                "name": i.name,
                "major": i.major,
                "className": j.name,
                "classId": j.id,
                "term": j.term
              }
            )
            index++;
          })
        })
        // console.log(this.rowMap)
        this.tableData = dataList;
        that.currentPage = num1;
        that.total = res.data.total
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
    getClassInfo(id) {
      this.$router.push({
        path: "/admin/classInfo",
        query: {
          cid: id
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        console.log(rowIndex + " " + this.rowMap.get(rowIndex))
        if (this.rowMap.has(rowIndex)) {
          console.log(this.rowMap.get(rowIndex).rowspan)
          return {
            rowspan: this.rowMap.get(rowIndex).rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
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
