import request from "@/utils/request";

let prefix = "/student/score";

// 学生获取成绩列表
export const getStudentScoreList = (params) => request.get(prefix, params);
