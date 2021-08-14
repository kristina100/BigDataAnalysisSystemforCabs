import numpy as np
from tqdm import *

def markov_model(trajs: list, n_grid: int, _epsilon: float) -> np.ndarray:
    # 构建|A|X|A|矩阵O
    # 矩阵初始化
    O_ = np.zeros((n_grid, n_grid))
    #遍历每条轨迹
    with tqdm(total=len(trajs)) as bar:
        bar.set_description('MMC:计算phi')
        for t in trajs:
            bar.update(1)
            O_sub = np.zeros((n_grid, n_grid))
            #计算phi
            for i in range(len(t) - 1):
                curr_point = t[i]
                next_point = t[i + 1]
                O_sub[curr_point][next_point] += 1

            O_sub /= (len(t) - 1)
            O_ += O_sub

    #构建拉普拉斯噪声矩阵
    with tqdm(total=n_grid*n_grid) as bar:
        bar.set_description('MMC:添加拉普拉斯噪声')
        for i in range(n_grid):
            for j in range(n_grid):
                bar.update(1)
                noise = np.random.laplace(0, 1 / _epsilon)
                O_[i][j] += noise

                if O_[i][j] < 0:
                    O_[i][j] = 0

    #计算X
    row_sum = [sum(O_[i]) for i in range(n_grid)]
    for j in range(n_grid):
        O_[j] /= row_sum[j]

    return O_