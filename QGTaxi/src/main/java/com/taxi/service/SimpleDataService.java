package com.taxi.service;

import com.taxi.po.CarInformation;

import java.util.Date;
import java.util.List;

/**
 * @author haimiandaxing,MOITY
 */
public interface SimpleDataService {

    /**
     * 树蛙将新数据存放在新数据库的接口
     *
     * @param LICENSEPLATENO 车牌号
     * @param GPS_TIME       定位时间
     * @param LONGITUDE      经度
     * @param LATITUDE       纬度
     * @param AREA           所属地区
     */
    void createSimpleData(String LICENSEPLATENO, Date GPS_TIME, String LONGITUDE, String LATITUDE, String AREA);

    /**
     * =====这个方法暂时没用上=====
     * 查找该区域内的所有车
     *
     * @param AREA 所属地区
     * @return 返回该区域所有车的车牌号
     */
    List<String> findCarsByArea(String AREA);

    /**
     * 根据车牌号进行新数据库的添加车主信息操作
     *
     * @param plate_no 车牌号
     * @return 添加成功的车主信息
     */
    CarInformation createCarInfoByPlate(String plate_no);

    /**
     * 根据车牌号进行车主信息的搜索
     *
     * @param plate_no 车牌号
     * @return 对应的车主信息
     */
    CarInformation findCarInformationByPlate(String plate_no);

}
