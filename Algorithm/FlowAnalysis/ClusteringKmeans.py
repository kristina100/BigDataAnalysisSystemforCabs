# -*- coding: utf-8 -*- 
# Time : 2021/8/18 2:10 
# Author : Kristina 
# File : Clustering.py
# contact: kristinaNFQ@163.com
# MyBlog: kristina100.github.io
# -*- coding:UTF-8 -*-


import operator
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import time
from sklearn.cluster import KMeans
import wgs84_to_gcj02


def read_single_csv(input_path):
    df_chunk = pd.read_csv(input_path, chunksize=1000000, encoding='UTF-8',
                           names=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                                  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'get_on_long',
                                  'get_on_lat', 'get_off_long', 'get_off_lat'], low_memory=False)
    res_chunk = []
    for chunk in df_chunk:
        res_chunk.append(chunk)
    res_df = pd.concat(res_chunk)
    print(res_df)
    return res_df


# 读数据
new_data = read_single_csv("Data/operator_his_OPERATE_HIS.csv")

new_data = new_data[new_data['B'].str.contains('20170202')]

# 基于下车地点聚类
area_0 = pd.DataFrame(new_data, columns=['get_off_long', 'get_off_lat'])
# 去除异常值
area_0 = area_0.drop(area_0[area_0.get_off_long < 0.01].index)
area_0 = area_0.drop(area_0[area_0.get_off_long < 0.01].index)
print(len(area_0))

# 坐标转换
for index, row in area_0.iterrows():
    row['get_off_long'], row['get_off_lat'] = wgs84_to_gcj02.wgs84_to_gcj02(row['get_off_long'], row['get_off_lat'])

# 进行坐标限制
with open("city_boundary.txt", 'r') as f:
    city_boundary = f.read()


city_boundary = city_boundary.split(';')

city_boundary_lng = []
city_boundary_lat = []
for x in city_boundary:
    city_boundary_lng.append(float(x.split(',')[0]))
    city_boundary_lat.append(float(x.split(',')[1]))


def pnpoly(testx, testy, nvert=len(city_boundary), vertx=None, verty=None):
    if verty is None:
        verty = city_boundary_lat
    if vertx is None:
        vertx = city_boundary_lng
    c = 0
    for i in range(0, nvert):
        if i == 0:
            j = nvert - 1
        else:
            j = i - 1
        if operator.ne(operator.gt(verty[i], testy),
                       operator.gt(verty[j], testy)) and operator.lt(testx, (vertx[j] -
                                                                             vertx[i]) * (
                                                                                    testy -
                                                                                    verty[
                                                                                        i]) / (
                                                                                    verty[
                                                                                        j] -
                                                                                    verty[
                                                                                        i]) +
                                                                            vertx[i]):
            c = 1 - c  # 点在多变形内

    return c


PNPOLY=[]
for index, row in area_0.iterrows():
    if pnpoly(row[0], row[1]) == 1:
        area_0.drop(area_0.index)


# 得到关于聚类得到的点
area_1 = pd.DataFrame(area_0, columns=['get_off_long', 'get_off_lat'])

print(len(area_1))

area_arr = area_1.values

""" KMeans聚类 """
t0 = time.time()
y_pred = KMeans(n_clusters=10).fit_predict(area_arr)
t_batch = time.time() - t0
print(t_batch)

plt.figure(figsize=(25, 18))
plt.scatter(area_arr[:, 0], area_arr[:, 1], c=y_pred)
my_x_ticks = np.arange(110, 117, 0.5)
my_y_ticks = np.arange(22, 34, 0.5)
plt.xticks(my_x_ticks)
plt.yticks(my_y_ticks)
plt.show()

# 给点填上区域标签
area_1.insert(area_1.shape[1], 'Area', y_pred)
# 进行坐标转换

area_1.to_csv("renew_data_for_flow.csv")

