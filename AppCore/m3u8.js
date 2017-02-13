/*匹配m3u8文件中的网址的正则表达式*/
var dReg=/https?:\/\/.*?\s/g;

/*存放需要下载文件的信息的数组*/
var objArray=[];
/*同时下载的最大任务数*/
var DownloadThread=10;

var DownloadStartCount=0;

var download=function(p_url,name)
{
	var fs=require("fs");
	var http=require("http");
	var notFound=false;
	
	var fd=fs.openSync(name,"w");

	var req=http.get(p_url,function(res)
	{
		if(res.statusCode == 404)
		{
			fs.close(fd);
			
			if(DownloadStartCount<objArray.length)
			{
				download(objArray[DownloadStartCount].url,objArray[DownloadStartCount].name);
				++DownloadStartCount;
			}
			
			console.log("Not Found:\t"+name);
			
			return;
		}
		var dataArray=[];
		res.on("data",function(data)
		{
			dataArray.push(data);
		});
		res.on("end",function()
		{
			//console.log("end");
			
			for(var key in dataArray)
			{
				fs.writeSync(fd,dataArray[key],0,dataArray[key].length,null);
			}
			fs.closeSync(fd);
			
			if(DownloadStartCount<objArray.length)
			{
				download(objArray[DownloadStartCount].url,objArray[DownloadStartCount].name);
				++DownloadStartCount;
			}
		
			console.log(name);
		})
	});
	
	req.on("error",function(error)
	{
		console.log(error);
	});
	
}

var fs_g=require("fs");

var name = process.argv[2];
var exec=require("child_process").exec;
var path= name+"\\";
var m3u8= name+".m3u8";

fs_g.readFile(m3u8,"utf-8",function(err,data)
{
	if(err)
	{
		console.log(err);
		return;
	}
	
	var array;
	var index=0;
	while(array=dReg.exec(data))
	{
		var obj={};
		
		obj.url=array[0]+"";
		obj.name=path+index+".ts";
		
		objArray.push(obj);
		++index;
	}

	for(var start=DownloadStartCount,len=objArray.length;DownloadStartCount<len;)
	{
		if(DownloadStartCount==start+DownloadThread)
		{
			break;
		}
		//console.log(objArray[DownloadStartCount]);
		download(objArray[DownloadStartCount].url,objArray[DownloadStartCount].name);
		++DownloadStartCount;
	}
})
