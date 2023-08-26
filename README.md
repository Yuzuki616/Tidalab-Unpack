# Tidalab-Unpack
V2board 潮汐客户端的解包后文件以及 Electron-builder 构建选项补全。

## 使用
1、搜索 `$api-url$`、`$title$`、`$license$` 分别替换为你的站点地址、标题、授权码，授权码通过对 `站点地址` 做sha1运算然后加上 `1145141919` 再做sha1运算取得。  
2、在 `res` 路径下放置你的图标文件。  
3、安装 `Electron-builder`，执行 `bash build.sh`。

## 声明
本项目仅用于学习交流，使用者造成的一切问题均由使用者本人负责，与项目发起者、维护者、贡献者无任何关系。
