package gnnt.mebs.api.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 
 * ClassName: DateUtils <br/> 
 * Function: 日期公共类处理. <br/>
 * Date: 2016年2月3日 下午3:27:48 <br/>
 *
 * @author daizh
 * @version 1.0
 * @since JDK 1.7
 */
public class DateUtil extends DateUtils {
	
	private static Log log = LogFactory.getLog(DateUtil.class);
	
	public static final String FMT_DATE_YYYY_MM_DD = "yyyy-MM-dd";
	public static final String FMT_DATE_YYYYMMDD = "yyyyMMdd";
	public static final String FMT_DATE_YYMMDD = "yyMMdd";
	public static final String FMT_DATE_YYYY = "yyyy";
	public static final String FMT_DATE_YYMM = "yyMM";
	public static final String FMT_DATE_YYYYMM = "yyyyMM";
	public static final String FMT_DATE_YYYYMMDDHHmmss = "yyyyMMddHHmmss";
	public static final String FMT_DATE_YYYYMMDDHHmm = "yyyyMMddHHmm";
	public static final String FMT_DATE_YYMMDDHHmm = "yyMMddHHmm";
	public static final String FMT_DATE_YYYYMMDDHH = "yyyyMMddHH";
	public static final String FMT_DATE_HHmm = "HHmm";
	public static final String FMT_DATE_DAY = "yyyy-MM-dd 00:00:00";
	public static final String FMT_DATE_HOUR = "yyyy-MM-dd HH:00:00";
	public static final String FMT_DATETIME = "yyyy-MM-dd HH:mm:ss";
	private static String timePattern = "HH:mm";
	
	private static Date tempDate = new Date();

