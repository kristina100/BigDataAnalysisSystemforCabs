package com.taxi.Builder;

import com.taxi.po.InterData;

import java.util.List;

/**
 * @author MOITY
 */
public abstract class Director {

    public abstract InterData getList(List list);
    public abstract InterData getMap(List list, String...keys);
}
