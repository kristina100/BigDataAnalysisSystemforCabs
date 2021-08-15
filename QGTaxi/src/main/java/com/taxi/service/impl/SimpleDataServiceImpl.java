package com.taxi.service.impl;

import com.taxi.dao.SimpleDataMapper;
import com.taxi.po.CarInformation;
import com.taxi.service.SimpleDataService;
import com.taxi.utils.dbchange.DataSourceContextHolder;
import com.taxi.utils.dbchange.DataSourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @author MOITY
 */
@Service
public class SimpleDataServiceImpl implements SimpleDataService {

    @Autowired
    private SimpleDataMapper simpleDataMapper;

    @Override
    public void createSimpleData(String LICENSEPLATENO, Date GPS_TIME, String LONGITUDE, String LATITUDE, String AREA) {
        simpleDataMapper.createSimpleData(LICENSEPLATENO, GPS_TIME, LONGITUDE, LATITUDE, AREA);
    }

    @Override
    public List<String> findCarsByArea(String AREA) {
        return simpleDataMapper.findCarsByArea(AREA);
    }

    @Override
    public CarInformation createCarInfoByPlate(String plate_no) {
        //MySql数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        Double load_mile = simpleDataMapper.findCarMileByPlate(plate_no);
        Integer company_id = simpleDataMapper.findCarCompanyByPlate(plate_no);
        Double evaluate = 0.0;
        //ClickHouse数据库
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_CLICK_HOUSE);
        simpleDataMapper.createCarInformation(plate_no, company_id, load_mile, evaluate);
        return new CarInformation(plate_no, company_id, load_mile, evaluate);
    }

    @Override
    public CarInformation findCarInformationByPlate(String plate_no) {
        return simpleDataMapper.findCarInformationByPlate(plate_no);
    }
}
