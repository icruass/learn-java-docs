import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>标识符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        写 Java 程序，我们每天都在给东西"起名字"——类叫什么、变量叫什么、方法叫什么。
        这些名字统称为<Text bold>标识符</Text>。本节分两层讲：
        先讲<Text bold>硬性规则</Text>（违反就编译报错），再讲<Text bold>软性规范</Text>
        （业界约定俗成，不违反不会报错，但不遵守会让代码显得"不专业"）。
        两者都掌握，才能写出合法又优雅的 Java 代码。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是标识符</Heading3>
    <Paragraph>
      <Text bold>标识符（Identifier）</Text>是程序员自己起的名字，用来标识
      <Text bold>类、方法、变量、常量、包</Text>等程序元素。
      例如下面代码里，<InlineCode>Student</InlineCode>、<InlineCode>name</InlineCode>、
      <InlineCode>getAge</InlineCode>、<InlineCode>MAX_SIZE</InlineCode> 都是标识符，
      而 <InlineCode>class</InlineCode>、<InlineCode>int</InlineCode>、
      <InlineCode>public</InlineCode> 是关键字，不属于标识符。
    </Paragraph>
    <CodeBlock
      title="标识符示例"
      code={`public class Student {           // Student 是标识符（类名）
    private String name;           // name 是标识符（变量名）
    private int age;               // age 是标识符（变量名）

    public int getAge() {          // getAge 是标识符（方法名）
        return age;
    }

    public static final int MAX_SIZE = 100;  // MAX_SIZE 是标识符（常量名）
}`}
    />

    <Heading3>2. 命名规则（硬性，违反编译报错）</Heading3>
    <Paragraph>
      Java 编译器对标识符有严格限制，只要违反其中任意一条，<InlineCode>javac</InlineCode> 就会报错：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>只能由字母、数字、下划线（_）、美元符（$）组成</Text>——
        不能含有空格、减号、加号、点、斜杠等其他字符。
      </ListItem>
      <ListItem>
        <Text bold>不能以数字开头</Text>——第一个字符必须是字母、下划线或美元符。
      </ListItem>
      <ListItem>
        <Text bold>不能是 Java 关键字或保留字</Text>——如 <InlineCode>int</InlineCode>、
        <InlineCode>class</InlineCode>、<InlineCode>goto</InlineCode> 等。
      </ListItem>
      <ListItem>
        <Text bold>严格区分大小写</Text>——<InlineCode>name</InlineCode>、
        <InlineCode>Name</InlineCode>、<InlineCode>NAME</InlineCode> 是三个完全不同的标识符。
      </ListItem>
      <ListItem>
        <Text bold>长度理论上不限</Text>——但过长的名字实际没有意义，可读性反而差。
      </ListItem>
    </UnorderedList>

    <Callout type="warning" title="_ 和 $ 合法，但不建议滥用">
      下划线 <InlineCode>_</InlineCode> 和美元符 <InlineCode>$</InlineCode> 作为开头在语法上合法，
      但通常有特殊含义：<InlineCode>_</InlineCode> 在某些框架里用于特殊变量，
      <InlineCode>$</InlineCode> 常见于编译器生成的内部类名。
      正常业务代码<Text bold>不建议</Text>用它们作为名字的开头。
    </Callout>

    <Callout type="warning" title="中文标识符：合法但强烈不推荐">
      Java 标识符支持 Unicode，因此中文在语法上是合法的，如
      <InlineCode>int 年龄 = 18;</InlineCode> 可以编译通过。
      但这会带来编码问题、跨平台风险、可读性下降（对不懂中文的人）等一系列麻烦，
      <Text bold>实际开发中强烈不推荐</Text>使用中文标识符。
    </Callout>

    <Heading3>3. 合法 / 非法标识符对照表</Heading3>
    <Table
      head={['标识符', '合法？', '原因']}
      align={['left', 'center', 'left']}
      rows={[
        [<InlineCode>username</InlineCode>, '合法', '只含字母，完全符合规则'],
        [<InlineCode>user_name</InlineCode>, '合法', '含下划线，允许'],
        [<InlineCode>_name</InlineCode>, '合法', '下划线开头语法允许（但不建议）'],
        [<InlineCode>$ok</InlineCode>, '合法', '美元符开头语法允许（但不建议）'],
        [<InlineCode>userName2</InlineCode>, '合法', '字母开头，含数字，符合规则'],
        [<InlineCode>2name</InlineCode>, '非法', '数字开头，编译报错'],
        [<InlineCode>user-name</InlineCode>, '非法', '含减号，不在允许字符范围内'],
        [<InlineCode>user name</InlineCode>, '非法', '含空格，不允许'],
        [<InlineCode>class</InlineCode>, '非法', '是 Java 关键字，不能用作标识符'],
        [<InlineCode>goto</InlineCode>, '非法', '是 Java 保留字，同样不能用作标识符'],
        [<InlineCode>null</InlineCode>, '非法', '是 Java 字面量，不能用作标识符'],
        [<InlineCode>Hello.World</InlineCode>, '非法', '含点号，不允许'],
      ]}
    />

    <Heading3>4. 命名规范（软性约定，建议遵守）</Heading3>
    <Paragraph>
      合法只是基本门槛。在企业实际开发中，还有一套<Text bold>行业约定</Text>，
      遵守它们能让代码更易读、更专业。
    </Paragraph>

    <Heading4>① 总原则：见名知意</Heading4>
    <Paragraph>
      名字要能<Text bold>表达用途</Text>，让人一看就懂。反例：<InlineCode>a</InlineCode>、
      <InlineCode>temp2</InlineCode>、<InlineCode>xxx</InlineCode>——这类名字在稍大的项目里会
      让自己和同事都看不懂。
    </Paragraph>

    <Heading4>② 类名：大驼峰（UpperCamelCase）</Heading4>
    <Paragraph>
      每个单词的<Text bold>首字母大写</Text>，其余小写，单词直接拼接，不加分隔符。
    </Paragraph>
    <CodeBlock
      title="类名命名规范示例"
      code={`// 好的类名：大驼峰
class HelloWorld { }
class StudentInfo { }
class UserLoginService { }

// 不好的类名（不符合规范，但能编译）
class helloworld { }    // 全小写
class hello_world { }   // 下划线分隔（更像 C 风格）
class HELLOWORLD { }    // 全大写（全大写是常量的规范）`}
    />

    <Heading4>③ 变量名、方法名：小驼峰（lowerCamelCase）</Heading4>
    <Paragraph>
      <Text bold>第一个单词全小写</Text>，后续每个单词首字母大写，单词直接拼接。
    </Paragraph>
    <CodeBlock
      title="变量名和方法名命名规范示例"
      code={`// 好的变量名：小驼峰
int age = 18;
String userName = "张三";
boolean isLoggedIn = false;

// 好的方法名：小驼峰
public void getUserName() { }
public int calculateTotalPrice() { }

// 不好的命名（不符合规范）
int UserAge = 18;         // 首字母不该大写（大驼峰是类名的规范）
String user_name = "xx";  // 下划线风格不符合 Java 约定`}
    />

    <Heading4>④ 常量名：全大写 + 下划线分隔</Heading4>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰的常量，单词全大写，多个单词用下划线
      <InlineCode>_</InlineCode> 分隔。
    </Paragraph>
    <CodeBlock
      title="常量命名规范示例"
      code={`public static final int MAX_SIZE = 100;
public static final double PI = 3.14159;
public static final String DEFAULT_CHARSET = "UTF-8";`}
    />

    <Heading4>⑤ 包名：全小写</Heading4>
    <Paragraph>
      包名<Text bold>全部小写</Text>，通常用反转的域名加项目路径，单词之间用点分隔。
    </Paragraph>
    <CodeBlock
      title="包名命名规范示例"
      code={`package com.example.project;
package com.mycompany.utils;
package org.apache.commons.lang3;`}
    />

    <Heading3>5. 规范总结对照表</Heading3>
    <Table
      head={['元素', '规范', '示例']}
      rows={[
        ['类名', '大驼峰 UpperCamelCase', <InlineCode>HelloWorld, UserService</InlineCode>],
        ['变量名', '小驼峰 lowerCamelCase', <InlineCode>userName, totalPrice</InlineCode>],
        ['方法名', '小驼峰 lowerCamelCase', <InlineCode>getName, calculateAge</InlineCode>],
        ['常量名', '全大写 + 下划线', <InlineCode>MAX_SIZE, DEFAULT_URL</InlineCode>],
        ['包名', '全小写，点分隔', <InlineCode>com.example.util</InlineCode>],
      ]}
    />

    <Callout type="success" title="规则 vs 规范，分清楚很重要">
      <Paragraph>
        <Text bold>命名规则</Text>是编译器强制的底线，违反就报错；
        <Text bold>命名规范</Text>是行业约定，违反不报错，但会让代码难以维护、在团队中显得不专业。
        初学阶段就养成遵守规范的习惯，不要等坏习惯根深蒂固了再改。
      </Paragraph>
    </Callout>

    <Heading3>6. 综合代码示例</Heading3>
    <Paragraph>
      下面用一段完整的小程序，把各类命名规范全部体现出来，对照注释看每个名字的命名依据：
    </Paragraph>
    <CodeBlock
      title="NamingDemo.java"
      code={`package com.example.demo;              // 包名：全小写

public class NamingDemo {              // 类名：大驼峰

    // 常量：全大写 + 下划线
    public static final int MAX_AGE = 150;
    public static final String DEFAULT_NAME = "无名氏";

    // 变量：小驼峰
    private String userName;
    private int userAge;

    // 方法：小驼峰
    public void printUserInfo() {
        System.out.println("姓名：" + userName);
        System.out.println("年龄：" + userAge);
    }

    public static void main(String[] args) {
        NamingDemo demo = new NamingDemo();    // demo：变量，小驼峰
        demo.userName = DEFAULT_NAME;
        demo.userAge = 20;
        demo.printUserInfo();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名：无名氏
年龄：20`}
    />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先独立作答，再点 <Text accent>「看答案 →」</Text> 核对。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断标识符合法性"
      code={`判断下列每个标识符是否合法，并简要说明理由：

① myVariable
② 3abc
③ _count
④ user-age
⑤ int
⑥ $price
⑦ HelloWorld
⑧ null
⑨ true
⑩ my variable`}
      answerCode={`① myVariable   → 合法。字母开头，只含字母和数字，符合规则。
② 3abc         → 非法。以数字 3 开头，编译报错。
③ _count       → 合法。下划线开头，语法允许（但不建议用于业务变量）。
④ user-age     → 非法。含减号 -，不在允许字符集（字母/数字/_/$）内。
⑤ int          → 非法。是 Java 关键字，不能用作标识符。
⑥ $price       → 合法。美元符开头，语法允许（但不建议用于业务变量）。
⑦ HelloWorld   → 合法。大驼峰，字母组合，完全合规。
⑧ null         → 非法。是 Java 字面量，不能用作标识符。
⑨ true         → 非法。是 Java 字面量（布尔值），不能用作标识符。
⑩ my variable  → 非法。含空格，不允许出现在标识符中。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：把不规范的命名改写成符合 Java 规范的形式"
      code={`下列标识符虽然合法（不会编译报错），但不符合 Java 命名规范。
请按规范改写，并说明改写依据。

① 类名：myclass
② 类名：user_service
③ 变量名：UserName
④ 变量名：total_price
⑤ 常量名：maxRetryCount（用 final static 修饰的常量）
⑥ 方法名：GetUserName`}
      answerCode={`① myclass         → MyClass
   理由：类名应使用大驼峰，每个单词首字母大写。

② user_service     → UserService
   理由：类名大驼峰，多个单词直接拼接，不用下划线分隔。

③ UserName         → userName
   理由：变量名应使用小驼峰，第一个单词全小写，后续单词首字母大写。

④ total_price      → totalPrice
   理由：变量名小驼峰，不用下划线分隔。

⑤ maxRetryCount    → MAX_RETRY_COUNT
   理由：final static 修饰的常量应全大写，多个单词用下划线分隔。

⑥ GetUserName      → getUserName
   理由：方法名小驼峰，第一个单词全小写。`}
    />
  </article>
);

export default index;
