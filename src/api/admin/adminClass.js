import request from "@/utils/request";

let prefix = "/admin/course/class";

// 获取班级信息
export const getClassInfo = (id, params) =>
  request.get(prefix + "/" + id, params);

// 删除班级
export const deleteClass = (id, params) =>
  request.delete(prefix + "/" + id, params);

// 添加班级
export const addClass = (data, params) => request.post(prefix, data, params);

// 添加学生到班级中
export const addStudent2Class = (data, params) =>
  request.post(prefix + "/student", data, params);

// 将学生从班级中删除
export const deleteClassStudent = (id, params) =>
  request.delete(prefix + "/student/" + id, params);

// 编辑班级
export const editClass = (data, params) => request.put(prefix, data, params);


