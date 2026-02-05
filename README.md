# Area Card Smart

[![HACS](https://img.shields.io/badge/hacs-custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/release/TheIronRock95/area-card-smart?style=for-the-badge)](https://github.com/TheIronRock95/area-card-smart/releases/)
[![License](https://img.shields.io/github/license/TheIronRock95/area-card-smart?style=for-the-badge)](https://github.com/TheIronRock95/area-card-smart/blob/main/LICENSE)

A smart wrapper for [area-card-plus](https://github.com/xBourner/area-card-plus) that **automatically detects area activity** without requiring binary sensors!

## ✨ Key Features

- **🎯 Zero Configuration Activity Detection**: No binary sensors needed - the card automatically detects if entities in an area are active
- **🎨 Dynamic Icon Colors**: Icon changes color based on activity (blue when active, gray when inactive)
- **🖱️ Visual Editor**: Easy configuration with dropdown menus in the Lovelace UI
- **⚡ Real-time Updates**: Icon colors update instantly when entity states change
- **🔧 Highly Customizable**: Configure active domains, colors, and more
- **📦 HACS Ready**: Easy installation via HACS

## 🚀 Why Area Card Smart?

Traditional area cards require you to create binary sensors with complex templates to detect activity. Area Card Smart eliminates this complexity by doing all the logic in JavaScript:

**Before (Traditional Method):**
```yaml
# Need to create binary sensor in configuration.yaml
binary_sensor:
  - platform: template
    sensors:
      woonkamer_active:
        value_template: >
          {{ is_state('light.woonkamer', 'on') or
             is_state('switch.tv', 'on') or
             is_state('media_player.tv', 'playing') }}
```

**After (Area Card Smart):**
```yaml
# Just use the card - no binary sensors needed!
type: custom:area-card-smart
area: woonkamer
area_icon: mdi:sofa
```

## 📋 Prerequisites

- Home Assistant 2024.1.0 or higher
- [area-card-plus](https://github.com/xBourner/area-card-plus) installed via HACS
- [card-mod](https://github.com/thomasloven/lovelace-card-mod) installed via HACS

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/TheIronRock95/area-card-smart`
6. Select category: "Lovelace"
7. Click "Add"
8. Find "Area Card Smart" in HACS and click "Download"
9. Restart Home Assistant

### Manual Installation

1. Download `area-card-smart.js` from the [latest release](https://github.com/TheIronRock95/area-card-smart/releases)
2. Copy it to your `config/www` folder
3. Add the following to your Lovelace dashboard configuration:
```yaml
resources:
  - url: /local/area-card-smart.js
    type: module
```
4. Restart Home Assistant

## 🎯 Configuration

### Minimal Configuration

```yaml
type: custom:area-card-smart
area: woonkamer
area_icon: mdi:sofa
```

### Full Configuration

```yaml
type: custom:area-card-smart
area: woonkamer                    # Required: Area name
area_icon: mdi:sofa                # Optional: Icon (default: mdi:home)
design: V1                         # Optional: V1 or V2 (default: V1)
layout: vertical                   # Optional: vertical or horizontal (default: vertical)
active_color: rgb(79, 134, 247)   # Optional: Color when active (default: blue)
inactive_color: rgb(128, 128, 128)# Optional: Color when inactive (default: gray)
active_domains:                    # Optional: Domains to check for activity
  - light
  - switch
  - media_player
  - fan
  - climate
theme: minimalist-desktop          # Optional: Theme name
hidden_entities:                   # Optional: Entities to exclude
  - sensor.unwanted_sensor
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `area` | string | Yes | - | Name of the Home Assistant area |
| `area_icon` | string | No | `mdi:home` | Icon to display for the area |
| `design` | string | No | `V1` | Design version (`V1` or `V2`) |
| `layout` | string | No | `vertical` | Card layout (`vertical` or `horizontal`) |
| `active_color` | string | No | `rgb(79, 134, 247)` | Icon color when area is active |
| `inactive_color` | string | No | `rgb(128, 128, 128)` | Icon color when area is inactive |
| `active_domains` | array | No | See below | Entity domains to check for activity |
| `theme` | string | No | - | Home Assistant theme to apply |
| `hidden_entities` | array | No | `[]` | Entities to exclude from activity detection |

**Default Active Domains:**
- `light`
- `switch`
- `media_player`
- `fan`
- `climate`

## 🎨 Activity Detection Logic

The card automatically checks entity states to determine if an area is active:

| Domain | Active When |
|--------|-------------|
| `light` | State is `on` |
| `switch` | State is `on` |
| `fan` | State is `on` |
| `media_player` | State is `playing` or `on` |
| `climate` | State is not `off` |
| `cover` | State is `open` |

## 🎨 Color Suggestions by Room Type

### Living Spaces
- **Living Room**: Active: `rgb(255, 193, 7)` (Warm Yellow), Inactive: `rgb(158, 158, 158)`
- **Bedroom**: Active: `rgb(156, 39, 176)` (Purple), Inactive: `rgb(189, 189, 189)`
- **Kitchen**: Active: `rgb(255, 152, 0)` (Orange), Inactive: `rgb(158, 158, 158)`

### Functional Spaces
- **Bathroom**: Active: `rgb(3, 169, 244)` (Light Blue), Inactive: `rgb(176, 190, 197)`
- **Office**: Active: `rgb(76, 175, 80)` (Green), Inactive: `rgb(165, 214, 167)`
- **Garage**: Active: `rgb(96, 125, 139)` (Blue Gray), Inactive: `rgb(207, 216, 220)`

### Outdoor
- **Garden**: Active: `rgb(139, 195, 74)` (Light Green), Inactive: `rgb(200, 230, 201)`
- **Terrace**: Active: `rgb(255, 235, 59)` (Yellow), Inactive: `rgb(255, 249, 196)`

## 🔧 Advanced Usage

### Custom Entity Filtering

You can customize which entity domains trigger the active state:

```yaml
type: custom:area-card-smart
area: garage
area_icon: mdi:garage
active_domains:
  - light
  - cover  # Garage door
```

### Hiding Specific Entities

Exclude specific entities from activity detection:

```yaml
type: custom:area-card-smart
area: bedroom
area_icon: mdi:bed
hidden_entities:
  - sensor.bedroom_temperature
  - sensor.bedroom_humidity
```

### Multiple Cards Example

```yaml
type: grid
cards:
  - type: custom:area-card-smart
    area: woonkamer
    area_icon: mdi:sofa
    active_color: rgb(255, 193, 7)

  - type: custom:area-card-smart
    area: keuken
    area_icon: mdi:fridge
    active_color: rgb(255, 152, 0)

  - type: custom:area-card-smart
    area: slaapkamer
    area_icon: mdi:bed
    active_color: rgb(156, 39, 176)
```

## 🐛 Troubleshooting

### Icon Color Not Changing

1. **Verify entities are assigned to the area**
   - Go to Settings → Areas & Zones
   - Check if entities are properly assigned

2. **Check entity domains**
   - Only entities in `active_domains` trigger activity detection
   - Default domains: light, switch, media_player, fan, climate

3. **Verify card-mod is installed**
   - The card requires card-mod for icon coloring
   - Install via HACS if not already installed

### Card Not Loading

1. **Check browser console** for errors (F12)
2. **Verify area-card-plus is installed**
3. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
4. **Restart Home Assistant**

### Visual Editor Not Showing

1. Clear browser cache
2. Verify the card is properly registered
3. Check browser console for JavaScript errors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/TheIronRock95/area-card-smart/blob/main/LICENSE) file for details.

## 🙏 Credits

- Built as a wrapper for [area-card-plus](https://github.com/xBourner/area-card-plus) by [xBourner](https://github.com/xBourner)
- Inspired by the need to simplify area activity detection in Home Assistant
- Thanks to the Home Assistant community for continuous inspiration

## 📞 Support

- 🐛 [Report a Bug](https://github.com/yourusername/area-card-smart/issues)
- 💡 [Request a Feature](https://github.com/yourusername/area-card-smart/issues)
- 📖 [View Documentation](https://github.com/yourusername/area-card-smart)

---

If you like this card, please ⭐ star the repository!
