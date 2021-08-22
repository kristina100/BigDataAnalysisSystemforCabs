# -*- coding: utf-8 -*- 
# Time : 2021/8/20 17:30 
# Author : Kristina 
# File : new_test.py
# contact: kristinaNFQ@163.com
# MyBlog: kristina100.github.io
# -*- coding:UTF-8 -*-

import pandas as pd
import numpy as np
import pickle
from matplotlib.path import Path

data = pd.read_csv("renew_data_for_flow.csv")

data = data[['get_off_long', 'get_off_lat']].values
print(data)
with open("city_boundary.txt", 'r') as f:
    city_boundary = f.read()
print(city_boundary)

city_boundary = city_boundary.split(';')

city_boundary_ = []
for x in city_boundary:
    city_boundary_.append((float(x.split(',')[0]), float(x.split(',')[1])))

city_boundary_ = np.array(city_boundary_)
print(city_boundary_)
path = Path(city_boundary_, closed=True)
data_filter = path.contains_points(data)
target_data = data[data_filter == True]
print(len(data_filter))
print(len(target_data))
print(len(np.unique(target_data,axis=0)))





# city_boundary = location.split(';')
# city_boundary_ = []
# for x in city_boundary:
#     city_boundary_.append((float(x.split(',')[0]), float(x.split(',')[1])))
# location = city_boundary_.values.reshape(city_boundary_.values.shape[1] // 2, 2)
# path = Path(location, closed=True)
# print(path)
#
#
# city_boundary = city_boundary.split(';')
# city_boundary_ = []
# for x in city_boundary:
#     city_boundary_.append((float(x.split(',')[0]), float(x.split(',')[1])))
# #
# city_boundary_.
# path = Path(city_boundary_, codes=True)
# print(path)
# print(city_boundary_)
#
# is_get_on_in_guangzhou = path.contains_points(city_boundary_)

# is_get_on_in_guangzhou = path.contains_points()
