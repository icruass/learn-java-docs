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
    <Title>ArrayList 基本使用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上节看到数组长度固定、增删繁琐。Java 提供了 <Text bold>ArrayList</Text>——
        一种<Text bold>长度可变的集合（容器）</Text>，内部自动扩容，并内置了常用的增删改查方法。
        本节从导包、创建、泛型含义，到六个核心方法逐一讲解，最后演示遍历方式，
        让你全面掌握 ArrayList 的日常用法。
      </Paragraph>
    </Callout>

    <Heading3>1. ArrayList 是什么</Heading3>
    <Paragraph>
      <InlineCode>ArrayList</InlineCode> 是 Java 集合框架中最常用的类之一，位于
      <InlineCode>java.util</InlineCode> 包下。它的底层是一个<Text bold>可自动扩容的动态数组</Text>：
      初始容量默认为 10，当元素数量超出容量时，ArrayList 会自动创建一个更大的数组并迁移数据，
      这一切对使用者透明，无需手动操心。
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>长度可变</Text>：随时 add / remove，无需预先确定大小。</ListItem>
      <ListItem><Text bold>有序</Text>：元素按加入顺序排列，支持按索引访问。</ListItem>
      <ListItem><Text bold>允许重复</Text>：同一个值可以多次存入。</ListItem>
      <ListItem><Text bold>只能存引用类型</Text>：基本类型须用对应的包装类（Integer、Double 等）。</ListItem>
    </UnorderedList>

    <Heading3>2. 使用 ArrayList 的三个前置步骤</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>导包</Text>：在类文件最顶部（package 语句之后）写
        <InlineCode>import java.util.ArrayList;</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>指定泛型</Text>：在 <InlineCode>&lt;&gt;</InlineCode> 中写明要存储的数据类型，如
        <InlineCode>ArrayList&lt;String&gt;</InlineCode>、<InlineCode>ArrayList&lt;Integer&gt;</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>创建对象</Text>：用 <InlineCode>new ArrayList&lt;&gt;()</InlineCode> 创建集合实例
        （右侧的 <InlineCode>&lt;&gt;</InlineCode> 可省略类型，编译器自动推断）。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="完整创建格式"
      code={`import java.util.ArrayList;   // 第一步：导包

ArrayList<E> list = new ArrayList<>();  // 第二、三步：指定泛型 E，创建对象`}
    />
    <Paragraph>
      其中 <InlineCode>E</InlineCode> 是泛型占位符，使用时替换为实际的引用类型，例如
      <InlineCode>String</InlineCode>、<InlineCode>Integer</InlineCode>、自定义的
      <InlineCode>Student</InlineCode> 等。
    </Paragraph>

    <Heading3>3. 泛型 E 的含义与约束</Heading3>
    <Paragraph>
      <InlineCode>ArrayList&lt;E&gt;</InlineCode> 中的 <InlineCode>E</InlineCode>（Element）是泛型参数，
      它规定了集合<Text bold>只能存储某一种类型</Text>的元素，让编译器在编译期就能发现类型错误。
    </Paragraph>
    <Callout type="warning" title="泛型只能写引用类型，不能写基本类型">
      <Paragraph>
        <InlineCode>ArrayList&lt;int&gt;</InlineCode> 是<Text bold>非法的</Text>，编译报错。
        基本类型必须使用对应的<Text bold>包装类</Text>：
      </Paragraph>
      <Table
        head={['基本类型', '对应包装类', '示例']}
        rows={[
          ['int', 'Integer', 'ArrayList<Integer>'],
          ['double', 'Double', 'ArrayList<Double>'],
          ['char', 'Character', 'ArrayList<Character>'],
          ['boolean', 'Boolean', 'ArrayList<Boolean>'],
          ['long', 'Long', 'ArrayList<Long>'],
        ]}
      />
      <Paragraph>
        Java 5 之后支持<Text bold>自动装箱 / 拆箱</Text>：
        向 <InlineCode>ArrayList&lt;Integer&gt;</InlineCode> 中 <InlineCode>add(3)</InlineCode> 时，
        字面量 <InlineCode>3</InlineCode> 会自动包装成 <InlineCode>Integer</InlineCode> 对象；
        取出时也会自动还原成 <InlineCode>int</InlineCode>，无需手动转换。
      </Paragraph>
    </Callout>

    <Heading3>4. 六个核心方法</Heading3>
    <Table
      head={['方法', '说明', '返回值']}
      rows={[
        ['add(E e)', '在集合末尾追加元素 e', 'boolean（一般忽略）'],
        ['add(int index, E e)', '在指定索引 index 处插入元素 e，原元素后移', 'void'],
        ['get(int index)', '获取索引 index 处的元素', 'E（集合的元素类型）'],
        ['size()', '返回集合中当前元素的个数', 'int'],
        ['remove(int index)', '删除索引 index 处的元素，后续元素前移，并返回被删除的元素', 'E'],
        ['set(int index, E e)', '把索引 index 处的元素替换为 e，返回被替换的旧元素', 'E'],
      ]}
    />
    <Callout type="tip" title="索引从 0 开始，与数组一致">
      ArrayList 的索引规则与数组相同，第一个元素索引为 0，最后一个元素索引为
      <InlineCode>size() - 1</InlineCode>。访问不存在的索引会抛出
      <InlineCode>IndexOutOfBoundsException</InlineCode>。
    </Callout>

    <Heading3>5. 遍历 ArrayList</Heading3>
    <Paragraph>
      ArrayList 没有 <InlineCode>.length</InlineCode> 属性，用 <InlineCode>size()</InlineCode> 方法获取元素个数。
      常用两种遍历方式：
    </Paragraph>
    <Table
      head={['遍历方式', '代码形式', '说明']}
      rows={[
        ['普通 for', 'for (int i = 0; i < list.size(); i++) { list.get(i); }', '需要用到索引时选用'],
        ['增强 for（for-each）', 'for (String s : list) { ... }', '只需逐个访问元素时更简洁'],
      ]}
    />

    <Heading3>6. 示例代码</Heading3>
    <Heading4>示例 1：存储字符串，演示全部核心方法</Heading4>
    <CodeBlock
      title="ArrayListStringDemo.java"
      code={`import java.util.ArrayList;

public class ArrayListStringDemo {
    public static void main(String[] args) {
        // 创建存储 String 的 ArrayList
        ArrayList<String> list = new ArrayList<>();

        // add(E e)：追加元素
        list.add("Java");
        list.add("Python");
        list.add("C++");
        System.out.println("初始集合：" + list);
        System.out.println("元素个数：" + list.size());  // size()

        // add(int index, E e)：在索引 1 处插入 "Go"，原来的 "Python" 后移
        list.add(1, "Go");
        System.out.println("插入后：" + list);

        // get(int index)：获取索引 2 的元素
        String third = list.get(2);
        System.out.println("索引 2 的元素：" + third);

        // set(int index, E e)：把索引 0 的 "Java" 改为 "Kotlin"
        String old = list.set(0, "Kotlin");
        System.out.println("被替换的旧元素：" + old);
        System.out.println("修改后：" + list);

        // remove(int index)：删除索引 2 的元素
        String removed = list.remove(2);
        System.out.println("被删除的元素：" + removed);
        System.out.println("删除后：" + list);

        // 普通 for 遍历
        System.out.println("=== 普通 for 遍历 ===");
        for (int i = 0; i < list.size(); i++) {
            System.out.println(i + " -> " + list.get(i));
        }

        // 增强 for 遍历
        System.out.println("=== 增强 for 遍历 ===");
        for (String s : list) {
            System.out.println(s);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`初始集合：[Java, Python, C++]
元素个数：3
插入后：[Java, Go, Python, C++]
索引 2 的元素：Python
被替换的旧元素：Java
修改后：[Kotlin, Go, Python, C++]
被删除的元素：Python
删除后：[Kotlin, Go, C++]
=== 普通 for 遍历 ===
0 -> Kotlin
1 -> Go
2 -> C++
=== 增强 for 遍历 ===
Kotlin
Go
C++`}
    />
    <Callout type="warning" title="直接打印 ArrayList 会输出 [元素1, 元素2, ...] 格式">
      <InlineCode>System.out.println(list)</InlineCode> 会自动调用 ArrayList 的
      <InlineCode>toString()</InlineCode> 方法，输出形如
      <InlineCode>[Java, Python, C++]</InlineCode> 的字符串，非常直观，调试时很方便。
    </Callout>

    <Heading4>示例 2：存储整数——使用包装类 Integer</Heading4>
    <CodeBlock
      title="ArrayListIntDemo.java"
      code={`import java.util.ArrayList;

public class ArrayListIntDemo {
    public static void main(String[] args) {
        // 存整数必须用 Integer，不能写 int
        ArrayList<Integer> numbers = new ArrayList<>();

        // 自动装箱：字面量 int 自动转成 Integer 存入
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);

        System.out.println("集合：" + numbers);
        System.out.println("元素个数：" + numbers.size());

        // 自动拆箱：get() 返回 Integer，赋给 int 变量时自动拆箱
        int first = numbers.get(0);
        System.out.println("第一个元素：" + first);

        // 修改第二个元素（索引 1）
        numbers.set(1, 99);
        System.out.println("修改后：" + numbers);

        // 删除索引 3 的元素（值 40）
        numbers.remove(3);
        System.out.println("删除后：" + numbers);

        // 求所有元素的总和
        int sum = 0;
        for (int n : numbers) {
            sum += n;   // 自动拆箱
        }
        System.out.println("总和：" + sum);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`集合：[10, 20, 30, 40]
元素个数：4
第一个元素：10
修改后：[10, 99, 30, 40]
删除后：[10, 99, 30]
总和：139`}
    />
    <Paragraph>
      注意 <InlineCode>numbers.remove(3)</InlineCode> 传入的是<Text bold>索引 3</Text>（删除第四个元素 40），
      而不是"删除值为 3 的元素"。
      对于 <InlineCode>ArrayList&lt;Integer&gt;</InlineCode>，如果想按<Text bold>值</Text>删除，
      需要传 <InlineCode>Integer</InlineCode> 对象：<InlineCode>numbers.remove(Integer.valueOf(30))</InlineCode>。
    </Paragraph>

    <Heading4>示例 3：存储自定义对象 Student</Heading4>
    <Paragraph>
      ArrayList 同样可以存储自定义类的对象，用法与存 String / Integer 完全一致。
      本例复用上节定义的 <InlineCode>Student</InlineCode> 类（含 name、age 字段及 getter 方法）。
    </Paragraph>
    <CodeBlock
      title="ArrayListStudentDemo.java"
      code={`import java.util.ArrayList;

public class ArrayListStudentDemo {
    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();

        // 添加学生对象
        students.add(new Student("张三", 20));
        students.add(new Student("李四", 21));
        students.add(new Student("王五", 19));

        System.out.println("学生列表（共 " + students.size() + " 人）：");
        for (Student s : students) {
            System.out.println("  " + s.getName() + "，" + s.getAge() + " 岁");
        }

        // 修改第二个学生（索引 1）
        students.set(1, new Student("陈六", 22));
        System.out.println("修改后第二个学生：" + students.get(1).getName());

        // 删除第一个学生（索引 0）
        Student removed = students.remove(0);
        System.out.println("删除了：" + removed.getName());
        System.out.println("剩余 " + students.size() + " 人");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`学生列表（共 3 人）：
  张三，20 岁
  李四，21 岁
  王五，19 岁
修改后第二个学生：陈六
删除了：张三
剩余 2 人`}
    />

    <Callout type="success" title="小结">
      <Paragraph>
        ArrayList 使用要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>导包 <InlineCode>import java.util.ArrayList;</InlineCode>，泛型写引用类型。</ListItem>
        <ListItem>基本类型用包装类：<InlineCode>int → Integer</InlineCode>，<InlineCode>double → Double</InlineCode>。</ListItem>
        <ListItem>六个核心方法：<InlineCode>add</InlineCode>、<InlineCode>add(index, e)</InlineCode>、<InlineCode>get</InlineCode>、<InlineCode>size</InlineCode>、<InlineCode>remove</InlineCode>、<InlineCode>set</InlineCode>。</ListItem>
        <ListItem>用 <InlineCode>size()</InlineCode> 取长度（不是 <InlineCode>.length</InlineCode>），索引从 0 开始。</ListItem>
        <ListItem>直接 <InlineCode>println(list)</InlineCode> 可打印 <InlineCode>[元素1, 元素2, ...]</InlineCode> 格式，方便调试。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：创建城市列表并演示增删改查"
      code={`// 要求：
// 1. 创建 ArrayList<String> 存储三座城市：北京、上海、广州。
// 2. 在索引 1 处插入"深圳"。
// 3. 将索引 3 处的元素（广州）改为"杭州"。
// 4. 删除索引 0 的元素，打印被删除的城市名。
// 5. 打印最终集合内容与元素个数。

import java.util.ArrayList;

public class Exercise01 {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise01 {
    public static void main(String[] args) {
        ArrayList<String> cities = new ArrayList<>();
        cities.add("北京");
        cities.add("上海");
        cities.add("广州");

        cities.add(1, "深圳");           // 插入后：[北京, 深圳, 上海, 广州]
        cities.set(3, "杭州");           // 修改后：[北京, 深圳, 上海, 杭州]

        String removed = cities.remove(0);   // 删除后：[深圳, 上海, 杭州]
        System.out.println("删除的城市：" + removed);
        System.out.println("最终集合：" + cities);
        System.out.println("元素个数：" + cities.size());
    }
}

/* 控制台输出：
删除的城市：北京
最终集合：[深圳, 上海, 杭州]
元素个数：3

解析：add(1,"深圳") 在索引 1 插入，原上海、广州后移；
      set(3,"杭州") 把广州替换为杭州；remove(0) 删除北京并返回其值。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：遍历 ArrayList<Integer> 求最大值"
      code={`// 要求：
// 1. 创建 ArrayList<Integer>，存入 5 个整数：34、12、78、56、90。
// 2. 遍历集合，找出其中最大值并打印。

import java.util.ArrayList;

public class Exercise02 {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise02 {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(34);
        nums.add(12);
        nums.add(78);
        nums.add(56);
        nums.add(90);

        int max = nums.get(0);   // 先假设第一个是最大值
        for (int i = 1; i < nums.size(); i++) {
            if (nums.get(i) > max) {
                max = nums.get(i);
            }
        }
        System.out.println("最大值：" + max);
    }
}

/* 控制台输出：
最大值：90

解析：max 初始为 34，遍历时依次比较 12（不更新）、78（更新 max=78）、
      56（不更新）、90（更新 max=90），最终输出 90。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：用 ArrayList<Student> 按姓名查找学生"
      code={`// 要求：
// 1. 向 ArrayList<Student> 中添加 4 个学生。
// 2. 编写方法 findByName(ArrayList<Student> list, String name)，
//    遍历集合，找到姓名匹配的学生返回，找不到返回 null。
// 3. 在 main 中分别查找"王五"和"不存在"，打印结果。

import java.util.ArrayList;

public class Exercise03 {

    public static Student findByName(ArrayList<Student> list, String name) {
        // 请补全代码
    }

    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise03 {

    public static Student findByName(ArrayList<Student> list, String name) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getName().equals(name)) {
                return list.get(i);   // 找到立即返回
            }
        }
        return null;   // 遍历完未找到，返回 null
    }

    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("张三", 20));
        students.add(new Student("李四", 21));
        students.add(new Student("王五", 19));
        students.add(new Student("赵六", 23));

        Student s1 = findByName(students, "王五");
        if (s1 != null) {
            System.out.println("找到：" + s1.getName() + "，年龄 " + s1.getAge());
        } else {
            System.out.println("未找到");
        }

        Student s2 = findByName(students, "不存在");
        if (s2 != null) {
            System.out.println("找到：" + s2.getName());
        } else {
            System.out.println("未找到该学生");
        }
    }
}

/* 控制台输出：
找到：王五，年龄 19
未找到该学生

解析：字符串比较必须用 equals() 而非 ==，== 比较的是引用地址，
      equals() 比较的是字符串内容，这里要匹配姓名内容，所以用 equals()。
*/`}
    />
  </article>
);

export default index;
