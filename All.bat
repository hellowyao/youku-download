@echo off
set AppCore="AppCore\\"
set/a group=200

set Name="��������"
set URL="http://v.youku.com/v_show/id_XNjMxMTIyMzcy.html"
::goto MERGER
echo #######################################################################################################
:START
AppCore\\node AppCore\\app.js %URL% %Name%
echo #######################################################################################################
:DOWNLOAD
echo "�Ƿ�����(Y/N)"
set/p IfDownload=
if  "%IfDownload%"=="Y" (
	mkdir %Name%
	AppCore\\node AppCore\\m3u8.js %Name%
) else (
	if "%IfDownload%"=="N" (
		goto end
	) else (
		echo "�������"
		goto DOWNLOAD
	)
) 
echo #######################################################################################################
:MERGER
echo "�Ƿ�ϲ�(Y/N)"
set/p IfMerger=
if  "%IfMerger%"=="Y" (
	AppCore\\node AppCore\\merger.js %Name% %group% %AppCore%
	rm -f *.ts
) else (
	if "%IfMerger%"=="N" (
		goto end
	) else (
		echo "�������"
		goto MERGER
	)
) 

:end
echo #######################################################################################################
echo "End"
pause