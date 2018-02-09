// Import dependencies.
import {CatalystToggleButton} from '../node_modules/@catalyst-elements/catalyst-toggle-button/dist/catalyst-toggle-button.module.js';

/**
 * Get the template for this element.
 */
function getTemplate() {
  let template = document.createElement('template');
  template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`;  // eslint-disable-line quotes

  // If using ShadyCSS.
  if (window.ShadyCSS !== undefined) {
    // Rename classes as needed to ensure style scoping.
    window.ShadyCSS.prepareTemplate(template, CatalystToggleSwitch.is);
  }

  return template;
}

/**
 * `<catalyst-toggle-switch>` is a toggle switch web component.
 *
 *     <catalyst-toggle-switch></catalyst-toggle-switch>
 *
 * It may include optional form control setting for use in a form.
 *
 *     <catalyst-toggle-switch name="form-element-name" value="value"></catalyst-toggle-switch>
 *
 * ### Focus
 * To focus a catalyst-toggle-switch, you can call the native `focus()` method as long as the
 * element has a tab index. Similarly, `blur()` will blur the element.
 *
 * ### Styling
 *
 * The following css custom properties are available for this element:
 *
 * Property | Description | Default Value
 * -------- |------------ | -------------
 * `--catalyst-toggle-switch-bar-color`       | The color of the bar. | `#ced4da`
 * `--catalyst-toggle-switch-knob-color`      | The color of the knob. | `#ffffff`
 * `--catalyst-toggle-switch-bar-width`       | The width of the bar. | `44px`
 * `--catalyst-toggle-switch-bar-height`      | The height of the bar. | `16px`
 * `--catalyst-toggle-switch-knob-size`       | The size of the knob (width and height). | `26px`
 * `--catalyst-toggle-switch-knob-offset`     | The offset applied to the knob's location. | `5px`
 * `--catalyst-toggle-switch-bar-border`      | The bar's border. | `none`
 * `--catalyst-toggle-switch-knob-border`     | The knob's border. | `none`
 * `--catalyst-toggle-switch-knob-box-shadow` | The box shadow applied to the knob. | _Too Long..._
 *
 * @class
 * @extends HTMLElement
 *
 * @customElement
 * @memberof CatalystElements
 * @group Catalyst Elements
 * @element catalyst-toggle-switch
 * @demo demo/demo.es5.html ES5 Component Demo
 * @demo demo/demo.es6.html ES6 Component Demo
 */
class CatalystToggleSwitch extends CatalystToggleButton {

  /**
   * @constant {String}
   *   The element's tag name.
   */
  static get is() {
    return 'catalyst-toggle-switch';
  }

  /**
   * Register this class as an element.
   */
  static register() {
    window.customElements.define(CatalystToggleSwitch.is, CatalystToggleSwitch);
  }

  /**
   * Construct the element.
   *
   * @param {HTMLTemplate} [template]
   *   The template to use.
   */
  constructor(template = getTemplate()) {
    super(template);

    /**
     * The bar.
     *
     * @type {HTMLElement}
     */
    this._bar = this.shadowRoot.querySelector('#bar');

    /**
     * The knob.
     *
     * @type {HTMLElement}
     */
    this._knob = this._bar.querySelector('#knob');
  }

  /**
   * Fires when the element is inserted into the DOM.
   */
  connectedCallback() {
    // Adjust the knob slide distance based on the width of the x borders.
    let barStyle = getComputedStyle(this._bar);
    let barXBorderWidth = Number.parseFloat(barStyle.borderLeftWidth) + Number.parseFloat(barStyle.borderRightWidth);
    this.style.setProperty('--catalyst-toggle-switch-knob-slide-dist-adjust', `${-barXBorderWidth}px`);

    // Figure out if the knob-offset is negitive.
    if (Number.parseFloat(getComputedStyle(this).getPropertyValue('--catalyst-toggle-switch-knob-offset')) < 0) {
      this._bar.classList.add('negitive-knob-offset');
    }

    // Set this element's role if it's not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'checkbox');
    }

    super.connectedCallback();
  }
}

// Export the element.
export { CatalystToggleSwitch };
