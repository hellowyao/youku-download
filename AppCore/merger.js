var child= require('child_process');
var iconv=require("iconv-lite");
var exec = child.exec;

function execCommand(pCMD)
{
	exec(pCMD,{encoding: 'binary'},function(error,stdout,stderror)
	{
		if(error)
		{
			console.log("ERROR:\n"+error);
			return;
		}
		if(stdout)
		{
			var fs=require("fs");
			var out=new Buffer(stdout,"binary");
			out=iconv.decode(out,'GBK');
			console.log("stdout:\n"+out);
		}
		if(stderror)
		{
			var errout=new Buffer(stderror,"binary");
			errout=iconv.decode(errout,'GBK');
			console.log("stderror:\n"+errout);	
		}

	})
}

var cmd="";
var outputTS="concat:";

/**/
var ffmpeg=process.argv[4]+"ffmpeg";
var m3u8=process.argv[2]+".m3u8";
var videoPATH= process.argv[2]+"\\";
var outputMP4= process.argv[2]+".mp4";
var group=process.argv[3];

var fs=require("fs");
var dReg=/https?:\/\/.*?\s/g;
fs.readFile(m3u8,"utf-8",function(err,data)
{
	if(err)
	{
		console.log(err);
		return;
	}
	
	var end=0;
	var start=0;
	while(array=dReg.exec(data))
	{
		++end;
	}
	var groupNUM=end/group;
	//console.log(groupNUM);

	execCommand("@echo off");
	for(var i=start;i<groupNUM;++i)
	{
		if(i*group>=end)
		{
			break;
		}
		
		var param="";
		for(var j=i*group;j<end&&j<(i+1)*group;++j)
		{
			param+="\""+videoPATH+j+".ts\"";
			if(j<end-1&&j<(i+1)*group-1)
			{
				param+="+";
			}
		}

		outputTS+=i+".ts";
		if(i<groupNUM-1)
		{
			outputTS+="|";
		}
		
		cmd+="copy/b "+param+" /y "+i+".ts";
		cmd+="\n";	
	}

	execCommand(cmd);

	cmd=ffmpeg+" -i \""+outputTS+"\" -c copy -bsf:a aac_adtstoasc -movflags +faststart "+outputMP4;
	execCommand(cmd);
	
})




