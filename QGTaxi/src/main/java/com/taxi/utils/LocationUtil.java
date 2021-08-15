package com.taxi.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * @author haimiandaxing,MOITY
 * 通过经纬度获取具体地址的API工具类
 * 直接调用即可，返回值为该经纬度的具体地理位置
 * String location = LocationUtil.SelectByLatLog("113.2753", "23.2130");
 * 广东省广州市白云区黄石街道鹤边鹤北二横路
 */
public class LocationUtil {

    public static String selectByLatLog(String lat, String log) {

        //请求链接
        String urlString = "https://restapi.amap.com/v3/geocode/regeo?"
                + "key=8c0e85a323c988ebe4305d364ccf9eb0"
                + "&location="
                + lat + "," + log;
        //访问返回结果
        String result = "";
        //读取访问结果
        BufferedReader read = null;

        try {
            //创建url
            URL url = new URL(urlString);
            //打开连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            //设置通用的请求属性
            connection.setDoOutput(true);
            connection.setRequestMethod("GET");
            //建立连接
            connection.connect();
            //定义 BufferedReader 输入流来读取URL的响应
            read = new BufferedReader(new InputStreamReader(
                    connection.getInputStream(), StandardCharsets.UTF_8));
            String line;//循环读取
            while ((line = read.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //关闭流
            if (read != null) {
                try {
                    read.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        //字符串切割
        int indexFirst = result.indexOf("formatted_address");
        int indexLast = result.indexOf("info");

        return result.substring(indexFirst + 20, indexLast - 4);
    }

    /**
     * @Description: 在矩形内随机生成经纬度
     * @param MinLon：最小经度
     * 		  MaxLon： 最大经度
     *  	  MinLat：最小纬度
     * 		  MaxLat：最大纬度
     * @return @throws
     */
    public static Map<String, String> randomLonLat(double MinLon, double MaxLon, double MinLat, double MaxLat) {
        BigDecimal db = new BigDecimal(Math.random() * (MaxLon - MinLon) + MinLon);
        String lon = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
        db = new BigDecimal(Math.random() * (MaxLat - MinLat) + MinLat);
        String lat = db.setScale(6, BigDecimal.ROUND_HALF_UP).toString();
        Map<String, String> map = new HashMap<String, String>();
        map.put("J", lon);
        map.put("W", lat);
        return map;
    }

}