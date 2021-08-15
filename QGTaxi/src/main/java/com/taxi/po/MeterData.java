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
public class MeterData {
    private Integer meter_data_no;
    private String plateno;
    private Integer plateno_company_id;
    private String chauffeur_no;
    private String chauffeur_company_id;
    private String equipment_no;
    private String meter_data_seq;
    private String meter_no;
    private Date work_begin_time;
    private Date work_end_time;
    private Float price;
    private Float load_mileage;
    private Integer slow_counting_time;
    private Float meter_money;
    private Float empty_mileage;
    private Date empty_begin_time;
    private Integer meter_k_value;
    private String yct_logic_card_no;
    private String pay_mode;
    private Integer status;
    private Date log_time;
    private String meter_plateno;
    private Integer reckonserial;
    private Integer error_type;
}
