import random
import numpy as np
from tqdm import *

def synthetic_trajs(n_grid: int, max_t_len: int, trip_distribution,
                    midpoint_movement, routes_length, nSyn: int):
    """

    综合轨迹生成

    Args:
        n_grid                : 网格数量
        max_t_len             : 最大网格轨迹长度
        trip_distribution_path: 起止点分布概率矩阵路径
        midpoint_movement_path: 马尔可夫转移概率矩阵路径
        routes_length_path    : 轨迹长度估计矩阵
        sd_path               : 综合生成轨迹路径
        nSyn                  : 轨迹条数

    Returns:

    """
    # 起止点分布概率矩阵
    R = trip_distribution
    # 马尔可夫转移概率矩阵
    X = midpoint_movement

    X_copy = X.copy()
    X_array = [X_copy]
    # 先对转移概率矩阵做乘方，迭代一定次数后基本不变
    for i in range(max_t_len):
        X_array.append(X_array[i] @ X_copy)

    X_array_len = len(X_array)

    # 轨迹长度估计矩阵，展开成一维数组
    L = routes_length.ravel()

    # 综合
    SD = []
    index_list = [j for j in range(n_grid * n_grid)]
    R /= np.sum(R)

    # line 2-6
    with tqdm(total=nSyn) as bar:
        bar.set_description('生成轨迹1')
    for i in range(nSyn):
        bar.update(1)
        # 从Rˆ中挑选一个样本S = (C_start, C_end)
        index = np.random.choice(index_list, p=R.ravel())
        # 起点
        start_point = int(index / n_grid)
        # 终点
        end_point = index - start_point * n_grid
        # tilde{l}
        l_hat = L[index]
        #从exp({ln_2}/{\tilde{l}})中随机挑选一个样本s
        s = int(np.round(random.expovariate(np.log(2) / l_hat)))  # 指数分布取轨迹长
        if s < 2:
            s = 2

        T = []
        prev_point = start_point
        T.append(prev_point)

        # 遍历
        for j in range(1, s-1):
            # 论文公式，X的s-j倍，寻找X_array下标，超过X_array长度则取最后一个
            if s - 1 - j - 1 >= X_array_len:
                X_now = X_array[-1]
            else:
                X_now = X_array[s - 1 - j - 1]
            # 计算赋给C_samp的概率
            sample_prob = []
            for k in range(n_grid):
                sample_prob.append(X_now[k][end_point] * X[prev_point][k])

            sample_prob = np.array(sample_prob)
            if np.sum(sample_prob) == 0:
                continue
            sample_prob /= np.sum(sample_prob)
            now_point = np.random.choice([int(m) for m in range(n_grid)],
                                         p=sample_prob.ravel())
            prev_point = now_point
            T.append(now_point)

        # 加入结束点
        T.append(end_point)
        SD.append(T)

    return SD


def generate_sd_grid_mapping_traj(s, grid_block_gps_range):
    """

    :param s: Sythetic_trajectory_generation得出的结果
    :param grid_block_gps_range: 各个小方格的范围
    :return: 生成的轨迹点
    """
    def random_sampling(grid_range):
        """
        在所在的方格范围内随机挑一个点
        :param grid_range: 小方格的范围
        :return: 经纬度
        """
        x = np.random.uniform(grid_range[0][0], grid_range[1][0])
        y = np.random.uniform(grid_range[0][1], grid_range[1][1])

        return x, y

    reverse_mapped_trajs = []
    for traj in s:
        reverse_mapped_trajs.append([random_sampling(grid_block_gps_range[i]) for i in traj])

    points = []
    with tqdm(total=len(reverse_mapped_trajs)) as bar:
        bar.set_description('生成轨迹2')
        for i in range(len(reverse_mapped_trajs)):
            bar.update(1)
            temp = []
            for point in reverse_mapped_trajs[i]:
                point = [point[0], point[1]]
                temp.append(point)
            points.append(temp)
    return points

