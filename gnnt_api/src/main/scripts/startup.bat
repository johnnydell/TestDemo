@echo off
title 接口提供
rem SETLOCAL 之后所做的环境改动只限于批处理文件
rem setlocal enabledelayedexpansion 表示延迟环境变量扩展，则在负值时用 !name!格式赋值
setlocal enabledelayedexpansion
set classpath=./bin;
rem 加载所有lib下的jar文件
for %%f in (./lib/*.jar) do (
    set onefile=%%f
    set classpath=!classpath!;./lib/!onefile!
)

@echo on

echo %classpath%

java  -classpath "%classpath%" gnnt.mebs.api.ServerStart
pause