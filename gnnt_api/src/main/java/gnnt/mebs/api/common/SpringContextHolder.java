package gnnt.mebs.api.common;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AbstractRefreshableWebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * ClassName:SpringContextHolder <br/> 
 * Function: 与SpringContext类似的操作容器对象的工具�? <br/> 
 * Reason:	 与SpringContext类似的操作容器对象的工具�?  <br/> 
 * Date:     2016�?�?�?下午5:13:37 <br/> 
 * @author   daizh
 * @version  
 * @since    JDK 1.7
 * @see 	 
 */
public class SpringContextHolder extends ContextLoaderListener {
	
	private static WebApplicationContext springContext = null;

	  public void contextDestroyed(ServletContextEvent event) {

	  }
	  
	  public void contextInitialized(ServletContextEvent event) {
	    super.contextInitialized(event);
	    ServletContext context = event.getServletContext();
	    springContext = WebApplicationContextUtils.getRequiredWebApplicationContext(context);
	  }

	  public static WebApplicationContext getSpringContext() {
			return springContext;
	  }

	  /**
	   * 
	   * getBean,(根据名称获取bean对象). <br/>
	   * Author: daizh <br/>
	   * Create Date: 2016�?�?�?<br/>
	   * ===============================================================<br/>
	   * Modifier: daizh <br/>
	   * Modify Date: 2016�?�?�?<br/>
	   * Modify Description:  <br/>
	   * ===============================================================<br/>
	   * @param name
	   * @return
	   * @since JDK 1.7
	   */
	  public static Object getBean(String name) {
	    return springContext.getBean(name);
	  }
	  
	  /**
		 * 
		 * getBean,(根据类对象获取bean对象). <br/>
		 * Author: daizh <br/>
		 * Create Date: 2016�?�?�?<br/>
		 * ===============================================================<br/>
		 * Modifier: daizh <br/>
		 * Modify Date: 2016�?�?�?<br/>
		 * Modify Description:  <br/>
		 * ===============================================================<br/>
		 * @param clazz
		 * @return
		 * @since JDK 1.7
		 */
	   public static <T> T getBean(Class<T> clazz) {
			return springContext.getBean(clazz);
	   }

	  /**
	   * 
	   * registerService,(向容器中动�?注入bean). <br/>
	   * Author: daizh <br/>
	   * Create Date: 2016�?�?�?<br/>
	   * ===============================================================<br/>
	   * Modifier: daizh <br/>
	   * Modify Date: 2016�?�?�?<br/>
	   * Modify Description:  <br/>
	   * ===============================================================<br/>
	   * @param impCls
	   * @param name
	   * @since JDK 1.7
	   */
	  public static void registerService(Class<?> impCls, String name) {
	    RootBeanDefinition beanDefinition = new RootBeanDefinition();
	    beanDefinition.setBeanClassName(impCls.getName());
	    beanDefinition.setScope("singleton");
	    beanDefinition.setAutowireMode(1);

	    ((DefaultListableBeanFactory)((AbstractRefreshableWebApplicationContext)springContext).getBeanFactory()).registerBeanDefinition(name, beanDefinition);
	  }
}

