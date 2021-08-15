# -*- coding: utf-8 -*-
"""
@File            : Approximate_Trajectory_Partitioning.py
@Time            : 16.29 2021/8/13
@Author          : Horace, JoTer
"""

import numpy as np

from Point import Point
from Segment import Segment


class ATP:
    def __init__(self, tra):
        """初始化一个轨迹，该轨迹包含n个轨迹点，每个轨迹点为一个array，那么tra的形状为n×2"""
        self.tra = tra

    def cal_mo(self, point):
        """计算该向量的模"""
        return np.sqrt((point ** 2).sum())

    def dist_ptol(self, a, b, c):
        """计算点c到直线ab的距离，点为numpy array形式"""
        ca = a - c
        cb = b - c
        ab = b - a
        dist = self.cal_mo(np.cross(ca, cb)) / (self.cal_mo(ab) + np.spacing(1))
        #     cos_t = np.dot(ca, cb)/(cal_mo(ca)*cal_mo(cb)+np.spacing(1))
        #     sin_t = np.sqrt(1-cos_t**2 + np.spacing(1))
        #     dist = cal_mo(ca)*cal_mo(cb)*sin_t/cal_mo(ab)
        if dist == 0:
            return np.spacing(1)
        return dist

    def dist_perp(self, si, ei, sj, ej):
        """根据定义计算两线间的垂直距离，点为array格式"""
        l1_perp = self.dist_ptol(si, ei, sj)
        l2_perp = self.dist_ptol(si, ei, ej)
        dist = (l1_perp ** 2 + l2_perp ** 2) / (l1_perp + l2_perp + np.spacing(1))
        return dist

    # def dist_parr(si, ei, sj, ej):
    #     """根据定义计算两线间的平行距离，点为array格式"""
    #     u1 = np.dot(sj-si, ei-si)/(cal_mo(ei-si)**2)
    #     u2 = np.dot(ej-sj, ei-si)/(cal_mo(ei-si)**2)
    #     ps = si + u1*(ei-si)
    #     pe = si + u2*(ei-si)
    #     l1_parr = min(cal_mo(si-ps), cal_mo(ei-pe))
    #     l2_parr = min(cal_mo(si-pe), cal_mo(ei-pe))
    #     dist = min(l1_parr, l2_parr)
    #     return dist

    def dist_angle(self, si, ei, sj, ej):
        """计算两线间的角度距离"""
        li = ei - si
        lj = ej - sj
        cos_t = np.dot(li, lj) / (self.cal_mo(li) * self.cal_mo(lj) + np.spacing(1))
        if li[0] == lj[0] and li[1] == lj[1]:
            return 0
        if cos_t > 0:
            sin_t = np.sqrt(1 - cos_t ** 2 + np.spacing(1))
            return self.cal_mo(lj) * sin_t
        else:
            return self.cal_mo(lj)

    def dist_func(self, si, ei, sj, ej):
        """距离函数，辅助求解MDL"""
        dist = self.dist_perp(si, ei, sj, ej) + self.dist_angle(si, ei, sj, ej)
        return dist

    def mdl_part(self, startIndex, currIndex):
        """
        计算出若在此点分割的MDL代价的L(D|H)部分
        :param startIndex: 起点的索引
        :param currIndex: 当前的索引
        :return: L(D|H)部分
        """
        cost = 0
        for j in range(startIndex, currIndex):
            if list(self.tra[startIndex]) == list(self.tra[j]) and list(self.tra[currIndex]) == list(self.tra[j + 1]):
                continue
            if self.cal_mo(self.tra[currIndex] - self.tra[startIndex]) > self.cal_mo(self.tra[j] - self.tra[j + 1]):
                # 这里判断的原因是算距离的时候要区分哪条是长的，哪条是短的
                # 算法算的时候默认li是长的，lj是短的，因此改变传参位置即可
                dist = self.dist_func(self.tra[startIndex], self.tra[currIndex], self.tra[j], self.tra[j + 1])
            else:
                dist = self.dist_func(self.tra[j], self.tra[j + 1], self.tra[startIndex], self.tra[currIndex])
            cost += np.log2(dist)
        return cost

    def MDL(self):
        """
        一个轨迹的MDL近似解，Approximate Trajectory Partitioning
        :return: 该轨迹的特征点集合CP
        """
        tra_len = len(self.tra)
        if tra_len == 0:
            return []
        CP = []  # CP: characteristic points
        CP.append(self.tra[0])
        startIndex = 0
        length = 1
        while startIndex + length < tra_len:
            currIndex = startIndex + length
            if self.mdl_part(startIndex, currIndex) < 0:
                CP.append(self.tra[currIndex - 1])
                startIndex = currIndex - 1
                length = 1
            else:
                length += 1
        CP.append(self.tra[-1])  # 把轨迹终点加进去
        return np.array(CP)


def array2Segment(CP):
    """
    将CP的array形式转变成后续算法好处理的Segment类型
    :param CP: 特征点集合
    :return: 线段类型的特征点集合
    """
    line_num = len(CP) - 1  # n个特征点则形成n-1条线段
    if line_num <= 0:
        return []
    CP_segments = [Segment(Point(CP[i][0], CP[i][1]), Point(CP[i + 1][0], CP[i + 1][1])) for i in range(line_num)]
    print('共有' + str(len(CP_segments)) + '条线段')
    return CP_segments
