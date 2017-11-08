package gnnt.mebs.api.common;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class PropertyXmlMgr {
	public static final String CONFIG_FILE = Constants.CFG_XML_FILE;

	private static Logger logger = LoggerFactory.getLogger(PropertyXmlMgr.class);

	private static Map<String, Configuration> map = new HashMap();

	private static Map<String, String> fileMap = new HashMap();

	private static String basePath = null;

	private static final int DATA_TYPE_BOOLEAN = 10;
	private static final int DATA_TYPE_BYTE = 20;
	private static final int DATA_TYPE_SHORT = 21;
	private static final int DATA_TYPE_INTEGER = 22;
	private static final int DATA_TYPE_BIGINTEGER = 23;
	private static final int DATA_TYPE_LONG = 24;
	private static final int DATA_TYPE_FLOAT = 30;
	private static final int DATA_TYPE_BIGDECIMAL = 31;
	private static final int DATA_TYPE_DOUBLE = 32;
	private static final int DATA_TYPE_STRING = 40;
	private static final int DATA_TYPE_KEYS = 90;

	public static void setBasePath(String basePath) {
		basePath = basePath;
	}

	public static synchronized void init(String path) {
		try {
			readConfigFile(getAbsoluteFilePath(CONFIG_FILE));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("在初始化系统配置{}时发生错误：", CONFIG_FILE, e);
		}
	}

	public static String getString(String alias, String key) {
		return (String) getObject(alias, key, DATA_TYPE_STRING);
	}

	public static Boolean getBoolean(String alias, String key) {
		return (Boolean) getObject(alias, key, DATA_TYPE_BOOLEAN);
	}

	public static Byte getByte(String alias, String key) {
		return (Byte) getObject(alias, key, DATA_TYPE_BYTE);
	}

	public static Short getShort(String alias, String key) {
		return (Short) getObject(alias, key, DATA_TYPE_SHORT);
	}

	public static Integer getInteger(String alias, String key) {
		return (Integer) getObject(alias, key, DATA_TYPE_INTEGER);
	}

	public static BigInteger getBigInteger(String alias, String key) {
		return (BigInteger) getObject(alias, key, DATA_TYPE_BIGINTEGER);
	}

	public static Long getLong(String alias, String key) {
		return (Long) getObject(alias, key, DATA_TYPE_LONG);
	}

	public static Float getFloat(String alias, String key) {
		return (Float) getObject(alias, key, DATA_TYPE_FLOAT);
	}

	public static BigDecimal getBigDecimal(String alias, String key) {
		return (BigDecimal) getObject(alias, key, DATA_TYPE_BIGDECIMAL);
	}

	public static Double getDouble(String alias, String key) {
		return (Double) getObject(alias, key, DATA_TYPE_DOUBLE);
	}

	public static Iterator<String> getKeys(String alias) {
		return (Iterator) getObject(alias, null, DATA_TYPE_KEYS);
	}

	public static boolean containsKey(String alias, String key) {
		Iterator keys = getKeys(alias);

		if (keys != null) {
			while (keys.hasNext()) {
				if (((String) keys.next()).equals(key)) {
					return true;
				}
			}
		}

		return false;
	}

	public static String[] getStringArray(String alias, String key,
			String delimiter) {
		try {
			Configuration configuration = getConfiguration(alias);

			if (configuration != null) {
				String str = configuration.getString(key);

				if ((str != null) && (!"".equals(str.trim()))) {
					return str.split(delimiter);
				}

			}

			return null;
		} catch (Exception e) {
			logger.error("获取参数配置alias=" + alias + ",key=" + key + ",delimiter="
					+ delimiter + "出错：", e);
		}
		return null;
	}

	public static List<String> getList(String alias, String key,
			String delimiter) {
		try {
			String[] strArr = getStringArray(alias, key, delimiter);

			if (strArr == null) {
				return null;
			}

			return Arrays.asList(strArr);
		} catch (Exception e) {
			logger.error("获取参数配置alias=" + alias + ",key=" + key + ",delimiter="
					+ delimiter + "出错：", e);
		}
		return null;
	}

	public static void refreshConfigFile(String absolutePath) throws Exception {
		String alias = null;
		String lowerCaseAbsolutePath = absolutePath.toLowerCase();

		for (Map.Entry entry : fileMap.entrySet()) {
			String lowerCaseFileName = ((String) entry.getValue())
					.toLowerCase();

			if (lowerCaseFileName.endsWith(lowerCaseAbsolutePath)) {
				alias = (String) entry.getKey();
				break;
			}
		}

		if (alias == null) {
			throw new IllegalArgumentException("文件{" + absolutePath
					+ "}没有加入到配置管理中。");
		}

		loadAndCacheConfiguration(alias, absolutePath);
	}

	public static String getAbsFilePathByAlias(String alias) {
		String fileAbsPath = "";
		if (StringUtils.isNotBlank(alias)) {
			if (fileMap != null) {
				fileAbsPath = fileMap.get(alias);
			}
		}
		return fileAbsPath;
	}

	private static String getAbsoluteFilePath(String fileName)
			throws IOException {
		//ClassPathResource c = new ClassPathResource(fileName);
		//return c.getURL().getPath();
		try{
			return PropertyXmlMgr.class.getResource(fileName).getPath();
		} catch(Exception ex){
			throw new FileNotFoundException("getAbsoluteFilePath failed");
		}
	}

	private static void readConfigFile(String filePath) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document doc = builder.parse(filePath);
		Node node = doc.getFirstChild();
		NodeList nodeList = node.getChildNodes();

		for (int i = 0; i < nodeList.getLength(); i++) {
			Node fileNode = nodeList.item(i);
			if ((fileNode != null) && (fileNode.getAttributes() != null)
					&& (fileNode.getNodeName().equalsIgnoreCase("properties"))) {
				Node fileNameAttrNode = fileNode.getAttributes().getNamedItem(
						"fileName");
				String fileName = null;
				String tempPath = null;
				try {
					fileName = fileNameAttrNode.getTextContent();
					tempPath = getAbsoluteFilePath(fileName);
				} catch (FileNotFoundException e) {
					logger.error("文件classpath:" + fileName + "不存在", e);
					continue;
				}

				if (tempPath == null) {
					logger.error("配置文件{}没有找到", fileName);
				} else {
					String alias = fileNode.getTextContent();
					fileMap.put(alias, tempPath);

					logger.info("读取配置文件{}，加载后保存到别名{}中。", tempPath, alias);
					loadAndCacheConfiguration(alias, tempPath);
				}
			}
		}
	}

	private static void loadAndCacheConfiguration(String alias, String filePath)
			throws Exception {
		Configuration configuration = null;

		String lowerCaseFilePath = filePath.toLowerCase();
		if (lowerCaseFilePath.endsWith("properties"))
			configuration = loadPropertiesConfiguration(filePath);
		else if (lowerCaseFilePath.endsWith("xml")) {
			configuration = loadXMLConfiguration(filePath);
		}

		map.put(alias, configuration);
	}

	private static synchronized Configuration loadPropertiesConfiguration(
			String filePath) {
		try {
			PropertiesConfiguration configuration = new PropertiesConfiguration();

			configuration.setDelimiterParsingDisabled(true);
			configuration.load(filePath);

			return configuration;
		} catch (ConfigurationException e) {
			logger.error("在读取配置文件{}时出错，请检查配置文件中的配置项。", filePath);
		}
		throw new ConfigException("在读取配置文件" + filePath + "时出错，请检查配置文件中的配置项。");
	}

	private static synchronized XMLConfiguration loadXMLConfiguration(
			String filePath) {
		try {
			XMLConfiguration configuration = new XMLConfiguration(filePath);

			configuration.setDelimiterParsingDisabled(true);
			configuration.load(filePath);

			return configuration;
		} catch (ConfigurationException e) {
		}
		throw new ConfigException("在读取配置文件" + filePath + "时出错，请检查配置文件中的配置项。");
	}

	private static Configuration getConfiguration(String alias)
			throws Exception {
		Configuration configuration = (Configuration) map.get(alias);

		return configuration;
	}

	private static Object getObject(String alias, String key, int dataType) {
		try {
			Configuration configuration = getConfiguration(alias);

			if (configuration != null) {
				switch (dataType) {
				case 40:
					return configuration.getString(key, null);
				case 10:
					return configuration.getBoolean(key, null);
				case 22:
					return configuration.getInteger(key, null);
				case 24:
					return configuration.getLong(key, null);
				case 30:
					return configuration.getFloat(key, null);
				case 32:
					return configuration.getDouble(key, null);
				case 90:
					return configuration.getKeys();
				case 20:
					return configuration.getByte(key, null);
				case 21:
					return configuration.getShort(key, null);
				case 23:
					return configuration.getBigInteger(key, null);
				case 31:
					return configuration.getBigDecimal(key, null);
				}
				return null;
			}

			return null;
		} catch (Exception e) {
			logger.error("获取参数配置alias=" + alias + ",key=" + key + ",dataType="
					+ dataType + "出错：", e);
		}
		return null;
	}

	static {
		init(basePath);
	}
}
