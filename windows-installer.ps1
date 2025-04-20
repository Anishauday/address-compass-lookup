
#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Installer script for Address Compass Lookup application
.DESCRIPTION
    This script automates the installation process for Address Compass Lookup:
    - Checks if Node.js and Git are installed
    - Clones the repository
    - Installs dependencies
    - Starts the application
.NOTES
    Version: 1.0
    Author: Address Compass Lookup Team
#>

# Set error action preference
$ErrorActionPreference = "Stop"

# Banner function
function Show-Banner {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "      ADDRESS COMPASS LOOKUP - WINDOWS INSTALLER      " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
}

# Progress function
function Show-Progress {
    param (
        [string]$Message
    )
    Write-Host "► $Message" -ForegroundColor Green
}

# Error function
function Show-Error {
    param (
        [string]$Message
    )
    Write-Host "✗ ERROR: $Message" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation failed. Please check the error message above." -ForegroundColor Yellow
    Write-Host "If you need help, please visit our GitHub repository for support." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Success function
function Show-Success {
    Write-Host ""
    Write-Host "✓ Installation completed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Display the banner
Show-Banner

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Show-Error "This script needs to be run as Administrator. Right-click on the script and select 'Run as Administrator'."
}

# Check if it's Windows
if (-not $env:OS -eq "Windows_NT") {
    Show-Error "This installer is designed for Windows only. Please use the appropriate installer for your operating system."
}

# Ask for installation directory
Write-Host "Where would you like to install the application?" -ForegroundColor Yellow
Write-Host "1. Current directory: $PWD" -ForegroundColor Yellow
Write-Host "2. Program Files" -ForegroundColor Yellow
Write-Host "3. Custom location" -ForegroundColor Yellow
$installChoice = Read-Host "Enter your choice (1-3)"

switch ($installChoice) {
    "1" { $installDir = $PWD.Path }
    "2" { $installDir = "$env:ProgramFiles\AddressCompassLookup" }
    "3" { 
        $customPath = Read-Host "Enter the full path for installation"
        $installDir = $customPath
    }
    default { $installDir = $PWD.Path }
}

# Create directory if it doesn't exist
if (-not (Test-Path $installDir)) {
    try {
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
        Show-Progress "Created installation directory: $installDir"
    }
    catch {
        Show-Error "Failed to create directory: $installDir. Error: $_"
    }
}

# Navigate to the installation directory
try {
    Set-Location $installDir
    Show-Progress "Changed directory to: $installDir"
}
catch {
    Show-Error "Failed to navigate to installation directory. Error: $_"
}

# Check if Node.js is installed
try {
    Show-Progress "Checking for Node.js installation..."
    $nodeVersion = node -v
    Write-Host "   Found Node.js $nodeVersion" -ForegroundColor Gray
}
catch {
    Show-Error "Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/"
}

# Check if Git is installed
try {
    Show-Progress "Checking for Git installation..."
    $gitVersion = git --version
    Write-Host "   Found $gitVersion" -ForegroundColor Gray
}
catch {
    Show-Error "Git is not installed or not in PATH. Please install Git from https://git-scm.com/"
}

# Get repository URL
$repoUrl = Read-Host "Enter the GitHub repository URL (press Enter to use default)"
if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    $repoUrl = "https://github.com/yourusername/address-compass-lookup.git"
    Write-Host "   Using default repository URL: $repoUrl" -ForegroundColor Gray
}

# Clone the repository
Show-Progress "Cloning the repository from $repoUrl..."
try {
    # Check if directory is not empty and doesn't have a git repo
    if ((Get-ChildItem -Force).Count -gt 0 -and -not (Test-Path ".git")) {
        $confirmClone = Read-Host "The directory is not empty. Do you want to continue? (Y/N)"
        if ($confirmClone -ne "Y" -and $confirmClone -ne "y") {
            Show-Error "Installation aborted by user."
        }
    }
    
    # Check if git repo already exists
    if (Test-Path ".git") {
        Write-Host "   Git repository already exists, pulling latest changes..." -ForegroundColor Gray
        git pull
    } else {
        git clone $repoUrl .
    }
    Write-Host "   Repository cloned successfully." -ForegroundColor Gray
}
catch {
    Show-Error "Failed to clone repository. Error: $_"
}

