package com.taxi.service.impl;

import com.taxi.dao.OperateHisMapper;
import com.taxi.po.OperateHis;
import com.taxi.service.OperateHisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * @author MOITY
 */
@Service
public class OperateHisServiceImpl implements OperateHisService {

    @Autowired
    private OperateHisMapper mapper;

    @Override
    public List<OperateHis> selectTaxi() {
        return mapper.selectTaxi();
    }

    @Override
    public List<OperateHis> selectTaxiByLicensePlate(String licensePlate) {
        return mapper.selectTaxiByLicensePlate(licensePlate);
    }

    @Override
    public List<OperateHis> selectAll() {
        return mapper.selectTaxi();
    }
}