package com.taxi.service;

import com.github.pagehelper.PageInfo;
import com.taxi.dao.TaxiMapper;
import com.taxi.po.OperateHis;
import com.taxi.po.Position;
import com.taxi.po.SimpleData;
import com.taxi.po.TaxiData;
import com.taxi.po.*;
import org.apache.ibatis.annotations.Param;

import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
public interface TaxiService {

    /**
     * 根据日期获取行车轨迹（给前端的）
     * @param license 车牌号
     * @param date 指定日期
     * @param style 区分是前端还是移动（0 前端，1 移动）
     * @return 如果车牌号不存在，返回错误信息，存在则返回指定日期某车辆的行车轨迹坐标集合
     */
    Object getTraceByTime(String license, String date, int style);

    /**
     * 通过车牌号查询此车辆的数据
     * @param LICENSEPLATENO 车牌号
     * @return 该车牌号的数据
     */
    List<TaxiData> selectByLICENSEPLATENO(String LICENSEPLATENO);

    /**
     * 通过车辆状态来查询所有数据
     * @param state1 车辆状态
     * @return 该状态的数据
     */
    List<TaxiData> selectByCAR_STAT1(String state1);

    /**
     * 根据区域代号获取载客热点
     * 并将得到的坐标列表转化成字符串
     * @return 对应载客热点的列表
     */
    String getHotPoints();

    /**
     * 查询该时间段的数据，分片传输
     * @param startTime 起始时间
     * @param endTime 终止时间
     * @param page 页码
     * @param size 每一页的大小
     * @return  List<TaxiData>
     */
    List<TaxiData> selectByTimeSlot(String startTime,String endTime, Integer page, Integer size);

    /**
     * 查询 上车经度、上车纬度、下车经度、下车纬度
     * 分片查询
     * @param page 第几片
     * @param size 这一片需要多少数据
     * @return  List<OperateHis>
     */
    List<OperateHis> getPositions(Integer page , Integer size);

    /**
     * 得到所有的表名
     * @return  List<String>
     */
    List<String> getAllTable();

    /**
     * 保存异常车辆信息
     * @param license   车牌号
     * @param longitude 经度
     * @param latitude  纬度
     * @param error 异常信息
     * @return  提示成功与否的信息
     */
    String saveErrorTaxi(String license,String longitude, String latitude ,String error);

    /**
     * 分页查询所有异常车辆
     * @param pageNum   分页序号，即第几页（第一页是0，以此类推）
     * @param pageTotal 分页总数，即一页有多少条数据
     * @return  异常车辆集合
     */
    PageInfo findErrorTaxis(Integer pageNum, Integer pageTotal);
}
