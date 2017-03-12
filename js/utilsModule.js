var fs = require("fs");
var utilsModule={};//工具类

//创建文件夹
utilsModule.createFolder=function(path){

       	 if(!fs.existsSync(path)){//判断是否存在 
       	 	console.log('创建文件夹:'+path);
       	 	fs.mkdirSync(path,function(err){  
			    console.log("创建错误:"+path); 
			}); 
       	 }
}
//创建文件
utilsModule.createProperties=function(file){
	      if(!fs.existsSync(file)){//判断是否存在 
		      	try{
		      		fs.writeFileSync(file,"last_capture_record=");
				    console.log('创建文件:'+file);
		      	}catch(e){
	                 console.log('创建文件失败:'+file);
	            }
	
       	 }
}
//解析properties文件
utilsModule.parseproperties=function(uri, encoding,key){
    var encoding = encoding==null?'UTF-8':encoding;  //定义编码类型
	try {
		let content = fs.readFileSync(uri, encoding);
		let regexjing = /\s*(#+)/;  //去除注释行的正则
		let regexkong = /\s*=\s*/;  //去除=号前后的空格的正则
		let keyvalue = {};  //存储键值对

		let arr_case = null;
		let regexline = /.+/g;  //匹配换行符以外的所有字符的正则
		while(arr_case=regexline.exec(content)) {  //过滤掉空行
			if (!regexjing.test(arr_case)) {  //去除注释行
				keyvalue[arr_case.toString().split(regexkong)[0]] = arr_case.toString().split(regexkong)[1];  //存储键值对
				
			}
		}
		return keyvalue[key];
	} catch (e) {
		//e.message  //这里根据自己的需求返回
		return null;
	}
	
}
//解析出tid
utilsModule.handleTid=function(address){
	let list=address.split('/');
	return list[2];
}
//修改properties
utilsModule.updateLastCaptureRecord=function(file,value){
		   try{
		        fs.unlinkSync(file)
		        fs.writeFileSync(file,"last_capture_record="+value);
		        console.log("propreties文件修改成功！");
	        	
		   }catch(e){
                 console.log('propreties文件修改失败:'+file);
            }
}

module.exports=utilsModule;