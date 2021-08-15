import numpy as np
from tqdm import *

def generate_adaptive_grid(gps_range, mdl_trajs, epsilon_1, epsilon_total, beta_factor = 80, n_top_grid=7):
    """

    :param gps_range: GPS的经纬度的最大差值，最大经度-最小经度；最大纬度-最小纬度
    :param mdl_trajs:
    :param epsilon_1: 分配给自适应网格的隐私预算
    :param epsilon_total: 总共的隐私预算
    :param beta_factor: 网格常数
    :param n_top_grid: 顶层网格 设置为7X7
    :return:mapped_trajs:每条轨迹中点所在的方格；n_grid：划分的方格数；grid_block_gps_range：每个小方格的边界
    """
    def grid_boundary_judge(cal_grid_idx, boundary=n_top_grid):
        """
        检测得出的结果是否在边界内
        :param cal_grid_idx: 计算出来的网格坐标
        :param boundary: 边界（就是7）
        :return: 网格坐标
        """

        if cal_grid_idx < boundary:
            return cal_grid_idx
        else:
            return boundary - 1

    assert len(gps_range) == 2, 'gps_range的格式发生错误'
    def cal_point_ids(point, n_grid=n_top_grid, step=None, base=None):
        """
        计算这个点归属到哪个网格
        :param point: 点坐标
        :param n_grid: 网格数
        :param step: 网格的长度
        :param base: 最小的经度和纬度
        :return: 网格点的索引
        """

        idx = grid_boundary_judge(int((point[0] - base['lat']) / step['lat']), n_grid) * n_grid \
              + grid_boundary_judge(int((point[1] - base['lon']) / step['lon']), n_grid)
        return idx

    total_trajs = mdl_trajs
    #根据论文beta的经验最佳值为(epsilon_total-epsilon_1)/80
    beta = (epsilon_total - epsilon_1) / beta_factor
    #一共有C个网格
    C = n_top_grid ** 2

    #划分板块，经纬度划分成49份，这个是经纬度的步长
    top_block_gps_step = {
        'lon': (gps_range['lon'][1] - gps_range['lon'][0]) / n_top_grid,
        'lat': (gps_range['lat'][1] - gps_range['lat'][0]) / n_top_grid
    }
    #eta是查询
    eta = [0 for i in range(C)]
    #这里是计算查询，遍历每个轨迹
    with tqdm(total=len(total_trajs)) as bar:
        bar.set_description('ADC计算查询')
        for traj in total_trajs:
            bar.update(1)
            #遍历轨迹中的所有点
            for p in traj:
                C_idx = cal_point_ids(p, step=top_block_gps_step,
                                      base={'lon': gps_range['lon'][0], 'lat': gps_range['lat'][0]})
                if len(traj):
                    eta[C_idx] += 1 / len(traj)
                else:
                    eta[C_idx] += 0


        #添加拉普拉斯噪声
    laplace_noise = np.random.laplace(0, 1/epsilon_1, C)
    eta = [eta[i] + laplace_noise[i] for i in range(C)]

        #让小于0的eta等于0
    for i in range(C):
        if eta[i] < 0:
            eta[i] = 0

    #（重划分）将每个方格划分为MXM较小的单元格
    #M = sqrt(beta * eta_{c_i})
    M = [np.sqrt(eta[i] * beta) for i in range(C)]
    #M[i]表示的是第i个方格被划分成M[i]xM[i]个格子
    for i in range(C):
        if M[i] < 1:
            M[i] = 1
        else:
            #四舍五入取整
            M[i] = int(np.rint(M[i]))

    #计算方格区域范围
    grid_block_gps_range = {}
    for i in range(C):
        current_idx = 0
        for j in range(i):
            current_idx += M[j] ** 2

        #如果只有一个方格
        if M[i] == 1:
            #//是保留整数，直接把小数去掉
            #在算行和列（基于方格的）
            row = i // n_top_grid
            col = i - row * n_top_grid
            #确定方格的范围
            grid_block_gps_range[current_idx] = (
                ((row * top_block_gps_step['lat'] + gps_range['lat'][0],
                    col * top_block_gps_step['lon'] + gps_range['lon'][0]),
                    ((row + 1) * top_block_gps_step['lat'] + gps_range['lat'][0],
                    (col + 1) * top_block_gps_step['lon'] + gps_range['lon'][0]))
            )

        else:
            row = i // n_top_grid
            col = i - row * n_top_grid
            #对应的一个顶层网格的范围
            start_point = (row * top_block_gps_step['lat'] + gps_range['lat'][0],
                            col * top_block_gps_step['lon'] + gps_range['lon'][0])
            end_point = ((row + 1) * top_block_gps_step['lat'] + gps_range['lat'][0],
                            (col + 1) * top_block_gps_step['lon'] + gps_range['lon'][0])
            #遍历小网格
            for k in range(M[i] ** 2):
                #划分每个小网格的步长（相当于一个小网格的长和宽）
                bottom_block_gps_step = {
                    'lat': (end_point[0] - start_point[0]) / M[i],
                    'lon': (end_point[1] - start_point[1]) / M[i]
                }
                row = k // M[i]
                col = k - row * M[i]
                #记录每个小网格的范围
                grid_block_gps_range[current_idx + k] = (
                    ((row * bottom_block_gps_step['lat'] + start_point[0],
                      col * bottom_block_gps_step['lon'] + start_point[1]),
                     ((row + 1) * bottom_block_gps_step['lat'] + start_point[0],
                      (col + 1) * bottom_block_gps_step['lon'] + start_point[1]))
                )

            #每个顶层网格的范围
    top_grid_block_gps_range = []
    for i in range(C):
        row = i
        col = i - row * n_top_grid
        top_grid_block_gps_range.append(
            ((row * top_block_gps_step['lat'] + gps_range['lat'][0],
              col * top_block_gps_step['lon'] + gps_range['lon'][0]),
             ((row + 1) * top_block_gps_step['lat'] + gps_range['lat'][0],
              (col + 1) * top_block_gps_step['lon'] + gps_range['lon'][0]))
        )

    #记录网格数
    n_grid = 0
    for i in range(C):
        n_grid += M[i] ** 2

    mapped_trajs = []
    #遍历每一条轨迹
    with tqdm(total=len(total_trajs)) as bar:
        bar.set_description('ADC计算每个点所在的方格位置')
        for i in range(len(total_trajs)):
            bar.update(1)
            mapped_traj = []
            #遍历轨迹的每一个点
            for point in total_trajs[i]:
                #遍历每个小方格
                for k in range(n_grid):
                    grid_range = grid_block_gps_range[k]
                    #如果这个点在这个方格的范围之内，就将它加入列表中
                    if grid_range[1][0] >= point[0] >= grid_range[0][0] and grid_range[1][1] >= point[1] >= grid_range[0][1]:
                        mapped_traj.append(k)

            mapped_trajs.append(mapped_traj)
        bar.update(1)
    return mapped_trajs, n_grid, grid_block_gps_range



