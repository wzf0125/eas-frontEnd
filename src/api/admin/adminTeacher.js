import request from "@/utils/request";

let prefix = "/admin/teacher";

// 获取教师列表
export const getTeacherList = (params) => request.get(prefix, params);

// 删除教师信息
export const deleteTeacher = (id, params) =>
  request.delete(prefix + "/" + id, params);

// 获取教师课程
export const getTeacherCourseList = (id, params) =>
  request.get(prefix + "/" + id, params);

// 添加教师
export const addTeacher = (data, params) =>
  request.post(prefix, JSON.stringify(data), params);

// 编辑教师
export const editTeacher = (data, params) => request.put(prefix,data, params);
