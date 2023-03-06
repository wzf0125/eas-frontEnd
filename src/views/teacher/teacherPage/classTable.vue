<template>
    <el-container>
        <el-header style="height: 100%;background-color: white;text-align: center;font-size: 30px;font-weight: bold; ">
            我的课表
        </el-header>
        <el-header style="height: 100%;background-color: white;">
            <el-select v-model="term" placeholder="请选择学期">
                <el-option v-for="item in termList" :key="item" :label="item" :value="item"
                    @click.native="onChange(item)">
                </el-option>
            </el-select>
        </el-header>
        <el-main>
            <el-table :data="tableData" :span-method="objectSpanMethod" border>
                <el-table-column prop="zero"></el-table-column>
                <el-table-column prop="one" label="星期一"></el-table-column>
                <el-table-column prop="two" label="星期二"></el-table-column>
                <el-table-column prop="three" label="星期三"></el-table-column>
                <el-table-column prop="four" label="星期四"></el-table-column>
                <el-table-column prop="five" label="星期五"></el-table-column>
                <el-table-column prop="six" label="星期六"></el-table-column>
                <el-table-column prop="seven" label="星期日"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>
  
<script>
import { getClassTable } from "@/api/teacher/teacherCourse.js";

export default {
    data() {
        return {
            tableData: [],
            lesson2LabelMap: new Map([
                [1, "第一节 \n 8:30-9:10"],
                [2, "第二节\n9:10-9:50"],
                [3, "第三节\n10:10-10:50"],
                [4, "第四节\n10:50-11:30"],
                [5, "第五节\n11:35-12:15"],
                [6, "第六节\n12:30-13:10"],
                [7, "第七节\n13:10-13:50"],
                [8, "第八节\n14:00-14:40"],
                [9, "第九节\n14:40-15:20"],
                [10, "第十节\n15:40-16:20"],
                [11, "第十一节\n16:20-17:00"],
                [12, "第十二节\n18:30-19:10"],
                [13, "第十三节\n19:10-19:50"],
                [14, "第十四节\n20:00-20:40"],
                [15, "第十五节\n20:40-21:20"],
            ]),
            week2LaelMap: new Map([
                [0, "zero"],
                [1, "one"],
                [2, "two"],
                [3, "three"],
                [4, "four"],
                [5, "five"],
                [6, "six"],
                [7, "seven"],
            ]),
            classList: [],
            rowMap: new Map(),
            classData: new Map(),
            term: "",
            termList: []
        }
    },
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
                (year - 2) + "" + (year + 1) + "1",
                (year - 2) + "" + (year + 1) + "2",
                (year - 3) + "" + (year - 2) + "1",
                (year - 3) + "" + (year - 2) + "2",
            ]
        } else {
            this.termList = [
                (year - 1) + "" + (year) + "1",
                (year - 1) + "" + (year) + "2",
                (year - 2) + "" + (year - 1) + "1",
                (year - 2) + "" + (year - 1) + "2",
                (year - 3) + "" + (year - 2) + "1",
                (year - 3) + "" + (year - 2) + "2",
                (year - 4) + "" + (year - 3) + "1",
                (year - 4) + "" + (year - 3) + "2",
            ]
        }
        this.term = this.termList[0];
        this.getClassTableData()
    },
    methods: {
        indexEncode(row, column) {
            return row + "_" + column
        },
        indexDecode(key) {
            let tmp = key.split("_");
            return {
                row: tmp[0],
                column: tmp[1]
            }
        },
        getClassTableData() {
            this.tableData = []
            let params = {
                headers: {
                    Authorization: sessionStorage.getItem("Authorization"),
                },
                params: {
                    term: this.term
                }
            }
            getClassTable(params).then(res => {
                this.classData = new Map()
                this.rowMap = new Map()
                this.classList = res.data.classList;
                if (this.classList.length != 0) {
                    this.classList.forEach(i => {
                        console.log(i)
                        this.rowMap.set(this.indexEncode(i.classTime.lesson[0] - 1, i.classTime.week), i.classTime.lesson.length)
                        let lessonLable = "";
                        let flag = false;
                        i.classTime.lesson.forEach(l => {
                            if (flag) {
                                lessonLable += "-"
                            }
                            lessonLable += l
                            flag = true;
                        })
                        lessonLable += "节"
                        this.classData.set(this.indexEncode(i.classTime.lesson[0], i.classTime.week), i.name + "\n" + i.teacherName + "\n" + lessonLable)
                    })
                }
                for (let i = 1; i <= 15; i++) {
                    let temp = {
                        "zero": "",
                        "one": "",
                        "two": "",
                        "three": "",
                        "four": "",
                        "five": "",
                        "six": "",
                        "seven": ""
                    };
                    for (let j = 0; j < 8; j++) {
                        if (j == 0) {
                            temp[this.week2LaelMap.get(j)] = this.lesson2LabelMap.get(i)
                            continue;
                        } else {
                            if (this.classData.length != 0) {
                                let key = this.indexEncode(i, j);
                                console.log(this.classData.get(key))
                                if (this.classData.get(key)) {
                                    temp[this.week2LaelMap.get(j)] = this.classData.get(key)
                                } else {
                                    temp[this.week2LaelMap.get(j)] = ""
                                }
                            } else {
                                temp[this.week2LaelMap.get(j)] = ""
                            }
                        }
                    }
                    console.log(temp)
                    this.tableData.push(temp)
                }

            })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            console.log(this.rowMap.get(this.indexEncode(rowIndex, columnIndex)))
            if (this.rowMap.get(this.indexEncode(rowIndex, columnIndex))) {
                return {
                    rowspan: this.rowMap.get(this.indexEncode(rowIndex, columnIndex)),
                    colspan: 1
                };
            } else {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            }
        },
        onChange(item) {
            this.term = item;
            this.getClassTableData()
        }
    }
}
</script>
  
<style lang="less" scoped>
/deep/.el-form-item__label {
    white-space: pre-line;
}

/deep/.el-table .cell {
    text-align: center;
    white-space: pre-line;
}
</style>