package com.taxi.po;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@Data
@AllArgsConstructor
@NoArgsConstructor
/**
 * 移动端使用的实体类
 * @author : MOITY
 */
public class InterData {
    private Integer code;
    private Object data;
    private String message;

//    public MobileData success(Object data){
//        this.code = 1;
//        this.data = data;
//        this.message = "成功！";
//        return this;
//    }


    public InterData setCode(Integer code) {
        this.code = code;
        return this;
    }

    public InterData setData(Object data) {
        this.data = data;
        return this;
    }

    public InterData setMessage(String message) {
        this.message = message;
        return this;
    }
}
