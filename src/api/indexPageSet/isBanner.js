import { gethttp } from "../user";

// 获取Banner列表
export const indexbanner = val => gethttp(val, "/indexpage/BannerConfig/lists");

// 获取显示隐藏
export const bannercheck = val => gethttp(val, "/indexpage/BannerConfig/check");
