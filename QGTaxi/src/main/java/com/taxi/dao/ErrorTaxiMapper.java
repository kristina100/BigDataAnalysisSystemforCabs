package com.taxi.dao;

import com.taxi.po.ErrorTaxi;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorTaxiMapper {
    /**
     * 添加异常车辆信息
     * @param errorTaxi 异常车辆对象
     */
    @Insert("INSERT INTO store.errorTaxi (plate_no,longitude,latitude,company_id,load_mile,evaluate,location,error) " +
            "VALUES (#{plate_no}, #{longitude}, #{latitude}, #{company_id}, #{load_mile}, #{evaluate}, #{location}, #{error})")
    void saveErrorTaxi(ErrorTaxi errorTaxi);

    /**
     * 分页查询异常车辆
     * @return  异常车辆集合
     */
    @Select("SELECT * FROM store.errorTaxi ")
    List<ErrorTaxi> findErrorTaxis();
}
