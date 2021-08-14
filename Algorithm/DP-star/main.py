import time
import json
import numpy as np
import pandas as pd
from MDL import *
from tqdm import *
from parament import *
from Adaptive_grid_construction import *
from Trip_Distribution_Extraction import *
from Mobility_model_construction import *
from Route_Lenth_Estimation import *
from Synthetic_trajectory_generation import *


if __name__ == '__main__':
    #加载已经处理好的json文件
    f = open('day_20170201.json', 'r')
    content = f.read()
    day_0201 = json.loads(content)

    #MDL特征点筛选
    MDL = []
    with tqdm(total=len(day_0201)) as bar:
        bar.set_description('MDL')
        for key in day_0201.keys():
            temp = T_MDL(day_0201[key])
            MDL.append(temp)
            bar.update(1)

    #删除特征点只有两个的轨迹
    error = []
    for i in range(len(MDL)):
        if len(MDL[i]) == 2:
            error.append(i)
    for i in reversed(error):
        del MDL[i]

    #得到轨迹点的范围
    gps_range = min_max_lon_lat(day_0201)
    #自适应网格
    mapped_trajs, n, grid_block_gps_range = generate_adaptive_grid(gps_range, MDL, epsilon_1,epsilon_total,
                                                                    beta_factor=80, n_top_grid=7)
    #得到起止点概率分布矩阵
    R = trip_distribution(mapped_trajs, n, epsilon_2)
    #得到转移矩阵
    O = markov_model(mapped_trajs, n, epsilon_3)
    #得到最大轨迹长度
    max_T = 0
    for item in MDL:
        if len(item) > max_T:
            max_T = len(item)
    #得到路程长度估计
    l_array = route_lenth_estimate(mapped_trajs, n, 0, max_T * 1.5, epsilon_4)
    len_modify_func = lambda x: x if x >= 2 else 2
    l_array = [len_modify_func(x) for x in l_array]
    l_mat = np.array(l_array).reshape((n, n))
    #轨迹合成
    s = synthetic_trajs(n, max_T, R, O, l_mat, len(MDL))
    final = generate_sd_grid_mapping_traj(s, grid_block_gps_range)

    #变成字典
    DP_results = {}
    j = 1
    for i in range(len(final)):
        if len(final[i]) > 50:
            DP_results[j] = final[i]
            j += 1

    #写入json文件
    DP_day_0201 = json.dumps(DP_results, ensure_ascii=False)
    fp1 = open('DP_day_0201.json', 'w+')
    fp1.write(DP_day_0201)
    fp1.close()



