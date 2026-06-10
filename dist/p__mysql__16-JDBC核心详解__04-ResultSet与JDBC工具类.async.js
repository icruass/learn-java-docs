"use strict";(self.webpackChunklearn_java_docs=self.webpackChunklearn_java_docs||[]).push([[2670],{99954:function(N,x,c){c.d(x,{UW:function(){return q},dn:function(){return G},iz:function(){return rn},aC:function(){return U},k8:function(){return I},ZM:function(){return R},HC:function(){return an},GS:function(){return tn},nv:function(){return O},T7:function(){return Q},QE:function(){return P},iA:function(){return en},xv:function(){return w},Dx:function(){return M},QI:function(){return un}});var j=c(97857),t=c.n(j),u=c(67294),l=c(85893),A=function(n){var a=n.children,e=n.color,r=n.accent,o=n.bold,v=n.italic,d=n.underline,h=n.size,E=n.as,p=n.className,S=n.style,B=E||"span",D=r?"var(--color-accent)":e,C=typeof h=="number"?"".concat(h,"em"):h||void 0,f=t()({color:D,fontWeight:o?700:void 0,fontStyle:v?"italic":void 0,textDecoration:d?"underline":void 0,fontSize:C},S);return(0,l.jsx)(B,{className:p,style:f,children:a})},w=A,s={title:"title____yC74",subtitle:"subtitle___DJnYC",heading3:"heading3___xgFVQ",heading4:"heading4___ueZC4",paragraph:"paragraph___SKLDb",secondary:"secondary___SxlcT",tag:"tag___zEMa3",tagSolid:"tagSolid___gwtRd",tagOutline:"tagOutline___lkgdE",inlineCode:"inlineCode___HWVFp",ul:"ul___99aUQ",ol:"ol___UKZ2Q",li:"li___qdI1J",divider:"divider___iNYzd",tableWrap:"tableWrap___j0swV",table:"table___mypt3",callout:"callout___dp1wm",calloutTitle:"calloutTitle___r6hUs",calloutIcon:"calloutIcon___FjVQy",calloutBody:"calloutBody___zuEgV",calloutTip:"calloutTip___Y1HSW",calloutWarning:"calloutWarning___dCuzh",calloutDanger:"calloutDanger___is50f",calloutSuccess:"calloutSuccess___PbpXI",calloutNote:"calloutNote___OsOYj"},M=function(n){var a=n.children,e=n.className,r=n.id;return(0,l.jsx)("h1",{id:r,className:"".concat(s.title," ").concat(e!=null?e:""),children:a})},P=function(n){var a=n.children,e=n.className,r=n.id;return(0,l.jsx)("h2",{id:r,className:"".concat(s.subtitle," ").concat(e!=null?e:""),children:a})},U=function(n){var a=n.children,e=n.className,r=n.id;return(0,l.jsx)("h3",{id:r,className:"".concat(s.heading3," ").concat(e!=null?e:""),children:a})},I=function(n){var a=n.children,e=n.className,r=n.id;return(0,l.jsx)("h4",{id:r,className:"".concat(s.heading4," ").concat(e!=null?e:""),children:a})},O=function(n){var a=n.children,e=n.className;return(0,l.jsx)("p",{className:"".concat(s.paragraph," ").concat(e!=null?e:""),children:a})},Q=function(n){var a=n.children,e=n.className;return(0,l.jsx)("p",{className:"".concat(s.secondary," ").concat(e!=null?e:""),children:a})},R=function(n){var a=n.children,e=n.className;return(0,l.jsx)("code",{className:"".concat(s.inlineCode," ").concat(e!=null?e:""),children:a})},hn=function(n){var a=n.children,e=n.variant,r=e===void 0?"soft":e,o=n.className,v=r==="solid"?styles.tagSolid:r==="outline"?styles.tagOutline:"";return _jsx("span",{className:"".concat(styles.tag," ").concat(v," ").concat(o!=null?o:""),children:a})},En=null,Z=c(15009),b=c.n(Z),W=c(99289),k=c.n(W),z=c(5574),T=c.n(z),H=c(94163),J=c(79166),K=c(24136),$=c(39825),m={wrapper:"wrapper___Q0ipC",fullscreen:"fullscreen___yo9BF",toolbar:"toolbar___f0O4P",lang:"lang___Vi58K",actions:"actions___fG58K",action:"action___TorJb",scroll:"scroll___bMM4_"},V=function(n){var a=n.code,e=n.language,r=e===void 0?"java":e,o=n.maxHeight,v=o===void 0?420:o,d=n.showLineNumbers,h=d===void 0?!0:d,E=n.title,p=(0,$.F)(),S=p.theme,B=(0,u.useState)(!1),D=T()(B,2),C=D[0],f=D[1],cn=(0,u.useState)(!1),_=T()(cn,2),sn=_[0],L=_[1],on=S==="dark"?J.Z:K.Z,dn=(0,u.useCallback)(k()(b()().mark(function g(){return b()().wrap(function(F){for(;;)switch(F.prev=F.next){case 0:return F.prev=0,F.next=3,navigator.clipboard.writeText(a);case 3:L(!0),window.setTimeout(function(){return L(!1)},1600),F.next=9;break;case 7:F.prev=7,F.t0=F.catch(0);case 9:case"end":return F.stop()}},g,null,[[0,7]])})),[a]);return(0,u.useEffect)(function(){if(C){var g=function(vn){vn.key==="Escape"&&f(!1)};document.addEventListener("keydown",g);var y=document.body.style.overflow;return document.body.style.overflow="hidden",function(){document.removeEventListener("keydown",g),document.body.style.overflow=y}}},[C]),(0,l.jsxs)("div",{className:"".concat(m.wrapper," ").concat(C?m.fullscreen:""),children:[(0,l.jsxs)("div",{className:m.toolbar,children:[(0,l.jsx)("span",{className:m.lang,children:E!=null?E:r}),(0,l.jsxs)("div",{className:m.actions,children:[(0,l.jsx)("button",{type:"button",className:m.action,onClick:dn,children:sn?"\u5DF2\u590D\u5236 \u2713":"\u590D\u5236"}),(0,l.jsx)("button",{type:"button",className:m.action,onClick:function(){return f(function(y){return!y})},children:C?"\u9000\u51FA\u5168\u5C4F \u2715":"\u5168\u5C4F \u2922"})]})]}),(0,l.jsx)("div",{className:m.scroll,style:C?void 0:{maxHeight:v},children:(0,l.jsx)(H.Z,{language:r,style:on,showLineNumbers:h,wrapLongLines:!1,customStyle:{margin:0,padding:"16px 18px",background:"transparent",fontSize:"13.5px",lineHeight:1.6},codeTagProps:{style:{fontFamily:"var(--font-mono)"}},children:a})})]})},G=V,X={tip:{icon:"\u{1F4A1}",label:"\u63D0\u793A",cls:"calloutTip"},warning:{icon:"\u26A0\uFE0F",label:"\u6CE8\u610F",cls:"calloutWarning"},danger:{icon:"\u{1F573}\uFE0F",label:"\u5E38\u89C1\u5751",cls:"calloutDanger"},success:{icon:"\u2705",label:"\u603B\u7ED3",cls:"calloutSuccess"},note:{icon:"\u{1F4CC}",label:"\u8BF4\u660E",cls:"calloutNote"}},Y=function(n){var a=n.type,e=a===void 0?"note":a,r=n.title,o=n.children,v=n.className,d=X[e];return(0,l.jsxs)("div",{className:"".concat(s.callout," ").concat(s[d.cls]," ").concat(v!=null?v:""),children:[(0,l.jsxs)("div",{className:s.calloutTitle,children:[(0,l.jsx)("span",{className:s.calloutIcon,children:d.icon}),(0,l.jsx)("span",{children:r!=null?r:d.label})]}),(0,l.jsx)("div",{className:s.calloutBody,children:o})]})},q=Y,nn=function(n){var a=n.head,e=n.rows,r=n.align,o=n.className,v=function(h){var E;return(E=r==null?void 0:r[h])!==null&&E!==void 0?E:"left"};return(0,l.jsx)("div",{className:"".concat(s.tableWrap," ").concat(o!=null?o:""),children:(0,l.jsxs)("table",{className:s.table,children:[(0,l.jsx)("thead",{children:(0,l.jsx)("tr",{children:a.map(function(d,h){return(0,l.jsx)("th",{style:{textAlign:v(h)},children:d},h)})})}),(0,l.jsx)("tbody",{children:e.map(function(d,h){return(0,l.jsx)("tr",{children:d.map(function(E,p){return(0,l.jsx)("td",{style:{textAlign:v(p)},children:E},p)})},h)})})]})})},en=nn,un=function(n){var a=n.children,e=n.className;return(0,l.jsx)("ul",{className:"".concat(s.ul," ").concat(e!=null?e:""),children:a})},tn=function(n){var a=n.children,e=n.className;return(0,l.jsx)("ol",{className:"".concat(s.ol," ").concat(e!=null?e:""),children:a})},an=function(n){var a=n.children,e=n.className;return(0,l.jsx)("li",{className:"".concat(s.li," ").concat(e!=null?e:""),children:a})},ln=function(n){var a=n.className;return(0,l.jsx)("hr",{className:"".concat(s.divider," ").concat(a!=null?a:"")})},rn=ln,Fn=c(40905),mn=function(n){var a=n.to,e=n.children,r=n.className,o=/^https?:\/\//.test(a);return o?_jsx("a",{href:a,target:"_blank",rel:"noreferrer",className:r,children:e}):_jsx(Link,{to:a,className:r,children:e})},Cn=null},39825:function(N,x,c){c.d(x,{F:function(){return u}});var j=c(67294),t=c(55766);function u(){var l=(0,j.useContext)(t.N);if(!l)throw new Error("useTheme \u5FC5\u987B\u5728 <ThemeProvider> \u5185\u4F7F\u7528");return l}},36204:function(N,x,c){c.r(x);var j=c(67294),t=c(99954),u=c(85893),l=function(){return(0,u.jsxs)("article",{children:[(0,u.jsx)(t.Dx,{children:"ResultSet \u4E0E JDBC \u5DE5\u5177\u7C7B"}),(0,u.jsx)(t.QE,{children:"\u4E03\u3001ResultSet\uFF1A\u7ED3\u679C\u96C6\u5BF9\u8C61"}),(0,u.jsxs)(t.nv,{children:[(0,u.jsx)(t.ZM,{children:"executeQuery"})," \u8FD4\u56DE\u7684 ",(0,u.jsx)(t.ZM,{children:"ResultSet"})," ","\u662F\u4E00\u5F20\u300C\u67E5\u8BE2\u7ED3\u679C\u8868\u300D\uFF0C\u5185\u90E8\u6709\u4E00\u4E2A",(0,u.jsx)(t.xv,{bold:!0,children:"\u6E38\u6807\uFF08cursor\uFF09"}),"\uFF0C\u521D\u59CB\u6307\u5411\u7B2C\u4E00\u884C",(0,u.jsx)(t.xv,{bold:!0,children:"\u4E4B\u524D"}),"\u3002"]}),(0,u.jsx)(t.aC,{children:"7.1 \u4E24\u4E2A\u6838\u5FC3\u65B9\u6CD5"}),(0,u.jsx)(t.iA,{head:["\u65B9\u6CD5","\u4F5C\u7528"],rows:[["boolean next()","\u6E38\u6807\u4E0B\u79FB\u4E00\u884C\uFF1B\u6709\u6570\u636E\u8FD4\u56DE true\uFF0C\u5230\u672B\u5C3E\u8FD4\u56DE false"],["getXxx(\u5217\u540D \u6216 \u5217\u7D22\u5F15)","\u53D6\u5F53\u524D\u884C\u67D0\u5217\u7684\u503C\uFF0CXxx \u662F\u7C7B\u578B\uFF1AgetInt\u3001getString\u3001getDouble\u3001getDate\u2026"]]}),(0,u.jsx)(t.aC,{children:"7.2 \u904D\u5386\u7ED3\u679C\u96C6"}),(0,u.jsx)(t.dn,{language:"java",code:`String sql = "SELECT id, username, password FROM user";
PreparedStatement ps = conn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();

while (rs.next()) {                 // \u6BCF\u6B21 next() \u79FB\u5230\u4E0B\u4E00\u884C
    int id = rs.getInt("id");           // \u6309\u5217\u540D\u53D6\uFF08\u63A8\u8350\uFF0C\u53EF\u8BFB\u6027\u597D\uFF09
    String name = rs.getString("username");
    String pwd  = rs.getString(3);      // \u4E5F\u53EF\u6309\u5217\u7D22\u5F15\u53D6\uFF08\u4ECE 1 \u5F00\u59CB\uFF09
    System.out.println(id + ", " + name + ", " + pwd);
}`}),(0,u.jsxs)(t.UW,{type:"danger",children:[(0,u.jsx)(t.xv,{bold:!0,children:"\u5E38\u89C1\u9519\u8BEF"}),"\uFF1A\u5FD8\u4E86\u5199 ",(0,u.jsx)(t.ZM,{children:"rs.next()"})," \u5C31\u76F4\u63A5"," ",(0,u.jsx)(t.ZM,{children:"getXxx"}),"\uFF0C\u4F1A\u629B"," ",(0,u.jsx)(t.ZM,{children:"Before start of result set"}),"\uFF08\u6E38\u6807\u8FD8\u6CA1\u6307\u5411\u4EFB\u4F55\u884C\uFF09\u3002\u67E5\u8BE2\u5355\u884C\u65F6\u4E5F\u8981\u5148 ",(0,u.jsx)(t.ZM,{children:"if(rs.next())"}),"\u3002"]}),(0,u.jsx)(t.aC,{children:"7.3 \u628A\u7ED3\u679C\u5C01\u88C5\u6210 Java \u5BF9\u8C61\uFF08JavaBean\uFF09"}),(0,u.jsxs)(t.nv,{children:["\u5B9E\u6218\u4E2D\u901A\u5E38\u628A\u6BCF\u884C\u5C01\u88C5\u6210\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u653E\u8FDB ",(0,u.jsx)(t.ZM,{children:"List"}),"\uFF1A"]}),(0,u.jsx)(t.dn,{language:"java",code:`List<User> list = new ArrayList<>();
while (rs.next()) {
    User u = new User();
    u.setId(rs.getInt("id"));
    u.setUsername(rs.getString("username"));
    u.setPassword(rs.getString("password"));
    list.add(u);
}
// list \u5C31\u662F\u67E5\u8BE2\u7ED3\u679C\uFF0C\u53EF\u4EE5\u8FD4\u56DE\u7ED9\u4E0A\u5C42\u4F7F\u7528`}),(0,u.jsx)(t.iz,{}),(0,u.jsx)(t.QE,{children:"\u516B\u3001\u91CA\u653E\u8D44\u6E90\u4E0E JDBC \u5DE5\u5177\u7C7B\u5C01\u88C5"}),(0,u.jsx)(t.aC,{children:"8.1 \u4E3A\u4EC0\u4E48\u5FC5\u987B\u91CA\u653E"}),(0,u.jsxs)(t.nv,{children:[(0,u.jsx)(t.ZM,{children:"Connection"}),"\u3001",(0,u.jsx)(t.ZM,{children:"Statement"}),"\u3001",(0,u.jsx)(t.ZM,{children:"ResultSet"})," \u90FD\u5360\u7528\u6570\u636E\u5E93/\u7CFB\u7EDF\u8D44\u6E90\uFF0C",(0,u.jsx)(t.xv,{bold:!0,children:"\u7528\u5B8C\u4E0D\u5173\u4F1A\u5BFC\u81F4\u8FDE\u63A5\u8017\u5C3D\u3001\u5185\u5B58\u6CC4\u6F0F"}),"\u3002\u8981\u5728"," ",(0,u.jsx)(t.ZM,{children:"finally"})," \u91CC",(0,u.jsx)(t.xv,{bold:!0,children:"\u5012\u5E8F\u5173\u95ED"}),"\uFF08\u5148\u5F00\u7684\u540E\u5173\uFF09\uFF1A"]}),(0,u.jsx)(t.dn,{language:"java",code:`} finally {
    if (rs != null)   try { rs.close(); }   catch (SQLException e) {}
    if (ps != null)   try { ps.close(); }   catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}`}),(0,u.jsx)(t.nv,{children:"\u6BCF\u4E2A\u7C7B\u90FD\u8FD9\u6837\u5199\u592A\u5570\u55E6\uFF0C\u4E8E\u662F\u5C01\u88C5\u6210\u5DE5\u5177\u7C7B\u3002"}),(0,u.jsx)(t.aC,{children:"8.2 \u914D\u7F6E\u6587\u4EF6 jdbc.properties"}),(0,u.jsxs)(t.nv,{children:["\u628A\u8FDE\u63A5\u4FE1\u606F\u62BD\u5230\u914D\u7F6E\u6587\u4EF6\uFF08\u653E\u5728 ",(0,u.jsx)(t.ZM,{children:"src"})," ","\u76EE\u5F55\u4E0B\uFF09\uFF0C\u6539\u6570\u636E\u5E93\u4E0D\u7528\u52A8\u4EE3\u7801\uFF1A"]}),(0,u.jsx)(t.dn,{language:"properties",code:`# jdbc.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC
username=root
password=your_password`}),(0,u.jsx)(t.aC,{children:"8.3 JDBCUtils \u5DE5\u5177\u7C7B"}),(0,u.jsx)(t.dn,{language:"java",code:`import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class JDBCUtils {
    private static String url;
    private static String user;
    private static String password;

    // \u9759\u6001\u5757\uFF1A\u7C7B\u52A0\u8F7D\u65F6\u53EA\u8BFB\u4E00\u6B21\u914D\u7F6E\u3001\u53EA\u6CE8\u518C\u4E00\u6B21\u9A71\u52A8
    static {
        try {
            Properties pro = new Properties();
            // \u7528\u7C7B\u52A0\u8F7D\u5668\u8BFB src \u4E0B\u7684\u914D\u7F6E\u6587\u4EF6
            InputStream is = JDBCUtils.class.getClassLoader()
                                .getResourceAsStream("jdbc.properties");
            pro.load(is);

            String driver = pro.getProperty("driver");
            url      = pro.getProperty("url");
            user     = pro.getProperty("username");
            password = pro.getProperty("password");

            Class.forName(driver);     // \u6CE8\u518C\u9A71\u52A8
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /** \u83B7\u53D6\u8FDE\u63A5 */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    /** \u91CA\u653E\u8D44\u6E90\uFF08\u67E5\u8BE2\u7528\uFF0C\u5173 3 \u4E2A\uFF09 */
    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null)   try { rs.close(); }   catch (SQLException e) { e.printStackTrace(); }
        if (stmt != null) try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    /** \u91CA\u653E\u8D44\u6E90\uFF08\u589E\u5220\u6539\u7528\uFF0C\u5173 2 \u4E2A\uFF09\u2014\u2014 \u65B9\u6CD5\u91CD\u8F7D */
    public static void close(Statement stmt, Connection conn) {
        close(null, stmt, conn);
    }
}`}),(0,u.jsx)(t.nv,{children:"\u7528\u4E86\u5DE5\u5177\u7C7B\u540E\uFF0C\u4E1A\u52A1\u4EE3\u7801\u77AC\u95F4\u6E05\u723D\uFF1A"}),(0,u.jsx)(t.dn,{language:"java",code:`Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
try {
    conn = JDBCUtils.getConnection();
    ps = conn.prepareStatement("SELECT * FROM user");
    rs = ps.executeQuery();
    while (rs.next()) { /* ... */ }
} catch (SQLException e) {
    e.printStackTrace();
} finally {
    JDBCUtils.close(rs, ps, conn);
}`}),(0,u.jsx)(t.iz,{})]})};x.default=l}}]);
