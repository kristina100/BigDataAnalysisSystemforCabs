package com.taxi.exception;

/**
 * @author MOITY IceClean
 */
public interface ResultCode {
    /**
     * 操作是否成功,true为成功，false操作失败
     * @return
     */
    boolean success();

    /**
     * 操作代码
     * @return
     */
    int code();

    /**
     * 提示信息
     * @return
     */
    String message();
}
