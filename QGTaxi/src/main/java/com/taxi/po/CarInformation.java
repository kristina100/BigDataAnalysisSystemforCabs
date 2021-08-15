package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarInformation {
    /**
     * 车牌号
     * 公司id
     * 行驶里程
     * 评价
     */
    private String plate_no;
    private Integer company_id;
    private Double load_mile;
    private Double evaluate;

}
