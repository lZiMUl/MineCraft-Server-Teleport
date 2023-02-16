# MineCraft Server Teleport

---

## 安装方法

* 进入服务器地图行为包目录
    ``cd behavior_packs``

---

* 下载行为包
    ``wget https://github.com/lZiMUl/MineCraft-Server-Teleport/releases/download/1.3.0/MineCraft.Server.Teleport.mcpack``

---

* 将行为包格式 **.mcpack** 重命名为 **.zip**
    ``mv MineCraft.Server.Teleport.mcpack MineCraft.Server.Teleport.zip``

---

* 然后进行解压
    ``unzip MineCraft.Server.Teleport.zip``

---

* 创建服务器地图行为包加载项文件
    ``touch world_behavior_packs.json``

---

* 写入该包设定到世界加载项
  ``echo "[{\"pack_id\": \"cd9d9466-926d-4d95-8e85-d2f914bf95bc\",\"version\": [ 1, 3, 0 ]}]
" >  world_behavior_packs.json``

---

* 启动服务器
