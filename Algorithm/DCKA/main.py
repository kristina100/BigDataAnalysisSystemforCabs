import pandas as pd
import numpy as np
from DCKA import *

if __name__ == '__main__':
    #打开csv文件
    df = pd.read_csv('data_20170201.csv')
    #进行初步数据处理
    data = np.array(df)
    #切分数据集
    points = [[] for i in range(10)]
    j = -1
    for i in range(len(data) - 1):
        if i % 12181 == 0:
            j += 1
        points[j].append(data[i])
    points = np.array(points)

    #定义邻接矩阵的发送信号智能体列表
    A = [
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    ]
    N_i = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    #对每个中心点求平均
    center_points = DCKA(10, 10, points, 300)
    sum = np.zeros(center_points[0].shape)
    for i in range(10):
        sum = sum + center_points[i]
    index = sum / 10
    #得到最后的聚类结果
    cluster = create_clusters(index, 10, data)
    #存入csv
    pd.DataFrame(cluster).to_csv('cluster_1.csv')


