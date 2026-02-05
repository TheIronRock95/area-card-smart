# Claude Code Context: Area Card Smart Project

## Project Overview

This is **Area Card Smart**, a custom Home Assistant Lovelace card that wraps [area-card-plus](https://github.com/xBourner/area-card-plus) with intelligent automatic activity detection.

**Key Innovation**: This card automatically detects if an area is active by checking entity states in JavaScript - **NO binary sensors needed!**

## Project Location

```
/Users/wouter/personal/area-card-smart/
```

## What Was Created

All files have been freshly generated and are production-ready:

### 1. area-card-smart.js (Main Implementation)
- **AreaCardSmart class**: Main card that wraps area-card-plus
- **Core Method `_isAreaActive()`**: Checks entity states to detect area activity
  - Checks entities in: light, switch, media_player, fan, climate, cover domains
  - Returns true if ANY entity in the area is active
  - No binary sensors required!
- **AreaCardSmartEditor class**: Visual configuration editor with dropdowns
- **Dynamic Coloring**: Icon changes color based on activity state via card_mod

### 2. hacs.json
- HACS integration configuration
- Configured for root-level installation
- Minimum Home Assistant version: 2024.1.0

### 3. package.json
- NPM package configuration
- Version: 1.0.0
- MIT License
- Ready for npm publishing (optional)

### 4. .github/workflows/release.yml
- GitHub Actions workflow for automatic releases
- Triggers on version tags (v*)
- Auto-creates releases and attaches area-card-smart.js

### 5. README.md
- Comprehensive user documentation
- Installation instructions (HACS + manual)
- Configuration examples (minimal + full)
- Activity detection logic explanation
- Color suggestions by room type
- Troubleshooting section
- Credits to area-card-plus

### 6. INSTALLATION.md
- Step-by-step setup guide
- GitHub repository creation
- First release creation
- HACS installation process
- Usage examples
- Tips & best practices

### 7. .gitignore
- Standard ignore patterns for Node.js projects
- IDE files, OS files, logs

## Technical Architecture

### How Activity Detection Works

```javascript
_isAreaActive() {
  // 1. Get area ID from config
  // 2. Find all entities in this area by checking:
  //    - entity.attributes.area_id
  //    - hass.entities[entity_id].area_id (entity registry)
  //    - device.area_id (via device registry)
  // 3. Filter by active_domains (default: light, switch, media_player, fan, climate)
  // 4. Check each entity's state based on domain-specific logic
  // 5. Return true if ANY entity is active
}
```

### Activity Logic by Domain

| Domain | Active When |
|--------|-------------|
| light, switch, fan | state === 'on' |
| media_player | state === 'playing' or 'on' |
| climate | state !== 'off' |
| cover | state === 'open' |

### Card Structure

```
Area Card Smart (wrapper)
  └─ area-card-plus (wrapped card)
      └─ card_mod (for icon coloring)
```

## Configuration Schema

**Minimal:**
```yaml
type: custom:area-card-smart
area: woonkamer
area_icon: mdi:sofa
```

**Full:**
```yaml
type: custom:area-card-smart
area: woonkamer                    # Required
area_icon: mdi:sofa                # Optional: default mdi:home
design: V1                         # Optional: V1 or V2
layout: vertical                   # Optional: vertical or horizontal
active_color: rgb(79, 134, 247)   # Optional: blue when active
inactive_color: rgb(128, 128, 128)# Optional: gray when inactive
active_domains:                    # Optional: domains to check
  - light
  - switch
  - media_player
  - fan
  - climate
theme: minimalist-desktop          # Optional
hidden_entities:                   # Optional: entities to exclude
  - sensor.unwanted_sensor
```

## Dependencies

The card requires these to be installed in Home Assistant:

1. **area-card-plus** (via HACS) - The base card we're wrapping
2. **card-mod** (via HACS) - For dynamic icon coloring
3. **Home Assistant 2024.1.0+**

## Current State

✅ All files created and ready
⏳ NOT yet initialized as git repository
⏳ NOT yet pushed to GitHub
⏳ NOT yet released
⏳ NOT yet tested in Home Assistant

## Next Steps to Complete

### 1. Initialize Git Repository
```bash
cd /Users/wouter/personal/area-card-smart
git init
git add .
git commit -m "Initial commit: Area Card Smart v1.0.0"
```

### 2. Create GitHub Repository
- Go to GitHub and create new repository: `area-card-smart`
- Make it public
- Don't initialize with README (we already have one)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOURUSERNAME/area-card-smart.git
git branch -M main
git push -u origin main
```

### 4. Create First Release
```bash
git tag v1.0.0
git push origin v1.0.0
```
This will trigger GitHub Actions to create the release automatically.

### 5. Test in Home Assistant
- Add as HACS custom repository
- Install the card
- Create a test card in Lovelace
- Verify icon color changes when turning lights on/off

## Design Decisions

### Why No Binary Sensors?
- **User Request**: All logic in JavaScript, not YAML templates
- **Simplicity**: Plug-and-play, no configuration needed
- **Maintainability**: Single source of truth

### Why Wrap area-card-plus?
- Don't reinvent the wheel
- area-card-plus has excellent UI and features
- We add the smart activity detection layer on top

### Color Scheme
- **Active**: rgb(79, 134, 247) - iOS-style blue
- **Inactive**: rgb(128, 128, 128) - Neutral gray
- **Customizable**: Users can override with any rgb() color

### Performance Considerations
- Only re-renders when activity state **changes**
- Uses `_wasAreaActive` boolean to track previous state
- Doesn't rebuild on every Home Assistant state update
- Efficient for dashboards with many cards

## Common Pitfalls Already Handled

1. ✅ **Entity Area Assignment**: Code checks ALL three methods:
   - Direct entity.attributes.area_id
   - Entity registry (hass.entities[id].area_id)
   - Device registry (device.area_id)

2. ✅ **State Updates**: Only rebuilds when activity state changes, not on every hass update

3. ✅ **Card Mod Syntax**: Inline CSS, not Jinja templates

4. ✅ **Card Helpers**: Properly awaits loadCardHelpers() promise

## File Locations

All files are in: `/Users/wouter/personal/area-card-smart/`

- Main code: `area-card-smart.js`
- Documentation: `README.md`, `INSTALLATION.md`
- Config: `hacs.json`, `package.json`, `.gitignore`
- Automation: `.github/workflows/release.yml`

## Testing Checklist

When testing, verify:
- [ ] Card loads without errors
- [ ] Visual editor appears and saves configuration
- [ ] Icon color changes when lights are turned on/off
- [ ] Works with all active_domains
- [ ] Area entity assignment is detected correctly
- [ ] Custom colors work
- [ ] Hidden entities are excluded
- [ ] Card updates in real-time without refresh
- [ ] Works with both V1 and V2 design modes
- [ ] HACS validation passes

## Known Issues / TODO

None currently - this is a fresh implementation ready for initial release.

## Version Information

- **Current Version**: 1.0.0
- **Status**: Pre-release (not yet published)
- **License**: MIT
- **Author**: Wouter

## Additional Context

This project was created to solve a specific pain point: making area cards show activity status without requiring users to create binary sensors with complex template logic. By moving all the logic into JavaScript, we make it a true plug-and-play solution.

The user (Wouter) has a sophisticated Home Assistant setup with 20+ rooms and wanted this functionality across all area cards without maintaining 20+ binary sensors.

## Questions You Might Have

**Q: Why not modify area-card-plus directly?**
A: This is a wrapper that adds functionality without forking/modifying the original. Cleaner separation of concerns.

**Q: Does this work with all Home Assistant versions?**
A: Requires 2024.1.0+. Older versions might work but untested.

**Q: Can I use this without HACS?**
A: Yes! Manual installation is documented in README.md.

**Q: How do I change the version number?**
A: Update in both `package.json` and the console.info() line in `area-card-smart.js`.

## Commands You Might Need

```bash
# Navigate to project
cd /Users/wouter/personal/area-card-smart

# Check file structure
ls -la

# View file contents
cat area-card-smart.js

# Initialize git (if not done)
git init

# Check git status
git status

# Create and push tag
git tag v1.0.0
git push origin v1.0.0
```

---

**Ready to Continue!** This project is complete and ready for git initialization, GitHub publishing, and Home Assistant testing.
