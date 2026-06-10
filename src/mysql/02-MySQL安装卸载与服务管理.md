# MySQL 的安装、卸载、服务启停与登录退出、目录结构

> **本章导读**
>
> 上一章我们认识了「MySQL 是什么、为什么要用数据库」，停留在概念层面。但概念会用嘴说还不够，你得先让 MySQL **真正跑在你自己电脑上**，才能动手敲 SQL。
>
> 本章就是你和 MySQL 的「第一次亲密接触」，目标非常务实：
>
> 1. **装上它**——Windows 下两种安装方式（向导式 msi、解压版 zip）该怎么选、怎么装；
> 2. **管得住它**——MySQL 装好后是一个常驻后台的「服务（Service）」，你要会启、会停；
> 3. **进得去它**——通过 `mysql` 命令行客户端登录进数据库、再安全退出；
> 4. **看得懂它**——MySQL 安装目录里那一堆文件夹（bin、data、my.ini……）分别是干嘛的；
> 5. **卸得干净**——某天想重装或换版本时，如何「彻底」卸载，避免残留把下次安装坑死。
>
> 你可以把 MySQL 想象成一台「电冰箱」：**安装**=把冰箱搬进厨房接好电；**服务启停**=按下冰箱的开/关机键；**登录**=打开冰箱门往里放/取东西；**目录结构**=冰箱的各个隔层（冷冻区、冷藏区、说明书）；**卸载**=搬走冰箱并把插座、说明书一并收走。本章学完，你就能完全掌控这台「数据冰箱」了。
>
> 后续所有章节（建库建表、增删改查、事务、索引……）都建立在「你已经能登录进 MySQL」这个前提上，所以本章是整套教程的**地基**，务必跟着动手做一遍。

---

## 1. 准备工作：先搞清楚几个概念

在动手之前，先把几个贯穿全章的名词理清楚，后面就不会一头雾水。

| 名词 | 通俗解释 | 类比 |
| --- | --- | --- |
| **MySQL 服务端（Server）** | 真正存数据、跑 SQL 的后台程序，进程名 `mysqld.exe`（多了个 d，代表 daemon 守护进程） | 冰箱本身（一直通着电，默默工作） |
| **MySQL 客户端（Client）** | 你用来连服务端、敲 SQL 的工具，命令行版叫 `mysql.exe` | 你这个「往冰箱里放东西的人」 |
| **服务（Windows Service）** | 服务端被注册成 Windows 后台服务后，可随开机自启、可被启停管理 | 冰箱的「电源总闸」 |
| **端口（Port）** | 服务端监听的「门牌号」，MySQL 默认 **3306** | 冰箱所在房间的门牌号，客户端按门牌找上门 |
| **root 用户** | MySQL 安装后自带的「超级管理员」账号，权限最大 | 冰箱主人，拥有所有钥匙 |
| **basedir** | MySQL 的**安装目录**（程序放哪） | 冰箱的「机身」 |
| **datadir** | MySQL 的**数据目录**（你的库表数据存哪） | 冰箱里实际存的「食物」 |

> 💡 **提示**：初学者最容易混的是「服务端」和「客户端」。它俩是两个程序：服务端 `mysqld` 在后台一直运行；你每次敲 `mysql` 进去都是开了一个新的客户端连接，退出客户端不影响服务端继续运行。这点想清楚，后面「为什么停了 mysql 客户端服务还在」就不会奇怪了。

本章用到的版本以 **MySQL 8.0**（社区版 Community Server）为例，路径示例统一假设安装在 `C:\Program Files\MySQL\MySQL Server 8.0`。你的实际路径可能不同，按自己的来即可。

---

## 2. Windows 下安装 MySQL

Windows 下有两种主流安装方式，先看对比，再分别详解：

| 维度 | 方式一：msi 向导式安装 | 方式二：zip 解压版安装 |
| --- | --- | --- |
| 安装文件 | `mysql-installer-community-x.x.x.msi` | `mysql-8.0.xx-winx64.zip` |
| 操作难度 | ⭐ 简单，鼠标点点点 | ⭐⭐⭐ 需手动配置、敲命令 |
| 自动注册服务 | ✅ 向导自动帮你注册 | ❌ 需手动 `mysqld --install` |
| 自动设置环境变量 | 部分版本会，多数仍需手动 | ❌ 全靠自己 |
| 适合人群 | 初学者、只想快速用上 | 想理解原理、要装多实例、要绿色免安装 |
| 卸载干净度 | 控制面板可卸，但仍有残留（见第 6 章） | 删目录 + 删服务即可，相对干净 |

> 💡 **建议**：第一次学，强烈推荐用 **msi 向导式**，省心。等你理解了目录结构和服务原理后，再尝试 zip 版以加深理解。下面两种都讲。

