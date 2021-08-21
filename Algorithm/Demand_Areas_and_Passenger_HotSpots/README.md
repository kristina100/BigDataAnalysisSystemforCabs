# Demand Areas and Passenger Hot Spots Analysis

## 数据预处理

* 对原始数据（包含上车经纬度及对应日期）进行了坐标转换（将GPS坐标转换为火星坐标），剔除了异常数据（广州市区域范围外的经纬度点），并提取出（02.05~02.11）的数据作为训练数据

## 载客热点问题求解

* 统计（02.05~02.11）内各上车（经纬度）点出现的次数，选取出现次数大于等于10的点作为载客热点

## 需求区域问题求解

* 尝试使用了KMeans、MiniBatchKMeans、DBSCAN、OPTICS、Birch等聚类算法进行求解，最后采用了KMeans的聚类结果，以各需求区域的中心点为圆心，各需求区域中离中心点最远的点与中心点的距离为半径，求得圆形需求区域
* 根据聚类结果，个人认为Birch的效果较好，但由于时间原因未能对聚类后的数据做进一步的处理，同时部分模型的参数还未调到较为理想的值，最后采用了KMeans的聚类结果
* 在跑DBSCAN的数据时，由于数据量过大（导致经常MemoryError/黑屏/蓝屏），没能得到较为理想的结果。有想过借鉴[Density-Based Distributed Clustering Method](http://www.jos.org.cn/html/2017/11/5343.htm)和[Distributed Consensus-Based K-Means Algorithm inSwitching Multi-Agent Networks](http://lsc.amss.ac.cn/~hsqi/papers/JSSC2018-DistributedKmeans.pdf )改进DBSCAN算法，但由于时间原因未能实现

