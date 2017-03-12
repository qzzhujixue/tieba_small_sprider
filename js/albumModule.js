var fs=require('fs');
var cheerio=require('cheerio');
var superagent=require('superagent');
var configHandle=require('./configHandle');
var utilsModule=require('./utilsModule');
var ep = require('./globalEventProxy');
var cacheHandle=require('./cacheHandle');

var albumModule={};//相册模块


albumModule.start=function(){//图册抓取启动


    let tiebas=configHandle.getValue('tieba');
     // 命令 eventproxy 监听
	ep.after('album_html_over', tiebas.length, function () {
		console.log('抓取图册完成！共'+cacheHandle.albums.length+'图册');
	    ep.emit('album_html_finished',[]);
	});
     for(let i in tiebas){
         let tieba=tiebas[i];
         utilsModule.createFolder(configHandle.getValue('store_path')+'\\'+tieba.tieba_key);
         //抓取贴吧图片首页
         superagent.get(encodeURI(tieba.address))
		    .end(function (err, sres) {
		      if (err) {
		        return next(err);
		      }

		      let $ = cheerio.load(sres.text);
              
              //抓取分类
              let catalogs=[];
		      $('.catalog_list_ul .catalog_li_normal .catalog_a_inner').each(function (idx, element) {
			        let $element = $(element);
			        $element.children('span').remove();
			        let catalog={};
			        catalog.text=$element.text().trim();
			        catalog.link=encodeURI(tieba.address)+$element.parent().attr('href');
			        catalogs.push(catalog);
			        
			   });
		       
		       // 命令 eventproxy 监听
				ep.after('album_html_'+tieba.tieba_key, catalogs.length, function () {
				   ep.emit('album_html_over',[]);
				});

              //抓取图册
		      albumModule.captureAlbum(tieba,catalogs);
		      
		});

     }
}

albumModule.captureAlbum=function(tieba,catalogs){//图册抓取启动

     for(let i in catalogs){
     	    let catalog=catalogs[i];
     	    utilsModule.createFolder(configHandle.getValue('store_path')+'\\'+tieba.tieba_key+'\\'+catalog.text);
	     	superagent.get(encodeURI(catalog.link))
			    .end(function (err, sres) {
			      if (err) {
			      	ep.emit('album_html', []);
			        return next(err);
			      }

			      let $ = cheerio.load(sres.text);
			      
	              //抓取图册
	              $('.grbm_ele_wrapper .grbm_ele_title').each(function (idx, element) {
			            
			            let $element = $(element);
			            let title=$element.children('a').attr('title');
			            utilsModule.createFolder(configHandle.getValue('store_path')+'\\'+tieba.tieba_key+'\\'+catalog.text+'\\'+title);
			            let album={};
			            album.title=title;
			            album.key=tieba.tieba_key;
			            album.is_ex_rep=tieba.is_ex_rep;
			            album.address=utilsModule.handleTid($element.children('a').attr('href'));
			            album.store_path=configHandle.getValue('store_path')+'\\'+tieba.tieba_key+'\\'+catalog.text+'\\'+title;
			            cacheHandle.putAlbum(album);
			       });
	              ep.emit('album_html_'+tieba.tieba_key, []);
	              
			      
			});
     }
}



module.exports=albumModule;