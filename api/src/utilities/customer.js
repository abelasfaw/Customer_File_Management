const fs = require('fs').promises;
const Customer = require('../models/customer.model');
const fileTypes = ['RECEIPT', 'AGREEMENT', 'APPLICATION', 'LICENSE', 'OTHERS' ];
exports.setupCustomerDirectory = async (customer_id)=>{
    await fs.mkdir(`files\\customer-${customer_id}`);
    for (let type in fileTypes) {
        await fs.mkdir(`files\\customer-${customer_id}\\${fileTypes[type]}`)
    }
}
exports.createNewCustomer = async(customer_details, createdBy) => {
     return await Customer.create({
        firstName: customer_details.firstName,
        middleName: customer_details.middleName,
        lastName: customer_details.lastName,
        phoneNumber: customer_details.phoneNumber ? customer_details.phoneNumber : null,
        registrationNumber: customer_details.registrationNumber,
        registeredBy: createdBy
    })    
}