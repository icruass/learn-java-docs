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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>IntelliJ IDEA 使用说明</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节我们用<Text bold>记事本 + 命令行</Text>写了第一个 Java 程序，目的是看清"编译 → 运行"的机制。
        但日常开发不可能一直这样做——代码一旦多起来，没有自动补全、没有报错提示，效率会非常低。
        本节介绍目前 Java 开发中<Text bold>最主流的 IDE：IntelliJ IDEA</Text>，覆盖从安装到调试的完整上手流程，
        重点演示能帮你<Text bold>大幅提速的快捷键和代码模板</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么用 IDE，而不是记事本</Heading3>
    <Paragraph>
      IDE（Integrated Development Environment，集成开发环境）把编写、编译、运行、调试集于一身。
      和"记事本 + 命令行"对比，优势一目了然：
    </Paragraph>
    <Table
      head={['能力', '记事本 + 命令行', 'IntelliJ IDEA']}
      rows={[
        ['代码高亮', '无，全部黑字', '关键字、类名、字符串颜色各不同，一眼分清结构'],
        ['自动补全', '无，全靠手打', '输入前几个字母即可弹出候选列表，Tab 或回车上屏'],
        ['一键编译运行', '需手动 javac + java 两条命令', '点绿色三角或按 Shift+F10 即可'],
        ['实时报错提示', '编译才知道错', '写的同时就在行尾画红线并给出修复建议'],
        ['调试（Debug）', '只能靠 println 猜', '可以打断点，逐行执行，实时查看变量值'],
        ['重构', '手动全局替换，容易遗漏', '安全重命名/提取方法，自动更新所有引用'],
      ]}
    />
    <Callout type="tip">
      记事本方式仍然有价值——它让你理解底层原理。但<Text bold>真正写项目时请用 IDEA</Text>，
      它能帮你把精力集中在业务逻辑上，而不是和拼写错误死磕。
    </Callout>

    <Heading3>2. 版本选择：社区版 vs 旗舰版</Heading3>
    <Paragraph>
      IntelliJ IDEA 分两个版本，官网（jetbrains.com/idea）可直接下载：
    </Paragraph>
    <Table
      head={['版本', '费用', '适合场景', '学 Java 够用吗']}
      rows={[
        ['Community（社区版）', '完全免费', '纯 Java / Kotlin / Android 开发', '完全够用'],
        ['Ultimate（旗舰版）', '收费（学生可免费申请）', '额外支持 Spring、数据库、前端框架等企业级特性', '学习阶段不必要'],
      ]}
    />
    <Callout type="tip">
      学习阶段直接下载<Text bold>社区版（Community Edition）</Text>，完全免费，本教程所有内容社区版均可完成。
      如果你是在校学生，也可以用学校邮箱在 JetBrains 官网申请旗舰版免费许可证。
    </Callout>

    <Heading3>3. 基本概念：Project 与 Module</Heading3>
    <Paragraph>
      在 IDEA 里，代码组织分两层：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Project（项目）</Text>：最顶层的容器，对应磁盘上的一个文件夹。
        IDEA 打开的是 Project，每次只能打开一个。
      </ListItem>
      <ListItem>
        <Text bold>Module（模块）</Text>：Project 内部的子单元，一个 Project 可以包含多个 Module。
        每个 Module 都有自己的源码目录（通常是 <InlineCode>src</InlineCode>）和编译输出目录。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      对于初学者来说，<Text bold>一个 Project 只放一个 Module</Text> 是最常见的做法，
      不需要纠结多模块的用法，后续课程再详细介绍。
    </Paragraph>
    <Callout type="warning" title="Project SDK 必须配置">
      新建 Project 时，IDEA 会要求选择 <Text bold>Project SDK</Text>——
      这就是告诉 IDEA"用哪个已安装的 JDK 来编译和运行代码"。
      如果这里留空或选错，IDEA 将无法编译任何代码。详见第 5 节注意事项。
    </Callout>

    <Heading3>4. 上手流程：从新建项目到运行</Heading3>
    <OrderedList>
      <ListItem>
        打开 IDEA，点击 <Text bold>New Project</Text>（新建项目）。
        左侧选 <InlineCode>Java</InlineCode>，右侧 <Text bold>Project SDK</Text> 下拉选中已安装的 JDK（如 JDK 17 或 21），
        填写项目名称和保存路径，点击 <Text bold>Create</Text>。
      </ListItem>
      <ListItem>
        项目创建完成后，在左侧 Project 面板可以看到 <InlineCode>src</InlineCode> 目录。
        右键 <InlineCode>src</InlineCode> → <Text bold>New → Package</Text>，填入包名（如 <InlineCode>com.example</InlineCode>）。
      </ListItem>
      <ListItem>
        右键刚创建的包 → <Text bold>New → Java Class</Text>，输入类名（如 <InlineCode>HelloWorld</InlineCode>），回车确认。
        IDEA 会自动生成类的骨架。
      </ListItem>
      <ListItem>
        在类体内输入 <InlineCode>main</InlineCode>（或 <InlineCode>psvm</InlineCode>），按 <Text bold>Tab 或回车</Text>展开为完整的 main 方法骨架，
        然后在方法体内输入 <InlineCode>sout</InlineCode> 并按 <Text bold>Tab 或回车</Text>展开为 <InlineCode>System.out.println();</InlineCode>，
        在括号内填入要打印的内容。
      </ListItem>
      <ListItem>
        运行程序有两种方式：
        点击 main 方法左侧（或类名左侧）的<Text bold>绿色三角按钮</Text>，或者按快捷键 <Text bold>Shift+F10</Text>。
        运行结果会显示在底部的 <Text bold>Run</Text> 面板。
      </ListItem>
    </OrderedList>

    <Heading3>5. 常用快捷键速查表</Heading3>
    <Paragraph>
      以下快捷键基于 <Text bold>Windows 键位</Text>（macOS 通常把 Ctrl 换成 Command，Alt 换成 Option）。
      前三个是 Live Template（代码模板），输入关键字后按 <Text bold>Tab 或回车</Text>即可展开：
    </Paragraph>
    <Table
      head={['快捷键 / 模板', '效果']}
      rows={[
        ['psvm 或 main → Tab/回车', '生成 public static void main(String[] args) 方法骨架'],
        ['sout → Tab/回车', '生成 System.out.println();'],
        ['Ctrl+/', '切换单行注释（选中多行则批量注释/取消注释）'],
        ['Ctrl+Shift+/', '切换块注释（/* ... */），适合多行'],
        ['Ctrl+Alt+L', '格式化代码（自动整理缩进和空格）'],
        ['Alt+Enter', '快速修复（光标停在红线处，弹出修复建议）'],
        ['Shift+F10', '运行当前程序'],
        ['Shift+F9', '以 Debug 模式运行当前程序'],
        ['Ctrl+D', '复制当前行到下一行'],
        ['Ctrl+Y', '删除当前行'],
        ['Ctrl+Z', '撤销'],
        ['Ctrl+Shift+Z', '重做（撤销的撤销）'],
      ]}
    />
    <Callout type="tip">
      最值得优先记住的是 <Text bold>sout、psvm、Ctrl+Alt+L、Alt+Enter、Shift+F10</Text> 这五个——
      它们能覆盖日常编码 80% 的高频操作。其余的用到时再查即可，用多了自然就记住了。
    </Callout>

    <Heading3>6. Live Template 演示：模板展开效果</Heading3>
    <Paragraph>
      Live Template 是 IDEA 内置的代码片段缩写，输入缩写词后按 <Text bold>Tab 或回车</Text>即可展开为完整代码。
      下面两个是最常用的：
    </Paragraph>

    <Heading4>sout → System.out.println()</Heading4>
    <Paragraph>
      在方法体内输入 <InlineCode>sout</InlineCode> 并按 Tab，展开结果：
    </Paragraph>
    <CodeBlock
      language="text"
      title="输入 sout → 按 Tab"
      code={`输入：sout

展开后：
System.out.println();
                  ^
                  光标自动定位到括号内，直接输入内容即可`}
    />

    <Heading4>psvm / main → main 方法骨架</Heading4>
    <Paragraph>
      在类体内输入 <InlineCode>psvm</InlineCode> 或 <InlineCode>main</InlineCode> 并按 Tab，展开结果：
    </Paragraph>
    <CodeBlock
      language="text"
      title="输入 psvm → 按 Tab"
      code={`输入：psvm

展开后：
public static void main(String[] args) {
    // 光标定位于此，直接开始写逻辑
}`}
    />

    <Paragraph>
      结合两个模板，一个完整的 Hello World 程序可以这样快速生成：
    </Paragraph>
    <CodeBlock
      title="用 Live Template 写出的完整示例"
      code={`public class HelloWorld {
    // 1. 类体内输入 psvm → Tab，生成 main 方法
    public static void main(String[] args) {
        // 2. 方法体内输入 sout → Tab，生成打印语句
        System.out.println("Hello, IntelliJ IDEA!");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`Hello, IntelliJ IDEA!`}
    />

    <Heading3>7. Debug 基础：打断点、单步执行</Heading3>
    <Paragraph>
      当程序输出不对、却看不出哪里出问题时，<Text bold>Debug（调试）</Text>是最有效的排查手段。
      基本流程如下：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>打断点</Text>：在代码编辑区左侧的<Text bold>行号区域单击</Text>，
        出现红色圆点即表示断点设置成功。程序运行到该行时会<Text bold>暂停</Text>，等待你的指令。
      </ListItem>
      <ListItem>
        <Text bold>以 Debug 方式运行</Text>：点击绿色三角旁边的<Text bold>绿色虫子图标</Text>，
        或按快捷键 <Text bold>Shift+F9</Text>。程序会运行到第一个断点处暂停。
      </ListItem>
      <ListItem>
        <Text bold>单步执行</Text>：
        <Text bold>F8（Step Over，步过）</Text>——执行当前行，不进入方法内部，跳到下一行；
        <Text bold>F7（Step Into，步入）</Text>——执行当前行，若当前行是方法调用，则进入该方法内部逐行执行。
      </ListItem>
      <ListItem>
        <Text bold>查看变量</Text>：程序暂停期间，底部 <Text bold>Variables（变量）</Text>面板会实时显示当前作用域内所有变量的名称和值，
        鼠标悬停到代码中的变量名上也会直接弹出当前值。
      </ListItem>
      <ListItem>
        <Text bold>继续执行</Text>：按 <Text bold>F9（Resume）</Text>让程序继续运行到下一个断点或结束。
      </ListItem>
    </UnorderedList>

    <Callout type="tip" title="调试小技巧">
      调试时如果不想进入 JDK 源码内部，用 <Text bold>F8（步过）</Text>即可。
      只有在需要深入查看<Text bold>自己写的方法</Text>内部时，才用 F7（步入）。
    </Callout>

    <Heading3>8. 注意事项</Heading3>
    <Callout type="warning" title="第一步必做：配置 Project SDK">
      <Paragraph>
        新建或打开项目后，如果 IDEA 提示"No SDK"或代码全是红线，
        说明 <Text bold>Project SDK 尚未配置</Text>。解决步骤：
      </Paragraph>
      <Paragraph>
        依次点击菜单 <Text bold>File → Project Structure（Ctrl+Alt+Shift+S）→ Project</Text>，
        在 <Text bold>SDK</Text> 下拉框中选择已安装的 JDK 路径，点击 <Text bold>OK</Text> 保存。
        保存后 IDEA 会重新索引项目，红线消失即表示配置成功。
      </Paragraph>
      <Paragraph>
        如果下拉框里没有可选项，点击 <Text bold>Add SDK → JDK</Text>，手动导航到 JDK 的安装目录（如
        <InlineCode>C:\Program Files\Java\jdk-17</InlineCode>）选中即可。
      </Paragraph>
    </Callout>

    <Callout type="danger" title="常见坑：中文路径 / 中文项目名">
      IDEA 本身支持中文界面，但<Text bold>项目路径和项目名称不要使用中文或空格</Text>——
      某些版本的 JDK 或构建工具在处理含中文的路径时会报奇怪的错误。
      建议路径全用英文字母、数字和短横线（如 <InlineCode>D:/projects/hello-java</InlineCode>）。
    </Callout>

    <Heading3>9. 练习与自测</Heading3>
    <Paragraph>
      先独立思考，再点右上角 <Text accent>「看答案 →」</Text>对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：快捷键速记"
      code={`问：在 IntelliJ IDEA 中：
  (1) 快速生成 main 方法骨架的 Live Template 是什么？
  (2) 快速生成 System.out.println(); 的 Live Template 是什么？
  (3) 给当前行添加/取消单行注释的快捷键是什么（Windows）？`}
      answerCode={`(1) 生成 main 方法骨架：
    输入 psvm 或 main，然后按 Tab 或回车展开。

(2) 生成 System.out.println();
    输入 sout，然后按 Tab 或回车展开。

(3) 单行注释快捷键（Windows）：Ctrl+/
    · 光标所在行没有注释 → 自动加上 //
    · 光标所在行已有注释 → 取消 //
    · 选中多行后按 Ctrl+/ → 批量加/取消注释`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：运行程序的两种方式"
      code={`问：在 IntelliJ IDEA 里，运行一个 Java 程序有哪两种常用方式？`}
      answerCode={`两种常用方式：

方式一：鼠标操作
  点击 main 方法左侧（或类名左侧）出现的绿色三角按钮，
  在弹出菜单中选择 "Run '类名.main()'" 即可运行。

方式二：键盘快捷键
  按 Shift+F10 直接运行当前程序（Windows）。
  macOS 对应快捷键为 Ctrl+R。

两种方式效果相同，运行结果都显示在底部的 Run 面板中。`}
    />
  </article>
);

export default index;
