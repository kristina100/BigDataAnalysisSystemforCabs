package com.taxi.exception;


import java.util.Map;

/**
 * @author MOITY IceClean
 */

public enum  CommonCode implements ResultCode {
    /**
     * asd
     */
    EXCEPTIONCOUSTM(false,10000,"自定义异常"),
    OTHER_EXCEPTION(false,99999,"不可预测异常"),
    IO_EXCEPTION(false,20000,"IO异常");

    private Boolean success;
    private Integer code;
    private String message;

    CommonCode(Boolean success, Integer code, String message) {
        this.success = success;
        this.code = code;
        this.message = message;
    }

    @Override
    public boolean success() {
        return success;
    }

    @Override
    public int code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }

}