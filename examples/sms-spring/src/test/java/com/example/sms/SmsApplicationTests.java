package com.example.sms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 冒烟测试：能加载完整的 Spring 上下文（所有 Bean 正确装配、数据源/JPA 正常初始化）
 * 就说明项目能启动。这是最基础也最有价值的一条测试。
 */
@SpringBootTest
class SmsApplicationTests {

    @Test
    void contextLoads() {
        // 上下文加载失败会直接让本测试报错；加载成功即通过。
    }
}
