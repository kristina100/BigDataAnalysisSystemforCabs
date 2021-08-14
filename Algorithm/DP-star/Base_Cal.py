import numpy as np

#计算两点间距离
def vlen(p1, p2):
    return np.sqrt(((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2))

#两点横纵坐标相减
def vec_sub(p1, p2):
    return [p1[0] - p2[0], p1[1] - p2[1]]

#两点横纵坐标相加
def vec_add(p1, p2):
    return [p1[0] + p2[0], p1[1] + p2[1]]

#数乘
def vec_times(c, p):
    return [p[0] * c, p[1] * c]

#点乘
def vec_dot(p1, p2):
    return p1[0] * p2[0] + p1[1] * p2[1]

#得出最小、最大的经纬度
def min_max_lon_lat(data):
    """
    \
    :param data: 所有轨迹的点
    :return: 最大最小的经纬度
    """
    min_lon = np.inf
    min_lat = np.inf
    max_lon = 0
    max_lat = 0
    for key in data.keys():
        for item in data[key]:
            temp = item[1]
            if temp < min_lon:
                min_lon = temp
            temp = item[1]
            if temp > max_lon:
                max_lon = temp
            temp = item[0]
            if temp < min_lat:
                min_lat = temp
            temp = item[0]
            if temp > max_lat:
                max_lat = temp

    gps_range = {}
    gps_range['lon'] = (min_lon, max_lon)
    gps_range['lat'] = (min_lat, max_lat)

    return gps_range