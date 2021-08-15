package com.taxi.dao;

import com.taxi.po.CarInformation;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
 * @author haimiandaxing, MOITY
 */
public interface SimpleDataMapper {

    /**
     * 树蛙将新数据存放在新数据库的接口
     *
     * @param LICENSEPLATENO 车牌号
     * @param GPS_TIME       定位时间
     * @param LONGITUDE      经度
     * @param LATITUDE       纬度
     * @param AREA           所属地区
     */
    @Insert("insert into store.simple_data values (#{LICENSEPLATENO},#{GPS_TIME},#{LONGITUDE},#{LATITUDE},#{AREA})")
    void createSimpleData(@Param("LICENSEPLATENO") String LICENSEPLATENO, @Param("GPS_TIME") Date GPS_TIME, @Param("LONGITUDE") String LONGITUDE, @Param("LATITUDE") String LATITUDE, @Param("AREA") String AREA);

    /**
     * =====这个方法暂时没用上=====
     * 查找该区域内的所有车
     *
     * @param AREA 所属地区
     * @return 返回该区域所有车的车牌号
     */
    @Select("select LICENSEPLATENO from store.simple_data where AREA = #{AREA}")
    List<String> findCarsByArea(String AREA);

    /**
     * 根据车牌号查询出租车的总里程
     *
     * @param plate_no 车牌号
     * @return 对应的总里程
     */
    @Select("select sum(load_mile) from operator_his.OPERATE_HIS where plate_no = #{plate_no}")
    Double findCarMileByPlate(String plate_no);

    /**
     * 根据车牌号查询出租车的所属公司id
     *
     * @param plate_no 车牌号
     * @return 对应公司id
     */
    @Select("select company_id from operator_his.OPERATE_HIS where plate_no = #{plate_no} limit 1")
    Integer findCarCompanyByPlate(String plate_no);

    /**
     * 进行新数据库的车主信息添加操作
     *
     * @param plate_no   车牌号
     * @param company_id 公司id
     * @param load_mile  总里程
     * @param evaluate   评价等级（全为0）
     */
    @Insert("insert into store.CarInformation values (#{plate_no}, #{company_id}, #{load_mile}, #{evaluate})")
    void createCarInformation(@Param("plate_no") String plate_no, @Param("company_id") Integer company_id, @Param("load_mile") Double load_mile, @Param("evaluate") Double evaluate);

    /**
     * 根据车牌号查询新数据库中的车主信息
     *
     * @param plate_no 车牌号
     * @return 车主信息
     */
    @Select("select * from store.CarInformation where plate_no = #{plate_no}")
    CarInformation findCarInformationByPlate(String plate_no);

    /**
     * ====已经没有用了====
     * 用于存入所有的车主信息
     *
     * @return 所有的车牌号
     */
    @Select("select LICENSEPLATENO from taxi_data.gps_data group by LICENSEPLATENO order by LICENSEPLATENO")
    public List<String> findAllCar();

}
