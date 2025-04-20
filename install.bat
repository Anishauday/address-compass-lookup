
@echo off
echo ======================================================
echo       ADDRESS COMPASS LOOKUP - WINDOWS INSTALLER      
echo ======================================================
echo.

:: Check if running on Windows
if not "%OS%"=="Windows_NT" (
    echo ERROR: This installer is designed for Windows only.
    echo Please use the appropriate installer for your operating system.
    goto :error
)

:: Check for Node.js
echo Checking for Node.js installation...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installing Node.js, restart this script.
    goto :error
)
echo Found Node.js

:: Check for Git
echo Checking for Git installation...
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/
    echo After installing Git, restart this script.
    goto :error
)
echo Found Git

:: Ask for installation directory
echo Where would you like to install the application?
echo 1. Current directory: %CD%
echo 2. Documents folder
echo 3. Custom location
set /p installChoice="Enter your choice (1-3): "

if "%installChoice%"=="1" (
    set "installDir=%CD%"
) else if "%installChoice%"=="2" (
    set "installDir=%USERPROFILE%\Documents\AddressCompassLookup"
) else if "%installChoice%"=="3" (
    set /p installDir="Enter the full path for installation: "
) else (
    set "installDir=%CD%"
)

:: Create directory if it doesn't exist
if not exist "%installDir%" (
    mkdir "%installDir%"
    echo Created installation directory: %installDir%
)

:: Navigate to the installation directory
cd /d "%installDir%"
echo Changed directory to: %installDir%

:: Get repository URL
set /p repoUrl="Enter the GitHub repository URL (press Enter to use default): "
if "%repoUrl%"=="" (
    set "repoUrl=https://github.com/yourusername/address-compass-lookup.git"
    echo Using default repository URL: %repoUrl%
)

:: Clone the repository
echo Cloning the repository from %repoUrl%...
if exist ".git" (
    echo Git repository already exists, pulling latest changes...
    git pull
) else (
    git clone %repoUrl% .
)
if %errorlevel% neq 0 goto :error
echo Repository cloned successfully.

:: Install dependencies
echo Installing dependencies with npm...
call npm install
if %errorlevel% neq 0 goto :error
echo Dependencies installed successfully.

:: Create desktop shortcut
set /p createShortcut="Do you want to create a desktop shortcut? (Y/N): "
if /i "%createShortcut%"=="Y" (
    echo @echo off > "%TEMP%\createShortcut.vbs"
    echo Set oWS = WScript.CreateObject^("WScript.Shell"^) >> "%TEMP%\createShortcut.vbs"
    echo sLinkFile = "%USERPROFILE%\Desktop\Address Compass Lookup.lnk" >> "%TEMP%\createShortcut.vbs"
    echo Set oLink = oWS.CreateShortcut^(sLinkFile^) >> "%TEMP%\createShortcut.vbs"
    echo oLink.TargetPath = "cmd.exe" >> "%TEMP%\createShortcut.vbs"
    echo oLink.Arguments = "/k cd /d ""%installDir%"" ^&^& npm run dev" >> "%TEMP%\createShortcut.vbs"
    echo oLink.WorkingDirectory = "%installDir%" >> "%TEMP%\createShortcut.vbs"
    echo oLink.IconLocation = "%installDir%\public\favicon.ico, 0" >> "%TEMP%\createShortcut.vbs"
    echo oLink.Save >> "%TEMP%\createShortcut.vbs"
    cscript //nologo "%TEMP%\createShortcut.vbs"
    del "%TEMP%\createShortcut.vbs"
    echo Desktop shortcut created successfully.
)

:: Start the application
set /p startNow="Do you want to start the application now? (Y/N): "
if /i "%startNow%"=="Y" (
    echo Starting the application...
    start cmd /k "cd /d "%installDir%" && npm run dev"
    echo Application started in a new window.
)

:: Create uninstaller batch file
echo @echo off > "%installDir%\uninstall.bat"
echo echo Uninstalling Address Compass Lookup... >> "%installDir%\uninstall.bat"
echo set "installDir=%installDir%" >> "%installDir%\uninstall.bat"
echo if exist "%%USERPROFILE%%\Desktop\Address Compass Lookup.lnk" del "%%USERPROFILE%%\Desktop\Address Compass Lookup.lnk" >> "%installDir%\uninstall.bat"
echo echo Desktop shortcut removed. >> "%installDir%\uninstall.bat"
echo set /p confirm="Do you want to remove all application files from %%installDir%%? (Y/N): " >> "%installDir%\uninstall.bat"
echo if /i "%%confirm%%"=="Y" ( >> "%installDir%\uninstall.bat"
echo   taskkill /f /im node.exe 2^>nul >> "%installDir%\uninstall.bat"
echo   cd .. >> "%installDir%\uninstall.bat"
echo   rmdir /s /q "%%installDir%%" >> "%installDir%\uninstall.bat"
echo   echo Application files removed successfully. >> "%installDir%\uninstall.bat"
echo ) >> "%installDir%\uninstall.bat"
echo echo Uninstallation complete! >> "%installDir%\uninstall.bat"
echo pause >> "%installDir%\uninstall.bat"
echo Uninstaller created at: %installDir%\uninstall.bat

echo.
echo Installation completed successfully!
echo.
echo Thank you for installing Address Compass Lookup!
echo To start the application later, use the desktop shortcut or run 'npm run dev' in the installation directory.
echo.
goto :end

:error
echo.
echo Installation failed. Please check the error messages above.
echo.

:end
pause
