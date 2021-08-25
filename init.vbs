Set WshShell = CreateObject("WScript.Shell")
path = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run path & "\Startup.bat " & Chr(34) & path & "\main" & Chr(34), 0
Set WshShell = Nothing