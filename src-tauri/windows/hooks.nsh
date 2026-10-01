!define MUI_BGCOLOR "18181B"
!define MUI_TEXTCOLOR "F4F4F5"
!define MUI_INSTFILESPAGE_COLORS "F4F4F5 18181B"

!define MUI_CUSTOMFUNCTION_GUIINIT EnableDarkMode

Function EnableDarkMode
  Var /GLOBAL dwm_dark_val
  StrCpy $dwm_dark_val 1
  System::Call 'dwmapi::DwmSetWindowAttribute(p $HWNDPARENT, i 20, *i dwm_dark_val, i 4)'
  System::Call 'dwmapi::DwmSetWindowAttribute(p $HWNDPARENT, i 19, *i dwm_dark_val, i 4)'
  System::Call 'uxtheme::#135(i 2)'
  System::Call 'uxtheme::#133(p $HWNDPARENT, i 1)'
FunctionEnd
