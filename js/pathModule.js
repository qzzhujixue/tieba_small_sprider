var fs=require('fs');
var cheerio=require('cheerio');
var superagent=require('superagent');
var configHandle=require('./configHandle');
var utilsModule=require('./utilsModule');
var ep = require('./globalEventProxy');
var cacheHandle=require('./cacheHandle');
var pathModule={};//路径抓取模块
var async=require("async");

pathModule.start=function(){//路径抓取模块启动
      // 取出图册缓存
	  let albums=cacheHandle.albums;

        async.mapLimit(albums, configHandle.getValue('album_thread_num'), function (album, callback) {
		    try{
	            
	            //判断配置文件是否存在,不存在则生成新文件
	            utilsModule.createProperties(album.store_path+'\\schedule.properties');
	            //获得最后一张爬取的图片文件名
	            let last_capture_record=utilsModule.parseproperties(album.store_path+'\\schedule.properties','UTF-8','last_capture_record');
	            //抓取图册首页
	            superagent.get(encodeURI('http://tieba.baidu.com/photo/g/bw/picture/list?kw='+album.key+'&alt=jview&rn=1&tid='+album.address+'&pn=1&ps=0&pe=100000&info=1'))
			    .end(function (err, sres) {
			    	 
	                 //抓取路径放入缓存
	                 try{
	                 	 if (err) {
			    	  	console.log(err);
				      	
				        return next(err);
				         }
	                      pathModule.capturePath(sres,last_capture_record,album);
	                 }catch(e){
	                 	console.log("抓取路径缓存"+e);
	                 }
	                  setTimeout(function () {
				       
					    callback(null, '抓取路径完成！');
					}, 100);
	                 
			    });
		    }catch(e){
                 	console.log("抓取路径缓存"+e);
                 	setTimeout(function () {
				        
					    callback(null, ' 抓取路径完成！');
					}, 100);
            }
		}, function (err, result) {
		   console.log('抓取图片路径完成！共'+cacheHandle.picPaths.length+'张图片');
		    ep.emit('path_html_finished',[]);
		});

	
}

//解析并抓取路径
pathModule.capturePath=function(sres,last_capture_record,album){

           let json_data= eval("("+sres.text+")");
           let newPicId='';
		   for(let i in json_data.data.pic_list){
		   	   let obj=json_data.data.pic_list[i];
		   	   	
               if(i==0){
               	newPicId=obj.pic_id.trim();
               }
                   //判断是否重复
	               if(album.is_ex_rep&&obj.pic_id.trim()==last_capture_record.trim()){
	               	   if(last_capture_record.trim()!=newPicId){
	               	      utilsModule.updateLastCaptureRecord(album.store_path+'\\schedule.properties',newPicId);
	               	   }
	               	   break;
	               }else{
	               	   if(i==json_data.data.pic_list.length-1){
	               	   	  if(last_capture_record.trim()!=newPicId){
	               	   	   utilsModule.updateLastCaptureRecord(album.store_path+'\\schedule.properties',newPicId);
	               	    	} 
	               	   }
	               }
              

		   	   let picPath={};
		   	   picPath.pic_path=obj.purl;
		   	   picPath.pic_id=obj.pic_id;
		   	   picPath.descr=obj.descr;
		   	   picPath.store_path=album.store_path;
		   	   cacheHandle.putPicPath(picPath);
		   	   
		   }

}

module.exports=pathModule;
