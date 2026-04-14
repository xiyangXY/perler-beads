@echo off
chcp 65001 >nul
title 拼豆图纸生成器
echo ============================================
echo    拼豆图纸生成器 - 本地版
echo ============================================
echo.
echo 正在启动服务...
echo.

node server-prod.js
