const Customer = require('../models/Customer');
const customer = require('../models/Customer');
const mongoose = require('mongoose');

/**
 * GET /
 * Homepage
 */


// This is the code for UI without pagination

exports.homepage = async(req, res)=>{
    const messages = await req.consumeFlash('info');
    const locals = {
        title: 'NodeJS',
        description: 'Free NodeJs User Management system'
    }

    try {
      const customers = await Customer.find({}).limit(22);
      res.render('index', {locals, messages, customers})
    } catch (error) {
     console.log(error);   
    }
}

// code for pagination uncomment it for pagination
// make sure that the template for this will be added

// exports.homepage = async(req, res)=>{
//     const messages = await req.consumeFlash('info');
//     const locals = {
//         title: 'NodeJS',
//         description: 'Free NodeJs User Management system'
//     }

//     let perPage = 12;
//     let page = req.query.page || 1;

//     try {
//         const customers = await Customer.aggregate([{$sort: {updatedAt: -1}}])
//         .skip(perPage * page - perPage)
//         .limit(perPage)
//         .exec();
//         const count = await Customer.count();

//         res.render('index', {
//             locals,
//             customers,
//             current: page,
//             pages: Math.ceil(count/ perPage),
//             messages
//         })
//     } catch (error) {
//      console.log(error);   
//     }
// }


/**
 * GET /
 * New customer form
 */

exports.addCustomer = async(req, res)=>{
    const locals = {
        title: 'Add New customer - NodeJs',
        description: 'Free NodeJs User Management system'
    }
    res.render('customer/add', locals)
}


/**
 * POST /
 * Create customer form
 */
exports.postCustomer = async(req, res)=>{
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email,
    })

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New customer has been added')
        
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}

/**
 * GET
 * Customer Data
 */

exports.view = async(req, res) =>{
    try{
        const customer = await Customer.findOne({_id: req.params.id})

        const locals = {
            title: 'View customer Data',
            description: 'Free NodeJs User Management system'
        }; 

        res.render('customer/view', {
            locals,
            customer
        })
    }
    catch(error){
        console.log(error);
    }
}

/**
 * GET
 * Edit Customer data
 */

exports.edit = async(req, res) =>{
    try{
        const customer = await Customer.findOne({_id: req.params.id})

        const locals = {
            title: 'Edit Customer Data',
            description: 'Free NodeJs User Management system'
        }; 

        res.render('customer/edit', {
            locals,
            customer
        })
    }
    catch(error){
        console.log(error);
    }
}

/**
 * GET
 * Update Customer data
 */

exports.editPost = async(req, res) =>{
  try {
    
    await customer.findByIdAndUpdate(req.params.id,{
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       tel: req.body.tel,
       email: req.body.email,
       details: req.body.details,
       updatedAt: Date.now()
    })

    await res.redirect(`/edit/${req.params.id}`)

  } catch (error) {
    console.log(error);
  }
}
/**
 * GET
 * Update Customer data
 */

exports.editPost = async(req, res) =>{
  try {
    await customer.findByIdAndUpdate(req.params.id,{
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       tel: req.body.tel,
       email: req.body.email,
       details: req.body.details,
       updatedAt: Date.now()
    })

    await res.redirect(`/edit/${req.params.id}`)

  } catch (error) {
    console.log(error);
  }
}


/**
 * DELETE
 * Delete Customer Data
 */

exports.deleteCustomer = async(req, res)=>{
    try {
        await Customer.deleteOne({_id: req.params.id})
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
}

/**
 * GET
 * Search Customer Data
 */

exports.searchCustomers = async(req, res)=>{

    const locals = {
        title: 'Search Customer Data',
        description: 'Free NodeJs User Management system'
    }

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const customers = await Customer.find({
            $or:[
                {firstName: {$regex: new RegExp(searchNoSpecialChar, "i")}},
                {lastName: {$regex: new RegExp(searchNoSpecialChar, "i")}},
            ]
        })
        res.render("search", {
            customers,
            locals    
        })
     
    } catch (error) {
        console.log(error)
    }
}