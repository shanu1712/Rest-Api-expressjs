const express = require('express')
const mongoose = require('mongoose')
//import dotenv from 'dotenv';
const dotenv = require('dotenv')
const app = express()
app.use(express.json()) //bodyparser

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });



//schemas//
const productSchema = new mongoose.Schema({
   name:String,
   description:String,
   price:Number, 
})

//models//
const Product = new mongoose.model("Product" , productSchema)
//api//
//read//
app.get("/api/v1/product",async(req,res)=>{
    const products = await Product.find()
    res.status(200).json({
        success :true,
        products
    })
})
app.post("/api/v1/product/new",async(req,res)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })

})

//update//
app.put("/api/v1/product/:id",async(req,res)=>{
      const {id} = req.params
     let product = await Product.findById(id)
      product = await Product.findByIdAndUpdate(id,req.body)
      if(!product){
        return res.status(404).json({message :`cannot find product with id ${id}`})
      }
      res.status(200).json(product) ///if it is updated
})

///delete
app.delete("/api/v1/product/:id",async(req,res)=>{
   const product = await Product.findByIdAndDelete(req.params.id)
   if(!product){
    return res.status(500).json({
        success :false,
        message : " cannot find product" 
    })
   }
   res.status(200).json(product) // if it is found then perform this
  // product.remove()
    res.status(200).json({
        success :true,
        message:"product is deleted successfully"
    })
})
app.listen(4500,()=>{
    console.log("server running on port 4500")
})
