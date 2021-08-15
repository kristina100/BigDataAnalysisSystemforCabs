import numpy as np
from tqdm import *

def trip_distribution(trajs: list, n_grid: int, epsilon: float) -> np.ndarray:
    """

    :param trajs: 自适应网格得出的结果，即每个轨迹点在哪个网格
    :param n_grid: 划分为多少个网格
    :param epsilon: 隐私预算
    :return: 起止点概率分布矩阵
    """
    # 初始化一个过度概率矩阵
    R = np.zeros((n_grid, n_grid))
    for t in trajs:
        if len(t) > 1:
            sta = t[0]
            end = t[-1]
            R[sta][end] += 1
    # 轨道数量
    count = int(np.sum(R))
    with tqdm(total=n_grid*n_grid) as bar:
        bar.set_description('行程分布')
        for i in range(n_grid):
            for j in range(n_grid):
                bar.update(1)
                # 只有不为0的小格加入拉普拉斯噪声
                if R[i][j] != 0:
                    noise = np.random.laplace(0, 1 / epsilon)  # add laplacian noise
                    R[i][j] += noise
                # 防止出现负概率
                if R[i][j] < 0:
                    R[i][j] = 0
    # 转移矩阵：每一行的转移概率之和等于1
    # 根据行程分布定义：
    R /= count

    return R