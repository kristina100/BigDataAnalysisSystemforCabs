package com.taxi.utils.dbchange;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * @author : Ice'Clean,MOITY
 * @date : 2021-08-10
 *
 * 动态数据源切换
 */
public class DynamicDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDbType();
    }
}
