# **Linux**

**常用Linux操作系统**

```python
RedHat(红帽)：6.5、7 
CentOS：6.5、7
Ubuntu：16.04、18.04
```

**远程连接工具-xshell**

```python
# 1、定义
xshell: 安装终端模拟软件
# 2、使用
文件-新建-输入服务器IP地址-输入用户名-输入密码-确认连接
# 3、文件互传
sudo apt-get install lrzsz
Windows -> Linux：rz 
Linux -> Windows: sz filename
```

**常用命令**

```python
1、ifconfig
  查看IP地址和MAC地址,Windows中命令为:ipconfig

2、ping IP/域名 [-c n]
  测试网络连通性,-c指定连接次数

3、nslookup 域名
  解析域名对应的IP地址

4、ls -lh file|directory
  显示文件权限及详细信息

5、tar -zcvf filename.tar.gz file1 file2 directory3 
  将文件|目录打包并压缩
 
6、tar -zxvf filename.tar.gz [-C path]
  解压缩,默认解压到当前路径,-C可指定路径

7、ps -aux
  显示进程命令(包含PID号)  ps -aux | grep 'mysql'

8、kill PID
  杀死某个进程
  eg: ps -aux | grep 'mysql'
      sudo kill PID号

9、chmod 权限 file
  给文件指定或者增加某权限

10、chown user:group file
  更改属主和属组
  eg: chown root:root file
       
11、find path -name filename
  在某个路径下查找文件
  eg: find /home/tarena/ -name '*.avi'
    
12、ssh user@IP
  远程连接到服务器
  eg: ssh tarena@172.40.91.138
    
13、scp file user@IP:绝对路径
  本地文件复制到远程
  eg: scp python.tar.gz tarena@172.40.91.138:/home/tarena/
```

**vi及vim使用**

```python
文本编辑器,vim是vi的升级版
# 使用流程
1、vi filename
初始(不能编辑,浏览模式)  -> 按 a(可编辑,插入模式) -> 编辑内容 -> 按ESC,然后shift+:(命令行模式) -> 输入wq!(保存并退出)、或q!(不保存直接退出)

# 常用
1、查找
  浏览模式 -> 输入 /  -> 输入查找内容 -> Enter  (n表示下1个,shift+n表示上1个)
2、复制+删除+粘贴+撤销
  yy：复制光标所在行(2yy复制两行内容)
   p：粘贴
  dd：删除(剪切)光标所在行(3dd删除(剪切)3行内容）
   u: 撤销
```

​		


























