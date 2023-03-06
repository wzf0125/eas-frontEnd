import request from "@/utils/request";

let prefix = "/common";
export const login = (params) =>
  request.post(prefix + "/login", JSON.stringify(params));

export const logout = (config) => request.delete(prefix + "/exit", config);
