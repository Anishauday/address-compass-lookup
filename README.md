
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f65a6cf0-9e82-4e54-84d5-b0d24374fc61

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f65a6cf0-9e82-4e54-84d5-b0d24374fc61) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use Windows Installer**

For Windows users, we've made installation super simple with two options:

1. **Using the batch file installer (Recommended)**:
   - Download the repository
   - Double-click on `install.bat`
   - Follow the on-screen instructions
   - The installer will detect if you're using a ZIP download or need to clone from Git
   - The installer will create shortcuts and launch the app for you
   - If the directory already contains files, you'll be given options:
     - Initialize Git in the current directory (recommended for first-time setup)
     - Clone into a subdirectory
     - Exit and choose a different directory

2. **Using PowerShell installer**:
   - Download the repository
   - Right-click on `windows-installer.ps1` and select "Run with PowerShell"
   - If PowerShell scripts are disabled, you may need to run:
     ```powershell
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
     ```
   - Then run: `.\windows-installer.ps1`
   - Follow the on-screen instructions

Both installers will:
- Verify Node.js and Git are installed
- Set up the repository (Clone or use existing files)
- Install dependencies
- Create a desktop shortcut (optional)
- Launch the application for you

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f65a6cf0-9e82-4e54-84d5-b0d24374fc61) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
