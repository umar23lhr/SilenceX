; SilenceX by Umar - Inno Setup Script
; This script generates a professional .exe installer for the Premiere Pro plugin.

[Setup]
AppId={{D3F7B2A1-8E4C-4F9D-A7B2-9E1A2B3C4D5E}
AppName=SilenceX by Umar
AppVersion=1.0.0
AppPublisher=Umar
AppPublisherURL=https://github.com/umar
DefaultDirName={userappdata}\Adobe\UXP\Plugins\SilenceX
DefaultGroupName=SilenceX by Umar
AllowNoIcons=yes
OutputDir=setup
OutputBaseFilename=SilenceX_Setup_v1.0.0
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

[Icons]
Name: "{group}\SilenceX by Umar"; Filename: "{app}\manifest.json"

[Messages]
WelcomeLabel2=This will install SilenceX by Umar as an extension for Adobe Premiere Pro. Please make sure Premiere Pro is closed before continuing.

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
  // Minimal checks could be added here to see if Premiere is installed, 
  // but for UXP, placing the folder in the specified AppData path is sufficient.
end;
