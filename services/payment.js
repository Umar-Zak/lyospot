const stripe = require("stripe")("sk_test_RIzwGO8kOepEb2bNEcjQb0GE00RKdcyNLP");

module.exports = async (token, amount) => {
  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });
  await stripe.charges.create({
    amount: amount * 100,
    currency: "usd",
    customer: customer.id,
    receipt_email: token.email,
    description: `Order made by ${token.email}`,
    shipping: {
      name: token.card.name,
      address: {
        line1: token.card.address_line1,
        line2: token.card.address_line2,
        city: token.card.address_city,
        country: token.card.address_country,
        postal_code: token.card.address_zip,
      },
    },
  });
};
