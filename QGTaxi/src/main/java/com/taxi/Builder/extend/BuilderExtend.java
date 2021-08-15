package com.taxi.Builder.extend;

import com.taxi.Builder.Builder;
import com.taxi.po.ErrorTaxi;
import com.taxi.po.InterData;
import com.taxi.po.OperateHis;
import com.taxi.po.TaxiData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author MOITY
 * 移动端实体类的建造实现类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuilderExtend extends Builder {
    private InterData interData = new InterData();
    private List<Object> data = new ArrayList<>();

    /**
     * 行车轨迹（移动）
     * 流向图（前端）
     * 热力图（移动）
     * 异常信息（移动）
     * @param list list
     */
    @Override
    public void setList(List<?> list){
        if(list != null){
            Object object = list.get(0);
            if (object instanceof ErrorTaxi){
                interData.setData(list);
            }
            if(object instanceof OperateHis){
                for (OperateHis position :(List<OperateHis>) list) {
                    data.add(position.getLocation());
                }
                interData.setData(data);
            }
            if(object instanceof TaxiData){
                for (TaxiData position :(List<TaxiData>) list) {
                    List<Double> positionList = new ArrayList<>(2);
                    positionList.add(Double.parseDouble(position.getLONGITUDE()));
                    positionList.add(Double.parseDouble(position.getLATITUDE()));
                    data.add(positionList);
                }
                interData.setData(data);
            }
            interData.setCode(1).setMessage("查询数据成功");
        }
        else {
            interData.setCode(0).setMessage("无数据");
        }
    }

    /**
     * 行车轨迹（前端：lng、lat）
     * 热力图（前端：lng、lat）
     * @param list list集合
     */
    @Override
    public void setMap(List<?> list, String... keys)  {
        if(list != null){
            TaxiData taxiData;
            for (int i = 0; i < list.size(); i++) {
                taxiData=(TaxiData) list.get(i);
                Map<String ,Double> map = new HashMap<>();
                map.put(keys[0],Double.parseDouble(taxiData.getLONGITUDE()));
                map.put(keys[1],Double.parseDouble(taxiData.getLATITUDE()));
                data.add(map);
            }
            interData.setData(data);
            interData.setCode(1).setMessage("查询数据成功");
        }
        else {
            interData.setCode(0).setMessage("无数据");
        }
    }


}
