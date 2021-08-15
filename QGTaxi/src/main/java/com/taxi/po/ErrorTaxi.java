package com.taxi.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorTaxi {
    private Integer id;
    private String plate_no;
    private String longitude;
    private String latitude;
    private Integer company_id;
    private Double load_mile;
    private Integer evaluate;
    private String location;
    private String error;

    public ErrorTaxi setId(Integer id) {
        this.id = id;
        return this;
    }

    public ErrorTaxi setError(String error) {
        this.error = error;
        return this;
    }

    public ErrorTaxi setPlate_no(String plate_no) {
        this.plate_no = plate_no;
        return this;
    }

    public ErrorTaxi setLongitude(String longitude) {
        this.longitude = longitude;
        return this;
    }

    public ErrorTaxi setLatitude(String latitude) {
        this.latitude = latitude;
        return this;
    }

    public ErrorTaxi setCompany_id(Integer company_id) {
        this.company_id = company_id;
        return this;
    }

    public ErrorTaxi setLoad_mile(Double load_mile) {
        this.load_mile = load_mile;
        return this;
    }

    public ErrorTaxi setEvaluate(Integer evaluate) {
        this.evaluate = evaluate;
        return this;
    }

    public ErrorTaxi setLocation(String location) {
        this.location = location;
        return this;
    }
}
