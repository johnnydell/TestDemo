package gnnt.mebs.api.common;

import org.apache.commons.lang.StringUtils;

public enum HQType {
	 DP("5", "大盘"), 
     SD("4", "三档"), 
     FS("6", "分时"),
     MB("7","每笔"),
	 RK("20", "日K"),
	 CPLX("21","藏品类型");

     private HQType(String value, String desc) {
         this.value = value;
         this.desc = desc;
     }

     private String value;
     private String desc;

     public String getValue() {
         return value;
     }

     public String getDesc() {
         return desc;
     }

     public static HQType getDes(String value) {
         if (StringUtils.isNotBlank(value)) {
             for (HQType p : HQType.values()) {
                 if (p.getValue().equals(value)) {
                     return p;
                 }
             }
         }
         return null;
     }
}
