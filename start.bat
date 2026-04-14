@echo off
chcp 65001 >nul
title 拼豆图纸生成器
echo ============================================
echo    拼豆图纸生成器 - 本地版
echo ============================================
echo.
echo 正在启动服务...
echo.
echo 提示: 按 Ctrl+C 停止服务，或关闭此窗口
echo.

node server-prod.js

exit
