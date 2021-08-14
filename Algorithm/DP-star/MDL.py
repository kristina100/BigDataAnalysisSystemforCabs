import numpy as np
from Base_Cal import *

#计算l(t)
#L(t):计算每两个代表性点之间的距离，再取对数log_2
def Lt(t_traj, star_ind, curr_ind):
    v_length = vlen(t_traj[star_ind], t_traj[curr_ind])
    return np.log2(v_length) if v_length else np.spacing(1)

#计算垂直距离
def cal_prependicular(si, ei, sj, ej):
    si_sj = vec_sub(sj, si)
    si_ei = vec_sub(ei, si)
    si_ej = vec_sub(ej, si)
    _base = vec_dot(si_ei, si_ei)
    if _base == 0:
        return np.spacing(1)
    u1 = vec_dot(si_sj, si_ei) / _base
    u2 = vec_dot(si_ej, si_ei) / _base
    ps = vec_add(si, vec_times(u1, si_ei))
    pe = vec_add(si, vec_times(u2, si_ei))
    l1 = vlen(ps, sj)
    l2 = vlen(pe, ej)
    if l1 + l2 == 0:
        D = 0
    else:
        D = (l1 ** 2 + l2 ** 2) / (l1 + l2)

    return D

#计算角距离
def angular(si, ei, sj, ej):
    si_ei = vec_sub(ei, si)
    sj_ej = vec_sub(ej, sj)
    if si_ei[0] == sj_ej[0] and si_ei[1] == sj_ej[1]:
        return 0
    # 90°<= theta <= 180°,即costheta <= 0, 即两向量点积 <= 0
    if vec_dot(si_ei, sj_ej) <= 0:
        out = np.sqrt(vec_dot(sj_ej, sj_ej))
    # 0° <= theta < 90°
    else:
        # cos = a*b/|a||b|
        cos = vec_dot(si_ei, sj_ej) / (np.sqrt(vec_dot(si_ei, si_ei)) * np.sqrt(vec_dot(sj_ej, sj_ej)))
        if 1 - cos ** 2 > 0:
            sin = np.sqrt(1 - cos ** 2)
        else:
            sin = 0
        out = np.sqrt(vec_dot(sj_ej, sj_ej)) * sin

    return out

#计算L(T|T~)
def Lt_tildeT(t_traj, start_ind, curr_ind):
    P = 0.0
    A = 0.0
    for j in range(start_ind, curr_ind):
        # 如果点是与起点的相邻点则继续
        if t_traj[start_ind] == t_traj[j] and t_traj[curr_ind] == t_traj[j + 1]:
            continue
            # 比较俩线段长度
        if vlen(t_traj[start_ind], t_traj[curr_ind]) > vlen(t_traj[j], t_traj[j + 1]):
            # 求垂直距离
            p = cal_prependicular(t_traj[start_ind], t_traj[curr_ind], t_traj[j], t_traj[j + 1])
            # 求角距离
            a = angular(t_traj[start_ind], t_traj[curr_ind], t_traj[j], t_traj[j + 1])
        else:
            # 求垂直距离
            p = cal_prependicular(t_traj[j], t_traj[j + 1], t_traj[start_ind], t_traj[curr_ind])
            # 求角距离
            a = angular(t_traj[j], t_traj[j + 1], t_traj[start_ind], t_traj[curr_ind])
        P += p
        A += a

    if P != 0:
        P = np.log2(P)
    else:
        P = 0
    if A != 0:
        A = np.log2(A)
    else:
        A = 0
    return P + A

#MDL
def T_MDL(t_traj):
    T_len = len(t_traj)
    if T_len == 0:
        return []

    T_tilde = list()
    T_tilde.append(t_traj[0])
    start_ind = 0
    length = 1

    while start_ind + length < T_len:
        curr_ind = start_ind + length
        if Lt_tildeT(t_traj, start_ind, curr_ind) < 0:
            T_tilde.append(t_traj[curr_ind - 1])
            start_ind = curr_ind - 1
            length = 1
        else:
            length += 1
    T_tilde.append(t_traj[-1])
    return T_tilde
