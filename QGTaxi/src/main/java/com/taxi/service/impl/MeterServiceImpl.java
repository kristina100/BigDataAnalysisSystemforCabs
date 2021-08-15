package com.taxi.service.impl;

import com.taxi.dao.MeterMapper;
import com.taxi.service.MeterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
@Service
public class MeterServiceImpl implements MeterService {

    @Autowired
    MeterMapper meterMapper;

}
