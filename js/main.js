var configHandle=require('./configHandle');
var albumModule=require('./albumModule');
var pathModule=require('./pathModule');
var downloadModule=require('./downloadModule');
var ep = require('./globalEventProxy');

var main={};

//启动程序
main.start=function(){

     	console.log('程序启动...');
          //开始抓取图册
          albumModule.start();

          ep.tail('album_html_finished',  function () {
              //开始抓取图片路径
              pathModule.start();
          });

          ep.tail('path_html_finished',  function () {
              //开始下载图片
              downloadModule.start();
          });

          ep.tail('download_finished',  function () {
              console.log('程序结束!');
          });



}


module.exports=main;
