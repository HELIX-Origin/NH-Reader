!define MUI_BGCOLOR "18181B"
!define MUI_TEXTCOLOR "F4F4F5"
!define MUI_HEADER_BGCOLOR "0D0D0D"
!define MUI_HEADER_TEXTCOLOR "FFFFFF"
!define MUI_HEADER_TRANSPARENT_TEXT
!define MUI_INSTFILESPAGE_COLORS "F4F4F5 18181B"

!define MUI_CUSTOMFUNCTION_GUIINIT EnableDarkMode
!define MUI_FINISHPAGE_CUSTOMFUNCTION_SHOW SetFinishPageColors
!define MUI_WELCOMEPAGE_CUSTOMFUNCTION_SHOW SetFinishPageColors

Function EnableDarkMode
  Var /GLOBAL dwm_dark_val
  StrCpy $dwm_dark_val 1
  System::Call 'dwmapi::DwmSetWindowAttribute(p $HWNDPARENT, i 20, *i dwm_dark_val, i 4)'
  System::Call 'dwmapi::DwmSetWindowAttribute(p $HWNDPARENT, i 19, *i dwm_dark_val, i 4)'
  System::Call 'uxtheme::#135(i 2)'
  System::Call 'uxtheme::#133(p $HWNDPARENT, i 1)'
FunctionEnd

Function SetFinishPageColors
  ; Set finish/welcome page static text controls to light text on dark background
  GetDlgItem $0 $MUI_HWND 1201
  ${If} $0 != 0
    SetCtlColors $0 "FFFFFF" "transparent"
  ${EndIf}
  GetDlgItem $0 $MUI_HWND 1202
  ${If} $0 != 0
    SetCtlColors $0 "F4F4F5" "transparent"
  ${EndIf}
  GetDlgItem $0 $MUI_HWND 1203
  ${If} $0 != 0
    SetCtlColors $0 "F4F4F5" "transparent"
  ${EndIf}
  GetDlgItem $0 $MUI_HWND 1204
  ${If} $0 != 0
    SetCtlColors $0 "F4F4F5" "transparent"
  ${EndIf}
  GetDlgItem $0 $MUI_HWND 1205
  ${If} $0 != 0
    SetCtlColors $0 "60A5FA" "transparent"
  ${EndIf}
FunctionEnd

!macro NSIS_HOOK_PREINSTALL
  ; Terminate any existing NH Reader instance to prevent file locking
  nsExec::Exec 'taskkill /F /IM "NH Reader.exe" /T'
  nsExec::Exec 'taskkill /F /IM "nh-reader.exe" /T'
  
  ; If previous version's uninstaller exists in target directory, run it synchronously
  ${If} ${FileExists} "$INSTDIR\uninstall.exe"
    DetailPrint "Uninstalling previous version..."
    ExecWait '"$INSTDIR\uninstall.exe" /S _?=$INSTDIR'
  ${EndIf}
!macroend

!ifdef MULTIUSER_INSTALLMODEPAGE
  !ifdef LANG_KOREAN
    LangString MULTIUSER_TEXT_INSTALLMODE_TITLE ${LANG_KOREAN} "설치 옵션 선택"
    LangString MULTIUSER_TEXT_INSTALLMODE_SUBTITLE ${LANG_KOREAN} "$(^NameDA)을(를) 설치할 사용자를 선택하십시오."
    LangString MULTIUSER_INNERTEXT_INSTALLMODE_TOP ${LANG_KOREAN} "$(^NameDA)을(를) 본인만 사용하도록 설치할지 이 컴퓨터의 모든 사용자를 위해 설치할지 선택하십시오. $(^ClickNext)"
    LangString MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS ${LANG_KOREAN} "이 컴퓨터를 사용하는 모든 사용자용으로 설치"
    LangString MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER ${LANG_KOREAN} "나만을 위해 설치"
  !endif
!endif
