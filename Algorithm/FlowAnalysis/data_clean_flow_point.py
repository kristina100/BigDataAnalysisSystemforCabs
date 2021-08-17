# -*- coding: utf-8 -*- 
# Time : 2021/8/18 0:48 
# Author : Kristina 
# File : data_clean.py
# contact: kristinaNFQ@163.com
# MyBlog: kristina100.github.io
# -*- coding:UTF-8 -*-

import pandas as pd
import csv


def read_single_csv(input_path):
    df_chunk = pd.read_csv(input_path,chunksize=1000000,encoding='UTF-8',low_memory=False)
    res_chunk=[]
    for chunk in df_chunk:
        res_chunk.append(chunk)
    res_df=pd.concat(res_chunk)
    print(res_df)
    return res_df


new_data = read_single_csv("Data/flow_data_point.csv")

area_1 = pd.DataFrame(new_data, columns=['W','get_off_long','get_off_lat'])
# 去除异常值

area_1 = area_1.drop(area_1[area_1.get_off_long < 0.01].index)
area_1 = area_1.drop(area_1[area_1.get_off_long < 0.01].index)

print(len(area_1))


for index, row in area_1.iterrows():
    if 113.183467 > row['get_off_long'] > 113.988831 and 22.565976 > row[
        'get_off_lat'] > 23.911726:
        area_1.drop(index=index,inplace=True)

print(len(area_1))

# area_1.to_csv("flow_data_points.csv")

