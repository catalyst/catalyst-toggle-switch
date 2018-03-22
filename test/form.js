/* eslint-disable no-unused-expressions, max-nested-callbacks */

/**
 * Form suite.
 */
suite('Form', () => {
  let form;
  let element;

  /**
   * Called before each following test is run.
   */
  setup(() => {
    form = fixture('form');
    element = form.querySelector('catalyst-toggle-switch');
  });

  /**
   * Test the initial state of the element.
   */
  suite('Initial State', () => {
    /**
     * Test the attributes and properties of the element in it's initial state.
     */
    suite('Attributes & Properties', () => {
      /**
       * Test element has name.
       */
      test('name', () => {
        expect(element.hasAttribute('name')).to.be.true;
        expect(element.getAttribute('name')).to.equal('foo');
        expect(element).to.have.property('name', 'foo');
        expect(element.inputElement).to.have.property('name', 'foo');
      });

      /**
       * Test element has value.
       */
      test('value', () => {
        expect(element).to.have.property('value', 'bar');
        expect(element.inputElement).to.have.property('value', 'bar');
      });

      /**
       * Test element has form.
       */
      test('form', () => {
        expect(element).to.have.property('form', form);
        expect(element.inputElement).to.have.property('form', form);
      });
    });

    /**
     * Test the form.
     */
    suite('Form', () => {
      /**
       * Test form has element.
       */
      test('Element is part of the form', () => {
        expect(form.elements.foo).to.exist;
      });
    });
  });
});
