import request from "@/utils/request";

let prefix = "/teacher/course";

// 获取教师课程列表
export const getCourseList = (params) => request.get(prefix, params);

// 获取教师课表
export const getClassTable = (params) => request.get(prefix + "/table", params);

// 编辑班级信息
export const editClass = (data, params) =>
  request.put(prefix + "/class", data, params);

// 查看班级学生列表
export const getClassInfo = (id, params) =>
  request.get(prefix + "/class/" + id, params);

// 设置学生成绩
export const editScore = (data, params) =>
  request.put(prefix + "/class/scores", data, params);