### 2.1 方式一：msi 安装包向导式安装

#### 第 1 步：下载

去 MySQL 官网下载页（`https://dev.mysql.com/downloads/installer/`），下载 **MySQL Installer for Windows**。有两个体积：

- `mysql-installer-web-community`（小，安装时联网下载）
- `mysql-installer-community`（大，离线全量包）

> 💡 网络不稳就选**离线全量包**，避免装到一半卡在下载。

#### 第 2 步：选择安装类型

双击 msi 启动向导，到 **Choosing a Setup Type** 界面，常见选项：

| 选项 | 含义 |
| --- | --- |
| Developer Default | 开发者全家桶（Server + Workbench + 各种连接器），体积大 |
| Server only | **只装服务端**，最干净，推荐初学者 |
| Custom | 自定义勾选组件 |

初学选 **Server only** 即可，后面缺什么再补。

#### 第 3 步：关键配置（重点！）

向导会依次让你配置几项，**这几项决定了你以后怎么用，务必看清**：

**(1) 网络与端口（Type and Networking）**

- **Config Type**：选 `Development Computer`（开发机，占用内存最小）。
- **Port（端口）**：默认 **3306**。

  > ⚠️ **注意**：如果你这台机器上已经装过别的 MySQL，或 3306 被别的程序占用，这里要改成其它端口（如 3307），否则服务会启不来。怎么查端口占用见下方「常见坑」。

**(2) 认证方式（Authentication Method）**

MySQL 8.0 默认用 **`Use Strong Password Encryption`（caching_sha2_password）** 这种更安全的新加密方式。

> 🕳️ **常见坑**：很多老的 Java / PHP 客户端、老版本 Navicat 连不上 8.0，报 `Authentication plugin 'caching_sha2_password' cannot be loaded`。
> - 解决办法 A：这里选下面那个 **`Use Legacy Authentication Method`（mysql_native_password）**，兼容性好；
> - 解决办法 B：保持新方式，事后升级你的客户端/驱动（JDBC 用 `mysql-connector-java 8.x` 即可正常连）。
> - 学习阶段图省事，可以选 Legacy。

**(3) 设置 root 密码（Accounts and Roles）**

这一步给超级管理员 **root** 设密码。

> ⚠️ **注意**：
> - 这个密码**一定要记住**！忘了它后续登录、改配置都很麻烦（要进安全模式重置）。
> - 学习机可以设简单点（如 `root` / `123456`），但**生产环境务必用强密码**。
> - 此处还可「Add User」添加普通账号，初学可跳过，先用 root。

**(4) 注册为 Windows 服务（Windows Service）**

向导会问是否把 MySQL 安装为系统服务：

- **Configure MySQL Server as a Windows Service**：勾上 ✅（推荐）。
- **Windows Service Name**：服务名，默认 `MySQL80`（8.0 版常见就叫这个）。**这个名字要记住**，后面 `net start` 要用到。
- **Start the MySQL Server at System Startup**：是否开机自启。
  - 学习机建议**不勾**，避免每次开机都常驻吃内存，需要时手动启；
  - 当服务器用就勾上。

#### 第 4 步：应用配置（Apply Configuration）

点 **Execute**，向导会自动执行：写配置文件 → 初始化 data 目录 → 注册服务 → 启动服务 → 应用安全设置。全部打勾即安装成功。

> 💡 **关于字符集**：msi 8.0 向导默认服务端字符集已经是 **`utf8mb4`**（8.0 的默认字符集就是它），一般不用手动改。**强烈建议保持 `utf8mb4`**——它是真正的「完整 UTF-8」，能存 emoji 😀 和所有中文；而老的 `utf8`（实为 `utf8mb3`）每个字符最多 3 字节，**存不了 emoji**，是历史坑。若向导有 `Server Character Set` 选项，选 `utf8mb4` 即可。怎么改见第 7 章。

### 2.2 方式二：zip 解压版安装（理解原理用）

zip 版没有向导，所有步骤都得手动，但正因如此，你能清楚看到「安装到底做了哪些事」。

#### 第 1 步：解压

下载 `mysql-8.0.xx-winx64.zip`，解压到你想放的目录，例如：

```text
D:\dev\mysql-8.0
```

这个目录就是 **basedir（安装目录）**。解压后里面有 `bin`、`lib`、`share` 等文件夹，但**注意：没有 data 目录、也没有 my.ini**，这俩需要我们自己来。

#### 第 2 步：手写配置文件 my.ini

在 basedir 根目录新建 `my.ini`（注意是 `.ini` 不是 `.txt`），写入最小可用配置：

