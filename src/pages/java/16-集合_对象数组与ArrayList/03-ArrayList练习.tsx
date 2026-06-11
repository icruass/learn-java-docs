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
    <Title>ArrayList 综合练习</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节通过四道由浅入深的综合示例，把 ArrayList 的常见用法串联起来：
        ①用 <InlineCode>ArrayList&lt;Integer&gt;</InlineCode> 存储随机数并遍历；
        ②自定义方法按指定格式打印集合；
        ③用 <InlineCode>ArrayList&lt;Student&gt;</InlineCode> 存储对象并遍历；
        ④筛选偶数元素存入新集合并返回。
        每个示例先给出完整代码与输出，再附讲解，最后是 3 道动手练习题。
      </Paragraph>
    </Callout>

    <Heading3>1. 练习一：存储随机数并遍历</Heading3>
    <Paragraph>
      用 <InlineCode>Math.random()</InlineCode> 生成指定范围内的随机整数，依次添加到
      <InlineCode>ArrayList&lt;Integer&gt;</InlineCode>，再遍历打印每个元素及其索引。
    </Paragraph>
    <Callout type="tip" title="生成 [min, max] 范围内的随机整数公式">
      <InlineCode>(int)(Math.random() * (max - min + 1)) + min</InlineCode>
    </Callout>
    <CodeBlock
      title="RandomNumberList.java"
      code={`import java.util.ArrayList;

public class RandomNumberList {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();

        // 生成 5 个 [1, 100] 之间的随机整数并加入集合
        for (int i = 0; i < 5; i++) {
            int num = (int)(Math.random() * 100) + 1;
            list.add(num);
        }

        System.out.println("随机数集合：" + list);
        System.out.println("共 " + list.size() + " 个元素");

        // 遍历，打印每个元素的索引与值
        System.out.println("逐个打印：");
        for (int i = 0; i < list.size(); i++) {
            System.out.println("  索引 " + i + " -> " + list.get(i));
        }

        // 求所有随机数之和
        int sum = 0;
        for (int n : list) {
            sum += n;
        }
        System.out.println("总和：" + sum);
        System.out.println("平均值：" + (double) sum / list.size());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（随机数每次运行不同，以下为示例）"
      code={`随机数集合：[47, 83, 12, 65, 29]
共 5 个元素
逐个打印：
  索引 0 -> 47
  索引 1 -> 83
  索引 2 -> 12
  索引 3 -> 65
  索引 4 -> 29
总和：236
平均值：47.2`}
    />
    <Paragraph>
      注意求平均值时写 <InlineCode>(double) sum / list.size()</InlineCode>，
      将 <InlineCode>sum</InlineCode> 强制转为 <InlineCode>double</InlineCode> 再做除法，
      否则两个 <InlineCode>int</InlineCode> 相除会丢失小数部分。
    </Paragraph>

    <Heading3>2. 练习二：自定义按指定格式打印集合的方法</Heading3>
    <Paragraph>
      直接 <InlineCode>println(list)</InlineCode> 输出的是 <InlineCode>[Java, Python, C++]</InlineCode> 格式。
      现在要求自定义输出格式，例如 <InlineCode>[元素1, 元素2, 元素3]</InlineCode>（与默认一样）
      或者更灵活的 <InlineCode>元素1 | 元素2 | 元素3</InlineCode>。
      通过自定义方法，可以支持任意分隔符，复用性更强。
    </Paragraph>
    <CodeBlock
      title="PrintListDemo.java"
      code={`import java.util.ArrayList;

public class PrintListDemo {

    /**
     * 按 "[元素1, 元素2, ...]" 格式打印 ArrayList<String>
     */
    public static void printList(ArrayList<String> list) {
        System.out.print("[");
        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i));
            if (i < list.size() - 1) {
                System.out.print(", ");   // 最后一个元素后面不加逗号
            }
        }
        System.out.println("]");
    }

    /**
     * 按指定分隔符打印 ArrayList<String>
     */
    public static void printListWithSep(ArrayList<String> list, String sep) {
        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i));
            if (i < list.size() - 1) {
                System.out.print(sep);
            }
        }
        System.out.println();   // 换行
    }

    public static void main(String[] args) {
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("苹果");
        fruits.add("香蕉");
        fruits.add("橙子");
        fruits.add("葡萄");

        System.out.print("默认格式打印：");
        printList(fruits);

        System.out.print("竖线分隔：");
        printListWithSep(fruits, " | ");

        System.out.print("箭头分隔：");
        printListWithSep(fruits, " -> ");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`默认格式打印：[苹果, 香蕉, 橙子, 葡萄]
竖线分隔：苹果 | 香蕉 | 橙子 | 葡萄
箭头分隔：苹果 -> 香蕉 -> 橙子 -> 葡萄`}
    />
    <Paragraph>
      关键技巧：在循环内判断 <InlineCode>i &lt; list.size() - 1</InlineCode>，
      只在非最后一个元素后面打印分隔符，避免末尾多出一个多余的分隔符。
    </Paragraph>

    <Heading3>3. 练习三：存储自定义对象并遍历</Heading3>
    <Paragraph>
      将多个 <InlineCode>Student</InlineCode> 对象存入 <InlineCode>ArrayList&lt;Student&gt;</InlineCode>，
      遍历时分别调用对象的 getter 方法，格式化输出每位学生的信息。
      同时演示如何统计集合中满足特定条件的对象数量。
    </Paragraph>
    <CodeBlock
      title="StudentListDemo.java"
      code={`import java.util.ArrayList;

public class StudentListDemo {
    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("张三", 20));
        students.add(new Student("李四", 17));
        students.add(new Student("王五", 22));
        students.add(new Student("赵六", 19));
        students.add(new Student("孙七", 25));

        // 遍历并格式化打印
        System.out.println("===== 学生名单 =====");
        for (int i = 0; i < students.size(); i++) {
            Student s = students.get(i);
            System.out.println((i + 1) + ". " + s.getName()
                    + "（" + s.getAge() + " 岁）");
        }

        // 统计 18 岁及以上的学生人数（成年人）
        int adultCount = 0;
        for (Student s : students) {
            if (s.getAge() >= 18) {
                adultCount++;
            }
        }
        System.out.println("共 " + students.size() + " 名学生，"
                + "其中成年（18岁+）：" + adultCount + " 人");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`===== 学生名单 =====
1. 张三（20 岁）
2. 李四（17 岁）
3. 王五（22 岁）
4. 赵六（19 岁）
5. 孙七（25 岁）
共 5 名学生，其中成年（18岁+）：4 人`}
    />
    <Paragraph>
      张三 20、王五 22、赵六 19、孙七 25 均满足年龄 &gt;= 18，共 4 人；李四 17 岁不满足，不计入。
    </Paragraph>

    <Heading3>4. 练习四：筛选偶数存入新集合并返回</Heading3>
    <Paragraph>
      编写方法 <InlineCode>filterEven</InlineCode>，接收一个 <InlineCode>ArrayList&lt;Integer&gt;</InlineCode>，
      遍历其中每个元素，将偶数收集到一个<Text bold>新集合</Text>中并返回。
      原集合不做任何修改。这是集合操作中非常常见的"筛选"模式。
    </Paragraph>
    <CodeBlock
      title="FilterEvenDemo.java"
      code={`import java.util.ArrayList;

public class FilterEvenDemo {

    /**
     * 从 source 中筛选出所有偶数，存入新集合并返回；原集合不变。
     */
    public static ArrayList<Integer> filterEven(ArrayList<Integer> source) {
        ArrayList<Integer> result = new ArrayList<>();
        for (int i = 0; i < source.size(); i++) {
            int num = source.get(i);
            if (num % 2 == 0) {
                result.add(num);   // 是偶数，加入结果集合
            }
        }
        return result;
    }

    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(3);
        numbers.add(8);
        numbers.add(15);
        numbers.add(20);
        numbers.add(7);
        numbers.add(12);
        numbers.add(5);
        numbers.add(6);

        System.out.println("原集合：" + numbers);

        ArrayList<Integer> evens = filterEven(numbers);
        System.out.println("筛选出的偶数：" + evens);
        System.out.println("原集合未变：" + numbers);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`原集合：[3, 8, 15, 20, 7, 12, 5, 6]
筛选出的偶数：[8, 20, 12, 6]
原集合未变：[3, 8, 15, 20, 7, 12, 5, 6]`}
    />
    <Paragraph>
      <InlineCode>filterEven</InlineCode> 方法内部新建了一个 <InlineCode>result</InlineCode> 集合，
      只将符合条件（<InlineCode>num % 2 == 0</InlineCode>）的元素加入其中，
      最后返回这个新集合。<Text bold>原集合 source 没有被修改</Text>，这种"不破坏原数据，生成新结果"
      的写法在实际开发中非常重要。
    </Paragraph>
    <Callout type="tip" title="同样的模式可以扩展到任意筛选条件">
      将判断条件换成其他逻辑（如大于某阈值、字符串以某字母开头、对象的某字段满足条件等），
      就能复用同样的框架实现各种筛选需求。
    </Callout>

    <Heading3>5. 综合知识回顾</Heading3>
    <Table
      head={['场景', '做法', '注意点']}
      rows={[
        ['存整数', 'ArrayList<Integer>，自动装箱/拆箱', '不能写 ArrayList<int>'],
        ['存字符串', 'ArrayList<String>', '比较字符串内容用 equals()，不用 =='],
        ['存自定义对象', 'ArrayList<Student>（或任意类名）', '需要先定义好该类及其方法'],
        ['遍历', 'for + size()/get() 或增强 for', '不能用 .length，要用 size()'],
        ['筛选', '新建结果集合，满足条件才 add', '原集合保持不变，结果存新集合'],
        ['打印', 'println(list) 直接打印或自定义方法', '默认输出 [e1, e2, ...] 格式'],
      ]}
    />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：筛选长度大于 3 的字符串存入新集合"
      code={`// 要求：编写方法 filterLong(ArrayList<String> list)，
// 返回其中字符串长度大于 3 的元素组成的新 ArrayList<String>。
// main 中准备集合：["Hi", "Java", "Go", "Python", "C", "Kotlin"]，
// 调用方法并打印筛选结果。

import java.util.ArrayList;

public class Exercise01 {

    public static ArrayList<String> filterLong(ArrayList<String> list) {
        // 请补全代码
    }

    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise01 {

    public static ArrayList<String> filterLong(ArrayList<String> list) {
        ArrayList<String> result = new ArrayList<>();
        for (String s : list) {
            if (s.length() > 3) {
                result.add(s);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        ArrayList<String> words = new ArrayList<>();
        words.add("Hi");
        words.add("Java");
        words.add("Go");
        words.add("Python");
        words.add("C");
        words.add("Kotlin");

        ArrayList<String> longWords = filterLong(words);
        System.out.println("原集合：" + words);
        System.out.println("长度 > 3 的元素：" + longWords);
    }
}

/* 控制台输出：
原集合：[Hi, Java, Go, Python, C, Kotlin]
长度 > 3 的元素：[Java, Python, Kotlin]

解析：Hi(2)、Go(2)、C(1) 长度不超过 3；
      Java(4)、Python(6)、Kotlin(6) 长度大于 3，被加入结果集合。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：向 ArrayList 中添加 1~10，然后删除所有奇数"
      code={`// 要求：
// 1. 创建 ArrayList<Integer>，用循环添加 1~10 共 10 个整数。
// 2. 遍历集合，将其中所有奇数删除，只保留偶数。
// 3. 打印删除后的集合。
//
// 提示：遍历时删除元素需注意索引变化，可以倒序遍历或每次删除后 i--。

import java.util.ArrayList;

public class Exercise02 {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise02 {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            list.add(i);
        }
        System.out.println("删除前：" + list);

        // 倒序遍历删除，避免删除元素后索引错乱
        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i) % 2 != 0) {   // 是奇数
                list.remove(i);
            }
        }
        System.out.println("删除奇数后：" + list);
    }
}

