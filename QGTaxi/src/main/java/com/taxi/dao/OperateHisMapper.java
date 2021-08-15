package com.taxi.dao;

import com.taxi.po.OperateHis;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author MOITY
 */
@Repository
public interface OperateHisMapper {

    /**
     * 在operator_his.OPERATE_HIS表中查询所有数据
     * @return 所有数据
     */
    @Select("select * from operator_his.OPERATE_HIS")
    List<OperateHis> selectTaxi();

    /**
     * 在operator_his.OPERATE_HIS表按车牌号查询此车牌号的所有数据
     * @param licensePlate 车牌号
     * @return 返回按照车牌号查询出来的数据
     */
    @Select("select * from operator_his.OPERATE_HIS where PLATE_NO = #{licensePlate} limit 10")
    List<OperateHis> selectTaxiByLicensePlate(String licensePlate);


}
