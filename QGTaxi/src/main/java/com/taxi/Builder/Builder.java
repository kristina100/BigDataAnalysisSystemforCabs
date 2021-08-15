package com.taxi.Builder;

import java.util.List;

/**
 * GPS建造者的抽象类
 * @author MOITY
 */
public abstract class Builder {
    public void setList(List<?> list){}

    public void setMap(List<?> list, String... keys){}

}
