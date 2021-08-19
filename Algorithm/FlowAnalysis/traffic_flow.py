# -*- coding: utf-8 -*- 
# Time : 2021/8/18 13:11 
# Author : Kristina 
# File : traffic_flow.py
# contact: kristinaNFQ@163.com
# MyBlog: kristina100.github.io
# -*- coding:UTF-8 -*-

import pandas as pd
import csv
from time import sleep
from tqdm import tqdm
import wgs84_to_gcj02


def read_single_csv(input_path):
    """
    读取文件
    :param input_path: 文件路径
    :return:
    """
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


# 使用函数
res = read_single_csv("Data/operator_his_OPERATE_HIS.csv")
# 读取某一天
new_data = res[res['B'].str.contains('20170201')]
# 只读取需要字段
area_0 = pd.DataFrame(new_data, columns=['B', 'get_on_long', 'get_on_lat', 'get_off_long', 'get_off_lat'])
# 清洗数据
area_0 = area_0.drop(area_0[area_0.get_on_long < 0.01].index)
area_0 = area_0.drop(area_0[area_0.get_on_lat < 0.01].index)
area_0 = area_0.drop(area_0[area_0.get_off_long < 0.01].index)
area_0 = area_0.drop(area_0[area_0.get_off_long < 0.01].index)

# 坐标转换
for index, row in area_0.iterrows():
    row['get_off_long'], row['get_off_lat'] = wgs84_to_gcj02.wgs84_to_gcj02(row['get_off_long'], row['get_off_lat'])
    row['get_on_long'], row['get_on_lat'] = wgs84_to_gcj02.wgs84_to_gcj02(row['get_on_long'], row['get_on_lat'])

# 去除不在广州市内的点
for index, row in area_0.iterrows():
    if 113.183467 > row['get_off_long'] > 113.988831 and 22.565976 > row['get_off_lat'] > 23.911726:
        area_0.drop(index=index, inplace=True)
    if 113.183467 > row['get_on_long'] > 113.988831 and 22.565976 > row['get_on_lat'] > 23.911726:
        area_0.drop(index=index, inplace=True)
print(len(area_0))

start_point = []
sort_area = area_0.sort_values(by=['get_on_long'])
print(sort_area)

final_data = area_0.sample(n=50000)

num = 0
sum_on_long = round(0, 6)
sum_on_lat = round(0, 6)
sum_off_long = round(0, 6)
sum_off_lat = round(0, 6)
start_end_point = []

for index, line in tqdm(sort_area.iterrows()):
    if index == 50000:
        break
    num += 1
    sum_on_long += float(line[0])
    sum_on_lat += float(line[1])
    sum_off_long += float(line[2])
    sum_off_lat += float(line[3])
    while num == 500:
        mean_get_on_long = round(sum_on_long / num, 6)
        mean_get_on_lat = round(sum_on_lat / num, 6)
        mean_get_off_long = round(sum_off_long / num, 6)
        mean_get_off_lat = round(sum_off_lat / num, 6)
        start_end_point.append([[mean_get_on_long, mean_get_on_lat], [mean_get_off_long, mean_get_off_lat]])
        sum_on_long = round(0, 6)
        sum_on_lat = round(0, 6)
        sum_off_long = round(0, 6)
        sum_off_lat = round(0, 6)
        num = 0
    sleep(0.01)
sleep(0.5)

# 逐行存入csv
with open('20170201.csv', "a", encoding='utf-8') as f:
    writer = csv.writer(f)
    for point in start_end_point:
        writer.writerow(point)
