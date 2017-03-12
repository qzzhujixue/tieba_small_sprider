var config=require('../config/config');
var fs=require('fs');

var configHandle={};//配置操作器

configHandle.getValue=function(key){
   return config[key];
}




module.exports=configHandle;
