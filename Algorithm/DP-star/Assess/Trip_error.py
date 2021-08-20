import json
import numpy as np
from Base_Cal import *

def calculate_te(raw_trajs, final_trajs, n_grid, gps_range, lat_len_gps, lon_len_gps, A):
    RD = np.zeros((n_grid ** 2) * (n_grid ** 2))
    RSD = np.zeros((n_grid ** 2) * (n_grid ** 2))
    D = []
    SD = []

    for traj in raw_trajs:
        T = []
        for point in traj:
            lat_lon = tuple(point)
            lat = int((lat_lon[0] - gps_range['lat'][0]) / lat_len_gps)
            if lat == n_grid:
                lat -= 1
            lon = int((lat_lon[1] - gps_range['lon'][0]) / lon_len_gps)
            if lon == n_grid:
                lon -= 1
            T.append(lat * n_grid + lon)
        D.append(T)
        RD[T[0] * A + T[-1]] += 1

    for traj in final_trajs:
        T = []
        for point in traj:
            lat_lon = tuple(point)
            lat = int((lat_lon[0] - gps_range['lat'][0]) / lat_len_gps)
            lon = int((lat_lon[1] - gps_range['lon'][0]) / lon_len_gps)
            if lat * n_grid + lon < A:
                T.append(lat * n_grid + lon)
        if T:
            SD.append(T)
            try:
                RSD[T[0] * A + T[-1]] += 1
            except Exception as e:
                print(e)
                continue

    RD = RD / np.sum(RD)
    RSD = RSD / np.sum(RSD)

    RD = RD.tolist()
    RSD = RSD.tolist()

    print('Trip Error: ', jsd(RD, RSD))

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

    n_grid = 6
    A = n_grid ** 2

    lat_len_gps = (gps_range['lat'][1] - gps_range['lat'][0]) / n_grid
    lon_len_gps = (gps_range['lon'][1] - gps_range['lon'][0]) / n_grid


    calculate_te(raw_trajs, final_trajs, n_grid, gps_range, lat_len_gps, lon_len_gps, A)