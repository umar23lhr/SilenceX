# Silence Remover for Premiere Pro (UXP)

Professional Adobe Premiere Pro plugin for automatic silence detection and removal.

## 🚀 Installation

1. **Locate your UXP Plugins folder:**
   - **macOS:** `~/Library/Application Support/Adobe/UXP/Plugins`
   - **Windows:** `%AppData%\Adobe\UXP\Plugins`

2. **Download/Copy the project files:**
   Place the following files into a new folder named `SilenceRemover` inside the Plugins directory:
   - `manifest.json`
   - `index.html` (entry point)
   - `dist/` (after building)
   - `src/extendscript.js`

3. **Enable Developer Mode in Premiere Pro:**
   - Go to `Edit > Preferences > Plug-ins` (Windows) or `Premiere Pro > Settings > Plug-ins` (macOS).
   - Ensure "Allow UXP Developer Tools" is enabled if you are using the UXP Developer Tool.

4. **Load the Plugin:**
   Use the **Adobe UXP Developer Tool** to "Add Plugin" and point to the `manifest.json`.

## 🛠 Project Structure

- `manifest.json`: UXP v5.0+ configuration & permissions.
- `index.html`: Main UI container.
- `src/App.tsx`: React-based UI with Adobe Spectrum styling.
- `src/ffmpeg.ts`: Wrapper for FFmpeg execution & parsing logic.
- `src/extendscript.js`: Host-side logic for timeline manipulation (Ripple Delete).
- `package.json`: NPM dependencies for building.

## ⚙️ Technical Details

### Audio Analysis
The plugin uses FFmpeg's `silencedetect` filter. Ensure `ffmpeg` is installed in your system PATH or bundled with the plugin binary in a production release.

### Timeline Automation
The automation logic performs ripple deletes starting from the **end of the timeline** working backwards. This ensures that deletions do not shift the remaining silent segments' timecodes, maintaining perfect synchronization.

### Permissions
The plugin requires `localFileSystem` for temporary audio exports and `launchProcess` for running FFmpeg checks.
