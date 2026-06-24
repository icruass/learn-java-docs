package com.example.sms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 应用启动入口。
 *
 * <p>{@code @SpringBootApplication} 是三个注解的组合：
 * <ul>
 *   <li>{@code @SpringBootConfiguration}：标记这是配置类；</li>
 *   <li>{@code @EnableAutoConfiguration}：根据 classpath 里的依赖自动装配
 *       （比如发现了 spring-boot-starter-web 就自动起一个内嵌 Tomcat）；</li>
 *   <li>{@code @ComponentScan}：从本包（com.example.sms）开始扫描
 *       {@code @RestController}/{@code @Service}/{@code @Repository} 等组件并放进容器。</li>
 * </ul>
 *
 * <p>运行 {@code main} 方法即可启动整个服务，默认监听 8080 端口。
 */
@SpringBootApplication
public class SmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmsApplication.class, args);
    }
}