```ini
[mysqld]
# 端口
port=3306
# 安装目录（basedir），注意路径用正斜杠 / 或双反斜杠 \\，避免转义问题
basedir=D:/dev/mysql-8.0
# 数据目录（datadir），这个目录下一步会自动生成，不要手动建里面的文件
datadir=D:/dev/mysql-8.0/data
# 服务端默认字符集，强烈建议 utf8mb4
character-set-server=utf8mb4
# 最大连接数
max_connections=200
# 默认存储引擎
default-storage-engine=INNODB

[mysql]
# 客户端默认字符集
default-character-set=utf8mb4
```

> ⚠️ **注意**：`datadir` 指向的 `data` 目录**必须不存在或为空**，下一步初始化命令会自己创建并填充。如果你提前手动建了个非空 data 目录，初始化会报错。

#### 第 3 步：初始化 data 目录

以**管理员身份**打开 CMD/PowerShell，进入 `bin` 目录，执行初始化：

```bash
cd /d D:\dev\mysql-8.0\bin

# 初始化数据目录，并生成一个临时 root 密码（打印在日志里）
mysqld --initialize --console
```

执行后，控制台会输出一行类似：

```text
[Note] [MY-010454] [Server] A temporary password is generated for root@localhost: kj3#Xa9!pQ?z
```

> ⚠️ **务必复制保存最后那串「临时密码」**（`kj3#Xa9!pQ?z`），第一次登录要用它，登进去后会被强制改成新密码。
>
> 💡 若用 `--initialize-insecure`（不带临时密码，root 初始为空密码）则更省事，但**仅限学习机**，绝不能用于生产。

#### 第 4 步：把 MySQL 注册为 Windows 服务

```bash
# 在 bin 目录下，--install 后面是自定义的服务名
mysqld --install MySQL80

# 输出：Service successfully installed.
```

#### 第 5 步：启动服务

```bash
net start MySQL80
```

#### 第 6 步：首次登录并修改临时密码

```bash
mysql -uroot -p
# 粘贴第 3 步那串临时密码
```

登入后立即改密码，否则做任何操作都报「You must reset your password」：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';
```

至此 zip 版安装完成。可以看到，**msi 向导其实就是把第 2~5 步自动帮你做了**。

> 💡 **配环境变量**（两种方式都建议做）：把 `bin` 目录加入系统 `PATH`，这样在任意目录都能直接敲 `mysql`，不用每次 `cd` 到 bin。详见 2.3。

### 2.3 配置 PATH 环境变量（让 mysql 命令随处可用）

不配的话，你必须先 `cd` 到 `bin` 目录才能用 `mysql`/`mysqld` 命令；配了就能在任何目录直接用。

图形方式：`此电脑` 右键 → `属性` → `高级系统设置` → `环境变量` → 在「系统变量」里找到 `Path` → 编辑 → 新增一行：

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

确定后，**重开一个**命令行窗口（旧窗口不会自动刷新环境变量）验证：

```bash
mysql --version
```

---

## 3. 安装后验证

装完别急着用，先确认两件事：服务在不在、命令通不通。

### 3.1 验证服务已注册

按 `Win + R`，输入 `services.msc` 回车，打开「服务」面板，在列表里找到你的 MySQL 服务（如 `MySQL80`）：

| 列 | 期望值 | 说明 |
| --- | --- | --- |
| 名称 | MySQL80 | 你安装时设的服务名 |
| 状态 | 正在运行 | 说明服务端进程已起来 |
| 启动类型 | 自动 / 手动 | 自动=开机自启；手动=要自己启 |

也可以用命令行查（更快）：

```bash
sc query MySQL80
```

输出里看到 `STATE : 4  RUNNING` 就说明正在运行：

```text
SERVICE_NAME: MySQL80
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 4  RUNNING
        ...
```

### 3.2 验证客户端命令可用

```bash
mysql --version
```

期望输出（版本号以你装的为准）：

```text
mysql  Ver 8.0.36 for Win64 on x86_64 (MySQL Community Server - GPL)
```

> 🕳️ **常见坑**：如果敲 `mysql --version` 报「'mysql' 不是内部或外部命令」，说明 **PATH 没配好** 或 **没重开命令行窗口**。回到 2.3 检查 bin 路径是否加进 Path，然后**关掉当前 CMD 重新开一个**再试。

---

## 4. MySQL 服务的启动与关闭

服务端就是那个常驻后台的 `mysqld`。你要随时能启、能停（比如改了 my.ini 必须重启服务才生效）。三种方式，按场景选。

### 4.1 方式一：图形方式（services.msc）

`Win + R` → `services.msc` → 找到 `MySQL80` → 右键，菜单里有：

- **启动（Start）**
- **停止（Stop）**
- **重新启动（Restart）**：改完配置最常用，等于停+启。

适合不爱敲命令的人，直观。

### 4.2 方式二：net 命令（最常用）

```bash
# 启动 MySQL 服务（MySQL80 换成你的服务名）
net start MySQL80

