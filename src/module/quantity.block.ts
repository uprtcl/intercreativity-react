import { LitElement, html, css, property, query } from 'lit-element';
import { Logger } from '@uprtcl/micro-orchestrator';
import { UprtclTextField } from '@uprtcl/common-ui';
import { Quantity } from './types';

export class QuantityBlock extends LitElement {
  logger = new Logger('QUANTITY-LENSE');

  @property({ type: String })
  uref: string;

  @property({ type: Object })
  data: Quantity;

  @property({ type: Boolean })
  editable: Boolean = false;

  @query('#value-input')
  valueInputEl!: UprtclTextField;

  @query('#units-input')
  unitsInputEl!: UprtclTextField;

  valueInput(e) {
    this.dispatchEvent(
      new CustomEvent('content-changed', {
        detail: {
          content: {
            ...this.data,
            value: this.valueInputEl.value,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  unitsInput(e) {
    this.dispatchEvent(
      new CustomEvent('content-changed', {
        detail: {
          content: {
            ...this.data,
            units: this.unitsInputEl.value,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<div class="row">
      <uprtcl-textfield
        ?disabled=${!this.editable}
        id="value-input"
        label="value"
        value=${this.data.value ? this.data.value : ''}
        @input=${this.valueInput}
      ></uprtcl-textfield>
      <uprtcl-textfield
        ?disabled=${!this.editable}
        id="units-input"
        label="units"
        class="units"
        value=${this.data.units ? this.data.units : ''}
        @input=${this.unitsInput}
      ></uprtcl-textfield>
    </div>`;
  }

  static get styles() {
    return css`
      .row {
        display: flex;
        justify-content: center;
        padding: 6px;
      }
      uprtcl-textfield {
        margin: 0px 6px;
      }
    `;
  }
}
