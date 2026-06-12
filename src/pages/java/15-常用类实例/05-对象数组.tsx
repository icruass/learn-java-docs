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
    <Title>对象数组</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面学过数组可以存储 <InlineCode>int</InlineCode>、<InlineCode>double</InlineCode> 等基本类型，
        其实数组同样可以存储<Text bold>对象</Text>。
        对象数组的每个元素保存的是对象的<Text bold>引用（地址）</Text>，而不是对象本身。
        本节从定义、初始化、赋值到遍历逐步讲透对象数组的用法，
        并在最后点出数组长度固定的局限性，为引入 ArrayList 做铺垫。
      </Paragraph>
    </Callout>

    <Heading3>1. 对象数组是什么</Heading3>
    <Paragraph>
      数组的元素类型不限于基本类型，任何类（包括自定义类）都可以作为数组的元素类型。
      这样的数组就叫做<Text bold>对象数组</Text>。
      需要特别理解的是：对象数组的每个槽位存放的是对象的<Text bold>引用（内存地址）</Text>，
      而不是对象数据本身。就好比一排储物柜，每个柜子里只放了一张"地址条"，
      凭地址条才能找到真正的物品（对象）。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        基本类型数组（如 <InlineCode>int[]</InlineCode>）：每个元素直接存储数值，如 <InlineCode>3</InlineCode>、<InlineCode>100</InlineCode>。
      </ListItem>
      <ListItem>
        对象数组（如 <InlineCode>Student[]</InlineCode>）：每个元素存储的是指向 Student 对象的<Text bold>引用</Text>，对象本身在堆内存中。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 对象数组的定义与默认值</Heading3>
    <Paragraph>
      定义格式与基本类型数组完全相同，只是元素类型换成类名：
    </Paragraph>
    <CodeBlock
      language="text"
      title="对象数组定义格式"
      code={`类名[] 数组名 = new 类名[长度];`}
    />
    <Paragraph>
      例如，创建一个能存放 3 个 Student 对象的数组：
    </Paragraph>
    <CodeBlock
      language="text"
      title="示例"
      code={`Student[] arr = new Student[3];`}
    />
    <Callout type="warning" title="刚创建时所有元素默认为 null">
      执行 <InlineCode>new Student[3]</InlineCode> 后，数组有 3 个槽位，
      但每个槽位的初始值都是 <InlineCode>null</InlineCode>，
      意味着<Text bold>还没有指向任何 Student 对象</Text>。
      若在赋值前就通过某个元素调用方法（如 <InlineCode>arr[0].getName()</InlineCode>），
      会抛出 <Text bold>NullPointerException（空指针异常）</Text>。
    </Callout>
    <Table
      head={['操作', '数组状态', '说明']}
      rows={[
        ['Student[] arr = new Student[3];', 'arr[0]=null, arr[1]=null, arr[2]=null', '三个槽位全部为 null，尚未存入任何对象'],
        ['arr[0] = new Student("张三", 20);', 'arr[0]=Student@地址, arr[1]=null, arr[2]=null', 'arr[0] 指向一个堆中的 Student 对象'],
        ['arr[1] = new Student("李四", 21);', 'arr[0]=Student@地址, arr[1]=Student@地址, arr[2]=null', '依次填入对象引用'],
      ]}
    />

    <Heading3>3. 往对象数组里放对象</Heading3>
    <Paragraph>
      通过<Text bold>索引赋值</Text>，将 <InlineCode>new</InlineCode> 出来的对象存入对应槽位。
      赋值后，该槽位就持有了这个对象的引用，后续可以通过数组索引访问该对象的所有成员。
    </Paragraph>
    <CodeBlock
      language="text"
      title="赋值格式"
      code={`数组名[索引] = new 类名(构造参数);`}
    />

    <Heading3>4. 遍历对象数组并调用成员</Heading3>
    <Paragraph>
      遍历方式与基本类型数组相同，用 <InlineCode>for</InlineCode> 循环配合
      <InlineCode>arr.length</InlineCode> 或增强 for 循环（for-each）均可。
      取出元素后，用 <InlineCode>.</InlineCode> 运算符调用对象的方法或访问字段。
    </Paragraph>
    <Table
      head={['遍历方式', '语法', '适用场景']}
      rows={[
        ['普通 for', 'for (int i = 0; i < arr.length; i++)', '需要使用索引 i 时'],
        ['增强 for（for-each）', 'for (Student s : arr)', '只需要逐个访问元素，不需要索引时'],
      ]}
    />

    <Heading3>5. 数组长度固定的局限</Heading3>
    <Paragraph>
      数组一旦创建，<Text bold>长度就固定无法改变</Text>。
      如果需要新增第 4 个 Student，就必须创建一个更大的新数组，再把旧数据复制过去，非常繁琐。
      实际开发中常常需要动态地增删元素，这时候就需要使用长度可变的集合——
      <Text bold>ArrayList</Text>（下节介绍）。
    </Paragraph>
    <UnorderedList>
      <ListItem>无法直接扩容：必须新建更大数组并手动复制元素。</ListItem>
      <ListItem>没有内置的 add / remove 方法，增删操作需要自己移动元素。</ListItem>
      <ListItem>长度固定时优先用数组；需要频繁增删时优先用 ArrayList。</ListItem>
    </UnorderedList>

    <Heading3>6. 示例代码</Heading3>
    <Heading4>示例 1：完整的 Student 类 + 对象数组基本操作</Heading4>
    <Paragraph>
      先定义一个简单的 <InlineCode>Student</InlineCode> 类（含两个字段、构造方法、getter 方法），
      再在主类中创建对象数组、赋值、遍历。
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`public class Student {
    private String name;
    private int age;

    // 构造方法
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // getter 方法
    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // 方便打印时直接显示对象信息
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}`}
    />
    <CodeBlock
      title="ObjectArrayDemo.java"
      code={`public class ObjectArrayDemo {
    public static void main(String[] args) {
        // 1. 创建能存放 3 个 Student 的对象数组，此时元素全为 null
        Student[] arr = new Student[3];

        // 2. 依次创建 Student 对象并存入数组
        arr[0] = new Student("张三", 20);
        arr[1] = new Student("李四", 21);
        arr[2] = new Student("王五", 19);

        // 3. 普通 for 循环遍历，通过索引取出对象并调用成员方法
        System.out.println("=== 普通 for 遍历 ===");
        for (int i = 0; i < arr.length; i++) {
            System.out.println("第" + (i + 1) + "个学生：" + arr[i].getName()
                    + "，年龄：" + arr[i].getAge());
        }

        // 4. 增强 for 循环遍历（for-each），直接得到每个 Student 对象
        System.out.println("=== 增强 for 遍历 ===");
        for (Student s : arr) {
            System.out.println(s);  // 调用 toString()
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 普通 for 遍历 ===
第1个学生：张三，年龄：20
第2个学生：李四，年龄：21
第3个学生：王五，年龄：19
=== 增强 for 遍历 ===
Student{name='张三', age=20}
Student{name='李四', age=21}
Student{name='王五', age=19}`}
    />
    <Paragraph>
      执行过程：<InlineCode>new Student[3]</InlineCode> 在堆上开辟三个槽位，
      初始均为 <InlineCode>null</InlineCode>；随后三次赋值让每个槽位分别指向新建的 Student 对象。
      遍历时，<InlineCode>arr[i]</InlineCode> 拿到引用，再通过 <InlineCode>.</InlineCode> 访问其方法。
    </Paragraph>

    <Heading4>示例 2：未赋值元素为 null——演示 NullPointerException</Heading4>
    <Paragraph>
      下面故意只填入前两个槽位，第三个保持 <InlineCode>null</InlineCode>，访问时会抛出异常，帮助直观理解。
    </Paragraph>
    <CodeBlock
      title="NullDemo.java"
      code={`public class NullDemo {
    public static void main(String[] args) {
        Student[] arr = new Student[3];
        arr[0] = new Student("张三", 20);
        arr[1] = new Student("李四", 21);
        // arr[2] 未赋值，仍为 null

        for (int i = 0; i < arr.length; i++) {
            // 安全写法：先判断不为 null 再访问
            if (arr[i] != null) {
                System.out.println(arr[i].getName());
            } else {
                System.out.println("第" + (i + 1) + "个槽位为 null，跳过");
            }
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`张三
李四
第3个槽位为 null，跳过`}
    />
    <Paragraph>
      通过 <InlineCode>if (arr[i] != null)</InlineCode> 判断可以避免
      <InlineCode>NullPointerException</InlineCode>。
      这是访问对象数组时的<Text bold>安全写法</Text>，实际开发中必须养成此习惯。
    </Paragraph>

    <Heading4>示例 3：体验数组长度固定的局限</Heading4>
    <Paragraph>
      数组已满时若想再添加一个元素，必须手动创建更大的数组并复制，非常繁琐。
    </Paragraph>
    <CodeBlock
      title="ArrayLimitDemo.java"
      code={`public class ArrayLimitDemo {
    public static void main(String[] args) {
        // 原始数组，容量只有 2
        Student[] arr = new Student[2];
        arr[0] = new Student("张三", 20);
        arr[1] = new Student("李四", 21);

        // 想再加一个"王五"——数组已满，只能新建更大的数组并复制
        Student[] newArr = new Student[3];
        for (int i = 0; i < arr.length; i++) {
            newArr[i] = arr[i];          // 把旧数据复制过去
        }
        newArr[2] = new Student("王五", 19);  // 存入新元素
        arr = newArr;                         // 让 arr 指向新数组

        System.out.println("扩容后共 " + arr.length + " 个学生：");
        for (Student s : arr) {
            System.out.println(s);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`扩容后共 3 个学生：
Student{name='张三', age=20}
Student{name='李四', age=21}
Student{name='王五', age=19}`}
    />
    <Callout type="tip" title="引出 ArrayList">
      上面的扩容代码既冗长又容易出错。Java 提供了 <Text bold>ArrayList</Text> 集合，
      它在内部自动完成扩容，提供了 <InlineCode>add()</InlineCode>、
      <InlineCode>remove()</InlineCode> 等便捷方法，
      彻底解放了我们对数组长度的手动管理。下节正式介绍。
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：创建并遍历手机对象数组"
      code={`// 要求：
// 1. 定义 Phone 类，包含 brand（品牌，String）和 price（价格，double）两个字段，
//    提供带参构造方法和 toString() 方法（格式：Phone{brand='xx', price=xx.x}）。
// 2. 在 main 中创建长度为 3 的 Phone[]，分别存入三部手机。
// 3. 用增强 for 循环遍历，打印每部手机信息。

public class Phone {
    // 请补全字段、构造方法、toString()
}

public class Exercise01 {
    public static void main(String[] args) {
        // 请补全对象数组创建、赋值与遍历代码
    }
}`}
      answerCode={`public class Phone {
    private String brand;
    private double price;

    public Phone(String brand, double price) {
        this.brand = brand;
        this.price = price;
    }

    public String toString() {
        return "Phone{brand='" + brand + "', price=" + price + "}";
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Phone[] phones = new Phone[3];
        phones[0] = new Phone("华为", 4999.0);
        phones[1] = new Phone("小米", 2999.0);
        phones[2] = new Phone("苹果", 7999.0);

        for (Phone p : phones) {
            System.out.println(p);
        }
    }
}

/* 控制台输出：
Phone{brand='华为', price=4999.0}
Phone{brand='小米', price=2999.0}
Phone{brand='苹果', price=7999.0}

解析：new Phone[3] 创建含 3 个 null 槽位的数组，
      三次赋值后分别指向三个 Phone 对象，增强 for 依次取出并调用 toString()。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：找出对象数组中年龄最大的学生"
      code={`// 要求：给定 Student[] arr（已包含 4 个学生），
// 编写方法 findOldest(Student[] arr)，返回年龄最大的 Student 对象。
// 在 main 中调用并打印其姓名与年龄。

public class Exercise02 {

    public static Student findOldest(Student[] arr) {
        // 请补全代码
    }

    public static void main(String[] args) {
        Student[] arr = new Student[4];
        arr[0] = new Student("张三", 20);
        arr[1] = new Student("李四", 25);
        arr[2] = new Student("王五", 19);
        arr[3] = new Student("赵六", 23);

        Student oldest = findOldest(arr);
        System.out.println("年龄最大的学生：" + oldest.getName() + "，年龄：" + oldest.getAge());
    }
}`}
      answerCode={`public class Exercise02 {

    public static Student findOldest(Student[] arr) {
        Student max = arr[0];          // 假设第一个是最大的
        for (int i = 1; i < arr.length; i++) {
            if (arr[i].getAge() > max.getAge()) {
                max = arr[i];          // 找到更大的，更新 max
            }
        }
        return max;
    }

    public static void main(String[] args) {
        Student[] arr = new Student[4];
        arr[0] = new Student("张三", 20);
        arr[1] = new Student("李四", 25);
        arr[2] = new Student("王五", 19);
        arr[3] = new Student("赵六", 23);

        Student oldest = findOldest(arr);
        System.out.println("年龄最大的学生：" + oldest.getName() + "，年龄：" + oldest.getAge());
    }
}

/* 控制台输出：
年龄最大的学生：李四，年龄：25

解析：max 从 arr[0] 出发，依次与后续元素比较年龄，
      发现李四（25）> 张三（20），更新 max；
      王五（19）和赵六（23）均不超过 25，max 保持为李四。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：将数组中分数低于 60 的学生筛选出来"
      code={`// 要求：定义 ScoreStudent 类，包含 name（String）和 score（int）字段，
// 构造方法和 toString()（格式：ScoreStudent{name='xx', score=xx}）。
// 在 main 中创建含 5 个 ScoreStudent 的数组，遍历时打印所有不及格（score < 60）的学生信息。

public class Exercise03 {
    public static void main(String[] args) {
        // 请补全代码
        // 5 个学生分数参考：张三 85、李四 42、王五 90、赵六 55、孙七 78
    }
}`}
      answerCode={`public class ScoreStudent {
    private String name;
    private int score;

    public ScoreStudent(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public int getScore() { return score; }

    public String toString() {
        return "ScoreStudent{name='" + name + "', score=" + score + "}";
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        ScoreStudent[] arr = new ScoreStudent[5];
        arr[0] = new ScoreStudent("张三", 85);
        arr[1] = new ScoreStudent("李四", 42);
        arr[2] = new ScoreStudent("王五", 90);
        arr[3] = new ScoreStudent("赵六", 55);
        arr[4] = new ScoreStudent("孙七", 78);

        System.out.println("不及格学生：");
        for (ScoreStudent s : arr) {
            if (s.getScore() < 60) {
                System.out.println(s);
            }
        }
    }
}

/* 控制台输出：
不及格学生：
ScoreStudent{name='李四', score=42}
ScoreStudent{name='赵六', score=55}

解析：遍历时对每个对象调用 getScore()，小于 60 才打印，
      李四 42 和赵六 55 满足条件，张三 85、王五 90、孙七 78 不满足，不打印。
*/`}
    />
  </article>
);

export default index;
