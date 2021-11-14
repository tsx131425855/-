import defaultSettings from "@/settings";

/**
 *页面标题
 很重要心情不好加点尿
 */
const title = defaultSettings.title;

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
