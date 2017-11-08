package gnnt.mebs.api.common;

import org.apache.commons.lang.StringUtils;

public enum SectionType {
	 BP("0", "白盘"), 
     YP("1", "夜档"), 
     ZS("2", "指数");

     private SectionType(String value, String desc) {
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

     public static SectionType getDes(String value) {
         if (StringUtils.isNotBlank(value)) {
             for (SectionType p : SectionType.values()) {
                 if (p.getValue().equals(value)) {
                     return p;
                 }
             }
         }
         return null;
     }
}
