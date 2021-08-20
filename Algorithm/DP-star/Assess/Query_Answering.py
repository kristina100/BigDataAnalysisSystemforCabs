import random
import json
from Base_Cal import *

def re(start_point:tuple, end_point:tuple, radius:float, raw_trajs:list,
       final_trajs:list) -> float:
    """

    :param start_point:最小经度和最小纬度（最小纬度，最小经度）
    :param end_point:（最大纬度，最小纬度）
    :param radius:半径
    :param raw_trajs:原始轨迹集
    :param final_trajs:合成轨迹集
    :return:
    """
    point_row = random.uniform(start_point[0], end_point[0])
    point_col = random.uniform(start_point[1], end_point[1])
    count_d = 0
    count_sd = 0
    #根据论文设定 b = 1 % × |D|
    b = int(len(raw_trajs) * 0.01)

    #通过中心为c、半径为r的圆形区域的轨迹数量
    for i in range(len(raw_trajs)):
        for step in raw_trajs[i]:
            if(step[0] - point_row) ** 2 + (step[1] - point_col) ** 2 <= radius ** 2:
                count_d += 1
                break
        for step in final_trajs[i]:
            if(step[0] - point_row) ** 2 + (step[1] - point_col) ** 2 <= radius ** 2:
                count_sd += 1
                break

    #根据论文的定义RE=\frac{|Q(D)-Q(S_D)|}{max\{Q(D),b\}}
    RE = abs(count_d - count_sd) / max(count_d, b)
    return RE

def cal_re(raw_trajs: list, final_trajs: list, min_latitude: float, min_longitude: float,
           len_latitude: float, len_longitude: float) -> float:
    """

    :param raw_trajs: 原始轨迹集
    :param final_trajs: 合成轨迹集
    :param min_latitude: 最小纬度
    :param min_longitude: 最小经度
    :param len_latitude: 经度的范围
    :param len_longitude: 纬度的范围
    :param epsilon: 隐私预算
    :return: 相对误差RE
    """
    error_r = 0
    #重复实验取平均值
    for it in range(10):
        error_r += re((min_latitude, min_longitude),
                      (min_latitude + len_latitude, min_longitude + len_longitude),
                      0.005, raw_trajs, final_trajs)

    query_avre = error_r / 10
    print('Query AvER:', query_avre)

    return query_avre

if __name__ == '__main__':
    f = open('day_20170201.json', 'r')
    content = f.read()
    raw_data = json.loads(content)

    gps_range = min_max_lon_lat(raw_data)

    raw_trajs = []
    for key in raw_data.keys():
        raw_trajs.append(raw_data[key])

    f = open('DP_day_0201.json', 'r')
    content = f.read()
    final_data = json.loads(content)

    final_trajs = []
    for key in final_data.keys():
        final_trajs.append(final_data[key])

    RE = cal_re(raw_trajs, final_trajs, gps_range['lat'][0], gps_range['lon'][0],
    gps_range['lat'][1] - gps_range['lat'][0], gps_range['lon'][1] - gps_range['lon'][0])