# 关闭 MySQL 服务
net stop MySQL80
```

启动成功输出：

```text
MySQL80 服务正在启动 .
MySQL80 服务已经启动成功。
```

> ⚠️ **注意（管理员权限）**：`net start/stop` **必须在「以管理员身份运行」的命令行**里执行，否则报：
>
> ```text
> 发生系统错误 5。
> 拒绝访问。
> ```
>
> 解决：开始菜单搜 `cmd` → 右键 →「以管理员身份运行」。

> 🕳️ **常见坑**：`net start` 报 **「服务名无效」** → 你写的服务名和实际注册的不一致。MySQL 5.7 常注册成 `MySQL`，8.0 常是 `MySQL80`。用 `sc query` 或 services.msc 确认真实名字；也可以 `net start`（不带名字）列出所有正在运行的服务名参考。

### 4.3 方式三：sc 命令

`sc` 是 Windows 自带的服务控制工具，功能更全：

```bash
# 启动
sc start MySQL80

# 停止
sc stop MySQL80

# 查询状态
sc query MySQL80
```

> 💡 `net` vs `sc` 的区别：日常启停用 `net` 更直观（中文反馈、会等服务启完）；`sc` 更偏底层、能查更多细节、还能用于删除服务（见卸载章）。同样需要管理员权限。

### 4.4 三种方式对比

| 方式 | 命令/操作 | 是否需管理员 | 适用场景 |
| --- | --- | --- | --- |
| services.msc | 图形右键启停 | 是（弹 UAC） | 不爱敲命令、想看启动类型 |
| net | `net start/stop 服务名` | 是 | 日常最常用 |
| sc | `sc start/stop/query 服务名` | 是 | 脚本化、查细节、删服务 |

---

## 5. 登录与退出 MySQL

服务端跑起来后，就可以用客户端 `mysql` **登录**进去敲 SQL 了。

### 5.1 登录命令完整语法

**语法格式：**

```bash
mysql -h 主机地址 -P 端口 -u 用户名 -p
```

**逐项解释：**

| 选项 | 含义 | 默认值 / 备注 |
| --- | --- | --- |
| `-h` | host，要连的服务器地址 | 不写默认 `localhost`（本机） |
| `-P` | Port，端口（**大写 P**） | 不写默认 `3306` |
| `-u` | user，用户名 | 常用 `root` |
| `-p` | password，密码 | **后面别直接跟密码**，回车后再输入更安全 |

> ⚠️ **大小写极易错**：`-P`（大写）是**端口**，`-p`（小写）是**密码**。写反了会出莫名其妙的错。

### 5.2 最常见：登录本机

本机登录可以省掉 `-h` 和 `-P`：

```bash
mysql -uroot -p
```

> 💡 `-uroot` 中 `-u` 和 `root` 之间**可以不加空格**（`-u root` 也行）；但 `-p` 后面**最好不要**直接接密码。

回车后提示输入密码（输入时屏幕不显示任何字符，是正常的隐藏，直接输完回车）：

```text
Enter password: ********
```

登录成功后看到欢迎信息和 `mysql>` 提示符，就代表进来了：

```text
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.36 MySQL Community Server - GPL

mysql>
```

看到 `mysql>` 这个提示符，就可以开始敲 SQL 了。验证一下：

```sql
SELECT VERSION();
```

**执行结果：**

```text
+-----------+
| VERSION() |
+-----------+
| 8.0.36    |
+-----------+
1 row in set (0.00 sec)
```

### 5.3 完整形式与登录远程主机

当 MySQL 不在本机、或端口不是 3306 时，就要写全：

```bash
# 连本机的 3307 端口
mysql -h 127.0.0.1 -P 3307 -u root -p

