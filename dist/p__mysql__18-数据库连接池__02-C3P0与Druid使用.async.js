"use strict";(self.webpackChunklearn_java_docs=self.webpackChunklearn_java_docs||[]).push([[2662],{99954:function(A,C,o){o.d(C,{UW:function(){return q},dn:function(){return Y},iz:function(){return cn},aC:function(){return U},k8:function(){return Z},ZM:function(){return W},HC:function(){return rn},GS:function(){return an},nv:function(){return z},T7:function(){return O},QE:function(){return w},iA:function(){return en},xv:function(){return L},Dx:function(){return M},QI:function(){return un}});var E=o(97857),a=o.n(E),e=o(67294),l=o(85893),b=function(n){var r=n.children,u=n.color,c=n.accent,s=n.bold,m=n.italic,d=n.underline,v=n.size,h=n.as,D=n.className,N=n.style,S=h||"span",g=c?"var(--color-accent)":u,x=typeof v=="number"?"".concat(v,"em"):v||void 0,y=a()({color:g,fontWeight:s?700:void 0,fontStyle:m?"italic":void 0,textDecoration:d?"underline":void 0,fontSize:x},N);return(0,l.jsx)(S,{className:D,style:y,children:r})},L=b,t={title:"title____yC74",subtitle:"subtitle___DJnYC",heading3:"heading3___xgFVQ",heading4:"heading4___ueZC4",paragraph:"paragraph___SKLDb",secondary:"secondary___SxlcT",tag:"tag___zEMa3",tagSolid:"tagSolid___gwtRd",tagOutline:"tagOutline___lkgdE",inlineCode:"inlineCode___HWVFp",ul:"ul___99aUQ",ol:"ol___UKZ2Q",li:"li___qdI1J",divider:"divider___iNYzd",tableWrap:"tableWrap___j0swV",table:"table___mypt3",callout:"callout___dp1wm",calloutTitle:"calloutTitle___r6hUs",calloutIcon:"calloutIcon___FjVQy",calloutBody:"calloutBody___zuEgV",calloutTip:"calloutTip___Y1HSW",calloutWarning:"calloutWarning___dCuzh",calloutDanger:"calloutDanger___is50f",calloutSuccess:"calloutSuccess___PbpXI",calloutNote:"calloutNote___OsOYj"},M=function(n){var r=n.children,u=n.className,c=n.id;return(0,l.jsx)("h1",{id:c,className:"".concat(t.title," ").concat(u!=null?u:""),children:r})},w=function(n){var r=n.children,u=n.className,c=n.id;return(0,l.jsx)("h2",{id:c,className:"".concat(t.subtitle," ").concat(u!=null?u:""),children:r})},U=function(n){var r=n.children,u=n.className,c=n.id;return(0,l.jsx)("h3",{id:c,className:"".concat(t.heading3," ").concat(u!=null?u:""),children:r})},Z=function(n){var r=n.children,u=n.className,c=n.id;return(0,l.jsx)("h4",{id:c,className:"".concat(t.heading4," ").concat(u!=null?u:""),children:r})},z=function(n){var r=n.children,u=n.className;return(0,l.jsx)("p",{className:"".concat(t.paragraph," ").concat(u!=null?u:""),children:r})},O=function(n){var r=n.children,u=n.className;return(0,l.jsx)("p",{className:"".concat(t.secondary," ").concat(u!=null?u:""),children:r})},W=function(n){var r=n.children,u=n.className;return(0,l.jsx)("code",{className:"".concat(t.inlineCode," ").concat(u!=null?u:""),children:r})},vn=function(n){var r=n.children,u=n.variant,c=u===void 0?"soft":u,s=n.className,m=c==="solid"?styles.tagSolid:c==="outline"?styles.tagOutline:"";return _jsx("span",{className:"".concat(styles.tag," ").concat(m," ").concat(s!=null?s:""),children:r})},hn=null,I=o(15009),B=o.n(I),H=o(99289),Q=o.n(H),k=o(5574),T=o.n(k),K=o(94163),R=o(79166),$=o(24136),G=o(39825),F={wrapper:"wrapper___Q0ipC",fullscreen:"fullscreen___yo9BF",toolbar:"toolbar___f0O4P",lang:"lang___Vi58K",actions:"actions___fG58K",action:"action___TorJb",scroll:"scroll___bMM4_"},V=function(n){var r=n.code,u=n.language,c=u===void 0?"java":u,s=n.maxHeight,m=s===void 0?420:s,d=n.showLineNumbers,v=d===void 0?!0:d,h=n.title,D=(0,G.F)(),N=D.theme,S=(0,e.useState)(!1),g=T()(S,2),x=g[0],y=g[1],on=(0,e.useState)(!1),_=T()(on,2),tn=_[0],P=_[1],sn=N==="dark"?R.Z:$.Z,dn=(0,e.useCallback)(Q()(B()().mark(function j(){return B()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.prev=0,p.next=3,navigator.clipboard.writeText(r);case 3:P(!0),window.setTimeout(function(){return P(!1)},1600),p.next=9;break;case 7:p.prev=7,p.t0=p.catch(0);case 9:case"end":return p.stop()}},j,null,[[0,7]])})),[r]);return(0,e.useEffect)(function(){if(x){var j=function(mn){mn.key==="Escape"&&y(!1)};document.addEventListener("keydown",j);var f=document.body.style.overflow;return document.body.style.overflow="hidden",function(){document.removeEventListener("keydown",j),document.body.style.overflow=f}}},[x]),(0,l.jsxs)("div",{className:"".concat(F.wrapper," ").concat(x?F.fullscreen:""),children:[(0,l.jsxs)("div",{className:F.toolbar,children:[(0,l.jsx)("span",{className:F.lang,children:h!=null?h:c}),(0,l.jsxs)("div",{className:F.actions,children:[(0,l.jsx)("button",{type:"button",className:F.action,onClick:dn,children:tn?"\u5DF2\u590D\u5236 \u2713":"\u590D\u5236"}),(0,l.jsx)("button",{type:"button",className:F.action,onClick:function(){return y(function(f){return!f})},children:x?"\u9000\u51FA\u5168\u5C4F \u2715":"\u5168\u5C4F \u2922"})]})]}),(0,l.jsx)("div",{className:F.scroll,style:x?void 0:{maxHeight:m},children:(0,l.jsx)(K.Z,{language:c,style:sn,showLineNumbers:v,wrapLongLines:!1,customStyle:{margin:0,padding:"16px 18px",background:"transparent",fontSize:"13.5px",lineHeight:1.6},codeTagProps:{style:{fontFamily:"var(--font-mono)"}},children:r})})]})},Y=V,J={tip:{icon:"\u{1F4A1}",label:"\u63D0\u793A",cls:"calloutTip"},warning:{icon:"\u26A0\uFE0F",label:"\u6CE8\u610F",cls:"calloutWarning"},danger:{icon:"\u{1F573}\uFE0F",label:"\u5E38\u89C1\u5751",cls:"calloutDanger"},success:{icon:"\u2705",label:"\u603B\u7ED3",cls:"calloutSuccess"},note:{icon:"\u{1F4CC}",label:"\u8BF4\u660E",cls:"calloutNote"}},X=function(n){var r=n.type,u=r===void 0?"note":r,c=n.title,s=n.children,m=n.className,d=J[u];return(0,l.jsxs)("div",{className:"".concat(t.callout," ").concat(t[d.cls]," ").concat(m!=null?m:""),children:[(0,l.jsxs)("div",{className:t.calloutTitle,children:[(0,l.jsx)("span",{className:t.calloutIcon,children:d.icon}),(0,l.jsx)("span",{children:c!=null?c:d.label})]}),(0,l.jsx)("div",{className:t.calloutBody,children:s})]})},q=X,nn=function(n){var r=n.head,u=n.rows,c=n.align,s=n.className,m=function(v){var h;return(h=c==null?void 0:c[v])!==null&&h!==void 0?h:"left"};return(0,l.jsx)("div",{className:"".concat(t.tableWrap," ").concat(s!=null?s:""),children:(0,l.jsxs)("table",{className:t.table,children:[(0,l.jsx)("thead",{children:(0,l.jsx)("tr",{children:r.map(function(d,v){return(0,l.jsx)("th",{style:{textAlign:m(v)},children:d},v)})})}),(0,l.jsx)("tbody",{children:u.map(function(d,v){return(0,l.jsx)("tr",{children:d.map(function(h,D){return(0,l.jsx)("td",{style:{textAlign:m(D)},children:h},D)})},v)})})]})})},en=nn,un=function(n){var r=n.children,u=n.className;return(0,l.jsx)("ul",{className:"".concat(t.ul," ").concat(u!=null?u:""),children:r})},an=function(n){var r=n.children,u=n.className;return(0,l.jsx)("ol",{className:"".concat(t.ol," ").concat(u!=null?u:""),children:r})},rn=function(n){var r=n.children,u=n.className;return(0,l.jsx)("li",{className:"".concat(t.li," ").concat(u!=null?u:""),children:r})},ln=function(n){var r=n.className;return(0,l.jsx)("hr",{className:"".concat(t.divider," ").concat(r!=null?r:"")})},cn=ln,pn=o(40905),Fn=function(n){var r=n.to,u=n.children,c=n.className,s=/^https?:\/\//.test(r);return s?_jsx("a",{href:r,target:"_blank",rel:"noreferrer",className:c,children:u}):_jsx(Link,{to:r,className:c,children:u})},xn=null},39825:function(A,C,o){o.d(C,{F:function(){return e}});var E=o(67294),a=o(55766);function e(){var l=(0,E.useContext)(a.N);if(!l)throw new Error("useTheme \u5FC5\u987B\u5728 <ThemeProvider> \u5185\u4F7F\u7528");return l}},75479:function(A,C,o){o.r(C);var E=o(67294),a=o(99954),e=o(85893),l=function(){return(0,e.jsxs)("article",{children:[(0,e.jsx)(a.Dx,{children:"C3P0 \u4E0E Druid \u4F7F\u7528"}),(0,e.jsx)(a.QE,{children:"\u56DB\u3001C3P0 \u7684\u4F7F\u7528"}),(0,e.jsx)(a.aC,{children:"4.1 \u51C6\u5907\u5DE5\u4F5C"}),(0,e.jsxs)(a.GS,{children:[(0,e.jsxs)(a.HC,{children:["\u5BFC\u5165\u4E24\u4E2A jar\uFF1A",(0,e.jsx)(a.ZM,{children:"c3p0-x.x.x.jar"}),"\u3001",(0,e.jsx)(a.ZM,{children:"mchange-commons-java-x.x.x.jar"}),"\uFF0C\u5916\u52A0 MySQL \u9A71\u52A8 jar\uFF1B"]}),(0,e.jsxs)(a.HC,{children:["\u5728 ",(0,e.jsx)(a.xv,{bold:!0,children:"src \u6839\u76EE\u5F55"}),"\u4E0B\u653E\u914D\u7F6E\u6587\u4EF6\uFF0C\u540D\u5B57",(0,e.jsx)(a.xv,{bold:!0,children:"\u5FC5\u987B"}),"\u53EB"," ",(0,e.jsx)(a.ZM,{children:"c3p0-config.xml"}),"\uFF08\u6846\u67B6\u81EA\u52A8\u6309\u8FD9\u4E2A\u540D\u5B57\u627E\uFF09\u3002"]})]}),(0,e.jsx)(a.aC,{children:"4.2 c3p0-config.xml \u914D\u7F6E"}),(0,e.jsx)(a.dn,{language:"xml",code:`<?xml version="1.0" encoding="UTF-8"?>
<c3p0-config>
    <!-- \u9ED8\u8BA4\u914D\u7F6E\uFF1Anew ComboPooledDataSource() \u4E0D\u4F20\u53C2\u65F6\u7528\u8FD9\u4E2A -->
    <default-config>
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/db_learn?useSSL=false&amp;serverTimezone=UTC</property>
        <property name="user">root</property>
        <property name="password">your_password</property>

        <!-- \u8FDE\u63A5\u6C60\u53C2\u6570 -->
        <property name="initialPoolSize">5</property>   <!-- \u521D\u59CB\u8FDE\u63A5\u6570 -->
        <property name="maxPoolSize">10</property>      <!-- \u6700\u5927\u8FDE\u63A5\u6570 -->
        <property name="checkoutTimeout">3000</property><!-- \u501F\u8FDE\u63A5\u7684\u8D85\u65F6(\u6BEB\u79D2) -->
    </default-config>

    <!-- \u547D\u540D\u914D\u7F6E\uFF1Anew ComboPooledDataSource("otherc3p0") \u65F6\u7528\u8FD9\u4E2A -->
    <named-config name="otherc3p0">
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/db_test?serverTimezone=UTC</property>
        <property name="user">root</property>
        <property name="password">your_password</property>
        <property name="maxPoolSize">8</property>
    </named-config>
</c3p0-config>`}),(0,e.jsxs)(a.UW,{type:"warning",children:["XML \u91CC URL \u7684 ",(0,e.jsx)(a.ZM,{children:"&"})," \u5FC5\u987B\u5199\u6210\u5B9E\u4F53"," ",(0,e.jsx)(a.ZM,{children:"&amp;"}),"\uFF0C\u5426\u5219 XML \u89E3\u6790\u62A5\u9519\u3002"]}),(0,e.jsx)(a.aC,{children:"4.3 \u4F7F\u7528 C3P0"}),(0,e.jsx)(a.dn,{language:"java",code:`import com.mchange.v2.c3p0.ComboPooledDataSource;
import javax.sql.DataSource;
import java.sql.Connection;

public class C3P0Demo {
    public static void main(String[] args) throws Exception {
        // \u521B\u5EFA\u8FDE\u63A5\u6C60\u5BF9\u8C61\uFF08\u81EA\u52A8\u8BFB\u53D6 c3p0-config.xml \u7684 default-config\uFF09
        DataSource ds = new ComboPooledDataSource();
        // \u82E5\u7528\u547D\u540D\u914D\u7F6E\uFF1Anew ComboPooledDataSource("otherc3p0");

        // \u4ECE\u6C60\u4E2D\u501F\u8FDE\u63A5
        Connection conn = ds.getConnection();
        System.out.println(conn);

        // ... \u6B63\u5E38\u7528 conn \u6267\u884C SQL\uFF08\u548C\u7B2C16\u7AE0\u4E00\u6837\uFF09...

        conn.close();   // \u5F52\u8FD8\u7ED9\u6C60\u5B50\uFF0C\u4E0D\u662F\u771F\u5173\u95ED
    }
}`}),(0,e.jsx)(a.aC,{children:"4.4 \u6838\u5FC3\u914D\u7F6E\u9879\u542B\u4E49"}),(0,e.jsx)(a.iA,{head:["\u914D\u7F6E\u9879","\u542B\u4E49"],rows:[["driverClass","\u9A71\u52A8\u7C7B\u540D"],["jdbcUrl","\u8FDE\u63A5 URL"],["user / password","\u8D26\u53F7\u5BC6\u7801"],["initialPoolSize","\u6C60\u542F\u52A8\u65F6\u521D\u59CB\u5316\u7684\u8FDE\u63A5\u6570"],["maxPoolSize","\u6C60\u4E2D\u6700\u5927\u8FDE\u63A5\u6570"],["checkoutTimeout","\u501F\u4E0D\u5230\u8FDE\u63A5\u65F6\u7B49\u5F85\u591A\u4E45\u5C31\u8D85\u65F6(\u6BEB\u79D2)"]]}),(0,e.jsx)(a.iz,{}),(0,e.jsx)(a.QE,{children:"\u4E94\u3001Druid \u7684\u4F7F\u7528\uFF08\u91CD\u70B9\uFF09"}),(0,e.jsx)(a.nv,{children:"Druid \u662F\u963F\u91CC\u5F00\u6E90\u7684\u8FDE\u63A5\u6C60\uFF0C\u529F\u80FD\u5F3A\u3001\u6709\u76D1\u63A7\u3001\u80FD\u9632 SQL \u6CE8\u5165\uFF0C\u56FD\u5185\u9879\u76EE\u7528\u5F97\u6700\u591A\u3002"}),(0,e.jsx)(a.aC,{children:"5.1 \u51C6\u5907\u5DE5\u4F5C"}),(0,e.jsxs)(a.GS,{children:[(0,e.jsxs)(a.HC,{children:["\u5BFC\u5165 ",(0,e.jsx)(a.ZM,{children:"druid-x.x.x.jar"})," \u548C MySQL \u9A71\u52A8 jar\uFF1B"]}),(0,e.jsxs)(a.HC,{children:["\u5728 src \u4E0B\u653E\u914D\u7F6E\u6587\u4EF6 ",(0,e.jsx)(a.ZM,{children:"druid.properties"}),"\uFF08",(0,e.jsx)(a.xv,{bold:!0,children:"\u540D\u5B57\u53EF\u81EA\u5B9A\u4E49\uFF0C\u9700\u624B\u52A8\u52A0\u8F7D"}),"\uFF0C\u8FD9\u70B9\u548C C3P0 \u4E0D\u540C\uFF09\u3002"]})]}),(0,e.jsx)(a.aC,{children:"5.2 druid.properties \u914D\u7F6E"}),(0,e.jsx)(a.dn,{language:"properties",code:`# \u6CE8\u610F Druid \u7684\u952E\u540D\u548C C3P0 \u4E0D\u4E00\u6837\uFF01
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC
username=root
password=your_password

# \u8FDE\u63A5\u6C60\u53C2\u6570
initialSize=5          # \u521D\u59CB\u8FDE\u63A5\u6570
maxActive=10           # \u6700\u5927\u8FDE\u63A5\u6570
maxWait=3000           # \u83B7\u53D6\u8FDE\u63A5\u6700\u5927\u7B49\u5F85\u65F6\u95F4(\u6BEB\u79D2)`}),(0,e.jsxs)(a.UW,{type:"warning",children:["Druid \u7684\u952E\u540D\u662F ",(0,e.jsx)(a.ZM,{children:"driverClassName"})," /"," ",(0,e.jsx)(a.ZM,{children:"url"})," / ",(0,e.jsx)(a.ZM,{children:"username"})," /"," ",(0,e.jsx)(a.ZM,{children:"password"}),"\uFF0C\u548C C3P0 \u7684 ",(0,e.jsx)(a.ZM,{children:"driverClass"})," /"," ",(0,e.jsx)(a.ZM,{children:"jdbcUrl"})," / ",(0,e.jsx)(a.ZM,{children:"user"})," \u4E0D\u540C\uFF0C\u522B\u8BB0\u6DF7\u4E86\u3002"]}),(0,e.jsx)(a.aC,{children:"5.3 \u4F7F\u7528 Druid"}),(0,e.jsx)(a.dn,{language:"java",code:`import com.alibaba.druid.pool.DruidDataSourceFactory;
import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

public class DruidDemo {
    public static void main(String[] args) throws Exception {
        // 1. \u52A0\u8F7D properties \u914D\u7F6E\u6587\u4EF6
        Properties pro = new Properties();
        InputStream is = DruidDemo.class.getClassLoader()
                            .getResourceAsStream("druid.properties");
        pro.load(is);

        // 2. \u7528\u5DE5\u5382\u6839\u636E\u914D\u7F6E\u521B\u5EFA\u8FDE\u63A5\u6C60\u5BF9\u8C61
        DataSource ds = DruidDataSourceFactory.createDataSource(pro);

        // 3. \u501F\u8FDE\u63A5
        Connection conn = ds.getConnection();
        System.out.println(conn);

        // ... \u6267\u884C SQL ...

        conn.close();   // \u5F52\u8FD8
    }
}`}),(0,e.jsxs)(a.UW,{type:"tip",children:["\u4E0E C3P0 \u7684\u533A\u522B\uFF1ADruid \u9700\u8981",(0,e.jsxs)(a.xv,{bold:!0,children:["\u81EA\u5DF1\u52A0\u8F7D properties \u5E76\u4EA4\u7ED9"," ",(0,e.jsx)(a.ZM,{children:"DruidDataSourceFactory.createDataSource()"})]}),"\uFF1BC3P0 \u662F\u81EA\u52A8\u627E ",(0,e.jsx)(a.ZM,{children:"c3p0-config.xml"}),"\u3002"]})]})};C.default=l}}]);
