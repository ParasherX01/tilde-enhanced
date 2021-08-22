Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\Users\kholm\Documents\Startup.bat" & Chr(34), 0
Set WshShell = Nothing