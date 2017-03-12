var fs=require('fs');
var request = require("request");
var async=require("async");
var configHandle=require('./configHandle');
var utilsModule=require('./utilsModule');
var ep = require('./globalEventProxy');
var cacheHandle=require('./cacheHandle');
var downloadModule={};//图片下载模块
var count=0;
downloadModule.start=function(){//图片开始下载
      // 取出图片缓存
	  let picPaths=cacheHandle.picPaths;
	 
		async.mapLimit(picPaths, configHandle.getValue('download_thread_num'), function (picPath, callback) {
		   downloadModule.downloadImg(picPath.pic_path,picPath.store_path, callback,1);
		}, function (err, result) {
		    console.log('下载图片完成！');
		    ep.emit('download_finished',[]);
		});
}
//下载方法
downloadModule.downloadImg = function(url, store_path, callback,times){
	    let pre='https://imgsa.baidu.com/forum/pic/item';
	    let realUrl=pre+url.substring(url.lastIndexOf('/'),url.length);
	    let local_path=store_path + url.substring(url.lastIndexOf('/'),url.length);
	    //判断是否存在
	     if(!fs.existsSync(local_path)){
		request.head(realUrl, function(err, res, body){
			try{
				if(err){
                    	if(times<5){
							console.log('重新下载'+(times+1)+'！访问错误:'+err+'url'+local_path);
						    downloadModule.downloadImg(url, store_path, callback,times+1);
						}else{
                            console.log('下载失败！访问错误:'+err+'url'+local_path);
                            setTimeout(function () {
						         callback(null, url + ' download 完成！');
						    }, 100);
						}
				}else{
                    
					request(realUrl).on('error', function(error){
						
						if(times<5){
							console.log('重新下载'+(times+1)+'！管道错误:'+error+'url'+local_path);
						    downloadModule.downloadImg(url, store_path, callback,times+1);
						}else{
                            console.log('下载失败！管道错误:'+error+'url'+local_path);
                            setTimeout(function () {
						         callback(null, url + ' download 完成！');
						    }, 100);
						}
					}).on('end', function(response) {
                     
                         count++;
                         console.log(count+"图片下载成功！"+local_path);
                         setTimeout(function () {
						    callback(null, url + ' download 完成！');
						}, 100);
                    }).pipe(fs.createWriteStream(local_path)).on('close', function(error){
                    	 
					});
							 
				}
                
			}catch(e){
	               console.log("图片下载失败！"+url);
	               setTimeout(function () {
					    callback(null, url + ' download 完成！');
					}, 100);
			}
			
			
		});
	}else{
		           setTimeout(function () {
					    callback(null, url + ' download 完成！');
					}, 100);
	}

};
module.exports=downloadModule;