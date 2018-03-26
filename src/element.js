// Import dependencies.
import { catalystToggleMixin } from '../node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.js';

const SuperClass = catalystToggleMixin(HTMLElement);

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
 * `--catalyst-toggle-switch-bar-color`       | The color of the bar.                      | `#ced4da`
 * `--catalyst-toggle-switch-knob-color`      | The color of the knob.                     | `#ffffff`
 * `--catalyst-toggle-switch-bar-width`       | The width of the bar.                      | `44px`
 * `--catalyst-toggle-switch-bar-height`      | The height of the bar.                     | `16px`
 * `--catalyst-toggle-switch-knob-size`       | The size of the knob (width and height).   | `26px`
 * `--catalyst-toggle-switch-knob-offset`     | The offset applied to the knob's location. | `5px`
 * `--catalyst-toggle-switch-bar-border`      | The bar's border.                          | `none`
 * `--catalyst-toggle-switch-knob-border`     | The knob's border.                         | `none`
 * `--catalyst-toggle-switch-knob-box-shadow` | The box shadow applied to the knob.        | _Too Long..._
 *
 * @class
 * @extends HTMLElement
 * @mixes CatalystToggleMixin
 *
 * @customElement
 * @group Catalyst Elements
 * @element catalyst-toggle-switch
 * @demo demo/basic.html Basic
 * @demo demo/styled.html Styled
 */
class CatalystToggleSwitch extends SuperClass {
  /**
   * The element's tag name.
   *
   * @public
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'catalyst-toggle-switch';
  }

  /**
   * Get the default template used by this element.
   *
   * @public
   * @readonly
   * @returns {HTMLTemplateElement}
   */
  static get template() {
    const template = document.createElement('template');
    template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`; // eslint-disable-line quotes

    // If using ShadyCSS.
    if (window.ShadyCSS != null) {
      // Rename classes as needed to ensure style scoping.
      window.ShadyCSS.prepareTemplate(template, CatalystToggleSwitch.is);
    }

    return template;
  }

  /**
   * Construct the element.
   *
   * @public
   */
  constructor() {
    super();

    // Create a shadow root and stamp out the template's content inside.
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      CatalystToggleSwitch.template.content.cloneNode(true)
    );

    /**
     * The bar.
     *
     * @protected
     * @type {HTMLElement}
     */
    this.bar = this.shadowRoot.querySelector('#bar');

    /**
     * The knob.
     *
     * @protected
     * @type {HTMLElement}
     */
    this.knob = this.bar.querySelector('#knob');
  }

  /**
   * Fires when the element is inserted into the DOM.
   *
   * @protected
   */
  connectedCallback() {
    // Update the element's style.
    this.styleUpdated();
    super.connectedCallback();
  }

  /**
   * Should be called after changing the element's style.
   */
  styleUpdated() {
    // Adjust the knob slide distance based on the width of the x borders.
    const barStyle = getComputedStyle(this.bar);
    this.style.setProperty(
      '--catalyst-toggle-switch-bar-border-top-width',
      barStyle.borderTopWidth
    );
    this.style.setProperty(
      '--catalyst-toggle-switch-bar-border-left-width',
      barStyle.borderLeftWidth
    );

    // Figure out if the knob-offset is negative.
    if (
      Number.parseFloat(
        getComputedStyle(this).getPropertyValue(
          '--catalyst-toggle-switch-knob-offset'
        )
      ) < 0
    ) {
      this.bar.classList.add('negative-knob-offset');
    }
  }
}

/**
 * Register the element.
 */
(async () => {
  // Make sure the polyfills are ready (if they are being used).
  await new Promise(resolve => {
    if (window.WebComponents == null || window.WebComponents.ready) {
      resolve();
    } else {
      window.addEventListener('WebComponentsReady', () => resolve());
    }
  });

  window.customElements.define(CatalystToggleSwitch.is, CatalystToggleSwitch);
})();

// Export the element.
export { CatalystToggleSwitch };
