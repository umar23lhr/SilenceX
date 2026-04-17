# 🎬 SilenceX by Umar - Premiere Pro Extension

The reason the panel was empty is that the code needed to use **relative paths**. I have fixed this in `vite.config.ts`. Please follow these exact steps to get it working.

---

## 🚀 Step-by-Step Installation Guide

### 1. Build the Plugin (CRITICAL)
You must generate the compiled files first. Open your terminal in the project folder and run:
```bash
npm run build
```
*   **What this does:** It creates a `dist/` folder with the mini-optimized app and then runs a script to gather everything into a `release/` folder.
*   **Verify:** Check if you now have a `release/` folder containing `index.html`, `CSXS/`, and `extendscript.js`.

### 2. Create the Installer (.EXE)
1.  Install [Inno Setup Compiler](https://jrsoftware.org/isdl.php).
2.  Open the file: `installer/silencex_installer.iss`.
3.  Press **F9** or click the **Play** (Compile) button.
4.  Once finished, it will create an installer in: `installer/setup/SilenceX_Professional_Setup.exe`.

### 3. Install the Extension
1.  Close Adobe Premiere Pro.
2.  Run the `SilenceX_Professional_Setup.exe` you just created.
3.  **IMPORTANT**: Run as Administrator if prompted. This installs to the System Common Files folder for 100% visibility.
4.  Follow the setup wizard to completion.
    *   *Note: The installer automatically enables "PlayerDebugMode" so Premiere Pro can see the plugin.*

### 4. Open in Premiere Pro 2023
1.  Launch **Premiere Pro 2023**.
2.  Open any project.
3.  Go to the top menu: **Window > Extensions > SilenceX by Umar**.
4.  The panel should now load perfectly with the Glitch UI!

---

## 🛠 Troubleshooting "Empty/Black Panel"
If you still see a black screen in Premiere Pro 2023, I have added **Legacy Engine Support** and an **Error Logger** to help:

1.  **Legacy Core**: I added an auto-fallback system (`@vitejs/plugin-legacy`) that generates code compatible with older versions of Premiere Pro's internal engine.
2.  **Global Polyfills**: Fixed errors where Adobe's engine couldn't find "global" or "process" variables.
3.  **On-Screen Error Logger**: If it *still* crashes, you will now see a **Red Error Message** inside the panel instead of a black screen. This will tell us exactly what is wrong.

### Manual Fixes:
1.  **Manual Registry Fix (Windows)**:
    Sometimes the installer might need Admin rights. Open PowerShell as Administrator and run:
    ```powershell
    reg add "HKCU\Software\Adobe\CSXS.7" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.8" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f
    reg add "HKCU\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f
    ```

2.  **Verify Files**: 
    Ensure the folder `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.umar.silencex` exists and contains the files from the `release/` folder.

---

## 📂 Project Summary
- **UI**: React + Tailwind + Motion (Glitch Aesthetic)
- **Logic**: ExtendScript for Timeline control + FFmpeg for Audio detection.
- **Architecture**: CEP (Adobe Extensions standard).
