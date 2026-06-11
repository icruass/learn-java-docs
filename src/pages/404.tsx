import React from "react";
import { Link } from "umi";
import { Title, Secondary } from "@/components/doc";
import { DEFAULT_DOC_PATH } from "@/routes/docRoutes";

const NotFound: React.FC = () => (
  <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 48px" }}>
    <Title>404</Title>
    <Secondary>抱歉，你访问的页面不存在。</Secondary>
    <Link to={DEFAULT_DOC_PATH}>← 返回文档首页</Link>
  </div>
);

export default NotFound;
