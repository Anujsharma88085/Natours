import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51Qj1hy01eoiKLiqFbzoHTmrJSNhpnLqC8HTfW7dM8NhzufCWv8Vg4tiHAR5c29TecwmmANh0CbTKvjLdSJqI7MiQ008PTcrwlf',
);

export const bookTour = async (tourid) => {
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourid}`,
    );

    console.log(session);

    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
