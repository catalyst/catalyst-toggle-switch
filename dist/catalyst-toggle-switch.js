(() => {
  /**
   * Namespace for all the Catalyst Elements.
   *
   * @namespace CatalystElements
   */
  window.CatalystElements = window.CatalystElements || {};

  /**
   * Create the custom element
   */
  function createElement() {
// Import dependencies.
            let CatalystToggleButton = window.CatalystElements.CatalystToggleButton;
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
     * @demo demo/basic.html Basic
     * @demo demo/styled.html Styled
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
       * Get the default template used by this element.
       */
      static get template() {
        let template = document.createElement('template');
        template.innerHTML = `<style>:host{position:relative;display:inline-block;width:54px;width:calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px));height:26px;height:calc(var(--catalyst-toggle-switch-bar-height, 16px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px));min-width:var(--catalyst-toggle-switch-bar-width,44px);min-height:var(--catalyst-toggle-switch-bar-height,16px);margin:0 8px;vertical-align:middle}#bar{position:absolute;top:5px;top:var(--catalyst-toggle-switch-knob-offset,5px);left:5px;left:var(--catalyst-toggle-switch-knob-offset,5px);width:44px;width:var(--catalyst-toggle-switch-bar-width,44px);height:16px;height:var(--catalyst-toggle-switch-bar-height,16px);cursor:pointer;background-color:#ced4da;background-color:var(--catalyst-toggle-switch-bar-color,#ced4da);border:none;border:var(--catalyst-toggle-switch-bar-border,none);border-radius:8px;border-radius:calc(var(--catalyst-toggle-switch-bar-height, 16px) / 2);-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:background-color .3s ease,border .3s ease;transition:background-color .3s ease,border .3s ease;will-change:background-color,border}#bar.negitive-knob-offset{top:0;left:0}#knob{position:absolute;top:-5px;top:calc(0px - var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-bar-border-top-wdith, 0px));left:-5px;left:calc(0px - var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-bar-border-left-wdith, 0px));width:26px;width:var(--catalyst-toggle-switch-knob-size,26px);height:26px;height:var(--catalyst-toggle-switch-knob-size,26px);background-color:#fff;background-color:var(--catalyst-toggle-switch-knob-color,#fff);border:1px solid rgba(0,0,0,.04);border:var(--catalyst-toggle-switch-knob-border,solid 1px rgba(0,0,0,.04));border-radius:13px;border-radius:calc(var(--catalyst-toggle-switch-knob-size, 26px) / 2);-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2));-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,transform .28s ease,box-shadow .28s cubic-bezier(.4,0,.2,1);transition:width .28s ease,height .28s ease,background-color .28s ease,border .28s ease,transform .28s ease,box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .28s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:width,height,background-color,border,transform,box-shadow}#knob:hover{-webkit-box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4);box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4))}:host([checked]) #knob{-webkit-transform:translateX(28px);transform:translateX(28px);-webkit-transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px)));transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px)))}:host([checked]) .negitive-knob-offset #knob{-webkit-transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px) - (var(--catalyst-toggle-switch-bar-height, 16px) - var(--catalyst-toggle-switch-knob-size, 26px)) / 2 + 1px));transform:translateX(calc(var(--catalyst-toggle-switch-bar-width, 44px) + 2 * var(--catalyst-toggle-switch-knob-offset, 5px) - var(--catalyst-toggle-switch-knob-size, 26px) + var(--catalyst-toggle-switch-bar-border-left-wdith, 0px) - (var(--catalyst-toggle-switch-bar-height, 16px) - var(--catalyst-toggle-switch-knob-size, 26px)) / 2 + 1px))}:host([disabled]) #bar{background-color:#f1f3f5;background-color:var(--catalyst-toggle-switch-bar-color,#f1f3f5)}:host([disabled]) #knob{background-color:#ced4da;background-color:var(--catalyst-toggle-switch-knob-color,#f1f3f5);-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1);box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1))}:host(:focus){outline:none}:host(:focus) #knob{background-color:#fafafa;background-color:var(--catalyst-toggle-switch-knob-color,#fafafa);border:1px solid rgba(0,0,0,.16);border:var(--catalyst-toggle-switch-knob-border,solid 1px rgba(0,0,0,.16));-webkit-box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4);box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4);-webkit-box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4));box-shadow:var(--catalyst-toggle-switch-knob-box-shadow,0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4))}:host([hidden]){display:none}</style><div id="bar"><div id="knob"></div></div><slot></slot>`;
        // eslint-disable-line quotes
        // If using ShadyCSS.
        if (window.ShadyCSS !== undefined) {
          // Rename classes as needed to ensure style scoping.
          window.ShadyCSS.prepareTemplate(template, CatalystToggleSwitch.is);
        }
        return template;
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
      constructor(template = CatalystToggleSwitch.template) {
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
        // Update the element's style.
        this.styleUpdated();
        // Set this element's role if it's not already set.
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'checkbox');
        }
        super.connectedCallback();
      }
      /**
       * Should be called after changing the element's style.
       */
      styleUpdated() {
        // Adjust the knob slide distance based on the width of the x borders.
        let barStyle = getComputedStyle(this._bar);
        this.style.setProperty('--catalyst-toggle-switch-bar-border-top-wdith', barStyle.borderTopWidth);
        this.style.setProperty('--catalyst-toggle-switch-bar-border-left-wdith', barStyle.borderLeftWidth);
        // Figure out if the knob-offset is negitive.
        if (Number.parseFloat(getComputedStyle(this).getPropertyValue('--catalyst-toggle-switch-knob-offset')) < 0) {
          this._bar.classList.add('negitive-knob-offset');
        }
      }
    }
    // Make the class globally accessible under the `CatalystElements` object.
    window.CatalystElements.CatalystToggleSwitch = CatalystToggleSwitch;

    // Register the element.
    CatalystToggleSwitch.register();
  }

  // If the `CatalystToggleSwitch` hasn't already been defined, define it.
  if (window.CatalystElements.CatalystToggleSwitch === undefined) {
    // If not using web component polyfills or if polyfills are ready, create the element.
    if (window.WebComponents === undefined || window.WebComponents.ready) {
      createElement();
    }
    // Otherwise wait until the polyfills is ready.
    else {
      window.addEventListener('WebComponentsReady', () => {
        createElement();
      });
    }
  } else {
    console.warn('CatalystToggleSwitch has already been defined, cannot redefine.');
  }
})();