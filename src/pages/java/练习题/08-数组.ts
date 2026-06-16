import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "arrays",
  name: "数组",
  problems: [
    {
      title: "数组的定义与初始化",
      difficulty: "简单",
      question:
        "Java 中数组有「静态初始化」和「动态初始化」两种方式，请分别写出语法示例，并说明它们的区别。访问数组长度用什么？",
      hint: "静态初始化在创建时就给出元素；动态初始化只给长度，元素取默认值。",
      answer:
        "静态初始化：创建数组的同时直接给出所有元素，长度由元素个数决定，例如 int[] a = {1, 2, 3}; 或 int[] a = new int[]{1, 2, 3};。\n动态初始化：只指定长度，元素先取默认值（int 为 0、double 为 0.0、boolean 为 false、引用类型为 null），例如 int[] b = new int[3];（此时 b 为 {0,0,0}）。\n区别：静态初始化适合「元素已知」的场景；动态初始化适合「先开好空间，之后再赋值」的场景。\n数组长度用属性 length 获取（注意是属性不是方法，没有括号）：a.length。",
      answerCode: `public class Demo {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};        // 静态初始化
        int[] b = new int[]{4, 5};   // 静态初始化（完整写法）
        int[] c = new int[3];        // 动态初始化，元素默认为 0

        System.out.println(a.length); // 3
        System.out.println(c[0]);     // 0
    }
}`,
      tags: ["数组初始化", "length"],
    },
    {
      title: "遍历数组求最大值与求和",
      difficulty: "简单",
      question:
        "给定数组 int[] nums = {3, 7, 1, 9, 4};，请编程求出其中的最大值和所有元素之和。",
      hint: "求最大值时先假设第一个元素最大，再逐个比较更新；求和用一个累加变量。",
      answer:
        "求和：用一个变量 sum 初始为 0，遍历数组把每个元素累加进去。\n求最大值：用一个变量 max 初始化为数组第一个元素（不要初始化为 0，否则元素全为负数时会出错），遍历时若发现更大的元素就更新 max。\n本例和为 24，最大值为 9。",
      answerCode: `public class Demo {
    public static void main(String[] args) {
        int[] nums = {3, 7, 1, 9, 4};

        int sum = 0;
        int max = nums[0]; // 初始化为第一个元素
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (nums[i] > max) {
                max = nums[i];
            }
        }
        System.out.println("和：" + sum);    // 和：24
        System.out.println("最大值：" + max); // 最大值：9
    }
}`,
      tags: ["数组遍历", "求和", "最大值"],
    },
    {
      title: "找错：数组越界",
      difficulty: "简单",
      question:
        "下面这段代码想要遍历并打印数组所有元素，但运行时会抛出异常。请指出错误原因、会抛出什么异常，并改正。",
      code: `public class Demo {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        for (int i = 0; i <= arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`,
      hint: "数组下标从 0 开始，合法范围是 0 到 length-1。注意循环条件里的 <= 。",
      answer:
        "错误在循环条件 i <= arr.length。数组长度为 3，合法下标是 0、1、2；当 i 等于 arr.length（即 3）时访问 arr[3] 越界，会抛出 ArrayIndexOutOfBoundsException（数组下标越界异常）。\n改正：把 <= 改成 <，让 i 最大只取到 length-1。",
      answerCode: `public class Demo {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        for (int i = 0; i < arr.length; i++) { // <= 改为 <
            System.out.println(arr[i]);
        }
    }
}`,
      tags: ["数组越界", "ArrayIndexOutOfBoundsException"],
    },
    {
      title: "数组反转（双指针）",
      difficulty: "中等",
      question:
        "请用「双指针」的方式原地反转一个 int 数组（不借助新数组），例如 {1,2,3,4,5} 反转为 {5,4,3,2,1}。",
      hint: "一个指针 left 从头开始、一个指针 right 从尾开始，交换两者后向中间靠拢，直到相遇。",
      answer:
        "双指针法：left 指向开头（0），right 指向结尾（length-1）。每一步交换 arr[left] 和 arr[right]，然后 left++、right--，当 left >= right 时停止（中间相遇）。\n这样只需遍历一半元素即可完成原地反转，时间复杂度 O(n)、空间复杂度 O(1)。交换两个变量需要一个临时变量 temp。",
      answerCode: `public class Demo {
    public static void reverse(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        reverse(arr);
        System.out.println(java.util.Arrays.toString(arr)); // [5, 4, 3, 2, 1]
    }
}`,
      tags: ["双指针", "数组反转"],
    },
    {
      title: "冒泡排序",
      difficulty: "困难",
      question:
        "请实现冒泡排序，把数组 {5, 2, 8, 1, 9, 3} 从小到大排序。说明冒泡排序的基本思想，并做一个「本轮无交换则提前结束」的小优化。",
      hint: "外层控制轮数，内层相邻两两比较，把较大的往后「冒泡」。用一个 boolean 标记本轮是否发生过交换。",
      answer:
        "基本思想：每一轮从头到尾相邻两两比较，若前者比后者大就交换，这样一轮下来最大的元素会被「冒泡」到末尾。n 个元素最多进行 n-1 轮，每轮已排好的末尾部分不必再比较（所以内层用 length-1-i 控制范围）。\n时间复杂度 O(n^2)，是一种稳定排序。\n优化：用 boolean swapped 记录本轮是否发生过交换，如果某一轮一次交换都没有，说明数组已经有序，可以直接 break 提前结束，对接近有序的数据能显著加速。",
      answerCode: `public class Demo {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false; // 本轮是否发生交换
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) { // 本轮无交换，说明已有序
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 2, 8, 1, 9, 3};
        bubbleSort(arr);
        System.out.println(java.util.Arrays.toString(arr)); // [1, 2, 3, 5, 8, 9]
    }
}`,
      tags: ["冒泡排序", "排序算法"],
    },
  ],
};

export default category;
