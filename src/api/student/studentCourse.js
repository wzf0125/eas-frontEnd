import request from "@/utils/request";

let prefix = "/student/course";

// 获取可选课程列表
export const getCourseClassList = (params) => request.get(prefix, params);
