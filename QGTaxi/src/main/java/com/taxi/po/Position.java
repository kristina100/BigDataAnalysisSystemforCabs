package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author : Ice'Clean
 * @date : 2021-08-09
 *
 * 车辆的位置，存放经纬度
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Position {
    private String longitude;
    private String latitude;
}
