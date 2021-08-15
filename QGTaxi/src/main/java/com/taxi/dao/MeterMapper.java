package com.taxi.dao;

import com.taxi.po.MeterData;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
public interface MeterMapper {

    /**
     * MySQL 数据库查询
     */
    @Select("select * from operator_his.TAXI_METER_DATA_HIS limit 1")
    List<MeterData> selectAll();

    @Select("select * from operator_his.TAXI_METER_DATA_HIS where work_begin_time between #{startTime} and #{endTime} limit 1000")
    List<MeterData> selectAllByLicensePlateAndTime(@Param("LicensePlate") String LicensePlate ,
                                                   @Param("startTime") String startTime ,
                                                   @Param("endTime") String endTime );
}
