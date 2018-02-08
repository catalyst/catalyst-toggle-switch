/* exported CatalystToggleSwitch */

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
class CatalystToggleSwitch extends HTMLElement {

  /**
   * @constant {String}
   *   The element's tag name.
   */
  static get is() {
    return 'catalyst-toggle-switch';
  }

  /**
   * @constant {HTMLTemplateElement}
   *   The template of the component.
   */
  static get _template() {
    if (this.__template === undefined) {
      this.__template = document.createElement('template');
      this.__template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`;  // eslint-disable-line quotes

      // If using ShadyCSS.
      if (window.ShadyCSS !== undefined) {
        // Rename classes as needed to ensure style scoping.
        window.ShadyCSS.prepareTemplate(this.__template, CatalystToggleSwitch.is);
      }
    }

    return this.__template;
  }

  /**
   * Key codes.
   *
   * @enum {number}
   */
  static get _KEYCODE() {
    if (this.__keycode === undefined) {
      this.__keycode = {
        SPACE: 32,
        ENTER: 13
      }
    }

    return this.__keycode;
  }

  /**
   * The attributes on this element to observe.
   *
   * @returns {Array.<string>}
   *   The attributes this element is observing for changes.
   */
  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value', 'form'];
  }

  /**
   * Register this class as an element.
   */
  static register() {
    window.customElements.define(CatalystToggleSwitch.is, CatalystToggleSwitch);
  }

  /**
   * Construct the element.
   */
  constructor() {
    super();

    // Create a shadow root and stamp out the template's content inside.
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(CatalystToggleSwitch._template.content.cloneNode(true));

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

    // The input element needs to be in the lightDom to work with form elements.

    /**
     * The element that will be submitting as part of a form to represent this component.
     *
     * @type {HTMLElement}
     */
    this._inputElement = document.createElement('input');
    this._inputElement.type = 'checkbox';
    this._inputElement.style.display = 'none';
    this.appendChild(this._inputElement);
  }

  /**
   * Fires when the element is inserted into the DOM.
   */
  connectedCallback() {
    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Style the element.
      window.ShadyCSS.styleElement(this);
    }

    // Adjust the knob slide distance based on the with of the x borders.
    let barStyle = getComputedStyle(this._bar);
    let barXBorderWidth = Number.parseFloat(barStyle.borderLeftWidth) + Number.parseFloat(barStyle.borderRightWidth);
    this.style.setProperty('--catalyst-toggle-switch-knob-slide-dist-adjust', `${-barXBorderWidth}px`);

    // Figure out if the knob-offset is negitive.
    if (Number.parseFloat(getComputedStyle(this).getPropertyValue('--catalyst-toggle-switch-knob-offset')) < 0) {
      this._bar.classList.add('negitive-knob-offset');
    }

    // Upgrade the element's properties.
    this._upgradeProperty('checked');
    this._upgradeProperty('disabled');

    // Set this element's role, tab index and aria attributes if they are not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'checkbox');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', 0);
    }
    if (!this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', this.checked);
    }
    if (!this.hasAttribute('aria-disabled')) {
      this.setAttribute('aria-disabled', this.disabled);
    }

    // Add the element's event listeners.
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeyDown);
  }

  /**
   * Upgrade the property on this element with the given name.
   *
   * A user may set a property on an _instance_ of an element before its prototype has been connected to this class.
   * This method will check for any instance properties and run them through the proper class setters.
   *
   * See the [lazy properties](/web/fundamentals/architecture/building-components/best-practices#lazy-properties) section for more details.
   *
   * @param {string} prop
   *   The name of a property.
   */
  _upgradeProperty(prop) {
    // If the property exists.
    if (this.hasOwnProperty(prop)) {
      // Delete it and reset it.
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  /**
   * Fires when the element is removed from the DOM.
   */
  disconnectedCallback() {
    // Remove the element's event listeners.
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeyDown);
  }

  /**
   * Setter for `checked`.
   *
   * @param {boolean} value
   *   If truthy, `checked` will be set to true, otherwise `checked` will be set to false.
   */
  set checked(value) {
    const isChecked = Boolean(value);
    if (isChecked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  /**
   * States whether or not this element is checked.
   *
   * @default false
   * @returns {boolean}
   */
  get checked() {
    return this.hasAttribute('checked');
  }

  /**
   * Setter for `disabled`.
   *
   * @param {boolean} value
   *   If truthy, `disabled` will be set to true, otherwise `disabled` will be set to false.
   */
  set disabled(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this.setAttribute('disabled', '');
    }
    else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * States whether or not this element is disabled.
   *
   * @default false
   * @returns {boolean}
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  /**
   * Setter for `name`.
   *
   * @param {string} value
   *   The value to set.
   */
  set name(value) {
    this.setAttribute('name', new String(value));
  }

  /**
   * The name of this element. Used for forms.
   *
   * @returns {string}
   */
  get name() {
    if (this.hasAttribute('name')) {
      return this.getAttribute('name');
    } else {
      return '';
    }
  }

  /**
   * The form this element is apart of.
   *
   * @returns {HTMLFormElement}
   */
  get form() {
    return this._inputElement.form;
  }

  /**
   * Setter for `value`.
   *
   * @param {string} value
   *   The value to set.
   */
  set value(value) {
    this.setAttribute('value', new String(value));
  }

  /**
   * The value this element has. Used for forms.
   *
   * @returns {string}
   */
  get value() {
    if (this.hasAttribute('value')) {
      return this.getAttribute('value');
    } else {
      return 'on';
    }
  }

  /**
   * The input element.
   *
   * @returns {HTMLInputElement}
   */
  get inputElement() {
    return this._inputElement;
  }

  /**
   * Fired when any of the attributes in the `observedAttributes` array change.
   *
   * @param {string} name
   *   The name of the attribute that changed.
   * @param {*} oldValue
   *   The original value of the attribute that changed.
   * @param {*} newValue
   *   The new value of the attribute that changed.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const hasValue = newValue !== null;
    switch (name) {
      case 'checked':
        // Set the aria value.
        this.setAttribute('aria-checked', hasValue);
        break;

      case 'disabled':
        // Set the aria value.
        this.setAttribute('aria-disabled', hasValue);

        // Add/Remove the tabindex attribute based `hasValue`.
        if (hasValue) {
          // If the tab index is set.
          if (this.hasAttribute('tabindex')) {
            this._tabindexBeforeDisabled = this.getAttribute('tabindex');
            this.removeAttribute('tabindex');
            this.blur();
          }
        } else {
          // If the tab index isn't already set and the previous value is known.
          if (!this.hasAttribute('tabindex') && this._tabindexBeforeDisabled !== undefined && this._tabindexBeforeDisabled !== null) {
            this.setAttribute('tabindex', this._tabindexBeforeDisabled);
          }
        }
        break;

      case 'name':
        // Update the form element's name.
        this._inputElement.name = newValue;
        break;

      case 'value':
        // Update the form element's value.
        this._inputElement.value = newValue;
        break;

      case 'form':
        // Update the form element's form.
        this._inputElement.setAttribute('form', newValue);
        break;
    }
  }

  /**
   * `_toggleChecked()` calls the `checked` setter and flips its state.
   * Because `_toggleChecked()` is only caused by a user action, it will
   * also dispatch a change event.
   *
   * @fires change
   */
  _toggleChecked() {
    // Don't do anything if disabled.
    if (this.disabled) {
      return;
    }

    // Change the value of checked.
    this.checked = !this.checked;

    /**
     * Fired when the component's `checked` value changes due to user interaction.
     *
     * @event change
     */
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        checked: this.checked,
      },
      bubbles: true,
    }));
  }

  /**
   * Called when this element is clicked.
   */
  _onClick() {
    this._toggleChecked();
  }

  /**
   * Called when a key is pressed on this element.
   *
   * @param {KeyboardEvent} event
   */
  _onKeyDown(event) {
    // Don’t handle modifier shortcuts typically used by assistive technology.
    if (event.altKey) {
      return;
    }

    // What key was pressed?
    switch (event.keyCode) {
      case CatalystToggleSwitch._KEYCODE.SPACE:
      case CatalystToggleSwitch._KEYCODE.ENTER:
        event.preventDefault();
        this._toggleChecked();
        break;

      // Any other key press is ignored and passed back to the browser.
      default:
        return;
    }
  }
}