# 连远程服务器（IP 192.168.1.100）的 MySQL
mysql -h 192.168.1.100 -P 3306 -u root -p
```

> 🕳️ **远程登录的几个常见坑**：
> 1. **服务器防火墙**：远程主机的防火墙没放行 3306 端口 → 连接超时。需在服务器上放行入站规则。
> 2. **MySQL 默认只允许本机连**：root 账号默认是 `root@localhost`，远程连会报 `Host 'xxx' is not allowed to connect`。需要在服务器上为对应用户授权远程访问（创建 `'root'@'%'` 或指定 IP 的账户并授权），这属于权限管理章节内容，这里先知道有这回事。
> 3. **`bind-address`**：服务端 my.ini 若配了 `bind-address=127.0.0.1`，会只监听本机，外部连不上；要改成 `0.0.0.0` 或注释掉。
> 4. **localhost 与 127.0.0.1 不完全等价**：在 MySQL 里 `localhost` 默认走本地 socket/管道，`127.0.0.1` 走 TCP。极少数情况下两者行为不同，远程调试时知道这点能少踩坑。

### 5.4 退出 MySQL 客户端

登录进去后（在 `mysql>` 提示符下），以下三种任选其一即可退出：

```sql
exit;
```

或

```sql
quit;
```

或

```sql
\q
```

**执行结果**（任意一种都会打印）：

```text
Bye
```

退出后回到普通命令行（`C:\>`）。

> 💡 **重点辨析**：退出客户端 ≠ 关闭服务！
> - `exit` / `quit` / `\q`：只是**断开你这一个客户端连接**，后台 `mysqld` 服务端**照常运行**，别人/别的连接不受影响。
> - `net stop MySQL80`：才是**真正关掉服务端**，所有连接都断、数据库整个停掉。
>
> 想象成：`exit` 是你「关上冰箱门走开」，冰箱还在制冷；`net stop` 才是「把冰箱电源拔了」。

---

## 6. 彻底卸载 MySQL（重装/换版本必看）

> 🕳️ **为什么单独大讲卸载？** 因为 MySQL **「装容易，卸干净难」**。最经典的坑就是：直接在控制面板卸载，但 **data 目录、注册表项、残留服务、环境变量** 没清理，结果**重装时**新装的 MySQL 读到旧 data 或旧服务，初始化失败、服务起不来、root 密码对不上……新手往往卡在这里好几个小时。所以「彻底」二字是关键。

按顺序执行下面**五步**，一步都别省。

### 第 1 步：停止 MySQL 服务

正在运行的服务无法被干净卸载，先停：

```bash
net stop MySQL80
```

### 第 2 步：控制面板卸载程序

`控制面板` → `程序和功能`（或设置 → 应用）→ 找到 **MySQL Server 8.0**（以及 MySQL Installer、Connector 等相关项）→ 卸载。

> 💡 若当初是 **zip 版** 安装，没有「程序和功能」里的条目，跳过本步，但要多做下面第 2.5 步「手动删除服务」。

### 第 2.5 步（zip 版/有残留服务时）：删除注册的服务

控制面板卸载有时不会删掉服务注册项，用 `sc delete` 手动删（管理员命令行）：

```bash
# 先确保服务已停止，再删除
sc delete MySQL80

# 输出：[SC] DeleteService 成功
```

> ⚠️ 删服务前**必须先 stop**，否则服务处于「标记为删除」的半残状态，得重启电脑才彻底消失。

### 第 3 步：删除安装目录与 data 目录

把这两个目录彻底删掉（找到你实际的 basedir 和 datadir）：

- 安装目录（basedir），如 `C:\Program Files\MySQL\`
- **数据目录（datadir）**，8.0 默认常在隐藏路径：

```text
C:\ProgramData\MySQL\MySQL Server 8.0\
```

> ⚠️ **这是最容易漏的一步！** `C:\ProgramData` 是**隐藏文件夹**，资源管理器默认看不到。
> - 打开方式：地址栏直接粘贴 `C:\ProgramData` 回车；或「查看」里勾上「隐藏的项目」。
> - **data 目录里就是你所有的库表数据**。卸载前如果里面有重要数据，**先备份**再删！删了不可恢复。

### 第 4 步：清理注册表残留

按 `Win + R` → 输入 `regedit` 打开注册表编辑器，检查并删除以下位置中与 MySQL 相关的残留项（如果存在）：

```text
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MySQL80
HKEY_LOCAL_MACHINE\SOFTWARE\MySQL AB
```

> ⚠️ **注意**：编辑注册表有风险，**删之前最好先导出备份**（选中项 → 右键 → 导出）。只删确认是 MySQL 的项，别误删其它。
>
> 💡 如果第 2.5 步用 `sc delete` 成功删了服务，`Services\MySQL80` 这一项通常会自动消失，可不必手动删。

### 第 5 步：清理环境变量

回到 `环境变量` 设置（见 2.3），在 `Path` 里把当初加的那行 MySQL `bin` 路径删掉：

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin   ← 删除这一行
```

### 卸载检查清单

全部做完后，对照确认「干净」了：

