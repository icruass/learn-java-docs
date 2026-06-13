import React from "react";
import { Navigate } from "umi";
import { DEFAULT_DOC_PATH, getDocByPath } from "@/routes/docRoutes";
import { getLastDocPath } from "@/utils/lastDoc";

/**
 * 站点根路径 `/` 的入口重定向（替代原先写死的 redirect）。
 *
 * 优先跳回用户「上次浏览」的文档（埋点见 DocLayout）；
 * 若无记录、或该文档已不存在（被删 / 改名），用 getDocByPath 校验失败后
 * 回退到默认第一篇，避免跳到已失效的路由导致 404 / 白屏。
 * 用 replace 避免在历史栈里堆一个空的 `/`，浏览器「后退」不会卡在重定向上。
 */
const IndexRedirect: React.FC = () => {
  const last = getLastDocPath();
  const target = last && getDocByPath(last) ? last : DEFAULT_DOC_PATH;
  return <Navigate to={target} replace />;
};

export default IndexRedirect;
