const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to DB successfully");
})

const userSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    paymentModes: {
        paymentModeId: {
            type: String,
        },
        paymentMode: {
            type: String,
            enum : ["UPI","Credit card", "Debit card"],
        },
        cardData: {
            cvv: String,
            startDate: Date,
            expiryDate: Date,
            cardHolder: String,
        }
    }
  });
  
const User = mongoose.model("users", userSchema);

app.get('/list', async(req, res) => {
    const result = await User.find({});
    res.json({result});
})

app.post('/user/:userId/:payment/:id', async(req, res)=> {
    const paymentMode = req.params.payment;
    const paymentId = req.params.id;
    const userId = req.params.userId;

    const result = await User.create({
        userId, 
        "paymentModes.paymentModeId":  paymentId,
        "paymentModes.paymentMode":  paymentMode,
    })
    res.json({result});
})

app.post('/user/:userId', async(req, res)=> {
    const userId = req.params.userId;
    const result = await User.find({userId})
    res.json({result});

})

app.listen(3000, () => {
    console.log("Server running at port 3000");
})


/*
 userId - string, required
 paymentModes - array
    [
     {
        paymentModeId : string, [upi id, card number] required
        paymentMode: string [enum : [upi, debit card, credit card]], required
        cardData: object 
                    {
                        cvv: Number,
                        start date: Date,
                        expiry: Date,
                        card holder: String,
                    }
     }
    ]
*/