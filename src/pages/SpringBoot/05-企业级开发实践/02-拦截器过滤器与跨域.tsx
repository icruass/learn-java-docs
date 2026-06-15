import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Table,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>拦截器、过滤器与跨域</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        企业项目里有些逻辑需要在<Text bold>每个请求前后</Text>执行：登录校验、打印请求日志、记录耗时……
        用<Text bold>拦截器（Interceptor）</Text>可以优雅实现，不用每个 Controller 都写一遍。
        同时本节解决前后端分离最常见的拦截问题：<Text bold>跨域（CORS）</Text>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、过滤器 vs 拦截器：先分清楚</Subtitle>
    <Table
      head={['', '过滤器 Filter', '拦截器 Interceptor']}
      rows={[
        ['归属', 'Servlet 规范，属于 Web 容器层', 'Spring MVC 机制，属于 Spring 层'],
        ['能访问 Spring Bean', '不直接访问（早于 Spring 初始化）', '可以（就在 Spring 里）'],
        ['拦截范围', '所有请求（含静态资源）', '只拦截 DispatcherServlet 处理的请求'],
        ['常用场景', '跨域处理、字符编码、安全过滤（如 Spring Security）', '登录校验、权限验证、接口耗时日志'],
      ]}
    />
    <Paragraph>
      日常开发<Text bold>优先用拦截器</Text>，能访问 Spring Bean（如 JWT 工具类），写起来更方便。
      Filter 留给需要更底层控制的场景（如 Spring Security）。
    </Paragraph>

    <Divider />

    <Subtitle>二、自定义拦截器</Subtitle>
    <Paragraph>
      以「登录令牌校验拦截器」为例，展示完整写法：
    </Paragraph>
    <CodeBlock
      title="config/LoginInterceptor.java"
      code={`package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {

    /**
     * preHandle：请求到达 Controller 之前执行。
     * 返回 true → 放行，继续走后续流程；返回 false → 拦截，不再调用 Controller。
     */
    @Override
    public boolean preHandle(HttpServletRequest request,
                              HttpServletResponse response,
                              Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        log.debug("请求路径：{}，token：{}", request.getRequestURI(), token);

        if (token == null || token.isBlank()) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\\"code\\":401,\\"message\\":\\"请先登录\\"}");
            return false;   // 拦截
        }
        // 实际项目这里解析 JWT，校验签名、有效期，把用户信息存入 ThreadLocal
        return true;        // 放行
    }

    /**
     * afterCompletion：请求完成后执行（无论成功还是抛异常）。
     * 适合做资源清理（如清空 ThreadLocal）、记录总耗时。
     */
    @Override
    public void afterCompletion(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Object handler, Exception ex) {
        // 清理 ThreadLocal，防止内存泄漏
        // UserContext.clear();
    }
}`}
    />

    <Paragraph>
      写好拦截器后，还需要在<Text bold>配置类里注册</Text>，并指定拦截哪些路径：
    </Paragraph>
    <CodeBlock
      title="config/WebMvcConfig.java"
      code={`package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginInterceptor loginInterceptor;

    public WebMvcConfig(LoginInterceptor loginInterceptor) {
        this.loginInterceptor = loginInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/api/**")          // 拦截 /api 下所有路径
                .excludePathPatterns(
                    "/api/auth/login",               // 登录接口不拦截
                    "/api/auth/register",
                    "/doc.html",                     // Knife4j 文档不拦截
                    "/v3/api-docs/**"
                );
    }
}`}
    />
    <Callout type="tip">
      <InlineCode>addPathPatterns</InlineCode> / <InlineCode>excludePathPatterns</InlineCode> 支持 Ant 风格通配符：
      <InlineCode>/**</InlineCode> 匹配任意层级，<InlineCode>/*</InlineCode> 只匹配一层。
    </Callout>

    <Divider />

    <Subtitle>三、跨域问题（CORS）</Subtitle>
    <Paragraph>
      前后端分离项目中，前端（如 <InlineCode>http://localhost:3000</InlineCode>）向后端（
      <InlineCode>http://localhost:8080</InlineCode>）发请求，因为<Text bold>域名/端口不同</Text>，
      浏览器会触发 CORS 拦截，报 <InlineCode>Access-Control-Allow-Origin</InlineCode> 错误。
    </Paragraph>

    <Paragraph>
      <Text bold>方案一：配置类全局解决（推荐）</Text>
    </Paragraph>
    <CodeBlock
      title="config/WebMvcConfig.java（在上面的配置类中追加）"
      code={`@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")                       // 对所有路径生效
            .allowedOriginPatterns("*")              // 允许所有来源（生产环境建议指定具体域名）
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)                  // 允许携带 Cookie/Authorization
            .maxAge(3600);                           // 预检请求缓存 1 小时
}`}
    />

    <Paragraph>
      <Text bold>方案二：@CrossOrigin 放在 Controller 上</Text>（仅针对单个 Controller，不推荐大量使用）
    </Paragraph>
    <CodeBlock
      code={`@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController { ... }`}
    />
    <Callout type="danger" title="跨域 + 拦截器的坑">
      若同时使用自定义拦截器，浏览器在真正请求前会先发一个 <InlineCode>OPTIONS</InlineCode> 预检请求。
      如果拦截器把这个预检请求拦截了（因为没有 token），浏览器就会认为跨域失败。
      解决方法：在 <InlineCode>preHandle</InlineCode> 里对 OPTIONS 方法直接放行：
      <CodeBlock
        code={`if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
    return true;  // 预检请求直接放行
}`}
      />
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>拦截器比过滤器更常用：能访问 Spring Bean，适合登录校验、权限验证、日志记录。</ListItem>
        <ListItem>实现 <InlineCode>HandlerInterceptor</InlineCode>，在 <InlineCode>WebMvcConfigurer.addInterceptors</InlineCode> 里注册并配置路径。</ListItem>
        <ListItem>跨域在 <InlineCode>addCorsMappings</InlineCode> 里全局配置，一次搞定所有接口。</ListItem>
        <ListItem>拦截器记得对 <InlineCode>OPTIONS</InlineCode> 预检请求直接放行，避免与跨域配置冲突。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
