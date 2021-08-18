import numpy as np
import pandas as pd
import random
from tqdm import tqdm


def get_distance(x_1, x_2):
    """
    计算欧式距离
    :param x_1: 点1
    :param x_2: 点2
    :return: 两点之间的欧式距离
    """
    return np.sqrt(np.sum(np.square(x_1 - x_2)))


def center_init(k, dataset):
    """
    初始化中心点
    :param k: 聚类的个数
    :param dataset: 数据集
    :return: 每个类的中心点
    """
    m, n = dataset.shape
    centers = np.zeros((k, n))
    #随机选择k个中心点
    selected_center_index = []
    for i in range(k):
        #不能选到相同的点
        index = random.choice(list(set(range(m))-set(selected_center_index)))
        centers[i] = dataset[index]
        selected_center_index.append(index)
    return centers


def closest_center(sample, centers):
    """
    分类，寻找和样本点最近的中心点
    :param sample: 样本点
    :param centers: 中心点
    :return: 样本属于的类
    """
    closest_i = 0
    closest_dist = float('inf')
    for i, c in enumerate(centers):
        distance = get_distance(sample, c)
        if distance < closest_dist:
            closest_i = i
            closest_dist = distance
    return closest_i


def create_clusters(centers, k, dataset):
    """
    聚类
    :param centers: 中心点
    :param k: 所聚类的个数
    :param dataset: 数据集
    :return: 每个类对应的点索引[[类1中点的索引][类2中点的索引][...][][][]]
    """
    #分为k个类，用来装每个类别对应样本的索引
    clusters = [[] for i in range(k)]
    #遍历样本计算每个样本点离哪个类别比较近
    for row, sample in enumerate(dataset):
        #加入列表中
        center_i = closest_center(sample, centers)
        clusters[center_i].append(row)
    return clusters


def cal_theta(N, center_points, data, k):
    """
    计算每个智能体对应的聚类结果
    以第i个智能体为例子，[[][][][]]len(clusters[i])==k,cluster[i][1]存放属于第一个簇的点的index
    :param N: 智能体的数量
    :param center_points: 中心点
    :param data: 智能体处理的数据
    :param k: 所聚的类的个数
    :return: 聚类结果
    """
    clusters = []
    for i in range(N):
        cluster = create_clusters(center_points[i], k, data[i])
        clusters.append(cluster)

    return clusters


def center_choice(k, N, data):
    """
    每个多智能体选择中心点
    :param k: 要聚的类的个数
    :param N: 智能体的数量
    :param data: 分割好了的数据集
    :return: 中心点
    """
    center_points_init = []
    for i in range(N):
        center_points = center_init(k, data[i])
        center_points_init.append(center_points)

    return center_points_init


# 计算每个智能体聚的每个类的长度
def cal_m(N, cluster):
    """
    计算每个智能体聚的每个类的长度
    :param N: 智能体的个数
    :param cluster: 智能体的聚类结果
    :return: 每个智能体聚的每个类的长度
    """
    length = [[] for i in range(N)]
    for i in range(N):
        for c in cluster[i]:
            l = len(c)
            length[i].append([l, l])
    length = np.array(length)

    return length


def cal_u(N, cluster, data, k):
    """
    计算每个智能体聚的每个类中点的坐标之和
    :param N: 智能体的个数
    :param cluster: 智能体的聚类结果
    :param data: 数据集
    :param k: 要聚的类的个数
    :return: 每个智能体聚的每个类中点的坐标之和
    """
    U = [[] for i in range(N)]
    for i in range(N):
        for j in range(k):
            x = 0
            y = 0
            for c in cluster[i][j]:
                x += data[i][c][0]
                y += data[i][c][1]
            U[i].append([x, y])
    U = np.array(U)

    return U


def cal_X(N, data, theta, k):
    """
    根据公式计算x_{i,k}(0, t+1)
    :param N: 智能体的个数
    :param data: 数据集
    :param theta: 每个只能所聚类的结果
    :param k: 要聚的类的个数
    :return: 公式中的x_{i,k}(0, t+1)
    """
    X = []
    x_1 = cal_u(N, theta, data, k)
    x_2 = cal_m(N, theta)
    for i in range(N):
        x = np.array([x_1[i], x_2[i]]).T
        X.append(x)
    X = np.array(X)

    return X


def neighbour_exchange(N, N_i, A, X):
    """
    根据公式计算
    :param N: 智能体数量
    :param N_i: 能发送信号的智能体的合集，列表
    :param A: 通信拓扑图的邻接矩阵
    :param X: X_{i，k}(s,t)
    :return: 下一时刻的X
    """
    X_new = []
    for i in range(N):
        X_i = 0
        for h in N_i:
            X_i += A[i][h] * X[h]
        X_new.append(X_i)
    X_new = np.array(X_new)

    return X_new


def cal_center(k, X, N):
    """
    根据公式更新类中心
    :param k: 所要聚的类的个数
    :param X: 根据公式计算的X
    :param N: 智能体的个数
    :return: 新的类中心
    """
    C = []
    for i in range(N):
        x = X[i][0]
        y = X[i][1]
        temp = []
        for j in range(k):
            lon = x[j][0] / x[j][1]
            lat = y[j][0] / y[j][1]
            temp.append([lon, lat])
        C.append(temp)
    C = np.array(C)
    return C

def DCKA(k, N, points, iter_n, N_i, A):
    """
    DCKA
    :param k: 所要聚的类的个数
    :param N: 智能体的数量
    :param points: 数据集
    :param iter_n: 迭代次数
    :param N_i: 能发送信号的智能体的集合
    :param A: 智能体通信图的邻接矩阵
    :return: 中心点
    """
    center_points = center_choice(k, N, points)
    with tqdm(total=iter_n) as bar:
        for n in range(iter_n):
            bar.update(1)
            theta = cal_theta(N, center_points, points, k)
            X = cal_X(N, points, theta, k)
            X_new = neighbour_exchange(N, N_i, A, X)
            center_points = cal_center(k, X_new, N)
    return center_points