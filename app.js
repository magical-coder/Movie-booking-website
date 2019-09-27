const express = require('express');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const hbs = require('hbs');
const flash = require('connect-flash');
const app = express();
const auth=require("./auth.js")
const serviceAccount = require("./ss.json");
const sendMsg = require('./sendMsg.js');
const fs=require('fs');
const NodeXls = require('node-xls');
const jsalert = require('js-alert');
const dateTime = require('date-time');
let otp,mob,user;

function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

// ============================================= Flash ====================================
  app.use(flash());
// ============================================= Middleware ===============================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ============= Temporary Session Management =============================================
const session = require('express-session');
let sess;
app.use(session(
  {
    secret: 'j34H5+lNYNLmpFD5mUUSDg5M/bL5g+tmiRfeCt6L2hg=',
    resave: false,
    saveUninitialized: false
  }
  ));

//=========================================================================================

app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');

hbs.registerHelper('if_eq', function(a, b, opts) {
  if(a == b)
      return opts.fn(this);
  else
      return opts.inverse(this);
});


app.use(express.static('./public'));

//===============================================GET=======================================

app.get('/',nocache, function (req, res) {
  res.render('idLogin.hbs', { messages: req.flash('invalidID') });
});

app.get('/requestOTP',nocache, (req, res)=>{
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if(sess.rsiid||sess.rsiAdmin)
  {
    res.render('userPhoneVerify.hbs', {messages: req.flash('invalidMobNo')});
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/home',nocache,function(req,res)
{
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    console.log("User Is :"+sess.rsiid+" Mobile Number :"+sess.mobNo);
    res.render('home.hbs',{rsiid :sess.rsiAdmin});
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/userLogin',nocache, (req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin))
  {res.render('userLogin.hbs', {messages:req.flash('invalidUser')});}
  else
  {res.redirect('/');}
});

app.get('/sendOTP',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  } 
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.render('sendOTP.hbs', {messages: req.flash('invalidOTP')});
  }
  else{
    res.redirect('/requestOTP');
  }
});

app.get('/changePassword',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo && sess.otp)
  {
    res.render('changePassword.hbs', {messages: req.flash('unequalPassword')});
  }
  else
  {
    res.redirect('/sendOTP');
  }
});

app.get('/contact',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/contact.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/history',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/history.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/sports',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/billiards.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/sanjog',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/sanjog.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/bar',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/bar.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/swimming',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/swimming.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/party',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/partyhall.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/trinco',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/trincorestuarent.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/guest',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.sendFile(__dirname+'/public/guestroom.html');
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/addMovie',nocache,(req,res)=>
{
  sess=req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.sendFile(__dirname+'/views/addmovie.html');
  }
  else
  {
    res.redirect('/movies');
  }
})

app.get('/movieAdded',nocache,(req,res)=>
{
  sess=req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.redirect('/movies');
  }
  else
  {
    res.redirect('/');
  }
})

app.get('/deleteMovie',nocache,(req,res)=>
{
  movieKey=req.query.key;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  var ref=admin.database().ref('Movies/'+movieKey).remove();
  res.redirect('/movies');
})

app.get('/deleteTicket',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('adminDelete.hbs',{messages:req.flash('deleteTicket')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})
app.get('/downloadSummary',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('downloadSummary.hbs',{messages:req.flash('summaryDownload')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})


app.get('/adminBooking',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo&&sess.movieKey)
  {
    res.render('adminBooking.hbs',{messages:req.flash('invalidUserOrMobile')});
  }
  else
  {
    res.redirect('/home');
  }
})


app.get('/adminVSuser',nocache,(req,res)=>
{
  sess=req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  sess.movieKey=req.query.key;
  if(user==='A-007')
  {
    res.redirect('/adminBooking');
  }
  else
  {
    res.redirect('/dependents');
  }
})

