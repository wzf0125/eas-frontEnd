<template>
  <el-form ref="form" :model="form" label-width="80px" style="width: 500px;">
    <el-form-item label="学生学号">
      <el-input v-model="form.number"></el-input>
    </el-form-item>
    <el-form-item label="学生姓名">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="学生密码">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="所属学院">
      <el-select v-model="form.major" placeholder="请选择学院">
        <el-option v-for="item in majorList" :key="item.id" :label="item.major" :value="item.major">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="年级">
      <el-select v-model="form.year" placeholder="请选择年级">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确定修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getMajorList } from "@/api/admin/adminMajor.js";
import { editStudent } from "@/api/admin/adminStudent.js";

export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        number: "",
        password: "",
        major: ""
      },
      selectValue: "",
      majorList: [],
      selectMajor: 1
    }
  },
  created: function () {
    console.log(this.$route.params.studentData)
    this.form = this.$route.params.studentData
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
    submit() {
      let header = {
        headers: {
          Authorization: sessionStorage.getItem("Authorization"),
        }
      }
      editStudent(this.form, header).then(res => {
        const h = this.$createElement;
        this.$notify.success({
          title: '通知',
          message: h(
            'i', { style: 'color:teal' },
            '编辑成功!'
          )
        })
        this.$router.push({
          path: "/admin/studentList",
        })
      }).catch(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>

</style>