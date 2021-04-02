
const serverless = require('serverless-http');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express()
const port = 3000

const stripe = require('stripe')(process.env.STRIPE_SECRET);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//app.use(express.json())

app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

app.post('/lottery/customer', (req, res) => {
  console.log("POST /lottery/customer \n")
  if(typeof req.body.name == 'undefined' || typeof req.body.email == 'undefined'){ 
    res.status('402').send({error: {'message': "Please include valid name and email"}})
  }

  stripe.customers.create({
    name: req.body.name,
    email: req.body.email,
  }).then((customer) => {
    res.send(customer)
  })
  .catch((err) => {
    console.error(err)
    res.status(500)
    res.send('Error creating customer')
  })
  
})

app.post('/lottery/subscription', async (req, res) => {
  console.log("POST /lottery/subscription")

  console.log('Adding the new payment method to the customer')
  console.log(req.body)
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    })
  } catch (error) {
    console.error(error);
    return res.status('402').send({error: { message: error.message}})
    console.log('\n')
  }

  // Change the default invoice settings on the customer to the new payment method
  console.log('Updating the customer payment method')
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );

  // Create the subscription
  console.log('Adding the subscription to the customer')
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: process.env.STRIPE_PRODUCT_ID }],
    expand: ['latest_invoice.payment_intent'],
  });
  console.log('Successfully created subscription, responding\n')


  res.send(subscription);
});

app.get('/', (req, res) => {
  console.log(req.body)
  res.send('Hello Hillcroft API!')
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports.handler = serverless(app);