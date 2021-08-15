package com.taxi.controller;

import com.taxi.po.CarInformation;
import com.taxi.po.InterData;
import com.taxi.service.SimpleDataService;
import com.taxi.utils.dbchange.DataSourceContextHolder;
import com.taxi.utils.dbchange.DataSourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author haimiandaxing
 */
@RestController
public class SimpleDataController {

    @Autowired
    private SimpleDataService simpleDataService;
    @Autowired
    private InterData interData;

    /**
     * 树蛙将新数据存放在新数据库的接口
     * @param LICENSEPLATENO 车牌号
     * @param GPS_TIME       定位时间
     * @param LONGITUDE      经度
     * @param LATITUDE       纬度
     * @param AREA           所属地区
     * @throws ParseException ParseException
     */
    @RequestMapping("/createSimpleData/{LICENSEPLATENO}/{GPS_TIME}/{LONGITUDE}/{LATITUDE}/{AREA}")
    public void createSimpleData(@PathVariable String LICENSEPLATENO, @PathVariable String GPS_TIME, @PathVariable String LONGITUDE, @PathVariable String LATITUDE, @PathVariable String AREA) throws ParseException {
        Date date;
        DateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        date = simpleDateFormat.parse(GPS_TIME);
        //ClickHouse数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_CLICK_HOUSE);
        simpleDataService.createSimpleData(LICENSEPLATENO, date, LONGITUDE, LATITUDE, AREA);
    }

    /**
     * =====这个方法暂时没用上=====
     * 查找该区域内的所有车
     *
     * @param AREA 所属地区
     * @return 返回该区域所有车的车牌号
     */
    @RequestMapping("/findCarsByArea/{AREA}")
    public List<String> findCarsByArea(@PathVariable String AREA) {
        //ClickHouse数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_CLICK_HOUSE);
        return simpleDataService.findCarsByArea(AREA);
    }

    /**
     * ====可能用不到了，因为我直接把所有车的信息都拉进数据库了====
     * 根据车牌号进行新数据库的添加车主信息操作
     *
     * @param plate_no 车牌号
     * @return 添加成功的车主信息
     */
    @RequestMapping("/createCarInfoByPlate/{plate_no}")
    public CarInformation createCarInfoByPlate(@PathVariable String plate_no) {
        return simpleDataService.createCarInfoByPlate(plate_no);
    }

    /**
     * （==前端接口==）
     * 根据车牌号进行车主信息的搜索
     *
     * @param plate_no 车牌号
     * @return 对应的车主信息
     */
    @RequestMapping("/findCarInformationByPlate/{plate_no}")
    public Object findCarInformationByPlate(@PathVariable String plate_no) {
        CarInformation informationByPlate = simpleDataService.findCarInformationByPlate(plate_no);
        if (informationByPlate != null) {
            return informationByPlate;
        }
        return "数据库中无该车牌号的车主信息，请检查输入，或者使用另一个接口进行数据添加";
    }

    /**
     * （==移动接口==）
     * 根据车牌号进行车主信息的搜索
     *
     * @param plate_no 车牌号
     * @return 对应的车主信息
     */
    @RequestMapping("/findCarInfoByPlate/{plate_no}")
    public Object findCarInfoByPlate(@PathVariable String plate_no) {
        CarInformation informationByPlate = simpleDataService.findCarInformationByPlate(plate_no);
        if (informationByPlate != null) {
            interData.setCode(1);
            interData.setData(informationByPlate);
            interData.setMessage("查询成功，返回该车牌号的车主信息");
            return interData;
        }
        interData.setCode(0);
        interData.setData(null);
        interData.setMessage("数据库中无该车牌号的车主信息，请检查输入，或者使用另一个接口进行数据添加");
        return interData;
    }

    /**
     * ====已经没有用了====
     * 用于存入所有的车主信息
     */
    @RequestMapping("/createAllCar")
    public void createAllCar() {
//        List<String> allCar = simpleDataMapper.findAllCar();
//        for (String s : allCar) {
//            simpleDataService.createCarInfoByPlate(s);
//        }
    }

}