/* 控制台输出：
删除前：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
删除奇数后：[2, 4, 6, 8, 10]

解析：正序遍历删除时，删掉索引 i 的元素后，原来 i+1 的元素变成了索引 i，
      下一步 i++ 会跳过它，导致漏删。倒序遍历从末尾往前删，
      已处理的高索引元素不影响还未处理的低索引元素，所以不会漏删。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：统计 ArrayList<Student> 中各分数段人数"
      code={`// 要求：定义 ScoreStudent 类，包含 name（String）和 score（int）。
// 创建包含 6 名学生的集合，分数分别为：92, 75, 55, 88, 63, 47。
// 统计并打印：优秀（>=90）、良好（[75,90)）、及格（[60,75)）、不及格（<60）各段人数。

import java.util.ArrayList;

public class Exercise03 {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;

class ScoreStudent {
    private String name;
    private int score;

    public ScoreStudent(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
}

public class Exercise03 {
    public static void main(String[] args) {
        ArrayList<ScoreStudent> list = new ArrayList<>();
        list.add(new ScoreStudent("张三", 92));
        list.add(new ScoreStudent("李四", 75));
        list.add(new ScoreStudent("王五", 55));
        list.add(new ScoreStudent("赵六", 88));
        list.add(new ScoreStudent("孙七", 63));
        list.add(new ScoreStudent("周八", 47));

        int excellent = 0, good = 0, pass = 0, fail = 0;

        for (ScoreStudent s : list) {
            int sc = s.getScore();
            if (sc >= 90) {
                excellent++;
            } else if (sc >= 75) {
                good++;
            } else if (sc >= 60) {
                pass++;
            } else {
                fail++;
            }
        }

        System.out.println("共 " + list.size() + " 名学生");
        System.out.println("优秀（>=90）：" + excellent + " 人");
        System.out.println("良好（75-89）：" + good + " 人");
        System.out.println("及格（60-74）：" + pass + " 人");
        System.out.println("不及格（<60）：" + fail + " 人");
    }
}

/* 控制台输出：
共 6 名学生
优秀（>=90）：1 人
良好（75-89）：2 人
及格（60-74）：1 人
不及格（<60）：2 人

解析：92 -> 优秀；75、88 -> 良好；63 -> 及格；55、47 -> 不及格。
      用 if-else if 链按从高到低的区间判断，确保每个分数只落入一个分支。
*/`}
    />
  </article>
);

export default index;
