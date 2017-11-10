package gnnt.mebs.api;

import gnnt.mebs.api.common.Constants;
import gnnt.mebs.api.common.PropertyXmlMgr;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class ServerStart {
	private static Logger logger = Logger.getLogger(ServerStart.class);
    public static void main(String[] args) {
        try {
        	//加载log4j配置文件
    		PropertyConfigurator.configure(ServerStart.class.getClassLoader().getResource("conf/log4j.properties"));
        	int port = PropertyXmlMgr.getInteger(Constants.CFG_LIST_API, "api.server.port");
        	logger.info("port:"+port);
            // 服务器的监听端口
            Server server = new Server(port);
            // 关联一个已经存在的上下文
            WebAppContext context = new WebAppContext();
            String webappPath = PropertyXmlMgr.getString(Constants.CFG_LIST_API, "api.server.webapp");
            logger.info("webapp:"+webappPath);
            // 设置描述符位置
            context.setDescriptor(webappPath+"/WEB-INF/web.xml");
            // 设置Web内容上下文路径
            context.setResourceBase(webappPath);
            // 设置上下文路径
            String ctxPath = PropertyXmlMgr.getString(Constants.CFG_LIST_API, "api.server.ctxPath");
            // 设定加载 jetty 服务的默认描述器，这里修改了是否使用配置缓存，这样服务启动的时候也能修改静态页面
            context.setDefaultsDescriptor(webappPath+"/WEB-INF/webdefault.xml");
            logger.info("ctxPath:"+ctxPath);
            context.setContextPath("/"+ctxPath);
            context.setParentLoaderPriority(true);
            server.setHandler(context);
            // 启动            
            server.start();
            printWelcome();
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 打印控制台欢迎页
     */
    private static void printWelcome(){
      System.out.println("======================================================================");
      System.out.println("=                                                                    =");
      System.out.println("=                                                                    =");
      System.out.println("=                      欢迎进入 接口服务系统!                              =");
      System.out.println("=                                                                    =");
      System.out.println("=                                                                    =");
      System.out.println("=                            已成功启动!                                =");
      System.out.println("=                                                                    =");
      System.out.println("=                                                                    =");
      System.out.println("======================================================================");
    }
}