	/**
	 * 
	 * getToday,(获取当前日期字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getToday() {
		Date today = new Date();
		return format(today);
	}

	/**
	 * 
	 * getTodayTime,(获取当前日期的准确时间). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getTodayTime() {
		return format(tempDate, FMT_DATETIME);
	}

	/**
	 * 
	 * addMonth,(对指定日期增加月份). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @param n
	 * @return
	 * @since JDK 1.7
	 */
	public static Date addMonth(Date date, int n) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(2, n);
		return cal.getTime();
	}

	/**
	 * 
	 * getTimeNow,(获取指定日期的时间部分[时分]). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param theTime
	 * @return
	 * @since JDK 1.7
	 */
	public static String getTimeNow(Date theTime) {
		return getDateTime(timePattern, theTime);
	}

	/**
	 * 
	 * getDateTime,(按照指定格式获取指定日期的字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param aMask
	 * @param aDate
	 * @return
	 * @since JDK 1.7
	 */
	public static final String getDateTime(String aMask, Date aDate) {
		SimpleDateFormat df = null;
		String returnValue = "";

		if (aDate == null) {
			log.error("aDate is null!");
		} else {
			df = new SimpleDateFormat(aMask);
			returnValue = df.format(aDate);
		}

		return returnValue;
	}

	/**
	 * 
	 * formatDate,(按照指定格式获取指定日期的字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @param nFmt
	 * @return
	 * @since JDK 1.7
	 */
	public static String formatDate(Date date, String nFmt) {
		SimpleDateFormat fmtDate = new SimpleDateFormat(nFmt);
		return fmtDate.format(date);
	}

	/**
	 * 
	 * getCurrentDateTime,(获取当前日期时间按照格式FMT_DATE_YYYYMMDDHHmmss). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getCurrentDateTime() {
		return formatDate(new Date(), FMT_DATE_YYYYMMDDHHmmss);
	}

	/**
	 * 
	 * getCurrentTime,(获取当前时间部分【时分】). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getCurrentTime() {
		return formatDate(new Date(), FMT_DATE_HHmm);
	}
    
	/**
	 * 
	 * getCurrentDate,(获取当前日期的日期部分). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getCurrentDate() {
		return formatDate(new Date(), FMT_DATE_YYYYMMDD);
	}

	/**
	 * 
	 * getCurrentYYYYMM,(获取当前日期的年月). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getCurrentYYYYMM() {
		return formatDate(new Date(), FMT_DATE_YYYYMM);
	}

	/**
	 * 
	 * getCurrentYYYY,(获取当前日期的年份). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String getCurrentYYYY() {
		return formatDate(new Date(), FMT_DATE_YYYY);
	}

	/**
	 * 
	 * checkIsDate,(检查是否为日期类型). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param strDate
	 * @return
	 * @since JDK 1.7
	 */
	public static final boolean checkIsDate(String strDate) {
		Date returnDate = null;
		try {
			if (strDate.length() == 4)
				returnDate = parseDate(strDate, FMT_DATE_YYYY);
			else if (strDate.length() == 6)
				returnDate = parseDate(strDate, FMT_DATE_YYYYMM);
			else if (strDate.length() == 8)
				returnDate = parseDate(strDate, FMT_DATE_YYYYMMDD);
			else if (strDate.length() == 10)
				returnDate = parseDate(strDate, FMT_DATE_YYYYMMDDHH);
			else if (strDate.length() == 12)
				returnDate = parseDate(strDate, FMT_DATE_YYYYMMDDHHmm);
		} catch (Exception e) {
			return false;
		}
		if (returnDate != null) {
			return true;
		}
		return false;
	}

	/**
	 * 
	 * getWeekInYear,(获取). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @param startOfWeek
	 * @return
	 * @since JDK 1.7
	 */
	public static int getWeekInYear(Date date, int startOfWeek) {
		Calendar cld = Calendar.getInstance();
		cld.setTime(date);
		cld.setFirstDayOfWeek(startOfWeek);

		return cld.get(3);
	}
	
    /**
     * 
     * getDateDiff,(获取两个日期的时间差). <br/>
     * Author: daizh <br/>
     * Create Date: 2016年5月12日 <br/>
     * ===============================================================<br/>
     * Modifier: daizh <br/>
     * Modify Date: 2016年5月12日 <br/>
     * Modify Description:  <br/>
     * ===============================================================<br/>
     * @param d1
     * @param d2
     * @return
     * @since JDK 1.7
     */
	public static int getDateDiff(Date d1, Date d2) {
		double nd = 86400000.0D;
		Long diff = Long.valueOf(Math.round(Math.abs(d1.getTime()
				- d2.getTime())
				/ nd + 0.5D));
		return diff.intValue();
	}

	/**
	 * 
	 * formatToSimpleDate,(将日期对象转化为FMT_DATE_YYYYMMDD格式的字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @return
	 * @since JDK 1.7
	 */
	public static String formatToSimpleDate(Date date) {
		return date == null ? "" :  new SimpleDateFormat(FMT_DATE_YYYYMMDD).format(date);
	}
	
	/**
	 * 
	 * format,(将日期对象转换为FMT_DATETIME格式的日期字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(Date date) {
		return date == null ? "" : format(date, FMT_DATETIME);
	}

	/**
	 * 
	 * format,(将当前日期和当前的时间值，按照FMT_DATETIME格式转化为日期字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param millis
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(long millis) {
		return  format(millis, FMT_DATETIME);
	}

	/**
	 * 
	 * format,(将日历对象转换为FMT_DATETIME格式的日期字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param calendar
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(Calendar calendar) {
		return calendar == null ? "": format(calendar, FMT_DATETIME);
	}

	/**
	 * 
	 * format,将日期转换为指定格式的日期字符串. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @param pattern
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(Date date, String pattern) {
		if (date == null)
			return null;
		SimpleDateFormat formater = new SimpleDateFormat(pattern);
		String result = formater.format(date);
		return result;
	}

	/**
	 * 
	 * format,根据提供的毫秒数和指定的类型转换为当前日期的时间字符串. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param millis
	 * @param pattern
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(long millis, String pattern) {
		tempDate.setTime(millis);
		SimpleDateFormat formater = new SimpleDateFormat(pattern);
		String result = formater.format(tempDate);
		return result;
	}

	/**
	 * 
	 * currentTimeStamp,(获取当前时间的字符时间戳). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @return
	 * @since JDK 1.7
	 */
	public static String currentTimeStamp() {
		return Integer.toString(new Long(System.currentTimeMillis() / 1000).intValue());
	}

	/**
	 * 
	 * format,将日历对象按照指定类型格式转换为日期.. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param calendar
	 * @param pattern
	 * @return
	 * @since JDK 1.7
	 */
	public static String format(Calendar calendar, String pattern) {
		if (calendar == null)
			return null;
		Date date = calendar.getTime();
		SimpleDateFormat formater = new SimpleDateFormat(pattern);
		String result = formater.format(date);
		return result;
	}

	/**
	 * 
	 * parseDate,将日期字符串按照FMT_DATETIME类型格式转换为日期. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param strDate
	 * @return
	 * @since JDK 1.7
	 */
	public static Date parseDate(String strDate) {
		if (strDate == null || strDate.length() == 0)
			return null;
		try {
			Date date = parseDate(strDate, FMT_DATETIME);
			return date;
		} catch (ParseException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	/**
	 * 
	 * parseDate,将日期字符串按照特定的类型格式转换为日期. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param strDate
	 * @param pattern
	 * @return
	 * @throws ParseException
	 * @since JDK 1.7
	 */
	public static Date parseDate(String strDate, String pattern) throws ParseException {
		if (strDate == null || strDate.length() == 0)
			return null;
		SimpleDateFormat formater = new SimpleDateFormat(pattern);
		Date result = formater.parse(strDate);
		return result;
	}

	/**
	 * 
	 * compareYear,(比较两个日期的年份).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYear(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.YEAR);
	}

	/**
	 * 
	 * compareYearToMonth,(比较两个日期到月份级别).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToMonth(Date dateOne, Date dateTwo) {
		int result = compareField(dateOne, dateTwo, Calendar.YEAR);
		if (result != 0)
			return result;
		else
			return compareField(dateOne, dateTwo, Calendar.MONTH);
	}

	/**
	 * 
	 * compareYearToDay,(比较两个日期到天级别).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToDay(Date dateOne, Date dateTwo) {
		int result = compareField(dateOne, dateTwo, Calendar.YEAR);
		if (result != 0)
			return result;
		else
			return compareField(dateOne, dateTwo, Calendar.DAY_OF_YEAR);
	}

	/**
	 * 
	 * compareYearToHour,(比较两个日期到时级).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToHour(Date dateOne, Date dateTwo) {
		int result = compareField(dateOne, dateTwo, Calendar.YEAR);
		if (result != 0)
			return result;
		else {
			result = compareField(dateOne, dateTwo, Calendar.DAY_OF_YEAR);
			if (result != 0)
				return result;
			else {
				return compareField(dateOne, dateTwo, Calendar.HOUR_OF_DAY);
			}
		}
	}

	/**
	 * 
	 * compareYearToMinutes,(比较两个日期到分级).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToMinutes(Date dateOne, Date dateTwo) {
		int result = compareField(dateOne, dateTwo, Calendar.YEAR);
		if (result != 0)
			return result;
		result = compareField(dateOne, dateTwo, Calendar.DAY_OF_YEAR);
		if (result != 0)
			return result;
		result = compareField(dateOne, dateTwo, Calendar.HOUR_OF_DAY);
		if (result != 0)
			return result;
		return compareField(dateOne, dateTwo, Calendar.MINUTE);
	}

	/**
	 * 
	 * compareYearToSeconds,(比较两个日期到秒级).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToSeconds(Date dateOne, Date dateTwo) {
		int result = compareField(dateOne, dateTwo, Calendar.YEAR);
		if (result != 0)
			return result;
		result = compareField(dateOne, dateTwo, Calendar.DAY_OF_YEAR);
		if (result != 0)
			return result;
		result = compareField(dateOne, dateTwo, Calendar.HOUR_OF_DAY);
		if (result != 0)
			return result;
		result = compareField(dateOne, dateTwo, Calendar.MINUTE);
		if (result != 0)
			return result;
		return compareField(dateOne, dateTwo, Calendar.SECOND);
	}

	/**
	 * 
	 * compareYearToMillisecond,比较两个日期到时间戳（毫秒）的大小.返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareYearToMillisecond(Date dateOne, Date dateTwo) {
		return compareDate(dateOne, dateTwo);
	}

	/**
	 * 
	 * compareDate,比较两个日期到时间戳的大小.返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareDate(Date dateOne, Date dateTwo) {
		if (dateOne == null)
			throw new IllegalArgumentException("The dateOne must not be null");
		if (dateTwo == null)
			throw new IllegalArgumentException("The dateTwo must not be null");
		long result = dateOne.getTime() - dateTwo.getTime();
		if (result > 0)
			return 1;
		if (result < 0)
			return -1;
		return 0;
	}

	/**
	 * 
	 * compareMonth,(比较两个日期的月份大小).返回1, 0, -1 三种值 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareMonth(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.MONTH);
	}

	/**
	 * 
	 * compareWeekOfYear,比较两个日期当前年份中的周次. 返回1, 0, -1 三种值<br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareWeekOfYear(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.WEEK_OF_YEAR);
	}

	/**
	 * 
	 * compareWeekOfMonth,比较两个日期当前月份的周次. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareWeekOfMonth(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.WEEK_OF_MONTH);
	}

	/**
	 * 
	 * compareDayOfYear,比较两个日期在当前年份. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareDayOfYear(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.DAY_OF_YEAR);
	}

	/**
	 * 
	 * compareDayOfMonth,比较两个日期的在当前月份中的天次. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareDayOfMonth(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.DAY_OF_MONTH);
	}

	/**
	 * 
	 * compareDayOfWeek,比较两个日期的星期几部分. <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @return
	 * @since JDK 1.7
	 */
	public static int compareDayOfWeek(Date dateOne, Date dateTwo) {
		return compareField(dateOne, dateTwo, Calendar.DAY_OF_WEEK);
	}

	/**
	 * 
	 * compareField,针对日期按照指定的calendar field进行比较.比如:Calendar.Year部分 <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param dateOne
	 * @param dateTwo
	 * @param calendarField
	 * @return
	 * @since JDK 1.7
	 */
	private static int compareField(Date dateOne, Date dateTwo, int calendarField) {
		if (dateOne == null)
			throw new IllegalArgumentException("The dateOne must not be null");
		if (dateTwo == null)
			throw new IllegalArgumentException("The dateTwo must not be null");
		
		Calendar compareCalendarOne = Calendar.getInstance();
		Calendar compareCalendarTwo = Calendar.getInstance();
		
		compareCalendarOne.setTime(dateOne);
        compareCalendarTwo.setTime(dateTwo);
		
		int result = compareCalendarOne.get(calendarField) - compareCalendarTwo.get(calendarField);
		if (result > 0)
			return 1;
		if (result < 0)
			return -1;
		return 0;
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of years to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addYears(Date date, int amount) {
		return addField(date, Calendar.YEAR, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of months to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addMonths(Date date, int amount) {
		return addField(date, Calendar.MONTH, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of weeks to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addWeeks(Date date, int amount) {
		return addField(date, Calendar.WEEK_OF_YEAR, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of days to a date returning a new object. The original date
	 * object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addDays(Date date, int amount) {
		return addField(date, Calendar.DAY_OF_MONTH, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of hours to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addHours(Date date, int amount) {
		return addField(date, Calendar.HOUR_OF_DAY, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of minutes to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addMinutes(Date date, int amount) {
		return addField(date, Calendar.MINUTE, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of seconds to a date returning a new object. The original
	 * date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addSeconds(Date date, int amount) {
		return addField(date, Calendar.SECOND, amount);
	}

	// -----------------------------------------------------------------------
	/**
	 * Adds a number of milliseconds to a date returning a new object. The
	 * original date object is unchanged.
	 *
	 * @param date
	 *			the date, not null
	 * @param amount
	 *			the amount to add, may be negative
	 * @return the new date object with the amount added
	 * @throws IllegalArgumentException
	 *			 if the date is null
	 */
	public static Date addMilliseconds(Date date, int amount) {
		return addField(date, Calendar.MILLISECOND, amount);
	}

	/**
	 * 
	 * add,(这里用一句话描述这个方法的作用). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @param calendarField
	 * @param amount
	 * @return
	 * @since JDK 1.7
	 */
	private static Date addField(Date date, int calendarField, int amount) {
		if (date == null) {
			throw new IllegalArgumentException("The date must not be null");
		}
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(calendarField, amount);
		return c.getTime();
	}

	/**
	 * 把yyyy-MM-dd hh:mm:ss格式的日期字符串转换成 sql.Timestamp 类型 by wx
	 * @param str
	 * @return
	 * @throws ParseException 
	 */
	public static java.sql.Timestamp parseTimestampString(String str) throws ParseException {
		java.sql.Timestamp timestamp = null;
		if (str != null && !str.equals("") && !str.equals(" ")) {
			timestamp = new java.sql.Timestamp(new SimpleDateFormat(FMT_DATETIME, java.util.Locale.US).parse(str).getTime());
		}
		return timestamp;
	}

	/**
	 * 字符串转时间戳
	 * 
	 * @param strDate
	 *			时间
	 * @param Format
	 *			格式 如 yyyy-MM-dd HH:mm:ss
	 * @return second 时间戳 秒
	 * @throws ParseException 
	 */
	public static int strToNum(String strDate, String Format) throws ParseException {
		SimpleDateFormat datetimeFormat = new SimpleDateFormat(Format, java.util.Locale.US);
		Date strToDate = null;
		strToDate = datetimeFormat.parse(strDate);
		long timeStemp = strToDate.getTime();
		int second = (int) (timeStemp / 1000);
		return second;
	}

	/**
	 * 
	 * getQuarterStartTime,获取日期所在季度的开始时间<br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年5月12日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年5月12日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param date
	 * @return
	 * @since JDK 1.7
	 */
	public static String getQuarterStartTime(String date) {
		SimpleDateFormat sdf = new SimpleDateFormat(FMT_DATE_YYYY_MM_DD);
		Calendar c = Calendar.getInstance();
		int currentMonth = Integer.parseInt(StringUtils.substringBetween(date, "-"));
		System.out.println(currentMonth);
		String now = null;
		try {
			Date dateTime = sdf.parse(date);
			c.setTime(dateTime);
			if (currentMonth >= 1 && currentMonth <= 3)
				c.set(Calendar.MONTH, 0);
			else if (currentMonth >= 4 && currentMonth <= 6)
				c.set(Calendar.MONTH, 2);
			else if (currentMonth >= 7 && currentMonth <= 9)
				c.set(Calendar.MONTH, 6);
			else if (currentMonth >= 10 && currentMonth <= 12)
				c.set(Calendar.MONTH, 9);
			c.set(Calendar.DATE, 1);
			now = sdf.format(c.getTime());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return now;
	}

	/**
	 * 当获取日期所在季度的结束时间
	 */
	public static String getQuarterEndTime(String date) {
		SimpleDateFormat sdf = new SimpleDateFormat(FMT_DATE_YYYY_MM_DD);
		Calendar c = Calendar.getInstance();
		int currentMonth = Integer.parseInt(StringUtils.substringBetween(date, "-"));
		String now = null;
		try {
			Date dateTime = sdf.parse(date);
			c.setTime(dateTime);
			if (currentMonth >= 1 && currentMonth <= 3) {
				c.set(Calendar.MONTH, 2);
				c.set(Calendar.DATE, 31);
			} else if (currentMonth >= 4 && currentMonth <= 6) {
				c.set(Calendar.MONTH, 5);
				c.set(Calendar.DATE, 30);
			} else if (currentMonth >= 7 && currentMonth <= 9) {
				c.set(Calendar.MONTH, 8);
				c.set(Calendar.DATE, 30);
			} else if (currentMonth >= 10 && currentMonth <= 12) {
				c.set(Calendar.MONTH, 11);
				c.set(Calendar.DATE, 31);
			}

			now = sdf.format(c.getTime());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return now;
	}
	
	/**
	 * 获得距离最近多少天的日期
	 * @param days 天数， 如果是当前日期之前，则传递负数，如-1，如果是当前日期之后，请传递正数，如1
	 * @author binbin
	 * @return 返回日期字符串
	 */
	public static String getLatestDateDay(int days) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		cal.add(cal.DATE,days);
		Date date = cal.getTime();
		return format(date,FMT_DATE_DAY);
	}
	
	
	/**
	 * 获得距离最近多少小时的时刻，格式 yyyy-MM-dd HH:00:00
	 * @param hours 小时数， 如果是当前时间之前，则传递负数，如-1，如果是当前时间之后，请传递正数，如1
	 * @author binbin
	 * @return
	 */
	public static String getFullLatestDateHour(int hours){
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		cal.add(cal.HOUR,hours);
		
		return format(cal.getTime(),FMT_DATE_HOUR);
	}
	
	/**
	 * 获取距离最近多少小时前的特点时刻，格式 yyyy-MM-dd HH:mm:ss
	 * @param hours 小时数， 如果是当前时间之前，则传递负数，如-1，如果是当前时间之后，请传递正数，如1
	 * @param date  指定参考日期
	 * @author binbin
	 * @return
	 */
	public static String getFullLatestDateTime(int hours,Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(cal.HOUR,hours);
		
		return format(cal.getTime(),FMT_DATETIME);
	}
	
	/**
	 * 
	 * dateToString,(将日期按照指定格式转换为字符串). <br/>
	 * Author: daizh <br/>
	 * Create Date: 2016年10月18日 <br/>
	 * ===============================================================<br/>
	 * Modifier: daizh <br/>
	 * Modify Date: 2016年10月18日 <br/>
	 * Modify Description:  <br/>
	 * ===============================================================<br/>
	 * @param currdate
	 * @param strFormat
	 * @return
	 * @since JDK 1.7
	 */
	public static final String dateToString(Date currdate, String strFormat) {
		String returnDate = "";
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(strFormat);
			if (currdate == null) {
				return returnDate;
			}
			returnDate = sdf.format(currdate);
		} catch (NullPointerException e) {
		}
		return returnDate;
	}
	
	public static void main(String[] args) {
		
		// 距离今天近几天范围的
		System.out.println(getLatestDateDay(-1)); // 一天前 的日期  ，运行结果：2015-11-17 00:00:00
		System.out.println(getLatestDateDay(2));  // 两天后 的日期  ，运行结果：2015-11-20 00:00:00
		System.out.println(getLatestDateDay(0));  // 当前日期  ，运行结果：2015-11-18 00:00:00
		
		// 距离现在近几个小时范围的
		System.out.println(getFullLatestDateHour(-1)); // 一小时 前的时间整点  ，运行结果：2015-11-18 14:00:00
		System.out.println(getFullLatestDateHour(0));  // 当前时间 的时间整点  ，运行结果：2015-11-18 15:00:00
		System.out.println(getFullLatestDateHour(1));  // 一小时后 的时间整点  ，运行结果：2015-11-18 16:00:00
		
		System.out.println(getFullLatestDateTime(-24,new Date()));  // 24小时前 的时间整点  ，运行结果：2015-11-18 16:59:20
		
	}
	
}