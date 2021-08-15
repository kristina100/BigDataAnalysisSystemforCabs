package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author MOITY
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OperateHis {
    private Integer ID;
    private String OPERATE_ID;
    private Long OPERATE_SEQ;
    private String EQUIPMENT_ID;
    private String PLATE_NO;
    private Integer COMPANY_ID;
    private String CHAUFFEUR_NO;
    private Integer METER_NO;
    private String METER_K_VALUE;
    private String TEAM_CODE;
    private Double EMPTY_MILE;
    private Date EMPTY_BEGIN_TIME;
    private Date WORK_BEGIN_TIME;
    private Date WORK_END_TIME;
    private Integer UNIT_PRICE;
    private Double LOAD_MILE;
    private Integer SLOW_COUNT_TIME;
    private Integer OPERATE_MONEY;
    private Integer EVALUATE;
    private String RECKON_ID;
    private Integer EQUIPMENT_TYPE;
    private String TRADE_CODE;
    private Date LOG_TIME;
    private Double GET_ON_LONGITUDE;
    private Double GET_ON_LATITUDE;
    private Double GET_OFF_LONGITUDE;
    private Double GET_OFF_LATITUDE;

    public List<List<Double>> getLocation(){
        List<List<Double>> originList = new ArrayList<>();
        List<Double> list1 = new ArrayList<>();
        List<Double> list2 = new ArrayList<>();
        list1.add(this.GET_ON_LONGITUDE);
        list1.add(this.GET_ON_LATITUDE);
        list2.add(this.GET_OFF_LONGITUDE);
        list2.add(this.GET_OFF_LATITUDE);
        originList.add(list1);
        originList.add(list2);
        return originList;
    }
}
