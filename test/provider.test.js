import React, { useContext } from 'react';
import { render } from 'enzyme';
import { suppressConsoleErrors } from './support/helpers';

import { RecurlyProvider } from '../lib';
import { RecurlyContext } from '../lib/provider';

describe('<RecurlyProvider />', function () {
  describe('without having included recurly.js', function () {
    const storedRecurly = window.recurly;

    suppressConsoleErrors();

    beforeEach(function () {
      delete window.recurly;
    });

    afterEach(function () {
      window.recurly = storedRecurly;
    });

    it('throws an error', function () {
      expect(() => {
        render(<RecurlyProvider publicKey="test-public-key" />);
      }).toThrow(/Please load Recurly\.js \(https:\/\/js\.recurly\.com\/v4\/recurly\.js\) on this page/);
    });
  });

  describe('without a publicKey', function () {
    suppressConsoleErrors();

    it('throws an error', function () {
      expect(() => {
        render(<RecurlyProvider />);
      }).toThrow(/Please pass your 'publicKey' value to this RecurlyProvider/);
    });
  });

  describe('with a publicKey', function () {
    it('does not throw an error', function () {
      expect(() => {
        render(<RecurlyProvider publicKey="test-public-key" />);
      }).not.toThrow();
    });

    it('provides a Recurly instance', function () {
      render(
        <RecurlyProvider publicKey="test-public-key">
          <StubComponent />
        </RecurlyProvider>
      );

      function StubComponent () {
        const { recurly } = useContext(RecurlyContext);
        expect(recurly).toBeInstanceOf(window.recurly.Recurly);
        return '';
      }
    });

    it('provides a memoized Recurly instance', function () {
      let memo;

      render(
        <div>
          <RecurlyProvider publicKey="test-public-key">
            <StubComponent />
          </RecurlyProvider>

          <RecurlyProvider publicKey="test-public-key">
            <StubComponentTwo />
          </RecurlyProvider>

          <RecurlyProvider publicKey="test-public-key-two">
            <StubComponentThree />
          </RecurlyProvider>
        </div>
      );

      function StubComponent () {
        memo = useContext(RecurlyContext).recurly;
        return '';
      }

      function StubComponentTwo () {
        const { recurly } = useContext(RecurlyContext);
        expect(recurly).toBe(memo);
        expect(recurly.config.publicKey).toBe('test-public-key');
        return '';
      }

      function StubComponentThree () {
        const { recurly } = useContext(RecurlyContext);
        expect(recurly).not.toBe(memo);
        expect(recurly.config.publicKey).toBe('test-public-key-two');
        return '';
      }
    });
  });
});