app.get('/addUser',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('adduser.hbs',{messages :req.flash('addUser')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})

app.get('/deleteUser',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('deleteuser.hbs',{messages:req.flash('deleteUser')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})

app.get('/changeDependents',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('changedependents.hbs',{messages:req.flash('depCountChanged')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})

app.get('/changePrices',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('changeprices.hbs',{messages:req.flash('pricesChanged')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})

app.get('/changeMobileNumber',nocache,(req,res)=>
{
  sess=req.session;
  if(sess.rsiAdmin&&sess.mobNo)
  {
    res.render('changemobilenumber.hbs',{messages:req.flash('numberChanged')});
  }
  else
  {
    res.redirect('/myTickets');
  }
})


app.get('/movies',nocache, (req, res) => {
  sess = req.session;
  sess.movieKey=undefined;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    auth.getMovies(sess.rsiid)
    .then((obj)=>
    {
      res.render('movie.hbs',{
        movieDetails : obj,
        adminId: sess.rsiAdmin,
        messages : req.flash('movieBooked')
      });
    },()=>
    {
      console.log("Reject");
    })
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/dependents',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  auth.checkBooking(sess.rsiid,sess.movieKey)
    .then(()=>
    {
      if(sess.rsiid && (sess.mobNo||sess.newMob)&& sess.movieKey){
        auth.getTotalPrice(sess.rsiid,sess.movieKey)
        .then((obj) => {
          res.render('dependents.hbs', obj);
        }, () => {
          res.redirect('/movies');
        });
      }
      else{
        res.redirect('/');
      }
    },()=>
    {
        console.log("Already Booked!!!");
        jsalert.alert('Sorry, You Have Utilised Your Limit Completely!!!');
        req.flash('movieBooked', 'You Have Already Booked Tickets For This Movie!!!');
        res.redirect('/movies');
    })
});

app.get('/adminActions',nocache, (req, res) => {
  sess=req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {
    res.render('adminactions.hbs',{rsiid :sess.rsiAdmin});
  }
  else
  {
    res.redirect('/userLogin');
  }
});

app.get('/myTickets',nocache, (req, res) => {
  sess=req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiAdmin==='A-007')
  {
    sess.rsiid='A-007';
  }
  if((sess.rsiid||sess.rsiAdmin) && sess.mobNo)
  {auth.getTickets(sess.rsiid)
  .then((ticketArr)=> {
    res.render('myTickets.hbs', {
      ticketDetails: ticketArr,
      rsiid:sess.rsiid
    });
  },
   () => {
    console.log('Some Error Is There!!!');
  });}

  else
  {
    res.redirect('/userLogin');
  }
});

app.get('/layout',nocache, (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(sess.rsiid && (sess.mobNo||sess.newMob) && sess.movieKey)
  {
      res.render('seatlayout.hbs', {
      rsiid: sess.rsiid,
      movieKey: sess.movieKey,
      totalSeats: sess.totalSeats
    });
  }
  else
  {
    res.redirect('/movies');
  }
});

app.get('/summary',nocache, (req, res)=>{
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let seats = req.query.seats;
  let arrSeats = JSON.parse(decodeURI(seats)).arr1;

var mapp = {};
var i;
for(i=0; i<359; i++){
    if(i>=0 && i<22){
        mapp[i]='B'+(i+1);
    }
    else if(i>=22 && i<42){
        mapp[i]='C'+(i-21);
    }
    else if(i>=42 && i<64){
        mapp[i]='D'+(i-41);
    }
    else if(i>=64 && i<84){
        mapp[i]='E'+(i-63);
    }
    else if(i>=84 && i<106){
        mapp[i]='F'+(i-83);
    }
    else if(i>=106 && i<126){
        mapp[i]='G'+(i-105);
    }
    else if(i>=126 && i<148){
        mapp[i]='H'+(i-125);
    }
    else if(i>=148 && i<168){
        mapp[i]='I'+(i-147);
    }
    else if(i>=168 && i<190){
        mapp[i]='J'+(i-167);
    }
    else if(i>=190 && i<210){
        mapp[i]='K'+(i-189);
    }
    else if(i>=210 && i<232){
        mapp[i]='L'+(i-209);
    }
    else if(i>=232 && i<252){
        mapp[i]='M'+(i-231);
    }
    else if(i>=252 && i<274){
        mapp[i]='N'+(i-251);
    }
    else if(i>=274 && i<294){
        mapp[i]='O'+(i-273);
    }
    else if(i>=294 && i<316){
        mapp[i]='P'+(i-293);
    }
    else if(i>=316 && i<336){
        mapp[i]='Q'+(i-315);
    }
    else if(i>=336 && i<358){
        mapp[i]='R'+(i-335);
    }
}

  let stringValues = [];
  let stringInteger=[];
  for(let key1 in arrSeats){
    stringValues.push(String(mapp[arrSeats[key1]]));
    stringInteger.push(String(arrSeats[key1]));
  }
  let seatValues = "";
  let seatInteger="";
  let key=0;
  for(key=0;key<arrSeats.length-1;key++){
    seatValues += mapp[arrSeats[key]]+",";
    seatInteger+=arrSeats[key]+",";

  }

  seatValues+=mapp[arrSeats[arrSeats.length-1]];
  seatInteger+=arrSeats[arrSeats.length-1];

  sess.arrSeats=stringInteger;
  sess.seatInteger=seatInteger;
  sess.seatValues=seatValues;
  sess.stringValues=stringValues;

  if(sess.rsiid && sess.mobNo && sess.movieKey)
  {
    auth.getSummary(sess.movieKey).then((details)=>{
      sess.movieName = details.name;
      sess.time = details.time;
      sess.date = details.date;
      res.render('summary.hbs', {
      rsiid: sess.rsiid,
      price: sess.totalPrice,
      movie: details.name,
      date: details.date,
      time: details.time,
      seats: stringValues
      });
    },
    ()=>{console.log('In Reject Of Summary!!!');});
  }
  else
  {
    res.redirect('/home');
  }
});


app.get('/ticket', (req, res) => {
  sess = req.session;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let ts = new Date().toLocaleString();
  if(sess.rsiid && sess.mobNo && sess.movieKey)
  {
  sess.movieKey = undefined;
  res.render('qrcode.hbs', {
    movie: sess.movieName,
    date: sess.date,
    time: sess.time,
    seats: sess.arrSeats,
    rsiid: sess.rsiid,
    price: sess.totalPrice,
    seatList: sess.stringValues
  });
}
  else
  {
    res.redirect('/');
  }
});

app.get('/logout',nocache,function(req,res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

//============================================POST=========================================

app.post('/phoneVerify', function (req, res) {
  let mobNo = req.body.mobNo;
  sess = req.session;
  auth.authMobNo(sess.rsiid, mobNo)
  .then(()=>{
    otp = generateOTP();
    sendMsg.sendOTP(otp, mobNo)
    sess.mobNo = mobNo;
    res.redirect('/sendOTP');
  }, () => {
    req.flash('invalidMobNo', 'Invalid Mobile Number! Please Try Again!!!');
    res.redirect('/requestOTP');
  });
})

app.post('/changePasswordVerify', function (req, res) {
  var newPass=req.body.newPass;
  var cnfmPass=req.body.cnfmPass;
  if(newPass === cnfmPass)
    {
      auth.updatePass(sess.rsiid, newPass)
      .then(()=>
      {
        res.redirect('/home');
      },()=>
      {
        req.flash('unequalPassword', 'Error In Updating Password!!!');
        res.redirect('/changePassword');
      })
  }
  else
  {
    req.flash('unequalPassword', 'Password Don\'t Match!!!');
    res.redirect('/changePassword');
  }
});

app.post('/OTPVerify', function (req, res) {
  sess = req.session;
  if(req.body.otp === otp)
  {
    sess.otp = req.body.otp;
    res.redirect('/changePassword');
  }
  else
  {
    req.flash('invalidOTP', 'Invalid OTP!!!');
    res.redirect('/sendOTP');
  }
});

app.post('/idVerify',function(req,res){
  sess = req.session;
  sess.rsiAdmin=undefined;
  sess.rsiid=undefined;
  sess.mobNo=undefined;
  var field1=req.body.field1;
  var field2=req.body.field2;
  user=field1+'-'+field2;
  user=user.toString();
  sess = req.session;
  auth.idVerify(user)
  .then(()=>{
    if(user==='A-007')
    {
      sess.rsiAdmin=user;
      sess.rsiid=user;
    }
    else
    {
      sess.rsiid = user;
    }
    res.redirect('/userLogin');
  }, ()=>{
    req.flash('invalidID', 'Invalid RSI-ID! Please Try Again!');
    res.redirect('/');
  });
});

app.post('/userVerify',function(req,res){
  mobNo = req.body.mobNo;
  sess = req.session;
  var password=req.body.rsipass;
   auth.authenticate(sess.rsiid,mobNo,password)
   .then(()=>{
     sess.mobNo = mobNo;
     res.redirect('/home');
   }, ()=>{
     req.flash('invalidUser','Invalid Number Or Password!!!');
     res.redirect('/userLogin');
   }); 
});

app.post('/movieAdded', (req,res)=>{
  var certification = req.body.certification;
  var date = req.body.date;
  var duration = req.body.duration;
  var language = req.body.language;
  var name = req.body.movieName;
  var timing = req.body.timing;
  var imageFile = req.body.imageFile;
  var Users = {'-1':{'time':admin.database.ServerValue.TIMESTAMP}};
  var status = ['A','A', 'A','A','A', 'A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A','A','A', 'A','A'];

  admin.database().ref('Movies/').push({
      certification : certification,
      date : date,
      image_url : imageFile,
      duration : duration,
      language : language,
      hall : {Users, status},
      name : name,
      timing : timing
  });
  res.redirect('/movieAdded');
});

app.post('/layout', (req, res)=>{
  sess = req.session;
  sess.totalPrice = parseInt(req.body.price);
  sess.totalSeats = req.body.seats;
  sess.guests=req.body.guests;
  sess.member=req.body.member;
  sess.dependents=req.body.dependents;
  res.redirect('/layout');
});

app.post('/adminUserDetails',(req,res)=>
{
  sess=req.session;
  sess.rsiid=req.body.rsiid;
  sess.newMob=req.body.newMob;
  if(sess.rsiid&&sess.newMob)
  {
  auth.authMobNo(sess.rsiid,sess.newMob)
  .then(()=>{
    res.redirect('/dependents');
  },
  ()=>{
    req.flash('invalidUserOrMobile','Invalid User-Id Or Mobile!!!');
    res.redirect('/adminBooking');
  })
}
else
{
  req.flash('invalidUserOrMobile','Please Enter The Details!!!');
  res.redirect('/adminBooking');
}
})

app.post('/adminDelete',(req,res)=>{
  var date = req.body.date;
  var ref = admin.database().ref('Tickets/');
  ref.on('value',(snapshot)=>{
    snapshot.forEach(childSnapshot =>{
      var ref1 = admin.database().ref('Tickets/'+childSnapshot.key);
      ref1.on('value',(snapshot1)=>{
        snapshot1.forEach(childSnapshot1=>{
          if(childSnapshot1.val().date===date){
            admin.database().ref('Tickets/'+childSnapshot.key +'/'+ childSnapshot1.key).remove();
          }
        });
      });   
    });
  });
  req.flash('deleteTicket','Ticket Deleted!!!');
  res.redirect('/deleteTicket');
});


app.post('/downloadSummary',(req,res)=>{
  var date = req.body.date;
  var data = [];
  var tool = new NodeXls();
  var ref = admin.database().ref('Summary/'+date);
  ref.once('value',(snapshot)=>{
      snapshot.forEach(childSnapshot => {
          data.push({
              Date : childSnapshot.val().date,
              MovieName : childSnapshot.val().movieName,
              RSIID : childSnapshot.val().rsiID,
              Seats : childSnapshot.val().seats,
              Time : childSnapshot.val().time,
              Dependent : childSnapshot.val().dependents,
              Guest : childSnapshot.val().guest,
              Member : childSnapshot.val().member,
              TotalCost : childSnapshot.val().totalCost,
              TypeOfTicket : childSnapshot.val().typeOfTicket 
          });
      });
      var xls = tool.json2xls(data, {order:["Date","MovieName","RSIID","Seats","Time","Dependent","Guest","Member","TotalCost","TypeOfTicket"], fieldMap:{MovieName: "Movie Name", RSIID : "RSI ID",Dependent:"Dependent(s)",Member:"Member(s)", Guest:"Guest(s)", TotalCost:"Total Cost", TypeOfTicket:"Type of Ticket"}});
      fs.writeFileSync(date+'.xls',xls, 'binary');
      res.download(date+'.xls');
  });    
});

app.post('/addUser',(req,res)=>
{
  var rsiID=req.body.rsiID;
  var mobno=req.body.mobno;
  var pass=req.body.pass;
  let obj={};
  obj['mobno']=mobno;
  obj['pass']=pass;
  obj['rsiID']=rsiID;
  if(rsiID&&mobno&&pass)
  {
    admin.database().ref('UserSignIn2/'+rsiID).set(obj);
    req.flash('addUser','User Added!!!');
    res.redirect('/addUser');
  }
  else
  {
    req.flash('addUser','Incomplete Details!!!');
    res.redirect('/addUser');
  }
})

app.post('/deleteUser',(req,res)=>
{
  var rsiID=req.body.rsiID;
  auth.idVerify(rsiID)
  .then(()=>
  {
    if(rsiID)
    {
      admin.database().ref('UserSignIn2/'+rsiID).remove();
      req.flash('deleteUser','User Deleted!!!');
      res.redirect('/deleteUser');
    }
    else
    {
      req.flash('deleteUser','Invalid User!!!');
      res.redirect('/deleteUser');
    }
  },
  ()=>{
    req.flash('deleteUser', 'Invalid RSI-ID! Please Try Again!');
    res.redirect('/deleteUser');
  });
})

app.post('/changePrices',(req,res)=>
{
  var guePrice = req.body.guestprice;
  var memPrice  = req.body.memberprice;
  var upiID = "9403107253@upi";
  if(guePrice&&memPrice&&upiID)
  {
  admin.database().ref('Settings').set({
    guePrice : guePrice,
    memPrice : memPrice,
    upiID : upiID
  });
  req.flash('pricesChanged',"Prices Changed Successfully!!!");
  res.redirect('/changePrices');
  }
  else
  {
    req.flash('pricesChanged',"Please Enter All The Details!!!");
    res.redirect('/changePrices');
  }
});

app.post('/changeMobileNumber',(req,res)=>
{
  var rsiID = req.body.rsiID;
  var mobno  = req.body.mobno;
  var newmobno = req.body.newmobno;
  if(rsiID&&mobno&&newmobno)
  {
    auth.changeMobNo(rsiID,mobno,newmobno)
    .then(()=>
    {
      console.log("Resolve");
      req.flash('numberChanged',"Mobile Number Changed Successfully!!!");
      res.redirect('/changeMobileNumber');
    },
    ()=>
    {
      console.log("Reject");
      req.flash('numberChanged',"Mobile Number Doesn't Match!!!");
      res.redirect('/changeMobileNumber');
    })
  }
  else
  {
    req.flash('numberChanged',"Please Enter All The Details!!!");
    res.redirect('/changeMobileNumber');
  }
});

app.post('/changeDependents', function(req,res){
  let rsi;
  let dep;

  rsi= req.body.rsiid;
  dep=req.body.depcount;
  auth.idVerify(rsi)
  .then(()=>
  {
    if(dep!=null)
    {
      var uid = admin.database().ref('DepCount/'+rsi);
      uid.once('value',function(snapshot)
      {
      if(snapshot.hasChild('depCount'))
      {
        var db = admin.database();
        db.ref('DepCount/'+rsi+'/'+'depCount/').set(dep);
      }
      else
      {
          admin.database().ref('DepCount/'+rsi).set({
          depCount:dep,
          rsiID:rsi
        });
      }
      req.flash('depCountChanged','Dependents Count Changed Successfully!!!');
      res.redirect("/changeDependents");
      });
    }
    else
    {
      req.flash('depCountChanged','Please Enter Valid Dependent Count!!!');
      res.redirect("/changeDependents");
    }
  },()=>
  {
    req.flash('depCountChanged','Invalid RSI-ID!!!');
    res.redirect("/changeDependents");
  })
  });

app.post('/book', (req, res) => {
  sess = req.session;
  if(sess.movieKey)
  {
    auth.bookTicket(sess.arrSeats, sess.movieKey).then(()=>{res.redirect('/ticket')});
    auth.insertTicket(sess.rsiid, sess.arrSeats,sess.seatValues, sess.movieName, sess.time, sess.date, sess.totalPrice,sess.member,sess.dependents,sess.guests);
    if(sess.rsiAdmin==='A-007')
    {
      sendMsg.sendBookingConfirmation(sess.rsiid, sess.stringValues, sess.movieName, sess.time, sess.date, sess.newMob);
    }
    else
    {
      sendMsg.sendBookingConfirmation(sess.rsiid, sess.stringValues, sess.movieName, sess.time, sess.date, sess.mobNo);
    }
  }
  else
  {
    res.redirect('/home');
  }
  });

const server = app.listen(process.env.PORT || 5000);