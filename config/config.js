var config={
    store_path:'G:\\store',               //图片存放路径
    tieba:[
      // {
      //  tieba_key:'韩彩英',
      //  address:'http://tieba.baidu.com/f?kw=韩彩英&tab=album',
      //  is_ex_rep:false                   //是否从上次节点开始
      // },
      // {
      //  tieba_key:'车晓',
      //  address:'http://tieba.baidu.com/f?kw=车晓&tab=album',
      //  is_ex_rep:false
      // },
      // {
      //  tieba_key:'江疏影',
      //  address:'http://tieba.baidu.com/f?kw=江疏影&tab=album',
      //  is_ex_rep:true
      // }
 {
       tieba_key:'临沂大学',
       address:'http://tieba.baidu.com/f?kw=临沂大学&tab=album',
       is_ex_rep:true
      }
    ],
    album_thread_num:10,                //图片抓取线程数量
    download_thread_num:10              //下载线程数量
    

}

module.exports=config;