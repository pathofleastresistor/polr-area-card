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
    console.log(hass);
  }

  render() {
    console.log(this._config["background"]);
    
    const gridStyle = {
        backgroundImage: ("url" in this._config["background"]) ? `url(${this._config["background"]["url"]})`:``,
        backgroundPosition: `right ${this._config["background"]["right"]} bottom ${this._config["background"]["bottom"]}`,
        backgroundSize: `${this._config["background"]["size"]}`
    };

    return html`
      <ha-card style=${styleMap(gridStyle)}>
        <div class="grid">
          <div class="title">${this._config["title"]}</div>
          <div class="info">
            <ha-icon icon="mdi:thermostat"></ha-icon>${ Math.round(this._hass["states"]["sensor.living_room_ir_repeater_temperature"]["state"]) }°F
          </div>
          <div class="buttons">
            ${map(this._config["buttons"], (button) => html`
              <div class="button" @click=${{ handleEvent: () => this._callService(button["action"]) }}>
                <ha-icon icon="${ button["icon"] }"></ha-icon>
              </div>
            `)}
          </div>
        </div>        
      </ha-card>
    `;
  }

  _callService(s : any){
    let vals: any;
    vals = s["service"].split(".");
    console.log(s, vals);
    this._hass.callService(vals[0], vals[1], s["data"]);
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
        padding: 20px;
      }

      .grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        flex-flow: column nowrap;
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
        background-color: var(--polr-area-primary-color);
        color: var(--polr-area-bg-color);
        fill: var(--polr-area-bg-color);
        border-radius: 50%;
        padding: 10px;
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
