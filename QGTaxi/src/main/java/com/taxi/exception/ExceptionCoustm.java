package com.taxi.exception;

/**
 * @author MOITY IceClean
 */
public class ExceptionCoustm extends RuntimeException{

    private ResultCode resultCode;

    public ResultCode getResultCode() {
        return resultCode;
    }

    public ExceptionCoustm(ResultCode resultCode) {
//        super必须在构造的第一行，this也一样，所以两者不能同时出现
        super("错误代码:"+resultCode.code()+"错误信息:"+resultCode.message());
        this.resultCode = resultCode;

    }
}