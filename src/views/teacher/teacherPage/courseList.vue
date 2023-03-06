<template>
  <div>
    <el-container class="page-table-ctn">
      <div style="justify-content: space-between;">
        <el-select v-model="term" placeholder="请选择学期">
          <el-option v-for="item in termList" :key="item" :label="item" :value="item" @click.native="choiceTerm(item)">
          </el-option>
        </el-select>
        <el-input v-model="keyWord" class="searchinput" placeholder="请输入课程名称/课程号/班级名称搜索" prefix-icon="el-icon-search"
          clearable @input="mounted()">
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
        <el-table-column prop="usualPercentage" label="平时成绩占比"></el-table-column>
        <el-table-column prop="finalPercentage" label="期末成绩占比"></el-table-column>
        <el-table-column prop="isClosedLabel" label="班级状态"></el-table-column>
        <el-table-column prop="capacity" label="班级容量"></el-table-column>
        <el-table-column prop="id" label="操作">
          <template slot-scope="scope">
            <el-button @click="getClassInfo(scope.row.classId)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="editClass(scope.row)">编辑</el-button>
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
import { getCourseList } from "@/api/teacher/teacherCourse.js";
import { showSuccess } from '@/utils/utils';

export default {
  // 初始化方法
  created: function () {
    this.tid = this.$route.query.tid
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
      tid: 0,
      rowMap: new Map(),
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      keyWord: "",
      termList: [],
      term: "",
      classStatusMap: new Map([
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
          keyWord: this.keyWord,
          term: this.term
        },
      }
      getCourseList(param).then(res => {
        this.rowMap = new Map();
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
                "term": j.term,
                "usualPercentage": j.usualPercentage,
                "finalPercentage": j.finalPercentage,
                "capacity": j.capacity,
                "isClosed": j.isClosed,
                "isClosedLabel": this.classStatusMap.get(j.isClosed),
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
    getClassInfo(id) {
      this.$router.push({
        path: "/teacher/classStudentList",
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
            rowspan: 1,
            colspan: 0
          };
        }
      }
    },
    choiceTerm(term) {
      this.term = term;
      this.getlivestockInfo(1);
    },
    editClass(data) {
      console.log(data.isClosed)
      this.$router.push({
        name: "教师编辑班级信息",
        params: {
          classData: {
            "id": data.classId,
            "isClosed": data.isClosed + "",
            "term": data.term,
            "usualPercentage": data.usualPercentage,
            "finalPercentage": data.finalPercentage,
            "capacity": data.capacity,
            "name": data.className
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
  