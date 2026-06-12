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
    <Title>BigDecimal 与 BigInteger</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>double</InlineCode> 算钱会出错、<InlineCode>long</InlineCode> 装不下超大整数——这是
        真实开发绕不过去的两个问题。本节先用例子揭示 <Text bold>浮点数精度丢失</Text> 的根源，
        再讲解专门用于<Text bold>精确小数计算</Text>的 <InlineCode>BigDecimal</InlineCode>
        和<Text bold>超大整数</Text>的 <InlineCode>BigInteger</InlineCode>，
        重点掌握 BigDecimal 的正确创建方式与除法舍入——这在涉及金额的系统里是硬性要求。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么 double 不能算钱</Heading3>
    <CodeBlock
      title="浮点数精度丢失"
      code={`public class DoubleProblem {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);
        System.out.println(0.3 - 0.1);
        System.out.println(1.0 - 0.9);
        System.out.println(0.1 + 0.2 == 0.3);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（结果令人意外）"
      code={`0.30000000000000004
0.19999999999999998
0.09999999999999998
false`}
    />
    <Callout type="danger" title="根源：二进制无法精确表示某些十进制小数">
      计算机用二进制存储浮点数，而 <InlineCode>0.1</InlineCode> 这类小数在二进制里是<Text bold>无限循环</Text>的，
      只能近似存储，运算后误差累积就暴露出来。<Text bold>凡是涉及金额、计费、对账的计算，绝不能用 double/float</Text>，
      必须用 <InlineCode>BigDecimal</InlineCode>。
    </Callout>

    <Heading3>2. BigDecimal 的正确创建方式</Heading3>
    <Paragraph>
      <InlineCode>BigDecimal</InlineCode> 用<Text bold>字符串</Text>表示任意精度的小数。但它有个极易踩的坑：
      <Text bold>必须用「字符串构造」或 valueOf，不能直接传 double</Text>。
    </Paragraph>
    <CodeBlock
      title="CreateBigDecimal.java"
      code={`import java.math.BigDecimal;

public class CreateBigDecimal {
    public static void main(String[] args) {
        // 错误：直接传 double，把 double 的误差也带进来了！
        BigDecimal wrong = new BigDecimal(0.1);
        System.out.println("new BigDecimal(0.1): " + wrong);

        // 正确①：用字符串构造（推荐）
        BigDecimal right1 = new BigDecimal("0.1");
        System.out.println("new BigDecimal(\\"0.1\\"): " + right1);

        // 正确②：用 valueOf（内部转成字符串处理）
        BigDecimal right2 = BigDecimal.valueOf(0.1);
        System.out.println("BigDecimal.valueOf(0.1): " + right2);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`new BigDecimal(0.1): 0.1000000000000000055511151231257827021181583404541015625
new BigDecimal("0.1"): 0.1
BigDecimal.valueOf(0.1): 0.1`}
    />
    <Callout type="danger" title="铁律：创建 BigDecimal 用字符串">
      <InlineCode>new BigDecimal(0.1)</InlineCode> 会把 <InlineCode>double</InlineCode> 那一长串误差原样接收。
      <Text bold>永远用 new BigDecimal("0.1")（字符串）或 BigDecimal.valueOf(0.1)</Text>，
      不要把 double 直接塞进 BigDecimal 的构造方法。
    </Callout>

    <Heading3>3. 四则运算：add / subtract / multiply / divide</Heading3>
    <Paragraph>
      <InlineCode>BigDecimal</InlineCode> 不能用 <InlineCode>+ - * /</InlineCode> 运算符，要调用方法。
      且它是<Text bold>不可变</Text>的，运算返回新对象：
    </Paragraph>
    <Table
      head={['方法', '运算']}
      rows={[
        ['add(b)', '加'],
        ['subtract(b)', '减'],
        ['multiply(b)', '乘'],
        ['divide(b)', '除（除不尽会抛异常，见下）'],
        ['divide(b, 位数, 舍入模式)', '除并指定保留位数与舍入'],
        ['compareTo(b)', '比较大小（比相等用它，不要用 equals）'],
      ]}
    />
    <CodeBlock
      title="ArithmeticDemo.java"
      code={`import java.math.BigDecimal;

public class ArithmeticDemo {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("0.1");
        BigDecimal b = new BigDecimal("0.2");

        System.out.println("加: " + a.add(b));
        System.out.println("减: " + b.subtract(a));
        System.out.println("乘: " + a.multiply(b));

        // 0.1 + 0.2 终于精确等于 0.3
        System.out.println("精确判断: " + (a.add(b).compareTo(new BigDecimal("0.3")) == 0));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`加: 0.3
减: 0.1
乘: 0.02
精确判断: true`}
    />
    <Callout type="warning" title="比较相等用 compareTo，不要用 equals">
      <InlineCode>equals</InlineCode> 会连「精度」一起比：<InlineCode>new BigDecimal("1.0").equals(new BigDecimal("1.00"))</InlineCode>
      返回 <InlineCode>false</InlineCode>（位数不同）！比较数值大小/相等一律用
      <InlineCode>compareTo(...) == 0</InlineCode>。
    </Callout>

    <Heading3>4. 除法必须处理除不尽的情况</Heading3>
    <CodeBlock
      title="DivideDemo.java"
      code={`import java.math.BigDecimal;
import java.math.RoundingMode;

public class DivideDemo {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("10");
        BigDecimal b = new BigDecimal("3");

        // 直接 divide：10/3 除不尽，抛 ArithmeticException
        try {
            System.out.println(a.divide(b));
        } catch (ArithmeticException e) {
            System.out.println("除不尽报错: " + e.getMessage());
        }

        // 正确：指定保留位数 + 舍入模式
        BigDecimal result = a.divide(b, 2, RoundingMode.HALF_UP); // 保留2位，四舍五入
        System.out.println("10 / 3 ≈ " + result);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`除不尽报错: Non-terminating decimal expansion; no exact representable decimal result.
10 / 3 ≈ 3.33`}
    />
    <Callout type="danger" title="divide 一定要带舍入参数">
      只要除法可能除不尽（如 10/3），<InlineCode>divide(b)</InlineCode> 单参版本就会抛
      <InlineCode>ArithmeticException</InlineCode>。<Text bold>实战中应始终用
      divide(除数, 保留位数, 舍入模式) 三参版本</Text>。常用舍入模式：
      <InlineCode>HALF_UP</InlineCode>（四舍五入）、<InlineCode>HALF_EVEN</InlineCode>（银行家舍入）、
      <InlineCode>DOWN</InlineCode>（直接截断）。
    </Callout>

    <Heading3>5. setScale：保留小数位</Heading3>
    <CodeBlock
      title="ScaleDemo.java"
      code={`import java.math.BigDecimal;
import java.math.RoundingMode;

public class ScaleDemo {
    public static void main(String[] args) {
        BigDecimal price = new BigDecimal("19.9");

        // 强制保留 2 位小数（金额展示常用）
        System.out.println(price.setScale(2, RoundingMode.HALF_UP)); // 19.90

        BigDecimal pi = new BigDecimal("3.14159");
        System.out.println(pi.setScale(2, RoundingMode.HALF_UP));    // 3.14
        System.out.println(pi.setScale(4, RoundingMode.HALF_UP));    // 3.1416
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`19.90
3.14
3.1416`}
    />

    <Heading3>6. BigInteger：超大整数</Heading3>
    <Paragraph>
      <InlineCode>long</InlineCode> 的上限约 9.2×10¹⁸，再大就溢出。<InlineCode>BigInteger</InlineCode>
      可表示<Text bold>任意大小</Text>的整数，用法与 BigDecimal 类似（也用方法运算、不可变）：
    </Paragraph>
    <CodeBlock
      title="BigIntegerDemo.java"
      code={`import java.math.BigInteger;

public class BigIntegerDemo {
    public static void main(String[] args) {
        // long 会溢出的超大数
        BigInteger a = new BigInteger("123456789012345678901234567890");
        BigInteger b = new BigInteger("987654321098765432109876543210");

        System.out.println("加: " + a.add(b));
        System.out.println("乘: " + a.multiply(b));

        // 计算 50 的阶乘（远超 long 范围）
        BigInteger result = BigInteger.ONE;
        for (int i = 1; i <= 50; i++) {
            result = result.multiply(BigInteger.valueOf(i));
        }
        System.out.println("50! = " + result);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`加: 1111111110111111111011111111100
乘: 121932631137021795226185032733622923332237463801111263526900
50! = 30414093201713378043612608166064768844377641568960512000000000000`}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>double/float</InlineCode> 存在精度丢失，<Text bold>算钱必须用 BigDecimal</Text>。</ListItem>
        <ListItem>创建 BigDecimal <Text bold>用字符串</Text> <InlineCode>new BigDecimal("0.1")</InlineCode> 或 <InlineCode>valueOf</InlineCode>，绝不直接传 double。</ListItem>
        <ListItem>用方法运算 <InlineCode>add/subtract/multiply/divide</InlineCode>，对象不可变。</ListItem>
        <ListItem><InlineCode>divide</InlineCode> 要带<Text bold>保留位数 + 舍入模式</Text>，否则除不尽会抛异常。</ListItem>
        <ListItem>比较相等用 <InlineCode>compareTo(...)==0</InlineCode>，不要用 <InlineCode>equals</InlineCode>（会比精度）。</ListItem>
        <ListItem><InlineCode>BigInteger</InlineCode> 表示超出 long 范围的任意大整数。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：找错"
      code={`找出下面每行的问题：
① BigDecimal a = new BigDecimal(0.1);
② BigDecimal r = new BigDecimal("10").divide(new BigDecimal("3"));
③ new BigDecimal("1.0").equals(new BigDecimal("1.00"))  // 期望 true
④ double total = 0.1 + 0.2;  // 用于计算订单金额`}
      answerCode={`答案：
① 传了 double，会带入浮点误差。应改为 new BigDecimal("0.1") 或 BigDecimal.valueOf(0.1)。
② 10/3 除不尽，会抛 ArithmeticException。应带舍入：divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP)。
③ 返回 false！equals 会比较精度（标度），1.0 与 1.00 标度不同。判相等要用 compareTo()==0。
④ 金额绝不能用 double（精度丢失）。应使用 BigDecimal 做金额计算。

解析：四条恰好覆盖 BigDecimal 的四大坑：构造传 double、除法不带舍入、用 equals 比相等、拿 double 算钱。`}
    />

    <CodeBlock
      qa
      title="练习2：购物车金额计算"
      code={`// 商品：单价 19.99 元，数量 3；优惠券立减 5 元。
// 用 BigDecimal 计算应付金额，保留两位小数。
// 预期输出：应付 54.97 元

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Cart {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.math.BigDecimal;
import java.math.RoundingMode;

public class Cart {
    public static void main(String[] args) {
        BigDecimal price = new BigDecimal("19.99");
        BigDecimal count = new BigDecimal("3");
        BigDecimal coupon = new BigDecimal("5");

        BigDecimal total = price.multiply(count)   // 19.99 * 3 = 59.97
                .subtract(coupon)                   // - 5 = 54.97
                .setScale(2, RoundingMode.HALF_UP); // 保留两位

        System.out.println("应付 " + total + " 元");
    }
}

/* 控制台输出：
应付 54.97 元

解析：全程用字符串构造的 BigDecimal 运算，multiply 后 subtract，最后 setScale 规范成两位。
      若用 double：19.99*3 = 59.970000000000006，再减 5 会出现误差尾巴——这正是金额必须用 BigDecimal 的原因。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：大数阶乘"
      code={`// 用 BigInteger 计算 30 的阶乘（30! 远超 long 范围）。
// 预期输出：265252859812191058636308480000000

import java.math.BigInteger;

public class Factorial {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.math.BigInteger;

public class Factorial {
    public static void main(String[] args) {
        BigInteger result = BigInteger.ONE;   // 从 1 开始
        for (int i = 1; i <= 30; i++) {
            result = result.multiply(BigInteger.valueOf(i));
        }
        System.out.println(result);
    }
}

/* 控制台输出：
265252859812191058636308480000000

解析：阶乘增长极快，13! 就超过 int、21! 就超过 long。BigInteger 能表示任意大整数，
      用 multiply 累乘即可。注意 BigInteger 不可变，每次乘法都要用返回值重新赋给 result。
      BigInteger.ONE / ZERO / TEN 是预置常量，valueOf(int) 把普通整数转为 BigInteger。
*/`}
    />
  </article>
);

export default index;
