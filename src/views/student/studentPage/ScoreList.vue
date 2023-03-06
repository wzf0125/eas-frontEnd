<template>
  <div>
    <el-container class="page-table-ctn">
      <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
        我的成绩
      </el-header>
      <el-header style="height: 100%;background-color: white;">
        <div style="justify-content: space-between;">
          <el-select v-model="term" placeholder="请选择学期">
            <el-option v-for="item in termList" :key="item" :label="item" :value="item" @click.native="onChange(item)">
            </el-option>
          </el-select>
        </div>
      </el-header>

      <el-table :data="tableData" border>
        <el-table-column prop="courseName" sortable label="课程名"></el-table-column>
        <el-table-column prop="className" sortable label="班级名"></el-table-column>
        <el-table-column prop="term" sortable label="学期"></el-table-column>
        <el-table-column prop="isClosed" sortable label="课程状态"></el-table-column>
        <el-table-column prop="usualScore" sortable label="平时成绩"></el-table-column>
        <el-table-column prop="finalScore" sortable label="期末成绩"></el-table-column>
        <el-table-column prop="score" sortable label="最终成绩"></el-table-column>
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
import { getStudentScoreList } from "@/api/student/studentScore.js";

export default {
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
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      keyWord: "",
      termList: [],
      term: "",
      classStausMap: new Map([
        [0, "进行中"],
        [1, "已结课"]
      ])
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
          term: this.term
        },
      }
      getStudentScoreList(param).then(res => {
        that.tableData = res.data.dataList;
        that.tableData.forEach(e => {
          if (e.isClosed == 0) {
            e.usualScore = "";
            e.finalScore = "";
            e.score = "";
          }
          e.isClosed = this.classStausMap.get(e.isClosed)
        })
        that.currentPage = num1;
        that.total = res.data.total
      });
    },
    // 页面刷新
    mounted() {
      this.getlivestockInfo(1);
    },
    onChange(item) {
      this.getlivestockInfo(1);
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
