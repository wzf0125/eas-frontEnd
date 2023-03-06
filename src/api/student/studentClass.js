import request from "@/utils/request";

let prefix = "/student/course/class";

// 获取课表
export const getClassTable = (params) => request.get(prefix, params);

// 选课
export const choiceClass = (id, params) =>
  request.post(prefix + "/" + id, null, params);

// 获取已选课列表
export const getStudentClassList = (params) =>
  request.get(prefix + "/choice", params);

// 退课
export const cancel = (id, params) => request.delete(prefix + "/" + id, params);
