# -*- coding: utf-8 -*-
"""
@File            : Line_Segment_Clustering.py
@Time            : 16.29 2021/8/13
@Author          : Horace, JoTer
"""

import math
from Point import Point
from collections import deque, defaultdict
from Segment import Segment, compare


# min_traj_cluster = 2  # 定义聚类的簇中至少需要的trajectory数量


class LSC:
    def __init__(self, epsilon=0.1, min_lines=5):
        """
        线段密度聚类，基于DBSCAN更改
        :param epsilon:
        :param min_lines: 核心线段要求的最小线段数
        """
        self.epsilon = epsilon
        self.min_lines = min_lines

    def neighborhood(self, seg, segs):
        """
        计算一个segment在距离epsilon范围内的所有segment集合
        :param seg: 需要计算的segment对象
        :param segs: 所有的segment集合, 为所有集合的partition分段结果集合
        :return: seg在距离epsilon内的所有Segment集合
        """
        segment_set = []
        for segment_tmp in segs:
            seg_long, seg_short = compare(seg, segment_tmp)  # get long segment by compare segment
            if seg_long.get_all_distance(seg_short) <= self.epsilon:
                segment_set.append(segment_tmp)
        return segment_set

    def expand_cluster(self, segs, queue, cluster_id):
        """
        扩展簇
        :param segs: 所有的segment集合, 为所有集合的partition分段结果集合
        :param queue: 一个双向列表
        :param cluster_id: 该簇所属的类
        """
        while len(queue) != 0:
            curr_seg = queue.popleft()
            curr_num_neighborhood = self.neighborhood(curr_seg, segs)
            if len(curr_num_neighborhood) >= self.min_lines:
                for m in curr_num_neighborhood:
                    if m.cluster_id == -1:
                        queue.append(m)
                        m.cluster_id = cluster_id
            else:
                pass

    def line_segment_clustering(self, traj_segments):
        """
        线段segment聚类, 采用DBSCAN的聚类算法
        :param traj_segments: 所有轨迹的partition划分后的segment集合
        :return: 聚类的集合和不属于聚类的集合
        """
        cluster_id = 0
        cluster_dict = defaultdict(list)
        for seg in traj_segments:
            _queue = deque(list(), maxlen=50)
            if seg.cluster_id == -1:
                seg_num_neighbor_set = self.neighborhood(seg, traj_segments)
                if len(seg_num_neighbor_set) >= self.min_lines:
                    seg.cluster_id = cluster_id
                    for sub_seg in seg_num_neighbor_set:
                        sub_seg.cluster_id = cluster_id  # assign clusterId to segment in neighborhood(seg)
                        _queue.append(sub_seg)  # insert sub segment into queue
                    self.expand_cluster(traj_segments, _queue, cluster_id)
                    cluster_id += 1
                else:
                    seg.cluster_id = -1
            # print(seg.cluster_id, seg.traj_id)
            if seg.cluster_id != -1:
                cluster_dict[seg.cluster_id].append(seg)  # 将轨迹放入到聚类的集合中, 按dict进行存放

        # remove_cluster = dict()
        # cluster_number = len(cluster_dict)
        # for i in range(0, cluster_number):
        #     traj_num = len(set(map(lambda s: s.traj_id, cluster_dict[i])))  # 计算每个簇下的轨迹数量
        #     print("the %d cluster lines:" % i, traj_num)
        #     if traj_num < min_traj_cluster:
        #         remove_cluster[i] = cluster_dict.pop(i)
        # return cluster_dict, remove_cluster
        return cluster_dict


def representative_trajectory_generation(cluster_segment, min_lines=3, min_dist=2.0):
    """
    通过算法生成代表性轨迹
    :param cluster_segment: 轨迹聚类的结果
    :param min_lines: 满足segment数的最小值
    :param min_dist: 生成的轨迹点之间的最小距离
    :return: 每个类别下的代表性轨迹结果
    """
    representive_point = defaultdict(list)
    for i in cluster_segment.keys():
        cluster_size = len(cluster_segment.get(i))
        sort_point = []  # [Point, ...], size = cluster_size*2
        rep_point, zero_point = Point(0, 0, -1), Point(1, 0, -1)

        # 对某个i类别下的segment进行循环, 计算类别下的平均方向向量: average direction vector
        for j in range(cluster_size):
            rep_point = rep_point + (cluster_segment[i][j].end - cluster_segment[i][j].start)
        rep_point = rep_point / float(cluster_size)  # 对所有点的x, y求平均值

        cos_theta = rep_point.dot(zero_point) / rep_point.distance(Point(0, 0, -1))  # cos(theta)
        sin_theta = math.sqrt(1 - math.pow(cos_theta, 2))  # sin(theta)

        # 对某个i类别下的所有segment进行循环, 每个点进行坐标变换: X' = A * X => X = A^(-1) * X'
        #   |x'|      | cos(theta)   sin(theta) |    | x |
        #   |  |  =   |                         | *  |   |
        #   |y'|      |-sin(theta)   cos(theta) |    | y |
        for j in range(cluster_size):
            s, e = cluster_segment[i][j].start, cluster_segment[i][j].end
            # 坐标轴变换后进行原有segment的修改
            cluster_segment[i][j] = Segment(
                Point(s.x * cos_theta + s.y * sin_theta, s.y * cos_theta - s.x * sin_theta, -1),
                Point(e.x * cos_theta + e.y * sin_theta, e.y * cos_theta - e.x * sin_theta, -1),
                traj_id=cluster_segment[i][j].traj_id,
                cluster_id=cluster_segment[i][j].cluster_id)
            sort_point.extend([cluster_segment[i][j].start, cluster_segment[i][j].end])

        # 对所有点进行排序, 按照横轴的X进行排序, 排序后的point列表应用在后面的计算中
        sort_point = sorted(sort_point, key=lambda _p: _p.x)
        for p in range(len(sort_point)):
            intersect_cnt = 0.0
            start_y = Point(0, 0, -1)
            for q in range(cluster_size):
                s, e = cluster_segment[i][q].start, cluster_segment[i][q].end
                # 如果点在segment内则进行下一步的操作
                if (sort_point[p].x <= e.x) and (sort_point[p].x >= s.x):
                    if s.x == e.x:
                        continue
                    elif s.y == e.y:
                        intersect_cnt += 1
                        start_y = start_y + Point(sort_point[p].x, s.y, -1)
                    else:
                        intersect_cnt += 1
                        start_y = start_y + Point(sort_point[p].x,
                                                  (e.y - s.y) / (e.x - s.x) * (sort_point[p].x - s.x) + s.y, -1)
            # 计算the average coordinate: avg_p and dist >= min_dist
            if intersect_cnt >= min_lines:
                tmp_point: Point = start_y / intersect_cnt
                # 坐标转换到原始的坐标系, 通过逆矩阵的方式进行矩阵的计算
                tmp = Point(tmp_point.x * cos_theta - sin_theta * tmp_point.y,
                            sin_theta * tmp_point.x + cos_theta * tmp_point.y, -1)
                _size = len(representive_point[i]) - 1
                if _size < 0 or (_size >= 0 and tmp.distance(representive_point[i][_size]) > min_dist):
                    representive_point[i].append(tmp)
    return representive_point
