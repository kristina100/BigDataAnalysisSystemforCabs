package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Ice'Clean
 * @date : 2021-08-09
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaxiData {
    private String LICENSEPLATENO;
    private Date IN_DATE;
    private Date GPS_TIME;
    private String PERIOD;
    private String LONGITUDE;
    private String LATITUDE;
    private String HEIGHT;
    private String SPEED;
    private String DIRECTION;
    private String EFF;
    private String CAR_STAT1;
    private String CAR_STAT2;
    private String GEO_7;
    private String GEO_5;

}
