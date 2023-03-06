import request from "@/utils/request";

let prefix = "/admin/student";

// 获取学生列表
export const getStudentList = (params) => request.get(prefix, params);

// 删除学生信息
export const deleteStudent = (id, params) =>
  request.delete(prefix + "/" + id, params);

// 添加学生
export const addStudent = (data, params) =>
  request.post(prefix, JSON.stringify(data), params);

// 编辑学生
export const editStudent = (data, params) => request.put(prefix, data, params);

// 获取学时学时信息
export const getStudentInfo = (id, params) =>
  request.get(prefix + "/" + id, params);

// 编辑成绩
export const editScore = (data, parmas) =>
  request.put(prefix + "/score", data, parmas);
