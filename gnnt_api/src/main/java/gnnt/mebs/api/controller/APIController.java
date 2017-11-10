package gnnt.mebs.api.controller;

import gnnt.mebs.api.entity.Example;
import gnnt.mebs.api.service.APIService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("api")
public class APIController {
	
	@Autowired
	private APIService apiService;
	
	private static final Logger log = Logger.getLogger(APIController.class);
	
	@RequestMapping("getExample")
	@ResponseBody
	public Example getExample(@RequestParam("id") String id){
		Example example = apiService.selectByPrimaryKey(id);
		return example;
	}
}
