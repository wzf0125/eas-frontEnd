import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login.vue";
import Index from "@/views/index.vue";

import AdminIndex from "@/views/admin/index.vue";
import AdminTeacherManage from "@/views/admin/adminTeacher/index.vue";
import AdminStudentManage from "@/views/admin/adminStudent/index.vue";
import AdminMajorManage from "@/views/admin/adminMajor/index.vue";
import AdminCourseManage from "@/views/admin/adminCourse/index.vue";
import AdminTeacherList from "@/views/admin/adminTeacher/teacherList.vue";
import AdminTeacherCourseList from "@/views/admin/adminTeacher/teacherCourseList.vue";
import AdminTeacherInfo from "@/views/admin/adminTeacher/teacherInfo.vue";
import AdminAddTeacher from "@/views/admin/adminTeacher/addTeacher.vue";
import AdminEditTeacher from "@/views/admin/adminTeacher/editTeacher.vue";
import AdminStudentList from "@/views/admin/adminStudent/studentList.vue";
import AdminStudentInfo from "@/views/admin/adminStudent/studentInfo.vue";
import AdminAddStudent from "@/views/admin/adminStudent/addStudent.vue";
import AdminEditStudent from "@/views/admin/adminStudent/editStudent.vue";
import AdminCourseList from "@/views/admin/adminCourse/courseList.vue";
import AdminCourseInfo from "@/views/admin/adminCourse/courseInfo";
import AdminAddCourse from "@/views/admin/adminCourse/addCourse.vue";
import AdminClassInfo from "@/views/admin/adminCourse/classInfo.vue";
import AdminMajorStudentList from "@/views/admin/adminMajor/studentList.vue";
import AdminMajorTeacherList from "@/views/admin/adminMajor/teacherList.vue";
import AdminAddClass from "@/views/admin/adminCourse/addClass.vue";
import AdminEditClass from "@/views/admin/adminCourse/editClass.vue";
import AdminEditCourse from "@/views/admin/adminCourse/editCourse.vue";

import StudentIndex from "@/views/student/index.vue";
import StudentPage from "@/views/student/studentPage/index.vue";
import StudentCourseList from "@/views/student/studentPage/courseList.vue";
import StudentClassTable from "@/views/student/studentPage/classTable.vue";
import StudentScoreList from "@/views/student/studentPage/ScoreList.vue";
import StudentChoicedCourse from "@/views/student/studentPage/choicedCourse.vue";

import TeacherIndex from "@/views/teacher/index.vue";
import TeacherPage from "@/views/teacher/teacherPage/index.vue";
import TeacherCourseList from "@/views/teacher/teacherPage/courseList.vue";
import TeacherClassStudentList from "@/views/teacher/teacherPage/classStudentList.vue";
import TeacherClassTable from "@/views/teacher/teacherPage/classTable.vue";
import TeacherEditClass from "@/views/teacher/teacherPage/editClass.vue";

import "@/assets/css/global.css";
Vue.use(VueRouter);

const routes = [
  {
    // ??????
    path: "/",
    name: "index",
    component: Index,
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  // ??????????????????
  {
    path: "/admin",
    component: AdminIndex,
    name: "admin",
    meta: { requireAuth: true },
    children: [
      {
        path: "/admin/teacherManage",
        component: AdminTeacherManage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/admin/teacherList",
            name: "????????????",
            isShow: true,
            component: AdminTeacherList,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/teacherCourseList",
            name: "??????????????????",
            isShow: false,
            component: AdminTeacherCourseList,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/teacherInfo",
            name: "????????????",
            isShow: false,
            component: AdminTeacherInfo,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/addTeacher",
            name: "????????????",
            isShow: false,
            component: AdminAddTeacher,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/editTeacher",
            name: "????????????",
            isShow: false,
            component: AdminEditTeacher,
            meta: { requireAuth: true },
          },
        ],
      },
      {
        path: "/studentManage",
        component: AdminStudentManage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/admin/studentList",
            name: "????????????",
            isShow: true,
            component: AdminStudentList,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/studentInfo",
            name: "????????????",
            isShow: false,
            component: AdminStudentInfo,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/addStudent",
            name: "????????????",
            isShow: false,
            component: AdminAddStudent,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/editStudent",
            name: "????????????",
            isShow: false,
            component: AdminEditStudent,
            meta: { requireAuth: true },
          },
        ],
      },
      {
        path: "/majorManage",
        component: AdminMajorManage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/admin/majorStudentList",
            name: "??????????????????",
            isShow: true,
            component: AdminMajorStudentList,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/majorTeacherList",
            name: "??????????????????",
            isShow: true,
            component: AdminMajorTeacherList,
            meta: { requireAuth: true },
          },
        ],
      },
      {
        path: "/courseManage",
        component: AdminCourseManage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/admin/courseList",
            name: "????????????",
            isShow: true,
            component: AdminCourseList,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/courseInfo",
            name: "????????????",
            isShow: false,
            component: AdminCourseInfo,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/addCourse",
            name: "????????????",
            isShow: false,
            component: AdminAddCourse,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/ClassInfo",
            name: "????????????",
            isShow: false,
            component: AdminClassInfo,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/addClass",
            name: "????????????",
            isShow: false,
            component: AdminAddClass,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/editClass",
            name: "????????????",
            isShow: false,
            component: AdminEditClass,
            meta: { requireAuth: true },
          },
          {
            path: "/admin/editCourse",
            name: "????????????",
            isShow: false,
            component: AdminEditCourse,
            meta: { requireAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: "/teacher",
    name: "teacher",
    component: TeacherIndex,
    meta: { requireAuth: true },
    children: [
      {
        path: "/teacher/teacherManage",
        component: TeacherPage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/teacher/courseList",
            name: "????????????",
            isShow: true,
            component: TeacherCourseList,
            meta: { requireAuth: true },
          },
          {
            path: "/teacher/classList",
            name: "????????????",
            isShow: true,
            component: TeacherClassTable,
            meta: { requireAuth: true },
          },
          {
            path: "/teacher/classStudentList",
            name: "????????????",
            isShow: false,
            component: TeacherClassStudentList,
            meta: { requireAuth: true },
          },
          {
            path: "/teacher/editClass",
            name: "????????????????????????",
            isShow: false,
            component: TeacherEditClass,
            meta: { requireAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: "/student",
    component: StudentIndex,
    name: "student",
    meta: { requireAuth: true },
    children: [
      {
        path: "/student/studenManage",
        component: StudentPage,
        name: "????????????",
        meta: { requireAuth: true },
        children: [
          {
            path: "/student/courseList",
            name: "????????????",
            isShow: true,
            component: StudentCourseList,
            meta: { requireAuth: true },
          },
          {
            path: "/student/choicedCourse",
            name: "????????????",
            isShow: true,
            component: StudentChoicedCourse,
            meta: { requireAuth: true },
          },
          {
            path: "/student/classTable",
            name: "????????????",
            isShow: true,
            component: StudentClassTable,
            meta: { requireAuth: true },
          },
          {
            path: "/student/scoreList",
            name: "????????????",
            isShow: true,
            component: StudentScoreList,
            meta: { requireAuth: true },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
