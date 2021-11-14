import { gethttp, postHttp } from "./user";

// 获取直播列表
export const getLiveList = val => postHttp(val, "live/live/room_list");

// 获取回放列表
export const getRePlay = val => postHttp(val, "live/live/room_replay");