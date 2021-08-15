package com.taxi.controller;

import com.taxi.service.MeterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;



/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-09
 */
@RestController
public class MeterController {
    @Autowired
    MeterService meterService;

}
