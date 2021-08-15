package com.taxi.utils.dbchange;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-10
 *
 * 负责切换数据库的类
 */
public class DataSourceContextHolder {

    private static final ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();

    public static void setDbType(String dbType) {
        CONTEXT_HOLDER.set(dbType);
    }


    public static String getDbType() {
        return CONTEXT_HOLDER.get();
    }


    public static void clearDbType() {
        CONTEXT_HOLDER.remove();
    }
}
