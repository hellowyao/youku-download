@echo off
set AppCore="AppCore\\"
set/a group=200

set Name="灌篮高手"
set URL="http://v.youku.com/v_show/id_XNjMxMTIyMzcy.html"
::goto MERGER
echo #######################################################################################################
:START
AppCore\\node AppCore\\app.js %URL% %Name%
echo #######################################################################################################
:DOWNLOAD
echo "是否下载(Y/N)"
set/p IfDownload=
if  "%IfDownload%"=="Y" (
	mkdir %Name%
	AppCore\\node AppCore\\m3u8.js %Name%
) else (
	if "%IfDownload%"=="N" (
		goto end
	) else (
		echo "输入错误"
		goto DOWNLOAD
	)
) 
echo #######################################################################################################
:MERGER
echo "是否合并(Y/N)"
set/p IfMerger=
if  "%IfMerger%"=="Y" (
	AppCore\\node AppCore\\merger.js %Name% %group% %AppCore%
	rm -f *.ts
) else (
	if "%IfMerger%"=="N" (
		goto end
	) else (
		echo "输入错误"
		goto MERGER
	)
) 

:end
echo #######################################################################################################
echo "End"
pause