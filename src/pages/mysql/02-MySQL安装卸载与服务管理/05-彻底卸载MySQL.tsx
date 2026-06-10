import React from 'react';
import {
  Title,
  Heading3,
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
    <Title>彻底卸载 MySQL</Title>

    <Callout type="danger" title="为什么单独大讲卸载？">
      因为 MySQL <Text bold>「装容易，卸干净难」</Text>。最经典的坑就是：直接在控制面板卸载，但{' '}
      <Text bold>data 目录、注册表项、残留服务、环境变量</Text> 没清理，结果<Text bold>重装时</Text>新装的 MySQL 读到旧 data 或旧服务，初始化失败、服务起不来、root 密码对不上……新手往往卡在这里好几个小时。所以「彻底」二字是关键。
    </Callout>
    <Paragraph>
      按顺序执行下面<Text bold>五步</Text>，一步都别省。
    </Paragraph>

    <Heading3>第 1 步：停止 MySQL 服务</Heading3>
    <Paragraph>正在运行的服务无法被干净卸载，先停：</Paragraph>
    <CodeBlock
      language="bash"
      code={`net stop MySQL80`}
    />

    <Heading3>第 2 步：控制面板卸载程序</Heading3>
    <Paragraph>
      <InlineCode>控制面板</InlineCode> → <InlineCode>程序和功能</InlineCode>（或设置 → 应用）→ 找到{' '}
      <Text bold>MySQL Server 8.0</Text>（以及 MySQL Installer、Connector 等相关项）→ 卸载。
    </Paragraph>
    <Callout type="tip" title="提示">
      若当初是 <Text bold>zip 版</Text> 安装，没有「程序和功能」里的条目，跳过本步，但要多做下面第 2.5 步「手动删除服务」。
    </Callout>

    <Heading3>第 2.5 步（zip 版/有残留服务时）：删除注册的服务</Heading3>
    <Paragraph>
      控制面板卸载有时不会删掉服务注册项，用 <InlineCode>sc delete</InlineCode> 手动删（管理员命令行）：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`# 先确保服务已停止，再删除
sc delete MySQL80

# 输出：[SC] DeleteService 成功`}
    />
    <Callout type="warning" title="注意">
      删服务前<Text bold>必须先 stop</Text>，否则服务处于「标记为删除」的半残状态，得重启电脑才彻底消失。
    </Callout>

    <Heading3>第 3 步：删除安装目录与 data 目录</Heading3>
    <Paragraph>把这两个目录彻底删掉（找到你实际的 basedir 和 datadir）：</Paragraph>
    <UnorderedList>
      <ListItem>
        安装目录（basedir），如 <InlineCode>C:\Program Files\MySQL\</InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>数据目录（datadir）</Text>，8.0 默认常在隐藏路径：
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      code={`C:\\ProgramData\\MySQL\\MySQL Server 8.0\\`}
    />
    <Callout type="warning" title="注意">
      <Paragraph>
        <Text bold>这是最容易漏的一步！</Text> <InlineCode>C:\ProgramData</InlineCode>{' '}
        是<Text bold>隐藏文件夹</Text>，资源管理器默认看不到。
      </Paragraph>
      <UnorderedList>
        <ListItem>
          打开方式：地址栏直接粘贴 <InlineCode>C:\ProgramData</InlineCode> 回车；或「查看」里勾上「隐藏的项目」。
        </ListItem>
        <ListItem>
          <Text bold>data 目录里就是你所有的库表数据</Text>。卸载前如果里面有重要数据，<Text bold>先备份</Text>再删！删了不可恢复。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>第 4 步：清理注册表残留</Heading3>
    <Paragraph>
      按 <InlineCode>Win + R</InlineCode> → 输入 <InlineCode>regedit</InlineCode>{' '}
      打开注册表编辑器，检查并删除以下位置中与 MySQL 相关的残留项（如果存在）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\MySQL80
HKEY_LOCAL_MACHINE\\SOFTWARE\\MySQL AB`}
    />
    <Callout type="warning" title="注意">
      <Paragraph>
        编辑注册表有风险，<Text bold>删之前最好先导出备份</Text>（选中项 → 右键 → 导出）。只删确认是 MySQL 的项，别误删其它。
      </Paragraph>
      <Paragraph>
        如果第 2.5 步用 <InlineCode>sc delete</InlineCode> 成功删了服务，<InlineCode>Services\MySQL80</InlineCode>{' '}
        这一项通常会自动消失，可不必手动删。
      </Paragraph>
    </Callout>

    <Heading3>第 5 步：清理环境变量</Heading3>
    <Paragraph>
      回到 <InlineCode>环境变量</InlineCode> 设置（见 2.3），在 <InlineCode>Path</InlineCode>{' '}
      里把当初加的那行 MySQL <InlineCode>bin</InlineCode> 路径删掉：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin   ← 删除这一行`}
    />

    <Heading3>卸载检查清单</Heading3>
    <Paragraph>全部做完后，对照确认「干净」了：</Paragraph>
    <Table
      head={['检查项', '干净的标志']}
      rows={[
        ['服务', 'services.msc 里找不到 MySQL；sc query MySQL80 报「指定的服务未安装」'],
        ['程序', '控制面板「程序和功能」无 MySQL 条目'],
        ['安装目录', 'basedir 已删'],
        ['数据目录', 'C:\\ProgramData\\MySQL\\ 已删（注意隐藏目录）'],
        ['注册表', '上述两处无 MySQL 残留'],
        ['环境变量', 'Path 中无 MySQL bin'],
        ['命令验证', '新开命令行敲 mysql --version 提示「不是内部或外部命令」'],
      ]}
    />
    <Callout type="danger" title="重装失败的典型现场">
      装到「Apply Configuration」时卡在 <InlineCode>Starting the server</InlineCode> 失败，多半是
      <Text bold>旧 data 目录没删</Text>——新初始化想建 data，发现已存在旧的、密码/版本对不上，于是失败。回到第 3 步把 data 彻底删干净再重装即可。
    </Callout>
  </article>
);

export default index;
