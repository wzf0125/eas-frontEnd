import request from "@/utils/request";

let prefix = "/admin/major";

export const getMajorList = (params) => request.get(prefix, params);

export const getMajorStudentList = (id, params) =>
  request.get(prefix + "/student/" + id, params);

export const getMajorTeacherList = (id, params) =>
  request.get(prefix + "/teacher/" + id, params);
