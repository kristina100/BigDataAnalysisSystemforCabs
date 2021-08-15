package com.taxi.service;

import com.taxi.po.OperateHis;

import java.util.List;


/**
 * @author MOITY
 */
public interface OperateHisService {

    /**
     * 查询固定量的所有数据
     * @return 返回第几页的数据
     */
    List<OperateHis> selectTaxi();

    /**
     * 通过车牌号查询
     * @param licensePlate 车牌号
     * @return 返回数据
     */
    List<OperateHis> selectTaxiByLicensePlate(String licensePlate);

    /**
     * 返回所有数据
     * @return 返回所有的数据
     */
    List<OperateHis> selectAll();
}
