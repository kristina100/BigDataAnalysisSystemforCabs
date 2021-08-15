package com.taxi.controller;


import com.taxi.Builder.extend.DirectorExtend;
import com.taxi.service.TaxiService;
import com.taxi.utils.LocationUtil;
import com.taxi.utils.dbchange.DataSourceContextHolder;
import com.taxi.utils.dbchange.DataSourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
@RestController
public class TaxiController {
    @Autowired
    TaxiService taxiService;

    /**
     * 行车轨迹（前端）
     * 根据车牌号和日期获取指定出租车一天的行车轨迹（给前端的）
     * @param license 车牌号
     * @param date 日期
     * @return 行车轨迹坐标集
     */
    @GetMapping(value = "/getTrace/{license}/{date}")
    public Object getTrace(@PathVariable String license,
                           @PathVariable String date) {
        // 换 MySQL
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return taxiService.getTraceByTime(license, date, 0);
    }

    /**
     * 行车轨迹（移动）
     * 根据车牌号和日期获取指定出租车一天的行车轨迹（给移动的）
     * @param license 车牌号
     * @param date 日期
     * @return 行车轨迹坐标集
     */
    @GetMapping(value = "/getTrace2/{license}/{date}")
    public Object getTrace2(@PathVariable String license,
                            @PathVariable String date) {
        // 换 MySQL
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return taxiService.getTraceByTime(license, date, 1);
    }

    /**
     * 在ClickHouse中查询
     * 通过车牌号查询该车辆的部分信息
     * 暂时固定10条
     * @param LICENSEPLATENO
     * @return
     */
    @GetMapping("/getLICENSEPLATENO/{LICENSEPLATENO}")
    public Object selectByLICENSEPLATENO(@PathVariable("LICENSEPLATENO") String LICENSEPLATENO){
        //ClickHouse数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_CLICK_HOUSE);
        return new DirectorExtend().getList(taxiService.selectByLICENSEPLATENO(LICENSEPLATENO));
    }

    /**
     * 通过车辆状态查询所有数据 CAR_STAT1
     * @param state1 车辆状态
     * @return 该状态的所有数据
     */
    @GetMapping("/getState1/{state1}")
    public Object selectByCAR_STAT1(@PathVariable("state1") String state1){
        //MySql数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return new DirectorExtend().getList(taxiService.selectByCAR_STAT1(state1));
    }

    /**
     * 流向图（前端）
     * @param page  分页参数1
     * @param size  分页参数2
     * @return  流向图数据
     */
    @GetMapping("/data/{page}/{size}")
    public Object getPositions(@PathVariable("page") Integer page ,
                               @PathVariable("size") Integer size) {
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return new DirectorExtend().getList(taxiService.getPositions(page * size, size)).getData();
    }

    /**
     * 返回前端热力图
     * 按照时间段，分片传输数据
     * @param startTime 起始时间
     * @param endTime 终止时间
     * @param page 第几段（分页序数）
     * @param size 这一段的数据大小（页容总数）
     * @return 此片的数据（路径数据）
     */
    @GetMapping("selectByTimeSlot/{startTime}/{endTime}/{page}/{size}")
    public Object selectByTimeSlot(@PathVariable("startTime") String startTime ,
                                   @PathVariable("endTime")String endTime,
                                   @PathVariable("page") Integer page,
                                   @PathVariable("size") Integer size){
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return new DirectorExtend().getMap(taxiService.selectByTimeSlot(startTime,endTime,page*size,size),"lng","lat").getData();
    }

    /**
     * 返回移动热力图
     * 按照时间段，分片传输数据
     * @param startTime 起始时间
     * @param endTime 终止时间
     * @param page 第几段
     * @param size 这一段的数据大小
     * @return 此片的数据
     */
    @GetMapping("selectByTimeSlot2/{startTime}/{endTime}/{page}/{size}")
    public Object selectByTimeSlot2(@PathVariable("startTime") String startTime ,
                                    @PathVariable("endTime")String endTime,
                                    @PathVariable("page") Integer page,
                                    @PathVariable("size") Integer size){
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return new DirectorExtend().getList(taxiService.selectByTimeSlot(startTime,endTime,page*size,size));
    }

    /**
     * 获取区域热点坐标集
     * @return 热点坐标集的字符串
     */
    @GetMapping("/getHotPoints")
    public Object getHotPoints() {
        // 使用 clickHouse 数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_CLICK_HOUSE);

        return taxiService.getHotPoints();
    }

    /**
     * 保存异常车辆信息
     * @param license   车牌号
     * @param longitude 经度
     * @param latitude  纬度
     * @return  提示成功与否的信息
     */
    @GetMapping("saveErrorTaxi/{license}/{longitude}/{latitude}")
    public Object saveErrorTaxi(@PathVariable("license") String license,
                                @PathVariable("longitude")String longitude,
                                @PathVariable("latitude") String latitude){
        return taxiService.saveErrorTaxi(license, longitude, latitude, "熄火");
    }

    /**
     * 分页查询所有异常车辆
     * @param pageNum   分页序号，即第几页（第一页是0，以此类推）
     * @param pageTotal 分页总数，即一页有多少条数据
     * @return  异常车辆集合
     */
    @GetMapping("findErrorTaxis/{pageNum}/{pageTotal}")
    public Object findErrorTaxis(@PathVariable("pageNum") Integer pageNum,
                                 @PathVariable("pageTotal") Integer pageTotal){
        return taxiService.findErrorTaxis(pageNum,pageTotal);
    }
    /**
     * 分页查询所有异常车辆(移端)
     * @param pageNum   分页序号，即第几页（第一页是0，以此类推）
     * @param pageTotal 分页总数，即一页有多少条数据
     * @return  异常车辆集合
     */
    @GetMapping("findErrorTaxis2/{pageNum}/{pageTotal}")
    public Object findErrorTaxis2(@PathVariable("pageNum") Integer pageNum,
                                 @PathVariable("pageTotal") Integer pageTotal){
        return new DirectorExtend().getList(taxiService.findErrorTaxis(pageNum,pageTotal).getList());
    }


    /**
     * 随机生成经纬度
     * @return
     */
    @GetMapping("random/{q}/{a}/{b}/{c}/{d}/{size}")
    public Object text(@PathVariable("q") Integer q,@PathVariable("a") Integer a,
                       @PathVariable("b") Integer b,@PathVariable("c") Integer c,@PathVariable("d") Integer d,@PathVariable("size") Integer size){
        List<List<List<Double>>> list1 = new ArrayList<>();
        for (int i = 0; i < q; i++) {
            Map<String, String> map = LocationUtil.randomLonLat(a, b, c, d);
            Map<String, String> map2 = LocationUtil.randomLonLat(a+size, b+size, c+size, d+size);
            List<Double> list2 = new ArrayList<>();
            list2.add(Double.parseDouble(map.get("J")));
            list2.add(Double.parseDouble(map.get("W")));
            List<Double> list3 = new ArrayList<>();
            list3.add(Double.parseDouble(map2.get("J")));
            list3.add(Double.parseDouble(map2.get("W")));
            List<List<Double>> list4 = new ArrayList<>();
            list4.add(list2);
            list4.add(list3);
            list1.add(list4);
        }
        return list1;
    }
}
