const http = require('http');
const urlencode = require('urlencode');

const username = 'srjbsht857@gmail.com';
const hash = '582cd89f3e07f336abe5d2a63e04f31ca548dcb7e56a2cd64ba5b183a50723a5'; 
const sender = 'RSIPUN';

callback = function (response) {
  let str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    // console.log(str);
  });
}

// ==================================== OTP =====================================

let sendOTP = (otp, mobNo) => {
  let msg_body = `Forgot Password! No problem, your OTP to reset password is ${otp},regards RSAMI!`
  let msg = urlencode(msg_body);

  let toNumber = mobNo;
  let data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
  let options = {
    host: 'api.textlocal.in', path: '/send?' + data
  };
  
  http.request(options, callback).end();
}

// ========================== Ticket Booking Confirmation =======================

const sendBookingConfirmation = (rsiID, seats, movie, time, date, mobNo) => {
  console.log("Sanjay");
  const msg_body = `Dear ${rsiID}, Seats : ${seats} confirmed for ${movie}. Show starts at ${time} hr on ${date}.`
  const msg = urlencode(msg_body);

  let toNumber = mobNo;
  let data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
  let options = {
    host: 'api.textlocal.in', path: '/send?' + data
  };
  
  http.request(options, callback).end();
}

// ==================================== EXPORTS =================================
module.exports.sendOTP = sendOTP;
module.exports.sendBookingConfirmation = sendBookingConfirmation;