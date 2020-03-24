import React, { useEffect } from 'react';
import { useRecurly, RecurlyProvider, Elements } from '@recurly/react-recurly';

export const PayPal = () => {
  return (
    <div className="DemoSection">
      <RecurlyProvider publicKey={process.env.REACT_APP_RECURLY_PUBLIC_KEY}>
        <Elements>
          <PayPalButton />
        </Elements>
      </RecurlyProvider>
    </div>
  );
};

const PayPalButton = () => {
  const { recurly } = useRecurly();
  const paypal = recurly.PayPal({
    display: {
      displayName: 'Test',
      description: 'Test description',
    },
  });

  useEffect(() => {
    paypal.on('error', error => {
      console.error(error);
    });

    paypal.on('token', token => {
      console.log('Token: ', token);
    });

    paypal.on('cancel', () => {
      console.log('Cancelled');
    });

    paypal.on('ready', () => {
      console.log('Ready');
    });

    return () => {
      paypal.off('token');
      paypal.off('error');
      paypal.off('cancel');
      paypal.off('ready');
    };
  }, [paypal]);

  const handleClick = () => {
    paypal.start();
  }

  return <button onClick={handleClick}>Start Paypal</button>;
};
