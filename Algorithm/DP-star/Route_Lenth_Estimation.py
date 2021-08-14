import random
import numpy as np
from tqdm import *

#指数机制
def exp_mechanism(score, m:int , epsilon:float) -> int:
    #初始化
    exponents_list = [0 for i in range(m)]
    summary = 0
    sum_exp = 0

    #敏感度为1.0，计算exp(-epsilon|rank(x)-rank(m)/2)
    for i in range(m):
        expo = 0.5 * (score[i]) * epsilon
        exponents_list[i] = np.exp(expo)
        summary += exponents_list[i]

    exponents_list = np.array(exponents_list)
    #每个取值的概率
    exponents_list /= summary
    r = random.random()
    j = 0

    while True:
        sum_exp += exponents_list[j]
        if sum_exp > r:
            break
        j += 1

    return j

def route_lenth_estimate(trajs: list, n_grid: int, lo, hi: float, epsilon: float) -> list:
    C = n_grid * n_grid
    L_matrix = [[] for i in range(C)]
    L = []

    #遍历每一条轨迹
    for t in trajs:
        len_T = len(t)
        #如果轨迹不在范围之内，则跳过
        if len_T > hi:
            continue
        if len_T < 2 or lo > len_T:
            continue

        #该轨迹属于哪个方格
        row = t[0]
        col = t[-1]
        l_index = row * n_grid + col
        #记录这个方格中轨迹的长度
        L_matrix[l_index].append(len_T)

    #遍历每一个方格
    with tqdm(total=C) as bar:
        bar.set_description('RLE')
        for i in range(C):
            bar.update(1)
            score_arr = []
            K = L_matrix[i].copy()
            #从小到达排序
            K.sort()
            #如果轨迹长度小于1，则将0添加到L中
            if len(K) < 1:
                L.append(0)
                continue
            #中间值的索引
            m_index = len(K) / 2

            #计算-|rank(x)-rank(m)|
            for j in range(len(K)):
                score_arr.append(-abs(j - m_index))
            r_index = exp_mechanism(score_arr, len(K), epsilon)
            L.append(K[r_index])

    return L
