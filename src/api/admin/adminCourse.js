import request from "@/utils/request";

let prefix = "/admin/course";

export const getCourseList = (params) => request.get(prefix, params);

export const getCourseInfo = (id, params) =>
  request.get(prefix + "/" + id, params);

// 添加课程
export const addCourse = (data, params) => request.post(prefix, data, params);

// 编辑课程
export const editCourse = (data, params) => request.put(prefix, data, params);

// 删除课程
export const deleteCourse = (id, params) =>
  request.delete(prefix + "/" + id, params);