| 检查项 | 干净的标志 |
| --- | --- |
| 服务 | `services.msc` 里找不到 MySQL；`sc query MySQL80` 报「指定的服务未安装」 |
| 程序 | 控制面板「程序和功能」无 MySQL 条目 |
| 安装目录 | basedir 已删 |
| 数据目录 | `C:\ProgramData\MySQL\` 已删（注意隐藏目录） |
| 注册表 | 上述两处无 MySQL 残留 |
| 环境变量 | Path 中无 MySQL bin |
| 命令验证 | 新开命令行敲 `mysql --version` 提示「不是内部或外部命令」 |

> 🕳️ **重装失败的典型现场**：装到「Apply Configuration」时卡在 `Starting the server` 失败，多半是**旧 data 目录没删**——新初始化想建 data，发现已存在旧的、密码/版本对不上，于是失败。回到第 3 步把 data 彻底删干净再重装即可。

---

## 7. MySQL 安装目录结构详解

装好后进入安装目录（basedir，如 `C:\Program Files\MySQL\MySQL Server 8.0\`），你会看到一堆文件夹。逐个认识它们的作用，这能帮你理解 MySQL「东西都放在哪」。

```text
MySQL Server 8.0\
├── bin\          ← 可执行程序（命令）都在这
├── data\         ← 数据文件！（8.0 常被放到 C:\ProgramData\MySQL\... 下，见下文）
├── docs\         ← 文档
├── include\      ← C/C++ 头文件（写 C 程序连 MySQL 用）
├── lib\          ← 库文件（.dll/.lib），程序运行依赖
├── share\        ← 共享资源：错误信息多语言文件、初始化 SQL、字符集定义等
└── my.ini        ← 核心配置文件（也可能在 ProgramData 里）
```

### 7.1 bin 目录——可执行程序

这是你接触最多的目录，里面是各种命令行工具：

| 程序 | 作用 |
| --- | --- |
| `mysqld.exe` | **服务端**主程序（后台守护进程，真正干活的） |
| `mysql.exe` | **客户端**，你登录敲 SQL 用的就是它 |
| `mysqladmin.exe` | 管理工具（改密码、查状态、关服务等） |
| `mysqldump.exe` | **逻辑备份**工具，把库表导出成 .sql 文件（备份/迁移必用） |
| `mysqlimport.exe` | 数据导入工具 |
| `mysql_upgrade.exe` | 版本升级后修复系统表 |

> 💡 **记忆法**：带 `d` 的 `mysqld` 是 daemon（服务端，后台）；不带 `d` 的 `mysql` 是你（客户端）。

### 7.2 data 目录——数据文件（最重要、最不能乱动）

这里存放**所有的真实数据**：每个数据库一个子文件夹，表数据存在表空间文件（InnoDB 的 `.ibd`）里，还有日志文件等。

```text
data\
├── ib_buffer_pool        ← 缓冲池转储
├── ibdata1               ← 系统表空间
├── ib_logfile* / #ib_redo* ← 重做日志（redo log，崩溃恢复用）
├── mysql\                ← 系统库（账号、权限等）
├── performance_schema\   ← 性能监控库
├── db_learn\             ← 你自己建的库（如本教程的 db_learn）就长这样
│   └── emp.ibd           ← emp 表的数据文件
└── 主机名.err            ← 错误日志（服务起不来时看它！）
```

> ⚠️ **铁律**：
> 1. **绝不要手动去 data 目录里删/改/拷贝文件**来「删库」或「搬数据」，极易损坏。要操作数据请用 SQL，要备份请用 `mysqldump`。
> 2. 卸载时这个目录是「数据老家」，重装前没删干净就是各种诡异问题的根源（见第 6 章）。
> 3. **服务起不来时**，第一件事就是去 data 目录看 `主机名.err` 错误日志，里面有失败原因。

> 💡 **为什么 8.0 的 data 在 `C:\ProgramData`？** msi 安装时把「程序」放 `Program Files`、把「数据」放 `ProgramData`，是为了符合 Windows 权限规范（Program Files 默认只读）。具体路径以 my.ini 里的 `datadir` 为准。

### 7.3 my.ini——核心配置文件

MySQL 的「总开关面板」，端口、目录、字符集、连接数等都在这里配置。文件分若干段（`[mysqld]` 给服务端、`[mysql]` 给客户端、`[client]` 给所有客户端工具）。

典型内容（节选并加注释）：

```ini
[mysqld]
# 服务端监听端口
port=3306
# 安装目录（basedir）
basedir="C:/Program Files/MySQL/MySQL Server 8.0/"
# 数据目录（datadir）—— 你的库表数据真正存放的地方
datadir="C:/ProgramData/MySQL/MySQL Server 8.0/Data"
# 服务端默认字符集（强烈建议 utf8mb4）
character-set-server=utf8mb4
# 默认存储引擎
default-storage-engine=INNODB
# 最大并发连接数
max_connections=151