# Install dependencies
Show-Progress "Installing dependencies with npm..."
try {
    npm install
    Write-Host "   Dependencies installed successfully." -ForegroundColor Gray
}
catch {
    Show-Error "Failed to install dependencies. Error: $_"
}

# Create desktop shortcut
$createShortcut = Read-Host "Do you want to create a desktop shortcut? (Y/N)"
if ($createShortcut -eq "Y" -or $createShortcut -eq "y") {
    try {
        Show-Progress "Creating desktop shortcut..."
        $WshShell = New-Object -ComObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Address Compass Lookup.lnk")
        $Shortcut.TargetPath = "powershell.exe"
        $Shortcut.Arguments = "-ExecutionPolicy Bypass -NoProfile -NoExit -Command `"Set-Location '$installDir'; npm run dev`""
        $Shortcut.WorkingDirectory = $installDir
        $Shortcut.IconLocation = "$installDir\public\favicon.ico, 0"
        $Shortcut.Save()
        Write-Host "   Desktop shortcut created successfully." -ForegroundColor Gray
    }
    catch {
        Write-Host "   Warning: Could not create desktop shortcut. Error: $_" -ForegroundColor Yellow
    }
}

# Start the application
$startNow = Read-Host "Do you want to start the application now? (Y/N)"
if ($startNow -eq "Y" -or $startNow -eq "y") {
    Show-Progress "Starting the application..."
    try {
        Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$installDir'; npm run dev"
        Write-Host "   Application started in a new window." -ForegroundColor Gray
    }
    catch {
        Show-Error "Failed to start the application. Error: $_"
    }
}

# Show success message
Show-Success

# Create uninstaller script
try {
    $uninstallerPath = Join-Path $installDir "uninstall.ps1"
    @"
#Requires -RunAsAdministrator
`$ErrorActionPreference = "Stop"

Write-Host "Uninstalling Address Compass Lookup..." -ForegroundColor Yellow
`$installDir = "$installDir"

# Remove desktop shortcut if exists
if (Test-Path "`$env:USERPROFILE\Desktop\Address Compass Lookup.lnk") {
    Remove-Item "`$env:USERPROFILE\Desktop\Address Compass Lookup.lnk" -Force
    Write-Host "Desktop shortcut removed." -ForegroundColor Green
}

# Ask for confirmation before deleting the directory
`$confirm = Read-Host "Do you want to remove all application files from `$installDir? (Y/N)"
if (`$confirm -eq "Y" -or `$confirm -eq "y") {
    # First kill any running npm processes in this directory
    Get-Process | Where-Object {`$_.Name -eq "node" -and `$_.Path -like "`$installDir*"} | ForEach-Object { Stop-Process -Id `$_.Id -Force }
    
    # Move up a directory if we're in the install dir
    if (`$PWD.Path -eq `$installDir) {
        Set-Location ..
    }
    
    # Delete the directory
    Remove-Item -Path `$installDir -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path `$installDir) {
        Write-Host "Warning: Some files could not be removed. Please delete the directory manually." -ForegroundColor Yellow
    } else {
        Write-Host "Application files removed successfully." -ForegroundColor Green
    }
}

Write-Host "Uninstallation complete!" -ForegroundColor Green
Read-Host "Press Enter to exit"
"@ | Out-File -FilePath $uninstallerPath -Encoding utf8
    Write-Host "✓ Uninstaller created at: $uninstallerPath" -ForegroundColor Green
}
catch {
    Write-Host "Warning: Could not create uninstaller. Error: $_" -ForegroundColor Yellow
}

Write-Host "Thank you for installing Address Compass Lookup!" -ForegroundColor Cyan
Write-Host "To start the application later, use the desktop shortcut or run 'npm run dev' in the installation directory." -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
