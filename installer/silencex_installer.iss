; SilenceX by Umar - Inno Setup Script
; This script generates a professional .exe installer for the Premiere Pro plugin.

[Setup]
AppId={D3F7B2A1-8E4C-4F9D-A7B2-9E1A2B3C4D5E}
AppName=SilenceX by Umar
AppVersion=1.0.0
AppPublisher=Umar
AppPublisherURL=https://github.com/umar
DefaultDirName={commoncf32}\Adobe\CEP\extensions\com.umar.silencex
DefaultGroupName=SilenceX by Umar
AllowNoIcons=yes
OutputDir=setup
OutputBaseFilename=SilenceX_Professional_Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Source is the 'release' folder prepared by the npm run build script
Source: "..\release\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Registry]
; Enable Player Debug Mode for CEP Extensions (Allows unsigned plugins to run)
Root: HKCU; Subkey: "Software\Adobe\CSXS.7"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.8"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.9"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.10"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.11"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.12"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Adobe\CSXS.13"; ValueName: "PlayerDebugMode"; ValueType: string; ValueData: "1"; Flags: uninsdeletevalue

[Icons]
Name: "{group}\SilenceX by Umar"; Filename: "{app}\index.html"

[Messages]
WelcomeLabel2=This will install SilenceX by Umar as an extension for Adobe Premiere Pro. Please make sure Premiere Pro is closed before continuing.

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
  // Minimal checks could be added here to see if Premiere is installed, 
  // but for UXP, placing the folder in the specified AppData path is sufficient.
end;
