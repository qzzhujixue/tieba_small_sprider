var cacheHandle={};//缓存处理

cacheHandle.albums=[];//图册队列
cacheHandle.picPaths=[];//图片路径队列


//添加图册
cacheHandle.putAlbum=function(album){
     cacheHandle.albums.unshift(album);
     
}
//取出图册
cacheHandle.takeAlbum=function(){
     cacheHandle.albums.pop();
}
//添加图片路径
cacheHandle.putPicPath=function(picPath){
     cacheHandle.picPaths.unshift(picPath);
     
}

module.exports=cacheHandle;