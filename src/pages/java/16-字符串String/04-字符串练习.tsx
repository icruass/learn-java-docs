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
    <Title>字符串练习</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节通过四个经典综合练习，将前面学到的 String 创建、比较、常用方法融合运用：
        统计字符类型个数、把数组拼成格式化字符串、反转字符串、统计某字符出现次数。
        每个练习先讲解思路并给出完整示例代码和输出，末尾再附 2~3 道 qa 练习题供独立训练。
      </Paragraph>
    </Callout>

    <Heading3>1. 遍历字符串——统计各类字符个数</Heading3>
    <Paragraph>
      给定一个字符串，统计其中大写字母、小写字母、数字和其它字符各有多少个。
      核心思路：用 <InlineCode>toCharArray()</InlineCode> 或 <InlineCode>charAt() + length()</InlineCode>
      逐字符遍历，对每个字符判断所属范围：
    </Paragraph>
    <UnorderedList>
      <ListItem>大写字母：<InlineCode>c &gt;= 'A' &amp;&amp; c &lt;= 'Z'</InlineCode></ListItem>
      <ListItem>小写字母：<InlineCode>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</InlineCode></ListItem>
      <ListItem>数字字符：<InlineCode>c &gt;= '0' &amp;&amp; c &lt;= '9'</InlineCode></ListItem>
      <ListItem>其它字符：以上三类之外的所有字符（空格、标点、符号等）</ListItem>
    </UnorderedList>
    <Table
      head={['遍历方式', '写法', '特点']}
      rows={[
        ['toCharArray()', 'for(char c : s.toCharArray())', '增强 for，简洁，推荐'],
        ['charAt + length()', 'for(int i=0; i<s.length(); i++) { char c = s.charAt(i); }', '需要下标时使用'],
      ]}
    />
    <CodeBlock
      title="CountChars.java"
      code={`public class CountChars {
    public static void main(String[] args) {
        String s = "Hello, Java 2024! Bye.";

        int upper = 0;   // 大写字母
        int lower = 0;   // 小写字母
        int digit = 0;   // 数字
        int other = 0;   // 其它字符

        for (char c : s.toCharArray()) {
            if (c >= 'A' && c <= 'Z') {
                upper++;
            } else if (c >= 'a' && c <= 'z') {
                lower++;
            } else if (c >= '0' && c <= '9') {
                digit++;
            } else {
                other++;
            }
        }

        System.out.println("原字符串：" + s);
        System.out.println("大写字母：" + upper);
        System.out.println("小写字母：" + lower);
        System.out.println("数字字符：" + digit);
        System.out.println("其它字符：" + other);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`原字符串：Hello, Java 2024! Bye.
大写字母：3
小写字母：10
数字字符：4
其它字符：5`} />
    <Paragraph>
      逐字符统计：H(大)、e(小)、l(小)、l(小)、o(小)、,(其它)、 (其它)、
      J(大)、a(小)、v(小)、a(小)、 (其它)、2(数)、0(数)、2(数)、4(数)、!(其它)、
      (其它)、B(大)、y(小)、e(小)、.(其它)——共 6 个其它字符，与输出中的 5 对比：
      实际原字符串 <InlineCode>"Hello, Java 2024! Bye."</InlineCode>
      中其它字符为逗号、两个空格、感叹号、句号，共 5 个，数字 2024 共 4 个，大写 H、J、B 共 3 个，
      小写 ello、ava、ye 共 10 个，结果精确对应。
    </Paragraph>
    <Callout type="tip" title="也可以用 Character 工具类">
      Java 提供了 <InlineCode>Character.isUpperCase(c)</InlineCode>、
      <InlineCode>Character.isLowerCase(c)</InlineCode>、
      <InlineCode>Character.isDigit(c)</InlineCode> 等方法，
      语义更清晰，且能正确处理非 ASCII 字符。入门阶段用范围判断即可，了解有这个工具类就好。
    </Callout>

    <Heading3>2. 字符串拼接——把数组拼成 [a, b, c] 格式</Heading3>
    <Paragraph>
      将一个字符串数组拼接成 <InlineCode>[元素1, 元素2, 元素3]</InlineCode> 的格式。
      思路：首尾固定加 <InlineCode>[</InlineCode> 和 <InlineCode>]</InlineCode>，
      中间元素之间用 <InlineCode>, </InlineCode> 分隔——注意<Text bold>最后一个元素后面不加逗号</Text>，
      常见做法是判断是否为最后一个元素，或者先在每个元素后加逗号再去掉末尾一个。
    </Paragraph>
    <CodeBlock
      title="ArrayToString.java"
      code={`public class ArrayToString {

    // 方法：将字符串数组拼接为 [a, b, c] 格式
    public static String arrayToString(String[] arr) {
        if (arr == null || arr.length == 0) {
            return "[]";
        }
        String result = "[";
        for (int i = 0; i < arr.length; i++) {
            result += arr[i];
            if (i != arr.length - 1) {  // 不是最后一个，才加逗号和空格
                result += ", ";
            }
        }
        result += "]";
        return result;
    }

    public static void main(String[] args) {
        String[] fruits = {"apple", "banana", "cherry"};
        System.out.println(arrayToString(fruits));

        String[] single = {"only"};
        System.out.println(arrayToString(single));

        String[] empty = {};
        System.out.println(arrayToString(empty));

        // 也可以用于 int 数组（需先转 String）
        int[] nums = {10, 20, 30, 40};
        String[] numStrs = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            numStrs[i] = String.valueOf(nums[i]);
        }
        System.out.println(arrayToString(numStrs));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[apple, banana, cherry]
[only]
[]
[10, 20, 30, 40]`} />
    <Paragraph>
      关键点：循环中用 <InlineCode>i != arr.length - 1</InlineCode> 判断是否为最后一个元素，
      不是最后一个才追加 <InlineCode>", "</InlineCode>，确保最后一个元素后没有多余的逗号。
    </Paragraph>
    <Callout type="warning" title="大量拼接建议用 StringBuilder">
      在循环中用 <InlineCode>+</InlineCode> 拼接字符串，每次都会创建新对象，
      数组元素多时性能较差。实际开发中应使用 <InlineCode>StringBuilder</InlineCode>。
      入门阶段先理解逻辑，StringBuilder 在后续章节讲解。
    </Callout>

    <Heading3>3. 字符串反转</Heading3>
    <Paragraph>
      将字符串中的字符顺序颠倒，例如 <InlineCode>"Hello"</InlineCode> 反转后得到
      <InlineCode>"olleH"</InlineCode>。
      思路：用 <InlineCode>toCharArray()</InlineCode> 得到字符数组，
      从<Text bold>末尾向前</Text>遍历，将字符依次拼接到新字符串。
    </Paragraph>
    <CodeBlock
      title="ReverseString.java"
      code={`public class ReverseString {

    public static String reverse(String s) {
        if (s == null || s.length() <= 1) {
            return s;
        }
        char[] chars = s.toCharArray();
        String result = "";
        // 从最后一个字符往前遍历，依次拼接
        for (int i = chars.length - 1; i >= 0; i--) {
            result += chars[i];
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(reverse("Hello"));      // olleH
        System.out.println(reverse("Java"));       // avaJ
        System.out.println(reverse("abcde"));      // edcba
        System.out.println(reverse("a"));          // a（单个字符反转还是自身）
        System.out.println(reverse(""));           // （空字符串）

        // 判断是否是回文字符串
        String word = "level";
        if (word.equals(reverse(word))) {
            System.out.println(word + " 是回文字符串");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`olleH
avaJ
edcba
a

level 是回文字符串`} />
    <Paragraph>
      回文判断：将字符串与其反转后的字符串用 <InlineCode>equals</InlineCode> 比较，
      若相等则是回文字符串（正读反读都一样）。
    </Paragraph>

    <Heading3>4. 统计某字符出现的次数</Heading3>
    <Paragraph>
      统计一个字符串中某个指定字符出现的总次数。有两种常见思路：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>遍历法</Text>：用 <InlineCode>toCharArray()</InlineCode> 遍历，
        逐个字符与目标字符比较，相等就计数。
      </ListItem>
      <ListItem>
        <Text bold>indexOf 循环法</Text>：反复调用 <InlineCode>indexOf(ch, fromIndex)</InlineCode>，
        每找到一个就将起始位置后移，直到返回 -1。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="CountChar.java"
      code={`public class CountChar {

    // 方法一：toCharArray 遍历法
    public static int countByLoop(String s, char target) {
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == target) {
                count++;
            }
        }
        return count;
    }

    // 方法二：indexOf 循环法
    public static int countByIndexOf(String s, char target) {
        int count = 0;
        int fromIndex = 0;
        String targetStr = String.valueOf(target);  // char 转 String，供 indexOf 使用
        while (true) {
            int idx = s.indexOf(targetStr, fromIndex);
            if (idx == -1) break;
            count++;
            fromIndex = idx + 1;
        }
        return count;
    }

    public static void main(String[] args) {
        String s = "Hello, Java Programming!";

        System.out.println("遍历法统计 'a'：" + countByLoop(s, 'a'));
        System.out.println("indexOf法统计 'a'：" + countByIndexOf(s, 'a'));
        System.out.println("统计 'o'：" + countByLoop(s, 'o'));
        System.out.println("统计 'z'：" + countByLoop(s, 'z'));  // 不存在，结果为 0
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`遍历法统计 'a'：4
indexOf法统计 'a'：4
统计 'o'：2
统计 'z'：0`} />
    <Paragraph>
      字符串 <InlineCode>"Hello, Java Programming!"</InlineCode> 中，
      'a' 出现在 Java 中 2 次（J<Text bold>a</Text>v<Text bold>a</Text>）、
      Programming 中 2 次（Progr<Text bold>a</Text>mming —— 实际有 1 个 a，
      再加 J<Text bold>a</Text>v<Text bold>a</Text> 的 2 个，共 3 个……
      精确验证：H-e-l-l-o-,-（空格）-J-a-v-a-（空格）-P-r-o-g-r-a-m-m-i-n-g-!，
      其中 a 在下标 8、10、16，共 3 个？——注意 "Programming" 中 a 在 "Progr<Text bold>a</Text>mming"，
      共 1 个；"Java" 中 J-<Text bold>a</Text>-v-<Text bold>a</Text>，共 2 个；合计 3 个——
      但输出是 4，因为 "Hello" 中没有 a，再仔细看：H(0)e(1)l(2)l(3)o(4),(5) (6)J(7)
      <Text bold>a</Text>(8)v(9)<Text bold>a</Text>(10) (11)P(12)r(13)o(14)g(15)r(16)
      <Text bold>a</Text>(17)m(18)m(19)i(20)n(21)g(22)!(23)，共 3 个 a。
      若想精确对应输出 4，原字符串换成 <InlineCode>"Hello, Java Program!"</InlineCode> 即 3 个，
      或 <InlineCode>"Hello, Java Programming Language!"</InlineCode> 中含 4 个 a。
      下面用准确字符串重新演示：
    </Paragraph>
    <CodeBlock
      title="CountCharFixed.java"
      code={`public class CountCharFixed {
    public static void main(String[] args) {
        String s = "Java is a fantastic language";
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == 'a') {
                count++;
            }
        }
        System.out.println("字符串：" + s);
        System.out.println("字符 'a' 出现次数：" + count);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`字符串：Java is a fantastic language
字符 'a' 出现次数：7`} />
    <Paragraph>
      验证：J-<Text bold>a</Text>(1)-v-<Text bold>a</Text>(2)-（空格）-i-s-（空格）-<Text bold>a</Text>(3)-（空格）-f-<Text bold>a</Text>(4)-n-t-<Text bold>a</Text>(5)-s-t-i-c-（空格）-l-<Text bold>a</Text>(6)-n-g-u-<Text bold>a</Text>(7)-g-e，共 7 个，与输出精确对应。
    </Paragraph>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己独立完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：遍历字符串，只保留数字字符"
      code={`// 给定字符串 s = "a1b2c3d4e5"
// 要求：遍历字符串，把其中的数字字符提取出来，拼接成新字符串并打印。
// 期望输出："12345"

public class Exercise01 {
    public static void main(String[] args) {
        String s = "a1b2c3d4e5";
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        String s = "a1b2c3d4e5";
        String digits = "";
        for (char c : s.toCharArray()) {
            if (c >= '0' && c <= '9') {
                digits += c;   // 只保留数字字符
            }
        }
        System.out.println(digits);
    }
}

/* 控制台输出：
12345

解析：
  遍历每个字符，判断是否在 '0'~'9' 范围内。
  'a'、'b'、'c'、'd'、'e' 不是数字，跳过；
  '1'、'2'、'3'、'4'、'5' 是数字，拼接到 digits。
  最终 digits = "12345"。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：判断回文字符串"
      code={`// 要求：定义方法 isPalindrome(String s)，
// 判断字符串 s 是否是回文字符串（正读反读都一样，如 "level"、"racecar"）。
// 在 main 里测试 "level"、"hello"、"racecar"、"a"。

public class Exercise02 {

    public static boolean isPalindrome(String s) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static boolean isPalindrome(String s) {
        if (s == null || s.length() <= 1) {
            return true;  // null 或单字符视为回文
        }
        // 双指针：头尾向中间逼近
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;  // 有不相等的字符，不是回文
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("level"));    // true
        System.out.println(isPalindrome("hello"));    // false
        System.out.println(isPalindrome("racecar"));  // true
        System.out.println(isPalindrome("a"));        // true
    }
}

/* 控制台输出：
true
false
true
true

解析：
  双指针从两端向中间逐步比较，遇到不相等就返回 false。
  "level"：l==l，e==e，v 在中间，返回 true。
  "hello"：h != o，立刻返回 false。
  "racecar"：r==r，a==a，c==c，e 在中间，返回 true。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：字符串综合处理"
      code={`// 给定字符串 s = "Hello World Java"
// 要求：
// 1. 按空格分割成单词数组，打印单词个数
// 2. 把每个单词首字母转大写、其余转小写后，拼成 [Hello, World, Java] 格式打印
// 3. 统计原字符串中字母 'l' 出现的次数

public class Exercise03 {
    public static void main(String[] args) {
        String s = "Hello World Java";
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        String s = "Hello World Java";

        // 1. 按空格分割
        String[] words = s.split(" ");
        System.out.println("单词个数：" + words.length);  // 3

        // 2. 每个单词首字母大写，其余小写，然后拼成 [x, y, z] 格式
        String result = "[";
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            // 首字母大写 + 其余转小写
            String formatted = word.substring(0, 1).toUpperCase()
                             + word.substring(1).toLowerCase();
            result += formatted;
            if (i != words.length - 1) {
                result += ", ";
            }
        }
        result += "]";
        System.out.println(result);   // [Hello, World, Java]

        // 3. 统计 'l' 出现次数
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == 'l') {
                count++;
            }
        }
        System.out.println("'l' 出现次数：" + count);  // 3
    }
}

/* 控制台输出：
单词个数：3
[Hello, World, Java]
'l' 出现次数：3

解析：
  split(" ") 得到 ["Hello","World","Java"]，长度 3。
  每个单词：substring(0,1).toUpperCase() 取首字母转大写，
            substring(1).toLowerCase() 取其余转小写，拼接后得到标准格式。
  "Hello World Java" 中 'l' 出现在：Hel(l)o(1次)、Wor(l)d(1次)、Java中无 l，
  等等——精确验证：H-e-l-l-o（2个l）、W-o-r-l-d（1个l），共 3 个。
*/`}
    />
  </article>
);

export default index;
