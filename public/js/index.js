window.onload = onLoadFunc();

var user = "A-011";
var map = {};
var m;
var arr1=[];
var k;
var h=0;
for(k=0; k<358; k++){
    map[k]=0;
}

function onLoadFunc(){
    $('p').css('opacity','0');
    var arrResult = [];
    var uid = firebase.database().ref('Movies/').orderByChild('date');
    uid.on('value',function(snapshot){
        snapshot.forEach(childSnapshot => {
            arrResult.push(childSnapshot.key);
        });
        var def = firebase.database().ref('Movies/'+arrResult[0]+'/hall/status');
        def.on('value',function(snapshot){
            snapshot.forEach(childSnapshot=>{
                if(childSnapshot.val()==="R"){
                    $('.'+childSnapshot.key).css({"background-color":"#E98074"});
                    // $('.'+childSnapshot.key).css({"background":"white"});
                }
            });
        });
    });
}

$('.seat').on('click', function() {
    var color = $(this).css("background");
    if($(this).css("background")=="rgb(233, 128, 116) none repeat scroll 0% 0% / auto padding-box border-box"){
        window.alert("already selected");
    }else{
        var text = $(this).attr('id');
        if(map[text]===0){
            map[text]=1;
            $(this).css({"background":"#8E8D8A"});
            let reff1 = firebase.database().ref("Movies/-LVIvl8J0H5NP2Haz9NZ/hall/Users");
            reff1.once('value',function(snapshot){
                if(snapshot.hasChild(text)){
                    alert('exists');
                }else{
                    firebase.database().ref("Movies/-LVIvl8J0H5NP2Haz9NZ/hall/Users/"+text).set({
                        time: firebase.database.ServerValue.TIMESTAMP,
                        seat : text,
                        user : user
                    });
                }
            });
        }else{
            map[text]=0;
            $(this).css({"background":"rgb(222, 228, 228)"});
            let reff1 = firebase.database().ref("Movies/-LVIvl8J0H5NP2Haz9NZ/hall/Users");
            reff1.once('value',function(snapshot){
                if(snapshot.hasChild(text)){
                    firebase.database().ref("Movies/-LVIvl8J0H5NP2Haz9NZ/hall/Users/"+text).remove();
                }else{
                    // alert('no entry is there');
                }
            });
        }
    }
});

function updateDB(){
    h=0;
    for(m=0; m<357; m++){
        if(map[m]===1){
            arr1[h] = m;
            h=h+1;
        }
    }
    flag = 0; 
    var o;
    for(o=0; o<arr1.length; o++){
        let reff2 = firebase.database().ref("Movies/-LVIvl8J0H5NP2Haz9NZ/hall/Users/"+arr1[o]);
        reff2.once('value',function(snapshot){
            if(snapshot.val().user===user){
                // some code I will right here 
            }else{
                flag=1;
            }
        });
    }
    alert(flag);
}

// function updateDB(){
//     var arrResult = [];
//     var uid = firebase.database().ref('Movies/').orderByChild('date');
//     uid.on('value',function(snapshot){
//         snapshot.forEach(childSnapshot => {
//             arrResult.push(childSnapshot.key);
//         });        
//     });
//     var j;
//     for(j=0; j<358; j++){
//         if(map[j]===1){
//             var def = firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/'+j);
//             def.once('value',function(snapshot){
//                 if(snapshot.val()==="A"){
//                     arr1[h]=j;
//                     h++;
//                     count2 = count2 + 1;
//                 }
//             });
//         }
//     }
//     // window.alert(count1);
//     // window.alert(count2);
//     if(count2<count1){
//         window.alert('seat already booked you are late');
//     }
//     if(count2==count1){
//         for(m=0; m<h; m++){
//             var xx = firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/'+arr1[m]);
//             xx.once('value',function(snapshot){
//                 if(snapshot.val()==="A"){
//                     firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/'+arr1[m]).set("R");
//                     alert('success');
//                 }else{
//                     alert('you are late 2');
//                 }
//             });
//         }
//     }
// }


// function updateDB(){
//     var d = new Date();
//     alert(d.getTime());
//     var arrResult = [];
//     var uid = firebase.database().ref('Movies/').orderByChild('date');
//     uid.on('value',function(snapshot){
//         snapshot.forEach(childSnapshot => {
//             arrResult.push(childSnapshot.key);
//         });        
//     });
//     var j;
//     for(j=0; j<358; j++){
//         if(map[j]===1){
//             var def = firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/'+j);
//             def.once('value',function(snapshot){
//                 //alert(1);
//                 if(snapshot.val()==="A"){
//                     count2 = count2 + 1;
//                   //  alert(2);
//                 }else{
//                     //alert(3);
//                 }
//             });
//         }
//     }

//     if(count2<count1){
//         window.alert('seat already booked you are late');
//     }
//     if(count2==count1){
//         for(j=0; j<358; j++){
//             if(map[j]===1){
//                 firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/'+j).set("R");
//                 //alert(firebase.database().ref('Movies/'+arrResult[0]+'/hall/status/').child(j).val());
//             }
//         }
//         window.alert('success');
//     }
// }



