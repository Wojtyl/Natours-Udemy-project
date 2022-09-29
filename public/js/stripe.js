/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Ln4BEHggX0FnSfx4OdzXzloOQOZ14jwKFz5APNGNwj5tMOIAUvwGglNkhIIRfuf09GGWYUpLAr4kKNBl2SQ3xIA00A5PlDEIs'
);

export const bookTour = async (tourId) => {
  //
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session.data.session.id);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
