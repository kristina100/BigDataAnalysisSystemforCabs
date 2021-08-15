package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Ice'Clean,SUO_ZHANG
 * @date : 2021-08-10
 * 对出租车表数据作简化，只包含：
 * 车牌号,GPS时间,经纬度以及区域划分
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleData {
    private String LICENSEPLATENO;
    private Date GPS_TIME;
    private String LONGITUDE;
    private String LATITUDE;
    private String AREA;
}
