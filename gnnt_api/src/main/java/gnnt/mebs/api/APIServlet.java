package gnnt.mebs.api;

import gnnt.mebs.api.common.SpringContextHolder;
import gnnt.mebs.api.entity.Example;
import gnnt.mebs.api.service.APIService;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;

public class APIServlet extends HttpServlet {

	private static Logger logger = Logger.getLogger(APIServlet.class);

	private static final long serialVersionUID = 1L;

	public APIServlet() {
		super();
	}

	public void init(ServletConfig config) throws ServletException {
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		doPost(request, response);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		logger.info("start to invoke api");
		String id = request.getParameter("id");
		String ret = "ERROR-001:wrong parameters";
		if (StringUtils.isNotBlank(id)) {
			APIService apiService = SpringContextHolder
					.getBean(APIService.class);
			// 藏品类型http://localhost:9982/?id=34
			Example example = apiService.selectByPrimaryKey(id);	
			ret = JSON.toJSONString(example);
		}		
		logger.info("invoke result:" + ret);
		PrintWriter out = response.getWriter();
		out.write(ret);
		out.close();
	}
}
