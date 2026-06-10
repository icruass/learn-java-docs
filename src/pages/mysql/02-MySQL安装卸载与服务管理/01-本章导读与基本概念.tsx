import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Table,
  Callout,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>本章导读与基本概念</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        上一章我们认识了「MySQL 是什么、为什么要用数据库」，停留在概念层面。但概念会用嘴说还不够，你得先让 MySQL{' '}
        <Text bold>真正跑在你自己电脑上</Text>，才能动手敲 SQL。
      </Paragraph>
      <Paragraph>本章就是你和 MySQL 的「第一次亲密接触」，目标非常务实：</Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>装上它</Text>——Windows 下两种安装方式（向导式 msi、解压版 zip）该怎么选、怎么装；
        </ListItem>
        <ListItem>
          <Text bold>管得住它</Text>——MySQL 装好后是一个常驻后台的「服务（Service）」，你要会启、会停；
        </ListItem>
        <ListItem>
          <Text bold>进得去它</Text>——通过 <InlineCode>mysql</InlineCode> 命令行客户端登录进数据库、再安全退出；
        </ListItem>
        <ListItem>
          <Text bold>看得懂它</Text>——MySQL 安装目录里那一堆文件夹（bin、data、my.ini……）分别是干嘛的；
        </ListItem>
        <ListItem>
          <Text bold>卸得干净</Text>——某天想重装或换版本时，如何「彻底」卸载，避免残留把下次安装坑死。
        </ListItem>
      </OrderedList>
      <Paragraph>
        你可以把 MySQL 想象成一台「电冰箱」：<Text bold>安装</Text>=把冰箱搬进厨房接好电；
        <Text bold>服务启停</Text>=按下冰箱的开/关机键；<Text bold>登录</Text>
        =打开冰箱门往里放/取东西；<Text bold>目录结构</Text>
        =冰箱的各个隔层（冷冻区、冷藏区、说明书）；<Text bold>卸载</Text>
        =搬走冰箱并把插座、说明书一并收走。本章学完，你就能完全掌控这台「数据冰箱」了。
      </Paragraph>
      <Paragraph>
        后续所有章节（建库建表、增删改查、事务、索引……）都建立在「你已经能登录进 MySQL」这个前提上，所以本章是整套教程的
        <Text bold>地基</Text>，务必跟着动手做一遍。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>1. 准备工作：先搞清楚几个概念</Subtitle>
    <Paragraph>在动手之前，先把几个贯穿全章的名词理清楚，后面就不会一头雾水。</Paragraph>

    <Table
      head={['名词', '通俗解释', '类比']}
      rows={[
        ['MySQL 服务端（Server）', '真正存数据、跑 SQL 的后台程序，进程名 mysqld.exe（多了个 d，代表 daemon 守护进程）', '冰箱本身（一直通着电，默默工作）'],
        ['MySQL 客户端（Client）', '你用来连服务端、敲 SQL 的工具，命令行版叫 mysql.exe', '你这个「往冰箱里放东西的人」'],
        ['服务（Windows Service）', '服务端被注册成 Windows 后台服务后，可随开机自启、可被启停管理', '冰箱的「电源总闸」'],
        ['端口（Port）', '服务端监听的「门牌号」，MySQL 默认 3306', '冰箱所在房间的门牌号，客户端按门牌找上门'],
        ['root 用户', 'MySQL 安装后自带的「超级管理员」账号，权限最大', '冰箱主人，拥有所有钥匙'],
        ['basedir', 'MySQL 的安装目录（程序放哪）', '冰箱的「机身」'],
        ['datadir', 'MySQL 的数据目录（你的库表数据存哪）', '冰箱里实际存的「食物」'],
      ]}
    />

    <Callout type="tip" title="提示">
      初学者最容易混的是「服务端」和「客户端」。它俩是两个程序：服务端 <InlineCode>mysqld</InlineCode>{' '}
      在后台一直运行；你每次敲 <InlineCode>mysql</InlineCode>{' '}
      进去都是开了一个新的客户端连接，退出客户端不影响服务端继续运行。这点想清楚，后面「为什么停了 mysql 客户端服务还在」就不会奇怪了。
    </Callout>

    <Paragraph>
      本章用到的版本以 <Text bold>MySQL 8.0</Text>（社区版 Community Server）为例，路径示例统一假设安装在{' '}
      <InlineCode>C:\Program Files\MySQL\MySQL Server 8.0</InlineCode>
      。你的实际路径可能不同，按自己的来即可。
    </Paragraph>
  </article>
);

export default index;
