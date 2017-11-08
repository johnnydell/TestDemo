package gnnt.mebs.api.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gnnt.mebs.api.dao.ExampleMapper;
import gnnt.mebs.api.entity.Example;
import gnnt.mebs.api.service.APIService;

@Service("apiService")
public class APIServiceImpl implements APIService {
	
	 /** 日志 */
    private static Logger logger = Logger.getLogger(APIServiceImpl.class);
    
    @Autowired
    private ExampleMapper exampleMapper;

	@Override
	public Example selectByPrimaryKey(String id) {
		return exampleMapper.selectByPrimaryKey(id);
	}

}
