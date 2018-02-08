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
     * There are no custom properties or mixins available for styling this component.
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
          this.__template.innerHTML = `<style>:host{position:relative;display:inline-block;width:54px;height:26px;margin:0 8px;vertical-align:middle}#switch{top:5px;left:5px;width:44px;height:16px;background-color:#ced4da;border-radius:8px}#knob,#switch{position:absolute}#knob{top:-5px;left:-5px;width:26px;height:26px;background:#fff;border-radius:13px;-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2);-webkit-transition:-webkit-transform .3s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:-webkit-transform .3s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:transform .3s ease,box-shadow .28s cubic-bezier(.4,0,.2,1);transition:transform .3s ease,box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .3s ease,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1)}#knob:hover{-webkit-box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4);box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4)}:host([checked]) #knob{-webkit-transform:translateX(28px);transform:translateX(28px)}:host([disabled]) #switch{background:#f1f3f5}:host([disabled]) #knob{background:#ced4da;-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1);box-shadow:0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.06),0 3px 1px -2px rgba(0,0,0,.1)}:host(:focus){outline:none}:host(:focus) #knob{-webkit-box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4);box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4)}:host([hidden]){display:none}</style><div id="switch"><div id="knob"></div></div>`;  // eslint-disable-line quotes

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
        if (!this.hasAttribute('aria-pressed')) {
          this.setAttribute('aria-pressed', this.checked);
        }
        if (!this.hasAttribute('aria-disabled')) {
          this.setAttribute('aria-disabled', this.disabled);
        }

        // Add the element's event listeners.
        this.addEventListener('click', this._onClick);
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
            this.setAttribute('aria-pressed', hasValue);
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
       * Called when the element is clicked.
       */
      _onClick() {
        this._toggleChecked();
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