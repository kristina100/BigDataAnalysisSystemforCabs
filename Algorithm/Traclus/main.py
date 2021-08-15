# -*- coding: utf-8 -*-
"""
@File            : main.py
@Time            : 16.29 2021/8/13
@Author          : Horace, JoTer
"""

import time
import json
import numpy as np

from Approximate_Trajectory_Partitioning import ATP, array2Segment
from Line_Segment_Clustering import LSC, representative_trajectory_generation

if __name__ == '__main__':
    content = json.load(open('./data/xxx', encoding='gbk'))  # 导入一个json文件，存放一千辆车的轨迹点

    I = []
    for car in list(content.keys())[:50]:
        # 筛选了前50辆车
        TR = np.array(content.get(car))
        I.append(TR)

    # 第一部分：将轨迹分成线段
    total_segments = []
    for tra in I:
        model = ATP(tra)
        tra_ATP = model.MDL()
        format_segment = array2Segment(tra_ATP)
        total_segments = total_segments + format_segment

    # 第二部分：线段聚类
    # start_1 = time.time()
    LSC_model = LSC()
    norm_cluster = LSC_model.line_segment_clustering(total_segments)
    # end_1 = time.time()
    # print(end_1 - start_1)

    # 第三部分：获得每个簇的代表性轨迹
    # start_2 = time.time()
    # min_dist的值很重要，需多调试
    RTR_dict = representative_trajectory_generation(norm_cluster, min_lines=2, min_dist=0.0005)
    # 由于数据集中经纬度之间差距较小，min_dist的取值应小
    # end_2 = time.time()
    # print(end_2 - start_2)

    # print(RTR_dict)

    # 将Point格式转换为list格式
    for i in range(len(RTR_dict[0])):
        RTR_dict[0][i] = list([RTR_dict[0][i].x, RTR_dict[0][i].y])

    js_RTR_dict = json.dumps(dict(RTR_dict))
    with open('./data/xxx_res.json', 'w') as f:
        f.write(js_RTR_dict)
