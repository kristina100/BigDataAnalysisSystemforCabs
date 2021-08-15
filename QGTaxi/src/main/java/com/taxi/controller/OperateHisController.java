package com.taxi.controller;

import com.taxi.service.OperateHisService;
import com.taxi.utils.dbchange.DataSourceContextHolder;
import com.taxi.utils.dbchange.DataSourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author MOITY
 */
@RestController
public class OperateHisController {

    @Autowired
    private OperateHisService service;

    @GetMapping("/taxi")
    public Object texi(){
        //MySql数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return service.selectTaxi();
    }

    @GetMapping("/searchTaxiByLicensePlate/{licensePlate}")
    public Object selectTaxiByLicensePlate(@PathVariable String licensePlate){
        //MySql数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return service.selectTaxiByLicensePlate(licensePlate);
    }

    @GetMapping("/searchAll")
    public Object selectAll(){
        //MySql数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return service.selectAll();
    }
}
