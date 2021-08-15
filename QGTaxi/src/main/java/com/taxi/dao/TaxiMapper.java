package com.taxi.dao;

import com.taxi.po.OperateHis;
import com.taxi.po.Position;
import com.taxi.po.TaxiData;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @author : Ice'Clean,MOIY
 * @date : 2021-08-09
 */
public interface TaxiMapper {

    /**
     * 获取所有的分表
     * 通过 information_schema 数据库的 tables 表查询出所有的分表记录
     * 用于分表查询时对每一张表都进行查询
     *
     * @return 所有分表名称的集合
     */
    @Select("select TABLE_NAME from information_schema.TABLES " +
            "where TABLE_NAME like 'day2017%'")
    List<String> getAllTable();

    /**
     * 根据日期获取行车轨迹
     * @param license 车牌号
     * @param date 指定日期
     * @return 指定日期某车辆的行车轨迹坐标集合
     */
    //@SelectProvider(type = TaxiMapperProvider.class, method = "getTraceByTime")
    @Select("select LONGITUDE, LATITUDE from taxi_data.day2017${date} where LICENSEPLATENO = #{license} order by ID")
    List<TaxiData> getTraceByTime(@Param("license") String license, @Param("date") String date);

    /**
     * 根据车牌号查找指定车辆，用于判断该车牌号是否存在
     * @param license 车牌号
     * @param date 指定日期
     * @return 得到的行数（限制为只查一条，提高效率）
     */
    @Select("select ID from taxi_data.day2017${date} where LICENSEPLATENO = #{license} limit 1")
    Integer isCarExist(@Param("license") String license, @Param("date") String date);

    /**
     * 通过车辆状态查询所有数据 CAR_STAT1
     * @param state1 车辆状态
     * @return 该状态的所有数据
     */
    @Select("select * from taxi_data.day20170201 where CAR_STAT1 = #{state1} limit 10")
    List<TaxiData> selectByCAR_STAT1(String state1);

    /**
     * 在clickhome中查询某车牌号的数据
     * @param LICENSEPLATENO 车牌号
     * @return 该车牌号的相关数据
     */
    @Select("select * from taxi_data.gps_data where LICENSEPLATENO = #{LICENSEPLATENO} limit 10")
    List<TaxiData> selectByLICENSEPLATENO(String LICENSEPLATENO);

    /**
     * 查询 上车经度、上车纬度、下车经度、下车纬度
     * 分片查询
     * @param page 第几”片“
     * @param size 每一”片“的大小
     * @return 每一”片“的数据
     */
    @Select("select GET_ON_LONGITUDE, GET_ON_LATITUDE,GET_OFF_LONGITUDE,GET_OFF_LATITUDE " +
            "from  operator_his.OPERATE_HIS limit #{page},#{size}")
    List<OperateHis> getPositions(@Param("page") Integer page ,@Param("size") Integer size);

    /**
     * 根据区域代号获取载客热点
     * @return 对应载客热点的列表
     */
    @Select("select LONGITUDE, LATITUDE from store.simple_data")
    List<Position> getHotPoints();


    /**
     * 测试用例
     * 在每一张表中取出一定量的数据
     * @param tableList 表名列表
     * @return 所有数据的列表
     */
    @SelectProvider(type = TaxiMapperProvider.class, method = "getTableData")
    List<Position> getTableData(@Param("tableList") List<String> tableList);

    /**
     * 返回前端/移动热力图
     * 按照时间段，分片传输数据
     * @param startTime 起始时间
     * @param endTime 终止时间
     * @param page 第几段
     * @param size 这一段的数据大小
     * @param form 哪个表
     * @return 数据
     */
    @Select("select LONGITUDE,LATITUDE from taxi_data.${form} where IN_DATE between #{startTime} and #{endTime} limit #{page},#{size}")
    List<TaxiData> selectByTimeSlot(@Param("startTime") String startTime,@Param("endTime") String endTime,
                                    @Param("page") Integer page,@Param("size") Integer size,@Param("form") String form);

    class TaxiMapperProvider {

        /**
         * 在每张表中获取一条数据（测试用例）
         * @param tableMap 存放表名列表
         * @return 该功能的 sql 语句
         */
        public String getTableData(Map<String, List<String>> tableMap) {
            // 获取全部的表
            List<String> tableList = tableMap.get("tableList");
            StringBuilder sql = new StringBuilder();

            // 书写查询 30 张表的 sql
            tableList.forEach(table -> {
                sql.append("(select LONGITUDE, LATITUDE from taxi_data.")
                        .append(table).append(" limit 1) union all ");
            });

            // 去掉最后一个 union
            sql.delete(sql.length() - 10, sql.length());

            return sql.toString();
        }

        public String getTraceByTime(Map<String, String> params) {
            return "select LONGITUDE, LATITUDE, IN_DATE from taxi_data.day2017" + params.get("date") + " where LICENSEPLATENO = '" + params.get("license") + "'";
        }
    }
}