[mysql]
# mysql 客户端默认字符集
default-character-set=utf8mb4
```

| 配置项 | 所在段 | 含义 |
| --- | --- | --- |
| `port` | `[mysqld]` | 服务端端口，默认 3306 |
| `basedir` | `[mysqld]` | MySQL 安装目录 |
| `datadir` | `[mysqld]` | 数据存放目录 |
| `character-set-server` | `[mysqld]` | 服务端默认字符集 |
| `max_connections` | `[mysqld]` | 最大连接数 |
| `default-character-set` | `[mysql]`/`[client]` | 客户端默认字符集 |

> 💡 **怎么快速找到我的 my.ini 在哪？** 登进 MySQL 后执行：
>
> ```sql
> SHOW VARIABLES LIKE 'basedir';
> SHOW VARIABLES LIKE 'datadir';
> ```
>
> 也可以在 services.msc 里看 MySQL 服务的「属性 → 可执行文件路径」，里面 `--defaults-file=` 后面就是 my.ini 的真实路径。

### 7.4 其它目录

| 目录 | 作用 |
| --- | --- |
| `lib\` | 运行所需的库文件（动态/静态库），缺了 MySQL 跑不起来，别动 |
| `share\` | 共享资源：各语言**错误提示文件**、字符集/排序规则定义、初始化系统库的 SQL 脚本 |
| `include\` | C/C++ 开发头文件，用 C 语言连 MySQL 时才用 |
| `docs\` | 自带文档（部分版本有） |

---

## 8. 配置文件 my.ini 常改项详解

日常学习/开发中，你最可能改的就是下面三项。**改完任何一项，都必须重启 MySQL 服务才生效**（`net stop` + `net start`，或 services.msc 里 Restart）。

### 8.1 默认字符集（character set）—— 最常改

**目的**：让数据库默认用 `utf8mb4`，彻底解决中文/emoji 乱码、存不进去的问题。

在 `my.ini` 中确保有：

```ini
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
```

| 配置 | 段 | 作用 |
| --- | --- | --- |
| `character-set-server` | `[mysqld]` | 新建库表的默认字符集 |
| `collation-server` | `[mysqld]` | 默认排序规则（影响比较/排序） |
| `default-character-set` | `[client]`/`[mysql]` | 客户端发送/接收数据用的字符集 |

改完重启后，进 MySQL 验证：

```sql
SHOW VARIABLES LIKE 'character%';
```

**期望结果（关键几行）：**

```text
+--------------------------+--------------------+
| Variable_name            | Value              |
+--------------------------+--------------------+
| character_set_client     | utf8mb4            |
| character_set_connection | utf8mb4            |
| character_set_database   | utf8mb4            |
| character_set_results    | utf8mb4            |
| character_set_server     | utf8mb4            |
+--------------------------+--------------------+
```

> 🕳️ **utf8 的历史坑**：MySQL 里的 `utf8` 其实是 `utf8mb3`（每字符最多 3 字节），**存不了 4 字节字符（如 emoji 😀、部分生僻字）**，插入时报 `Incorrect string value`。**`utf8mb4` 才是真·完整 UTF-8**，永远优先用它。MySQL 8.0 默认已是 `utf8mb4`，老版本（5.7 及以前）建好习惯手动改。

### 8.2 端口（port）

**目的**：当 3306 被占用，或一台机器要装多个 MySQL 实例时，改端口。

```ini
[mysqld]
port=3307
```

改完重启服务。之后登录就要带上新端口：

```bash
mysql -uroot -P 3307 -p
```

> 🕳️ **怎么查端口是否被占用**（管理员命令行）：
>
> ```bash
> netstat -ano | findstr 3306
> ```
>
> 若有输出，最后一列是占用进程的 PID，再去任务管理器按 PID 定位是谁占的。3306 被占是「服务启动失败」的常见原因之一。

### 8.3 最大连接数（max_connections）

**目的**：限制同时连接 MySQL 的客户端数量上限。默认 **151**，连接数多的应用容易顶满。

```ini
[mysqld]
max_connections=300
```

查看当前值与历史峰值：

```sql
SHOW VARIABLES LIKE 'max_connections';
SHOW STATUS LIKE 'Max_used_connections';
```

**结果示意：**

```text
+-----------------+-------+        +----------------------+-------+
| Variable_name   | Value |        | Variable_name        | Value |
+-----------------+-------+        +----------------------+-------+
| max_connections | 300   |        | Max_used_connections | 27    |
+-----------------+-------+        +----------------------+-------+
```

> 🕳️ **常见坑**：应用报 `Too many connections`，就是连接数超过 `max_connections` 了。临时可在线调（`SET GLOBAL max_connections=500;` 立即生效但重启失效），永久要写进 my.ini。根因往往是**连接没关闭/连接池配置不当**，调大上限只是治标。
>
> ⚠️ **注意**：`max_connections` 别盲目调超大，每个连接都吃内存，调太大会拖垮内存。按实际并发量 + 适当余量来设。

> 💡 **在线改 vs 改配置文件**：很多参数能用 `SET GLOBAL 变量=值;` **临时**在线修改（无需重启，但**重启即失效**）；要**永久**生效必须写进 my.ini 并重启服务。两者配合：先 `SET GLOBAL` 试效果，确认好了再落到 my.ini。

---

## 本章小结

- **安装两种方式**：msi 向导式（推荐初学，自动注册服务）、zip 解压版（手动 `my.ini` + `mysqld --initialize` + `mysqld --install`，能看清原理）。关键配置：**端口 3306、root 密码（务必记住）、字符集 utf8mb4、注册为服务**。
- **安装后验证**：`services.msc` 看服务在不在、`mysql --version` 看命令通不通；命令不通多半是 PATH 没配或没重开窗口。
- **服务启停**：三种方式——`services.msc` 图形、`net start/stop 服务名`（最常用）、`sc start/stop`。**都需要管理员权限**；服务名 8.0 常为 `MySQL80`。
- **登录退出**：`mysql -h 主机 -P 端口 -u 用户 -p`；本机可简写为 `mysql -uroot -p`。**`-P` 是端口（大写）、`-p` 是密码（小写）**。退出用 `exit` / `quit` / `\q`，但退出客户端 ≠ 关服务。
- **目录结构**：`bin`（可执行：mysqld 服务端 / mysql 客户端）、`data`（真实数据，绝不手动改）、`my.ini`（核心配置：port/basedir/datadir/character-set-server）、`lib`、`share` 等。
- **彻底卸载五步**：停服务 → 控制面板卸载 →（zip 版 `sc delete` 删服务）→ 删 basedir 与 data 目录（`C:\ProgramData` 隐藏目录易漏）→ 清注册表 → 清环境变量。**残留 data/服务是重装失败的头号原因**。
- **my.ini 常改三项**：字符集（`character-set-server=utf8mb4`，避坑 `utf8`≠完整 UTF-8）、端口（`port`，配合 `netstat` 查占用）、最大连接数（`max_connections`，默认 151）。改完**必须重启服务**。

---

## 常见面试 / 易错问答

**Q1：`mysqld` 和 `mysql` 有什么区别？**
A：`mysqld`（带 d，daemon）是**服务端**后台进程，真正存数据、执行 SQL；`mysql` 是**客户端**，你用它连服务端、敲 SQL。退出 `mysql` 客户端不会关掉 `mysqld` 服务端。

**Q2：`-P` 和 `-p` 区别？**
A：大写 `-P` 指定**端口**（Port），小写 `-p` 指定**密码**（password）。最易写反。

**Q3：MySQL 8.0 用 `utf8` 还是 `utf8mb4`？为什么？**
A：用 **`utf8mb4`**。因为 MySQL 的 `utf8` 实为 `utf8mb3`，每字符最多 3 字节，**存不了 emoji 和部分 4 字节字符**；`utf8mb4` 才是完整 UTF-8。8.0 默认即 `utf8mb4`。

**Q4：`net start mysql` 报「拒绝访问/系统错误 5」怎么办？**
A：没用管理员权限。以「管理员身份运行」命令行后重试。

**Q5：为什么卸载后重装老是失败？**
A：八成是 **data 目录（常在 `C:\ProgramData\MySQL` 隐藏路径）或残留服务/注册表没删干净**，新安装初始化时与旧残留冲突。按本章「彻底卸载五步」清理后再装。

**Q6：改了 my.ini 不生效？**
A：(1) 改的可能不是 MySQL 实际加载的那个 my.ini（用 `SHOW VARIABLES LIKE 'datadir'` 或服务属性的 `--defaults-file` 确认真实路径）；(2) 改完**没重启服务**——配置文件改动必须 `net stop` + `net start` 才生效。

**Q7：`localhost` 和 `127.0.0.1` 登录有区别吗？**
A：在 MySQL 里 `localhost` 默认走本地 socket/命名管道，`127.0.0.1` 走 TCP。权限表里 `user@localhost` 与 `user@127.0.0.1` 是不同的授权对象，少数场景两者行为不同，远程/本地连接调试时要留意。

**Q8：报 `Too many connections` 怎么处理？**
A：连接数超过 `max_connections`（默认 151）。临时 `SET GLOBAL max_connections=更大值;`，永久写进 my.ini 重启。但要排查是否连接泄漏（没关连接），否则只是治标。
