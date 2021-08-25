Set WshShell = CreateObject("WScript.Shell")
path = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run path & "\Startup.bat " & Chr(34) & path & "\main" & Chr(34), 1
Set WshShell = Nothing