package com.taxi.exception;

import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;


/**
 * @author MOITY IceClean
 */
@ControllerAdvice
@ResponseBody
public class ExceptionCatch {
    /**
     * log4j打印日志
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionCatch.class);


    /**
     * 使用EXCEPTIONS存放异常类型和错误代码的映射
     */
    private static ImmutableMap<Class<? extends Throwable>, ResultCode> EXCEPTIONS;


    /**
     * 使用builder来构建一个异常类型和错误代码的异常集合
     */
    protected static ImmutableMap.Builder<Class<? extends Throwable>, ResultCode> builder = ImmutableMap.builder();

    /*
      加载异常类型，可以加载n个
     */
    static {
        builder.put(IOException.class,CommonCode.IO_EXCEPTION);
    }

    /**
     * 捕获自定义异常类型
     * @param exceptionCoustm
     * @return
     */
    @ExceptionHandler(ExceptionCoustm.class)
    public void exceptionCoustm(ExceptionCoustm exceptionCoustm){
        ResultCode resultCode = exceptionCoustm.getResultCode();
        LOGGER.info(exceptionCoustm.getMessage());
        LOGGER.error("catch exception:{}",exceptionCoustm);
        LOGGER.error("catch exception:{}",resultCode);
        exceptionCoustm.printStackTrace();
    }

    @ExceptionHandler(Exception.class)
    public void exception(Exception exception){
        LOGGER.info(exception.getMessage());
        //打印记录日志
        LOGGER.error("catch exception:{}",exception);
        exception.printStackTrace();
        if (EXCEPTIONS==null){
            //ImmutableMap创建完成，不可在更改数据
            EXCEPTIONS=builder.build();
        }

        //获取异常类型,与定义相符的存入（resultCode）多态
        ResultCode resultCode = EXCEPTIONS.get(exception.getClass());

    }

}
