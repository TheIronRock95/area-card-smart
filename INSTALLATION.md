# Installation Guide - Area Card Smart

This guide will walk you through setting up Area Card Smart from scratch, including creating the GitHub repository and publishing it for HACS distribution.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating the GitHub Repository](#creating-the-github-repository)
3. [Uploading Files](#uploading-files)
4. [Creating Your First Release](#creating-your-first-release)
5. [Installing via HACS](#installing-via-hacs)
6. [Using the Card](#using-the-card)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- ✅ Home Assistant 2024.1.0 or higher installed
- ✅ HACS (Home Assistant Community Store) installed
- ✅ [area-card-plus](https://github.com/xBourner/area-card-plus) installed via HACS
- ✅ [card-mod](https://github.com/thomasloven/lovelace-card-mod) installed via HACS
- ✅ A GitHub account

## Creating the GitHub Repository

### Step 1: Create a New Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `area-card-smart`
   - **Description**: "A smart Home Assistant card that automatically detects area activity"
   - **Visibility**: Public
   - ✅ Check "Add a README file"
   - **License**: MIT License
5. Click **"Create repository"**

### Step 2: Clone the Repository

Open a terminal and clone your new repository:

```bash
git clone https://github.com/yourusername/area-card-smart.git
cd area-card-smart
```

## Uploading Files

### Step 1: Add Project Files

Copy the following files to your repository folder:

- `area-card-smart.js` - The main card JavaScript file
- `hacs.json` - HACS integration configuration
- `package.json` - NPM package configuration
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation
- `.github/workflows/release.yml` - GitHub Actions workflow

### Step 2: Commit and Push

```bash
# Add all files
git add .

# Commit the files
git commit -m "Initial commit: Area Card Smart v1.0.0"

# Push to GitHub
git push origin main
```

## Creating Your First Release

Releases are crucial for HACS integration. Here's how to create your first release:

### Step 1: Create a Git Tag

```bash
# Create a version tag
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

### Step 2: GitHub Actions Will Auto-Create the Release

The GitHub Actions workflow (`.github/workflows/release.yml`) will automatically:
- Create a GitHub release
- Attach the `area-card-smart.js` file
- Generate release notes

Alternatively, you can create a release manually:

### Step 3: Manual Release (Alternative)

1. Go to your GitHub repository
2. Click on **"Releases"** in the right sidebar
3. Click **"Create a new release"**
4. Fill in the release details:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Release v1.0.0`
   - **Description**:
     ```markdown
     ## Area Card Smart v1.0.0

     Initial release with automatic activity detection!

     ### Features
     - ✅ Automatic area activity detection without binary sensors
     - ✅ Dynamic icon coloring
     - ✅ Visual configuration editor
     - ✅ Support for multiple entity domains

     ### Installation
     Install via HACS or download `area-card-smart.js` manually.
     ```
5. Upload `area-card-smart.js` as a release asset
6. Click **"Publish release"**

## Installing via HACS

### For Users: Install the Custom Card

1. Open **HACS** in Home Assistant
2. Click on **"Frontend"**
3. Click the **three dots** (⋮) in the top right corner
4. Select **"Custom repositories"**
5. Add your repository:
   - **Repository**: `https://github.com/yourusername/area-card-smart`
   - **Category**: Lovelace
6. Click **"Add"**
7. Find **"Area Card Smart"** in the list
8. Click **"Download"**
9. **Restart Home Assistant**

### For Repository Owner: Submit to HACS Default

To make your card available in HACS by default (optional):

1. Ensure your repository meets [HACS requirements](https://hacs.xyz/docs/publish/start)
2. Submit a pull request to [HACS-default](https://github.com/hacs/default)
3. Wait for review and approval

## Using the Card

### Step 1: Add the Card via UI

1. Go to your Lovelace dashboard
2. Click **"Edit Dashboard"** (three dots → Edit Dashboard)
3. Click **"+ Add Card"**
4. Search for **"Area Card Smart"**
5. Configure the card using the visual editor:
   - **Area**: Select or type your area name (e.g., "woonkamer")
   - **Area Icon**: Choose an icon (e.g., "mdi:sofa")
   - **Design**: V1 or V2
   - **Layout**: Vertical or Horizontal
   - **Active Color**: rgb(79, 134, 247) or your preferred color
   - **Inactive Color**: rgb(128, 128, 128) or your preferred color
6. Click **"Save"**

### Step 2: Add the Card via YAML

Alternatively, add the card using YAML:

```yaml
type: custom:area-card-smart
area: woonkamer
area_icon: mdi:sofa
active_color: rgb(79, 134, 247)
inactive_color: rgb(128, 128, 128)
```

### Step 3: Verify It Works

1. Turn on a light or switch in the configured area
2. The card icon should change from gray to blue (or your custom colors)
3. Turn off all entities
4. The icon should change back to gray

## Usage Examples

### Example 1: Living Room

```yaml
type: custom:area-card-smart
area: woonkamer
area_icon: mdi:sofa
active_color: rgb(255, 193, 7)
inactive_color: rgb(158, 158, 158)
```

### Example 2: Bedroom (Climate Only)

```yaml
type: custom:area-card-smart
area: slaapkamer
area_icon: mdi:bed
active_color: rgb(156, 39, 176)
active_domains:
  - climate
  - light
```

### Example 3: Multi-Card Grid

```yaml
type: grid
columns: 3
cards:
  - type: custom:area-card-smart
    area: woonkamer
    area_icon: mdi:sofa

  - type: custom:area-card-smart
    area: keuken
    area_icon: mdi:fridge

  - type: custom:area-card-smart
    area: slaapkamer
    area_icon: mdi:bed
```

## Troubleshooting

### Card Not Appearing in HACS

**Problem**: Card doesn't show up in HACS after adding custom repository

**Solutions**:
1. Verify the repository URL is correct
2. Ensure `hacs.json` exists in the repository root
3. Check that you selected "Lovelace" as the category
4. Try reloading HACS (Configuration → Settings → System → Reload HACS)

### Card Not Loading

**Problem**: Card shows as "Custom element doesn't exist: area-card-smart"

**Solutions**:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify the card is downloaded in HACS
3. Restart Home Assistant
4. Check browser console (F12) for errors

### Icon Color Not Changing

**Problem**: Icon stays gray even when entities are active

**Solutions**:
1. Verify entities are assigned to the correct area:
   - Go to Settings → Areas & Zones
   - Check entity assignments
2. Verify entity domains match `active_domains` configuration
3. Ensure card-mod is installed:
   ```bash
   # Check in HACS → Frontend
   ```
4. Check entity states in Developer Tools → States

### area-card-plus Not Found

**Problem**: Error message about area-card-plus

**Solutions**:
1. Install area-card-plus from HACS:
   - Open HACS → Frontend
   - Search for "area-card-plus"
   - Click Download
2. Restart Home Assistant

## Updating the Card

### For Users

1. Open HACS → Frontend
2. Find "Area Card Smart"
3. If an update is available, click "Update"
4. Restart Home Assistant

### For Developers (Publishing Updates)

1. Make your code changes
2. Update version in `package.json` and `area-card-smart.js`
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Version 1.1.0: Add new feature"
   git push origin main
   ```
4. Create a new tag and push:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
5. GitHub Actions will automatically create the release

## Tips & Best Practices

### 1. Test Before Publishing
- Test the card in your own Home Assistant instance
- Verify all features work as expected
- Check browser console for errors

### 2. Area Assignment
- Ensure all relevant entities are assigned to areas
- Use consistent area naming (lowercase, underscores)
- Verify assignments in Settings → Areas & Zones

### 3. Color Customization
- Use RGB format: `rgb(r, g, b)`
- Test colors in both light and dark themes
- Consider accessibility (sufficient contrast)

### 4. Performance
- The card only re-renders when activity state changes
- No performance impact from frequent state updates
- Suitable for dashboards with many cards

### 5. Documentation
- Keep README.md up to date
- Document breaking changes in release notes
- Provide migration guides for major versions

## Support & Resources

- 📖 [Full Documentation](https://github.com/yourusername/area-card-smart)
- 🐛 [Report Issues](https://github.com/yourusername/area-card-smart/issues)
- 💡 [Request Features](https://github.com/yourusername/area-card-smart/issues)
- 🤝 [Contribute](https://github.com/yourusername/area-card-smart/pulls)

## Additional Resources

- [HACS Documentation](https://hacs.xyz/)
- [Home Assistant Lovelace Documentation](https://www.home-assistant.io/lovelace/)
- [area-card-plus Documentation](https://github.com/xBourner/area-card-plus)
- [card-mod Documentation](https://github.com/thomasloven/lovelace-card-mod)

---

**Congratulations!** 🎉 You've successfully installed and configured Area Card Smart. Enjoy your automated area activity detection!
