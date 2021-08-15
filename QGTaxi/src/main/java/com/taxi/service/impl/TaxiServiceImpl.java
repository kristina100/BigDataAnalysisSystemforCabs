package com.taxi.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.taxi.Builder.extend.DirectorExtend;
import com.taxi.dao.ErrorTaxiMapper;
import com.taxi.dao.OperateHisMapper;
import com.taxi.dao.TaxiMapper;
import com.taxi.po.OperateHis;
import com.taxi.po.Position;
import com.taxi.po.TaxiData;
import com.taxi.po.*;
import com.taxi.service.TaxiService;
import com.taxi.utils.LocationUtil;
import com.taxi.utils.dbchange.DataSourceContextHolder;
import com.taxi.utils.dbchange.DataSourceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
@Service
public class TaxiServiceImpl implements TaxiService {
    @Autowired
    TaxiMapper taxiMapper;
    @Autowired
    OperateHisMapper operateHisMapper;
    @Autowired
    ErrorTaxiMapper errorTaxiMapper;

    @Override
    public Object getTraceByTime(String license, String date, int style) {
        // 先判断车牌号是否存在
        Integer carExist = taxiMapper.isCarExist(license, date);
        // 返回的数据
        Object trace;
        if (carExist == null) {
            // 不存在则返回错误信息
            if(style == 0){
                Map<String ,Object> map = new HashMap<>();
                map.put("name",license);
                map.put("path",new DirectorExtend().getList(null).getData());
                trace = map;
            }else {
                trace = new DirectorExtend().getMap(null,"longitude","latitude");
            }
        } else {
            // 存在则返回坐标集
            List<TaxiData> traceByTime = taxiMapper.getTraceByTime(license, date);

            traceByTime.forEach(taxiData -> {
                taxiData.setLONGITUDE("" + (Double.parseDouble(taxiData.getLONGITUDE()) + 0.0054242));
                taxiData.setLATITUDE("" + (Double.parseDouble(taxiData.getLATITUDE()) - 0.00257775));
            });

            if(style == 0){
                Map<String ,Object> map = new HashMap<>();
                map.put("name",license);
                map.put("path",new DirectorExtend().getList(traceByTime).getData());
                trace = map;
            }else {
                trace = new DirectorExtend().getMap(traceByTime,"longitude","latitude");
            }
        }
        return trace;
    }

    @Override
    public List<TaxiData> selectByLICENSEPLATENO(String LICENSEPLATENO) {
        return taxiMapper.selectByLICENSEPLATENO(LICENSEPLATENO);
    }

    @Override
    public List<TaxiData> selectByCAR_STAT1(String state1) {
        return taxiMapper.selectByCAR_STAT1(state1);
    }

    @Override
    public List<TaxiData> selectByTimeSlot(String startTime, String endTime, Integer page, Integer size) {
        startTime = startTime.replaceAll("_", " ");
        endTime = endTime.replaceAll("_", " ");
        String form = "day" + startTime.split(" ")[0].replaceAll("-", "");
        List<String> allTable = getAllTable();
        for (int i = 0; i < allTable.size(); i++) {
            if (form.equals(allTable.get(i))) {
                return taxiMapper.selectByTimeSlot(startTime, endTime, page, size, form);
            }
        }
        return null;
    }

    @Override
    public List<OperateHis> getPositions(Integer page, Integer size) {
        return taxiMapper.getPositions(page, size);
    }

    @Override
    public String getHotPoints() {
        StringBuilder pointString = new StringBuilder();
        List<Position> hotPoint = taxiMapper.getHotPoints();

        // 将对象列表转化成字符串
        hotPoint.forEach(position -> {
            pointString.append(position.getLongitude()).append(",");
            pointString.append(position.getLatitude()).append("\n");
        });

        // 去掉所有的 + 号并返回
        return pointString.toString().replaceAll("\\+", "");
    }


    @Override
    public List<String> getAllTable() {
        return taxiMapper.getAllTable();
    }

    @Override
    public String saveErrorTaxi(String license, String longitude, String latitude, String error) {
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        List<OperateHis> list = operateHisMapper.selectTaxiByLicensePlate(license);
        if (list.size() > 0) {
            OperateHis operateHis = list.get(0);
            errorTaxiMapper.saveErrorTaxi(new ErrorTaxi()
                    .setPlate_no(license)
                    .setLongitude(longitude)
                    .setLatitude(latitude)
                    .setCompany_id(operateHis.getCOMPANY_ID())
                    .setLoad_mile(operateHis.getLOAD_MILE())
                    .setEvaluate(operateHis.getEVALUATE())
                    .setLocation(LocationUtil.selectByLatLog(longitude, latitude))
                    .setError(error));
            return "数据存储成功！";
        }
        return "数据存储失败...";
    }

    @Override
    public PageInfo findErrorTaxis(Integer pageNum, Integer pageTotal) {
        PageHelper.startPage(pageNum, pageTotal);
        DataSourceContextHolder.setDbType(DataSourceType.SOURCE_MYSQL);
        return new PageInfo(errorTaxiMapper.findErrorTaxis());
    }


}
