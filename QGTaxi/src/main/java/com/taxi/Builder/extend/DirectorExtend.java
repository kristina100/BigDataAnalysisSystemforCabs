package com.taxi.Builder.extend;


import com.taxi.Builder.Director;
import com.taxi.po.InterData;

import java.util.List;

/**
 * @author MOITY
 * 移动端实体类的建造指导。
 */
public class DirectorExtend extends Director {
    private BuilderExtend builderExtend = new BuilderExtend();

    @Override
    public InterData getList(List list){
        builderExtend.setList(list);
        return builderExtend.getInterData();
    }

    @Override
    public InterData getMap(List list, String...keys) {
        builderExtend.setMap(list,keys);
        return builderExtend.getInterData();
    }

}
