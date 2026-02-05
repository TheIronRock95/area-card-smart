/**
 * Area Card Smart
 * A wrapper for area-card-plus that automatically detects area activity
 * without requiring binary sensors.
 *
 * @version 0.0.3
 * @author sironite
 * @license MIT
 */

class AreaCardSmart extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._helpers = null;
    this._card = null;
    this._wasAreaActive = false;
  }

  /**
   * Set configuration from Lovelace UI
   * @param {Object} config - Card configuration
   */
  setConfig(config) {
    if (!config.area) {
      throw new Error('Area is required');
    }

    // Set defaults
    this._config = {
      area: config.area,
      area_icon: config.area_icon || 'mdi:home',
      design: config.design || 'V1',
      layout: config.layout || 'vertical',
      active_color: config.active_color || 'rgb(79, 134, 247)',
      inactive_color: config.inactive_color || 'rgb(128, 128, 128)',
      active_domains: config.active_domains || ['light', 'switch', 'media_player', 'fan', 'climate'],
      hidden_entities: config.hidden_entities || [],
      theme: config.theme || null,
      ...config
    };

    this._loadCardHelpers();
  }

  /**
   * Load card helpers from Home Assistant
   */
  async _loadCardHelpers() {
    this._helpers = await window.loadCardHelpers();
    if (this._hass) {
      this._updateCard();
    }
  }

  /**
   * Called when Home Assistant state updates
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    this._hass = hass;

    // Check if area activity state changed
    const isActive = this._isAreaActive();

    // Only rebuild card if activity state changed or card doesn't exist
    if (!this._card || isActive !== this._wasAreaActive) {
      this._wasAreaActive = isActive;
      this._updateCard();
    }

    // Always update hass for the wrapped card
    if (this._card && this._card.hass) {
      this._card.hass = hass;
    }
  }

  /**
   * Core method: Detect if area is active by checking entity states
   * This is the key innovation - no binary sensors needed!
   * @returns {boolean} - True if any entity in the area is active
   */
  _isAreaActive() {
    if (!this._hass) {
      return false;
    }

    const areaId = this._config.area.toLowerCase().replace(/\s+/g, '_');
    const activeDomains = this._config.active_domains;
    const hiddenEntities = this._config.hidden_entities;

    // Get all entities from Home Assistant
    const entities = Object.keys(this._hass.states);

    // Filter entities that belong to this area
    const areaEntities = entities.filter(entityId => {
      // Skip hidden entities
      if (hiddenEntities.includes(entityId)) {
        return false;
      }

      const entity = this._hass.states[entityId];
      if (!entity) {
        return false;
      }

      // Check if entity belongs to area (multiple ways to check)
      // 1. Direct entity area_id attribute
      if (entity.attributes.area_id === areaId) {
        return true;
      }

      // 2. Check entity registry via hass.entities
      if (this._hass.entities && this._hass.entities[entityId]) {
        const entityEntry = this._hass.entities[entityId];
        if (entityEntry.area_id === areaId) {
          return true;
        }
      }

      // 3. Check device area (requires device_id)
      if (entity.attributes.device_id && this._hass.devices) {
        const device = this._hass.devices[entity.attributes.device_id];
        if (device && device.area_id === areaId) {
          return true;
        }
      }

      return false;
    });

    // Check if any entity in the area is active
    for (const entityId of areaEntities) {
      const entity = this._hass.states[entityId];
      const domain = entityId.split('.')[0];

      // Only check entities in active_domains
      if (!activeDomains.includes(domain)) {
        continue;
      }

      // Check if entity is active based on domain-specific logic
      const isActive = this._isEntityActive(entity, domain);
      if (isActive) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a specific entity is active based on its domain
   * @param {Object} entity - Entity state object
   * @param {string} domain - Entity domain (light, switch, etc.)
   * @returns {boolean} - True if entity is active
   */
  _isEntityActive(entity, domain) {
    if (!entity) {
      return false;
    }

    const state = entity.state;

    switch (domain) {
      case 'light':
      case 'switch':
      case 'fan':
        return state === 'on';

      case 'media_player':
        return state === 'playing' || state === 'on';

      case 'climate':
        return state !== 'off';

      case 'cover':
        return state === 'open';

      default:
        return state === 'on';
    }
  }

  /**
   * Update the wrapped card with current configuration
   */
  async _updateCard() {
    if (!this._helpers || !this._hass) {
      return;
    }

    // Build the area-card-plus configuration WITHOUT card_mod
    const cardConfig = this._buildCard();

    // Create the card element
    if (!this._card) {
      this._card = await this._helpers.createCardElement(cardConfig);
      this._card.hass = this._hass;

      // Clear and append
      while (this.lastChild) {
        this.removeChild(this.lastChild);
      }
      this.appendChild(this._card);
    } else {
      // Update existing card config
      this._card.setConfig(cardConfig);
      this._card.hass = this._hass;
    }

    // Apply icon coloring directly via CSS (no card-mod needed!)
    this._applyIconStyling();
  }

  /**
   * Build the area-card-plus configuration (NO card_mod to avoid conflicts)
   * @returns {Object} - Card configuration object
   */
  _buildCard() {
    // Start with area-card-plus config, keeping ALL original options
    const config = {
      type: 'custom:area-card-plus',
      ...this._config  // Pass through ALL config options
    };

    // Remove our custom properties that area-card-plus doesn't understand
    delete config.active_color;
    delete config.inactive_color;
    delete config.active_domains;
    delete config.hidden_entities;

    return config;
  }

  /**
   * Apply icon styling directly via CSS (avoids card-mod conflicts)
   */
  _applyIconStyling() {
    if (!this._card) {
      return;
    }

    const isActive = this._isAreaActive();
    const iconColor = isActive ? this._config.active_color : this._config.inactive_color;

    // Apply CSS custom property to the card
    const cardElement = this._card.querySelector('ha-card') || this._card;
    if (cardElement) {
      cardElement.style.setProperty('--area-card-icon-color', iconColor);
    }

    // Find and color all icons in the card
    const icons = this._card.querySelectorAll('ha-icon');
    icons.forEach(icon => {
      icon.style.color = iconColor;
    });

    // Also check in shadow DOM
    if (this._card.shadowRoot) {
      const shadowIcons = this._card.shadowRoot.querySelectorAll('ha-icon');
      shadowIcons.forEach(icon => {
        icon.style.color = iconColor;
      });
    }
  }

  /**
   * Get card size for Lovelace layout
   * @returns {number} - Card height in grid units
   */
  getCardSize() {
    if (this._card && this._card.getCardSize) {
      return this._card.getCardSize();
    }
    return 3;
  }

  /**
   * Get the visual configuration editor
   * @returns {Object} - Editor element
   */
  static getConfigElement() {
    return document.createElement('area-card-smart-editor');
  }

  /**
   * Get default stub configuration
   * @returns {Object} - Default configuration
   */
  static getStubConfig() {
    return {
      type: 'custom:area-card-smart',
      area: 'woonkamer',
      area_icon: 'mdi:sofa'
    };
  }
}

/**
 * Visual configuration editor for Area Card Smart
 */
class AreaCardSmartEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  /**
   * Render the configuration editor UI
   */
  _render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    // Get all areas from Home Assistant
    const areas = this._getAreas();

    this.shadowRoot.innerHTML = `
      <style>
        .card-config {
          padding: 16px;
        }
        .config-row {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .config-row label {
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--primary-text-color);
        }
        .config-row input,
        .config-row select {
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background-color: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 14px;
        }
        .info-box {
          background-color: var(--info-color, #2196F3);
          color: white;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .required {
          color: var(--error-color, #f44336);
        }
      </style>

      <div class="card-config">
        <div class="info-box">
          ℹ️ De card detecteert automatisch of entities in deze area actief zijn. Je hoeft geen binary sensor aan te maken!
        </div>

        <div class="config-row">
          <label>Area <span class="required">*</span></label>
          <select id="area">
            <option value="">Select area...</option>
            ${areas.map(area => `
              <option value="${area.area_id}" ${this._config.area === area.area_id ? 'selected' : ''}>
                ${area.name}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="config-row">
          <label>Area Icon</label>
          <input
            type="text"
            id="area_icon"
            .value="${this._config.area_icon || 'mdi:home'}"
            placeholder="mdi:home"
          />
        </div>

        <div class="config-row">
          <label>Design</label>
          <select id="design">
            <option value="V1" ${this._config.design === 'V1' || !this._config.design ? 'selected' : ''}>V1</option>
            <option value="V2" ${this._config.design === 'V2' ? 'selected' : ''}>V2</option>
          </select>
        </div>

        <div class="config-row">
          <label>Layout</label>
          <select id="layout">
            <option value="vertical" ${this._config.layout === 'vertical' || !this._config.layout ? 'selected' : ''}>Vertical</option>
            <option value="horizontal" ${this._config.layout === 'horizontal' ? 'selected' : ''}>Horizontal</option>
          </select>
        </div>

        <div class="config-row">
          <label>Active Color</label>
          <input
            type="text"
            id="active_color"
            .value="${this._config.active_color || 'rgb(79, 134, 247)'}"
            placeholder="rgb(79, 134, 247)"
          />
        </div>

        <div class="config-row">
          <label>Inactive Color</label>
          <input
            type="text"
            id="inactive_color"
            .value="${this._config.inactive_color || 'rgb(128, 128, 128)'}"
            placeholder="rgb(128, 128, 128)"
          />
        </div>

        <div class="config-row">
          <label>Active Domains (comma-separated)</label>
          <input
            type="text"
            id="active_domains"
            .value="${this._getActiveDomainsString()}"
            placeholder="light, switch, media_player, fan, climate"
          />
        </div>

        <div class="config-row">
          <label>Theme (optional)</label>
          <input
            type="text"
            id="theme"
            .value="${this._config.theme || ''}"
            placeholder="minimalist-desktop"
          />
        </div>
      </div>
    `;

    // Add event listeners
    this._attachEventListeners();
  }

  /**
   * Get all areas from Home Assistant
   * @returns {Array} - List of area objects
   */
  _getAreas() {
    if (!this._hass || !this._hass.areas) {
      return [];
    }

    return Object.keys(this._hass.areas).map(areaId => ({
      area_id: areaId,
      name: this._hass.areas[areaId].name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get active domains as comma-separated string
   * @returns {string}
   */
  _getActiveDomainsString() {
    if (Array.isArray(this._config.active_domains)) {
      return this._config.active_domains.join(', ');
    }
    return 'light, switch, media_player, fan, climate';
  }

  /**
   * Attach event listeners to input fields
   */
  _attachEventListeners() {
    const inputs = ['area', 'area_icon', 'design', 'layout', 'active_color', 'inactive_color', 'active_domains', 'theme'];

    inputs.forEach(key => {
      const element = this.shadowRoot.getElementById(key);
      if (element) {
        element.addEventListener('input', (e) => this._valueChanged(e));
        element.addEventListener('change', (e) => this._valueChanged(e));
      }
    });
  }

  /**
   * Handle value changes in the editor
   * @param {Event} e - Input event
   */
  _valueChanged(e) {
    if (!this._config) {
      return;
    }

    const target = e.target;
    const key = target.id;
    let value = target.value;

    // Parse active_domains as array
    if (key === 'active_domains') {
      value = value.split(',').map(d => d.trim()).filter(d => d);
    }

    // Update config
    this._config = {
      ...this._config,
      [key]: value
    };

    // Fire config changed event
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Register custom elements
customElements.define('area-card-smart', AreaCardSmart);
customElements.define('area-card-smart-editor', AreaCardSmartEditor);

// Register card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'area-card-smart',
  name: 'Area Card Smart',
  description: 'Automatically detect area activity without binary sensors',
  preview: true,
  documentationURL: 'https://github.com/TheIronRock95/area-card-smart'
});

console.info(
  '%c AREA-CARD-SMART %c v0.0.3 ',
  'color: white; background: #2196F3; font-weight: 700;',
  'color: #2196F3; background: white; font-weight: 700;'
);
