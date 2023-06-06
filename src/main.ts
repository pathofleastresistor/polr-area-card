import {LitElement, html, css, CSSResultGroup} from 'lit';
import { property } from "lit/decorators.js";
import {map} from 'lit/directives/map.js';
import {styleMap} from 'lit/directives/style-map.js';

class PolrAreaCard extends LitElement {
  @property() _config : any;
  @property() _hass : any;

  static getConfigElement() {
    // return document.createElement("polr-area-card-editor");
  }

  setConfig(config : any) {
    this._config = JSON.parse(JSON.stringify(config));

    if(!("background" in config))
      this._config["background"] = {}
  }

  set hass(hass : any) {
    this._hass = hass;
  }

  render() {    
    const gridStyle = this._config["background"];

    return html`
      <ha-card header=${ this._config["title"] } style=${styleMap(gridStyle)}>
        <div class="grid">
          ${ this._renderInfo() }
          ${ this._renderButtons() }
        </div>        
      </ha-card>
    `;
  }

  _renderInfo() {
    if(!("info" in this._config)) {
      return html``;
    }

    return html`
      <div class="info">
        <ha-icon icon="mdi:thermostat"></ha-icon>${ Math.round(this._hass["states"][this._config["info"]]["state"]) }°F
      </div>
    `;
  }

  _renderButtons() {
    if(!("buttons" in this._config)) {
      return html``;
    }

    return html`
      <div class="buttons">
        ${map(this._config["buttons"], (button) => html`
          <div class="button" @click=${{ handleEvent: () => this._handleTapAction(button["tap_action"]) }}>
            <ha-icon icon="${ button["icon"] }"></ha-icon>
          </div>
        `)}
      </div>
    `;
  }

  _handleTapAction(tapAction : any) {
    if(!("action" in tapAction)) {
      return;
    }

    if(tapAction["action"] === "call-service") {
      this._callService(tapAction);
    }

    if(tapAction["action"] === "navigate") {
      window.history.pushState(null, "", tapAction["url_path"]);
      window.dispatchEvent(new Event('location-changed', {
        bubbles: true,
        cancelable: false,
        composed: true,
      }));
    }
  }

  _callService(actionConfig : any){

    const [domain, service] = actionConfig["service"].split(".", 2);
    this._hass.callService(
      domain,
      service,
      actionConfig["data"] ?? actionConfig["service_data"],
      actionConfig["target"]
    );
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --polr-area-bg-color: #1c1d21;
        --polr-area-primary-color: #d5d4ce;
        --polr-area-primary-text: #ffffff;
      }

      div {
        padding: 0;
        margin: 0;
        line-height: 1em;
      }

      ha-card{
        background-repeat: no-repeat;
      }
      
      .card-header {
        padding: 12px 16px 0;
        line-height: 1em !important;
      }

      .grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        flex-flow: column nowrap;
        padding: 0 16px 12px;
      }

      .title{
        font-size: 2em;
        font-weight: bold;
      }

      .info {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: bold;
        font-size: 0.8em;
      }

      .buttons {
        margin-top: auto;
        padding-top: 25px;
        display: flex;
        gap: 10px;
      }

      .button {
        background-color: var(
          --ha-card-border-color,
          var(--divider-color, #e0e0e0)
        );
        color: var(--primary-text-color);
        fill: var(--primary-text-color);
        border-radius: 50%;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .button:active {
        opacity: 80%;
        transition: all 0s;
      }
    `;
  }
}

class PolrAreaCardEditor extends LitElement {
  
  setConfig(config:any) {
  }
  
  render() {
    return html`
      <ha-card header="hello">
        hello world
      </ha-card>
    `;
  }
}

customElements.define("polr-area-card", PolrAreaCard);
customElements.define("polr-area-card-editor", PolrAreaCardEditor);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'polr-area-card',
  name: 'POLR Area Card',
  description: 'A template custom card for you to create something awesome',
});
