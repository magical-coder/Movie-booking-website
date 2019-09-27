const salt = "qwertyuiop[]asdfghjkl;zxc7896321450vbnm,.QWERTYUI741852963OP[]ASDFGHJKL;ZXCVBNM,.7418529630*-+!@#$%^&*()_+";
const saltLength = salt.length ;
const key = [25,4,8,15,12,3,7,13,20,21,5,1,2,9,11,10,17,19,18,24,16,22,23,14,6,0];

const getSalt = () => {
  let str = '';
  for(let i = 0; i < 15; i++)
  {
    str += salt[Math.floor(Math.random()*saltLength)];
  }
  return str;
}

const enc_map = (asc) => {
  return key[asc];
}

const dec_map = (val) => {
  return key.indexOf(val);
}

const encrypt = (str) => {
  let e_val = '';
  let asc, asc_e;
  for(let i = 0; i < str.length; i++)
  {
    e_val += getSalt();
    if(str[i] <= 'Z' && str[i] >= 'A'){
      asc = str.charCodeAt(i);
      asc_e = enc_map(asc - 65) + 65;
      e_val += String.fromCharCode(asc_e);
    }
    else if(str[i] <= 'z' && str[i] >= 'a'){
      asc = str.charCodeAt(i);
      asc_e = enc_map(asc - 97) + 97;
      e_val += String.fromCharCode(asc_e);
    }
    else{
      e_val += str[i];
    }
  }
  return new Promise((resolve, reject) => {
    if(e_val !== '')
    resolve(e_val);
    else
    reject();
  });
}

const decrypt = (str) => {
  let d_val = '';
  let asc, asc_d;
  for(let i = 15; i < str.length; i += 15)
  { 
    if(str[i] <= 'Z' && str[i] >= 'A'){
      asc = str.charCodeAt(i);
      asc_d = dec_map(asc - 65) + 65;
      d_val += String.fromCharCode(asc_d);
      i++;
    }
    else if(str[i] <= 'z' && str[i] >= 'a'){
      asc = str.charCodeAt(i);
      asc_d = dec_map(asc - 97) + 97;
      d_val += String.fromCharCode(asc_d);
      i++;
    }
    else{
      d_val += str[i];
      i++;
    }    
  }
  return new Promise((resolve, reject) => {
    if(d_val !== '')
    resolve(d_val);
    else
    reject();
  });
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;