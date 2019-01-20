
var express  = require('express');
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
//var app = express();
var cors = require('cors') ;
 app = express();
 app.use(bodyParser.urlencoded({'extended':'true'}));
 app.use(bodyParser.json());
 app.use(bodyParser.json({type:'application/vnd.api+json'}));
 
  app.use(cors()); 
  var cid,mid1,comid1;
  var val=[];
 var comp_date;
 var valCType=[];
var valUpdate=[];
  const pg  = require('pg');
  // const config = {
  //     user: 'postgres',
  //     database: 'postgres',
  //     password: 'root',
  //     port: 5432
  // };
  const config = {
    user: 'postgres',
    database: 'postgres',
    password: 'root',
    port: 5432
};
  const pool = new pg.Pool(config);





  
//Master Module List
 app.get('/masterModulelist',function(req,res,next){
    pool.connect(function (err, client, done) {
     client.query('SELECT "moduleId", "moduleType" FROM public."ssSoftwareModules"', function (err, result) {
                done();
                if (err)
                    res.send(err)
                  //  console.log(result);
               //console.log(result.rows);
                    res.json(result.rows);
   });
 
   })
 });
 

//get Complaint List

app.get('/masterComplaintlist',function(req,res,next){
  var c_others='Others';
   pool.connect(function (err, client, done) {
    client.query('SELECT "complaintTypeId", "complaintType" FROM public."ssSoftwareComplaint" where "complaintothers"is null', function (err, result) {
               done();
               if (err)
                   res.send(err)
                  // console.log(result);
             // console.log(result.rows);
                   res.json(result.rows);
  });

  })
});

 
 //open Complaint lists
 
 app.get('/openComplaint',function(req,res,next){
  var stat="Opened";
  var list1=[];
  var open_list=[];
  pool.connect(function (err, client, done) {
   client.query('select scm."complaintId",sm."moduleType",sc."complaintType",sc."complaintothers",scm."complaintDescription",scm."complaintDate",scm."errorPath",scm."remarks",scm."staffStatus" from public."ssSoftwareModules" sm,public."ssSoftwareComplaint" sc,public."ssComplaintMaster" scm,public."ssStaffLogin" ss where sc."complaintTypeId"=scm."complainttypeId" and sm."moduleId"=scm."moduleId" and ss."employeecode"=scm."personalId" and scm."staffStatus"=$1',[stat], function (err, result) {
              done();
              if (err)
                  res.send(err)
                  console.log("result ghfghfghgfhfgh: "+result);
            //  console.log("table opennnnn-----"+result.rows[0]);
            //  console.log("table open  -----"+JSON.stringify(result.rows));
             console.log("length row : "+result.rows.length);
             for(i=0;i<result.rows.length;i++)
             {
                data1=JSON.stringify(result.rows[i]["complaintDate"]);
                data1=data1.substring(1, 11);
                console.log("date "+data1);
                list1={
                  "complaintId":result.rows[i]["complaintId"],
                  "module_type":result.rows[i]["moduleType"],
                  "complaint_type":result.rows[i]["complaintType"],
                  "comp_others":result.rows[i]["complaintothers"],
                  "description":result.rows[i]["complaintDescription"],
                  "complaintDate":data1,
                  "error_path":result.rows[i]["errorPath"],
                  "remarks":result.rows[i]["remarks"]
                };
                open_list.push(list1);
             }
            // console.log("leng json : "+Object.keys(open_list));
            //  console.log("open list : "+JSON.stringify(open_list));
            res.json(open_list);
 });

 })
});
 
//completed complaintlist
app.get('/completedComplaint',function(req,res,next){
  var stat="Completed";
  var list1=[];
  var completed_list=[];
  pool.connect(function (err, client, done) {
   client.query('select scm."complaintId",sm."moduleType",sc."complaintType",scm."complaintDescription",scm."complaintDate",scm."errorPath",scm."remarks" from public."ssSoftwareModules" sm,public."ssSoftwareComplaint" sc,public."ssComplaintMaster" scm,public."ssStaffLogin" ss where sc."complaintTypeId"=scm."complainttypeId" and sm."moduleId"=scm."moduleId" and ss."employeecode"=scm."personalId" and scm."staffStatus"=$1',[stat], function (err, result) {
              done();
              if (err)
                  res.send(err)
               //   console.log("result ghfghfghgfhfgh: "+result);

                //  console.log("length row : "+result.rows.length);
                  for(i=0;i<result.rows.length;i++)
                  {
                    data1=JSON.stringify(result.rows[i]["complaintDate"]);
                    data1=data1.substring(1, 11);
                  //  console.log("date "+data1);
                    list1={
                      "complaintId":result.rows[i]["complaintId"],
                      "module_type":result.rows[i]["moduleType"],
                      "complaint_type":result.rows[i]["complaintType"],
                      "description":result.rows[i]["complaintDescription"],
                      "complaintDate":data1,
                      "error_path":result.rows[i]["errorPath"],
                      "remarks":result.rows[i]["remarks"]
                    };
                  completed_list.push(list1);
                 }
             // console.log("leng json : "+Object.keys(completed_list));
              //  console.log("open list : "+JSON.stringify(open_list));
              res.json(completed_list);


           
 });

 })
});

//complaint listOthers
app.get('/getOtherComplaint',function(req,res,next){
  var c_others='Others';
   pool.connect(function (err, client, done) {
    client.query('SELECT "complaintothers" FROM public."ssSoftwareComplaint" where "complaintType"=$1',[c_others], function (err, result) {
               done();
               if (err)
                   res.send(err)
                else if(!result){
                  //console.log("null");
                }
                else{
                 //  console.log(result);
              //console.log(result.rows);
                   res.json(result.rows);
                }
  });

  })
});


//complaint listOthers
app.get('/getOtherComplaint',function(req,res,next){
  var c_others='Others';
   pool.connect(function (err, client, done) {
    //client.query('SELECT "complaintothers" FROM public."ssSoftwareComplaint" where "complaintType"=$1',[c_others], function (err, result) {
      client.query('SELECT "complaintothers" FROM public."ssSoftwareComplaint" where "complaintothers"=$1',[c_others], function (err, result) {
               done();
               if (err)
                   res.send(err)
                else if(!result){
                  console.log("null");
                }
                else{
                   console.log(result);
              //console.log(result.rows);
                   res.json(result.rows);
                }
  });

  })
});


// function getModuleId(moduleType)
//   {
//     console.log("Inside function--moduleType"+moduleType);
//     pool.connect(function(err,client,done){
//       console.log("Inside function--moduleType2"+moduleType);
//       client.query('select "moduleId" from public."ssSoftwareModules" where "moduleType"=$1',[moduleType],function(err,result){
//         console.log("Inside function--moduleType3"+moduleType);
//         if (err) {
//                       console.log(err);
//                       return;
//                   } else {
//                     console.log("moduleid==========="+result.rows[0]["moduleId"])
//                     console.log("select mid : "+JSON.stringify(result.rows[0]["moduleId"]));
//                     mid1=JSON.stringify(result.rows[0]["moduleId"]);
//                     mid1 = mid1.replace(/^"(.*)"$/, '$1');
//                     console.log("mid : "+mid1);
//                     return mid1;
//                   }
//       })
     
      
//     });
//   }

 //////////////////new other Refister 17-01-19

 app.post('/tsInsertComplaint',urlencodedParser,function(req,res,next){

  console.log("testhhgjhgjhg");

  console.log("test req : "+JSON.stringify(req.body));
  var data=JSON.stringify(req.body);

  dataKey=JSON.parse(data);
  console.log(dataKey["module_type"]);
  

  pool.connect(function(err,client,done){


    var mid=dataKey["module_type"];
    var pid="p1";//dataKey["personalId"];
    comid=dataKey["complaint_type"];
    console.log("ctype test   : "+comid);
    var comp_des=dataKey["description"];
    
    var err_path=dataKey["error_path"];
    var img="img1";
    var ad_stat="Unread";
    var stf_stat="Opened";
    var lvl="0";
    var rmks="By sir";

    other_CompDescription=dataKey["other_Complaints"];
    console.log("other desc : "+other_CompDescription);

    var currentdate = new Date();
    //comp_date=currentdate.getDate()+'-'+(currentdate.getMonth())+'-'+(currentdate.getFullYear());
    comp_date=(currentdate.getFullYear())+'-'+(currentdate.getMonth()+1)+'-'+currentdate.getDate();
    console.log("year : "+(currentdate.getFullYear()));
    console.log("month : "+(currentdate.getMonth()));
    console.log("date : "+currentdate.getDate());
    console.log("date : "+comp_date); 

    // //////////////////////////////////////////SEQUENCE//////////////////////////////////////////////////////////////////////////////
cid;


client.query('SELECT * from compl_id()',function(err,result){
  if (err) {
                console.log(err);
                return;
            } else {
              //console.log("select compid : "+JSON.stringify(result.rows[0]["compl_id"]));
              cid="comp";
              cid+=JSON.stringify(result.rows[0]["compl_id"]);
              console.log("cid : "+cid);
              return cid;
                //console.log('row inserted with id: ' + result.rows[0].id);
            }
})   
//    // //////////////////////////////////////////SEQUENCE//////////////////////////////////////////////////////////////////////////////
    mid1;
    client.query('select "moduleId" from public."ssSoftwareModules" where "moduleType"=$1',[mid],function(err,result){
      if (err) {
                    console.log(err);
                    return;
                } else {
                  console.log("moduleid==========="+result.rows[0]["moduleId"])
                  console.log("select mid : "+JSON.stringify(result.rows[0]["moduleId"]));
                  mid1=JSON.stringify(result.rows[0]["moduleId"]);
                  mid1 = mid1.replace(/^"(.*)"$/, '$1');
                  console.log("mid : "+mid1);
                  return mid1;
                }
    })
   
    client.query('select current_date',function(err,result){
              if (err) {
                            console.log(err);
                            return;
                        } else {
                          if(comid=="Others")
                          //if(other_CompDescription=="Others")
                          {
                            console.log("others");
                            client.query('SELECT * from public."ssSoftwareComplaint" where "complaintType"=$1',[comp_des],function(err,result){
                            //client.query('SELECT * from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                             if (err) {
                                               console.log(err);
                                               return;
                                           } else {
                                             
                                             c=result.rows.length;
                                             console.log("count in first fun : "+c);
                                             //return cid;
                                               //console.log('row inserted with id: ' + result.rows[0].id);
                                               if(c==0){
                                                 console.log("other's c==0 if");
                                                 client.query('SELECT * from compltype_id()',function(err,result){
                                                   if (err) {
                                                                 console.log(err);
                                                                 return;
                                                             } else {
                                                               
                                                               compType_cid=JSON.stringify(result.rows[0]["compltype_id"]);
                                                               compType_cid = compType_cid.replace(/^"(.*)"$/, '$1');
                                                               console.log("cid type  eeeeee : "+compType_cid);
                                                               other_CompDescription=other_CompDescription.replace(/^"(.*)"$/, '$1');
                                                               console.log("in if comid : "+comid);
                                                               //valCType.push(compType_cid,other_CompDescription,comid);
                                                               valCType.push(compType_cid,comp_des,comid);
                                                               val.push(cid,mid1,pid,compType_cid,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                                               return compType_cid;
                                                                 //console.log('row inserted with id: ' + result.rows[0].id);
                                                             }
                                                 })
                                                 client.query('insert into public."ssSoftwareComplaint"("complaintTypeId","complaintType","complaintothers")values($1,$2,$3)',valCType,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 valCType=[];
                                             
                                                             }
                                                 })
                                                 client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 val=[];
                                             
                                                             }
                                                   })
                 
                                               } 
                                               else{
                                                 console.log("other's c==0 else");
                                                 //client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                                                  client.query('SELECT * from public."ssSoftwareComplaint" where "complaintType"=$1',[comp_des],function(err,result){
                                                   if (err) {
                                                                 console.log(err);
                                                                 return;
                                                             } else {
                                                               console.log("select compid : "+JSON.stringify(result.rows[0]["complaintTypeId"]));
                                                               var demo=result.rows[0];

                                                               comid1=JSON.stringify(demo["complaintTypeId"]);
                                                               comid1 = comid1.replace(/^"(.*)"$/, '$1');

                                                               //return comid1;
                                                               val.push(cid,mid1,pid,comid1,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                                               client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                                 if (err) {
                                                                         console.log(err);
                                                                   return;
                                                                   } else {
                                                                               console.log("success");
                                                                               val=[];
                                                           
                                                                           }
                                                                 })
                                                             }
                                                 })
                                                 
                 
                 
                                               }
                                           }
                           })  
                          
                          }
                          else{
                           console.log("out");
                           client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                           //client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                             if (err) {
                                           console.log(err);
                                           return;
                                       } else {
                                         //console.log("select compid : "+JSON.stringify(result.rows[0]["complaintTypeId"]));
                                         var demo=result.rows[0];
                                         //comid1=JSON.stringify(result.rows[0]["complaintTypeId"]);
                                         comid1=JSON.stringify(demo["complaintTypeId"]);
                                         comid1 = comid1.replace(/^"(.*)"$/, '$1');

                                         val.push(cid,mid1,pid,comid1,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                         client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 val=[];
                                             
                                                             }
                                           })
                                         return comid1;
                                       }
                           })
                            console.log("out comid1 : "+comid1);
                           
                                
                          }
                         
                        }
            })
  })//pool.connect
})



///INSERT COMPLAINT
app.post('/tsInsertDummySample',urlencodedParser,function(req,res,next){

   console.log("testhhgjhgjhg");

  console.log("test req : "+JSON.stringify(req.body));
  var data=JSON.stringify(req.body);

  dataKey=JSON.parse(data);
  console.log(dataKey["module_type"]);
  

  pool.connect(function(err,client,done){


    var mid=dataKey["module_type"];
    var pid="p1";//dataKey["personalId"];
    comid=dataKey["complaint_type"];
    console.log("ctype test   : "+comid);
    var comp_des=dataKey["description"];
    
    var err_path=dataKey["error_path"];
    var img="img1";
    var ad_stat="Unread";
    var stf_stat="Opened";
    var lvl="0";
    var rmks="By sir";
    

    other_CompDescription=dataKey["other_Complaints"];

    var currentdate = new Date();
    //comp_date=currentdate.getDate()+'-'+(currentdate.getMonth())+'-'+(currentdate.getFullYear());
    comp_date=(currentdate.getFullYear())+'-'+(currentdate.getMonth()+1)+'-'+currentdate.getDate();
    console.log("year : "+(currentdate.getFullYear()));
    console.log("month : "+(currentdate.getMonth()));
    console.log("date : "+currentdate.getDate());
    console.log("date : "+comp_date); 

    // //////////////////////////////////////////SEQUENCE//////////////////////////////////////////////////////////////////////////////
cid;


client.query('SELECT * from compl_id()',function(err,result){
  if (err) {
                console.log(err);
                return;
            } else {
              //console.log("select compid : "+JSON.stringify(result.rows[0]["compl_id"]));
              cid="comp";
              cid+=JSON.stringify(result.rows[0]["compl_id"]);
              console.log("cid : "+cid);
              return cid;
                //console.log('row inserted with id: ' + result.rows[0].id);
            }
})   
//    // //////////////////////////////////////////SEQUENCE//////////////////////////////////////////////////////////////////////////////
    mid1;
    client.query('select "moduleId" from public."ssSoftwareModules" where "moduleType"=$1',[mid],function(err,result){
      if (err) {
                    console.log(err);
                    return;
                } else {
                  console.log("moduleid==========="+result.rows[0]["moduleId"])
                  console.log("select mid : "+JSON.stringify(result.rows[0]["moduleId"]));
                  mid1=JSON.stringify(result.rows[0]["moduleId"]);
                  mid1 = mid1.replace(/^"(.*)"$/, '$1');
                  console.log("mid : "+mid1);
                  return mid1;
                }
    })
   
    client.query('select current_date',function(err,result){
              if (err) {
                            console.log(err);
                            return;
                        } else {
                          if(comid=="Others")
                          {
                            console.log("others");
                            client.query('SELECT * from public."ssSoftwareComplaint" where "complaintothers"=$1',[other_CompDescription],function(err,result){
                             if (err) {
                                               console.log(err);
                                               return;
                                           } else {
                                             
                                             c=result.rows.length;
                                             console.log("count in first fun : "+c);
                                             //return cid;
                                               //console.log('row inserted with id: ' + result.rows[0].id);
                                               if(c==0){
                                                 console.log("other's c==0 if");
                                                 client.query('SELECT * from compltype_id()',function(err,result){
                                                   if (err) {
                                                                 console.log(err);
                                                                 return;
                                                             } else {
                                                               
                                                               compType_cid=JSON.stringify(result.rows[0]["compltype_id"]);
                                                               compType_cid = compType_cid.replace(/^"(.*)"$/, '$1');
                                                               console.log("cid type  eeeeee : "+compType_cid);
                                                               other_CompDescription=other_CompDescription.replace(/^"(.*)"$/, '$1');
                                                               console.log("in if comid : "+comid);
                                                               valCType.push(compType_cid,comid,other_CompDescription);
                                                               val.push(cid,mid1,pid,compType_cid,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                                               return compType_cid;
                                                                 //console.log('row inserted with id: ' + result.rows[0].id);
                                                             }
                                                 })
                                                 client.query('insert into public."ssSoftwareComplaint"("complaintTypeId","complaintType","complaintothers")values($1,$2,$3)',valCType,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 valCType=[];
                                             
                                                             }
                                                 })
                                                 client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 val=[];
                                             
                                                             }
                                                   })
                 
                                               } 
                                               else{
                                                 console.log("other's c==0 else");
                                                 client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                                                   if (err) {
                                                                 console.log(err);
                                                                 return;
                                                             } else {
                                                               console.log("select compid : "+JSON.stringify(result.rows[0]["complaintTypeId"]));
                                                               
                                                               comid1=JSON.stringify(result.rows[0]["complaintTypeId"]);
                                                               
                                                               comid1 = comid1.replace(/^"(.*)"$/, '$1');

                                                               //return comid1;
                                                               val.push(cid,mid1,pid,comid1,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                                               client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                                 if (err) {
                                                                         console.log(err);
                                                                   return;
                                                                   } else {
                                                                               console.log("success");
                                                                               val=[];
                                                           
                                                                           }
                                                                 })
                                                             }
                                                 })
                                                 
                 
                 
                                               }
                                           }
                           })  
                          
                          }
                          else{
                           console.log("out");
                           client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                             if (err) {
                                           console.log(err);
                                           return;
                                       } else {
                                         console.log("select compid : "+JSON.stringify(result.rows[0]["complaintTypeId"]));
                                         
                                         comid1=JSON.stringify(result.rows[0]["complaintTypeId"]);
                                         
                                         comid1 = comid1.replace(/^"(.*)"$/, '$1');

                                         val.push(cid,mid1,pid,comid1,comp_des,comp_date,err_path,img,ad_stat,stf_stat,lvl,rmks);
                                         client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                                   if (err) {
                                                           console.log(err);
                                                     return;
                                                     } else {
                                                                 console.log("success");
                                                                 val=[];
                                             
                                                             }
                                           })
                                         return comid1;
                                       }
                           })
                            console.log("out comid1 : "+comid1);
                           
                                
                          }
                         
                        }
            })
  })//pool.connect
})

   //closed complaintlist
   app.get('/closedComplaint',function(req,res,next){
    
    var stat="Closed";
    var list1=[];
    var closed_list=[];
    pool.connect(function (err, client, done) {
     client.query('select scm."complaintId",sm."moduleType",sc."complaintType",scm."complaintDescription",scm."complaintDate",scm."errorPath",scm."remarks" from public."ssSoftwareModules" sm,public."ssSoftwareComplaint" sc,public."ssComplaintMaster" scm,public."ssStaffLogin" ss where sc."complaintTypeId"=scm."complainttypeId" and sm."moduleId"=scm."moduleId" and ss."employeecode"=scm."personalId" and scm."staffStatus"=$1',[stat], function (err, result) {
                done();
                if (err)
                    res.send(err)
                    console.log("result ghfghfghgfhfgh: "+result);
  
                    console.log("length row : "+result.rows.length);
                    for(i=0;i<result.rows.length;i++)
                    {
                      data1=JSON.stringify(result.rows[i]["complaintDate"]);
                      data1=data1.substring(1, 11);
                      console.log("date "+data1);
                      list1={
                        "complaintId":result.rows[i]["complaintId"],
                        "module_type":result.rows[i]["moduleType"],
                        "complaint_type":result.rows[i]["complaintType"],
                        "description":result.rows[i]["complaintDescription"],
                        "complaintDate":data1,
                        "error_path":result.rows[i]["errorPath"],
                        "remarks":result.rows[i]["remarks"]
                      };
                    closed_list.push(list1);
                   }
                console.log("leng json : "+Object.keys(closed_list));
                //  console.log("open list : "+JSON.stringify(open_list));
                res.json(closed_list);
  
  
             
   });
  
   })
  });

  app.post('/tsUpdateComplaint',urlencodedParser,function(req,res,next){

   // console.log("testhhgjhgjhg");
  
   // console.log("test req  update : "+JSON.stringify(req.body));
    var data=JSON.stringify(req.body);
  
    dataKey=JSON.parse(data);
   // console.log("hfhfghfghfgh "+dataKey["module_type"]);
    
  
    pool.connect(function(err,client,done){
  
      
  
      cno=dataKey["complaintId"];
      var mid=dataKey["module_type"];
      var pid="p1";//dataKey["personalId"];
      comid=dataKey["complaint_type"];
      // console.log("ctype test   : "+comid);
      var comp_des=dataKey["description"];
      
      var err_path=dataKey["error_path"];
      var img="img1";
      var rmks="By sir";
  
      other_CompDescription=dataKey["other_Complaints"];
  
      var currentdate = new Date();
     
      comp_date=(currentdate.getFullYear())+'-'+(currentdate.getMonth()+1)+'-'+currentdate.getDate();
      
     
  
      mid1;
      client.query('select "moduleId" from public."ssSoftwareModules" where "moduleType"=$1',[mid],function(err,result){
        if (err) {
                      //console.log(err);
                      return;
                  } else {
                   // console.log("moduleid==========="+result.rows[0]["moduleId"])
                    //console.log("select mid : "+JSON.stringify(result.rows[0]["moduleId"]));
                    mid1=JSON.stringify(result.rows[0]["moduleId"]);
                    mid1 = mid1.replace(/^"(.*)"$/, '$1');
                    console.log("mid : "+mid1);
                    return mid1;
                  }
      })
      console.log("mid 1 : "+mid1);
     
      client.query('select current_date',function(err,result){
                if (err) {
                              console.log(err);
                              return;
                          }
                            else{
                             console.log("out");
                            client.query('select "complaintTypeId" from public."ssSoftwareComplaint" where "complaintType"=$1',[comid],function(err,result){
                            //client.query('select "complaintTypeId" from public."ssSoftwareComplaint" ',function(err,result){
                               if (err) {
                                             console.log(err);
                                             return;
                                         } else {
                                           console.log("comid inside : "+comid);
                                           console.log("count : "+result.rowCount);
                                           console.log("inside comid val : "+JSON.stringify(result.rows));
                                           var demo=result.rows[0];
                                           
                                          comid1=JSON.stringify(result.rows[0]["complaintTypeId"]);
                                          comid1=JSON.stringify(demo["complaintTypeId"]);
                                           comid1 = comid1.replace(/^"(.*)"$/, '$1');
                                           //console.log("out comid1 : "+comid1);
                                           val.push(mid1,pid,comid1,comp_des,comp_date,err_path,img,rmks,cno);
                                           //client.query('insert into public."ssComplaintMaster"("complaintId","moduleId","personalId","complainttypeId","complaintDescription","complaintDate","errorPath","image","adminStatus","staffStatus","level","remarks")values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',val,function(err,result){
                                            client.query('update public."ssComplaintMaster" set "moduleId"=$1,"personalId"=$2,"complainttypeId"=$3,"complaintDescription"=$4,"complaintDate"=$5,"errorPath"=$6,"image"=$7,"remarks"=$8 where "complaintId"=$9',val,function(err,result){
                                                     if (err) {
                                                             console.log("err update : "+err);
                                                       return;
                                                       } else {
                                                                   console.log("success update");
                                                                   val=[];
                                               
                                                               }
                                             })
                                           return comid1;
                                         }
                             })
                              console.log("out comid1 : "+comid1);
                             
                                  
                            }
                           
                          })
                        })
    })//pool.connect


// Update an existing user's status
app.post('/testUpdate',urlencodedParser, (request, response) => {
  console.log("completediddd==");

  console.log("test req : "+JSON.stringify(request.body));
  var data=JSON.stringify(request.body);

  dataKey=JSON.parse(data);
  console.log(dataKey["compId"]);
  var cId=dataKey["compId"];

  console.log("completediddd=="+cId);
status="Closed";
pstatus="opened";
  pool.connect(function (err, client, done) {
    console.log("connect==");
    client.query('UPDATE public."ssComplaintMaster" SET "staffStatus"=$1 where "complaintId"=$2',[status,cId],(error, result) => {//  WHERE complaintId = ?', [request.body, id], (error, result) => {
      if (error){
        console.log("error===>"+error);
        return 0;
      } 
      else{
       
      response.send('User updated successfully.');
      return 1;
    }
  });

})
});




//delete...
app.delete('/deleteSingleData:complaintId', function(req, res,next) {
    
    var id=req.params.complaintId;
      console.log("iddd=="+id);
         pool.connect(function (err, client, done) {
           client.query('delete from public."ssComplaintMaster" where "complaintId"=$1',[id], function (err, result) {
                           done();
                           if (err)
                               res.send(err)
                               console.log(result);
                          console.log(result.rows);
                               res.json(result.rows);
});
});




console.log("deleting..........");

 });


 app.get('/othersInEdit1',function(req,res,next){
  pool.connect(function (err, client, done) {
  //  client.query('SELECT "complaintothers" FROM public."ssSoftwareComplaint" where "complaintType"=$1',["Others"], function (err, result) {
    client.query('SELECT "complaintType" FROM public."ssSoftwareComplaint" where "complaintothers"=$1',["Others"], function (err, result) {
              done();
              if (err)
                  res.send(err)
                  console.log(result);
             console.log("comppppppp=======> "+result.rows);
                  res.json(result.rows);
 });

 })
});

///Othercomplant count for enabling select option in userview edit
app.get('/getOthersCountInEdit1:comptype',function(req,res,next){
  var c_others=req.params.comptype;
  console.log("other count====> :  "+c_others);
   pool.connect(function (err, client, done) {
    //client.query('SELECT "complaintothers" FROM public."ssSoftwareComplaint" where "complaintType"=$1',[c_others], function (err, result) {
      client.query('SELECT * FROM public."ssSoftwareComplaint" where "complaintType"=$1 and "complaintothers" IS NOT NULL',[c_others],function (err, result) {
               done();
               if (err)
                   res.send(err)
                // else if(!result){
                //   console.log("null");
                // }
                else{
                  otherscount=result.rowCount;
                  console.log("count others : "+result.rowCount);
                  //console.log(result.rows);
                   res.json(result.rowCount);
                }
  });

  })
});


//////Complaint View For User///////////////////////////
app.get('/openComplaintUserView',function(req,res,next){
  var stat="Opened";
  var list1=[];
  var open_list=[];
  pool.connect(function (err, client, done) {
   //client.query('select scm."complaintId",sm."moduleType",sc."complaintType",sc."complaintothers",scm."complaintDescription",scm."complaintDate",scm."errorPath",scm."remarks",scm."staffStatus" from public."ssSoftwareModules" sm,public."ssSoftwareComplaint" sc,public."ssComplaintMaster" scm,public."ssStaffLogin" ss where sc."complaintTypeId"=scm."complainttypeId" and sm."moduleId"=scm."moduleId" and ss."employeecode"=scm."personalId" and scm."staffStatus"=$1',[stat], function (err, result) {
    client.query('select scm."complaintId",sm."moduleType",sc."complaintType",sc."complaintothers",scm."complaintDescription",scm."complaintDate",scm."errorPath",scm."remarks",scm."staffStatus" from public."ssSoftwareModules" sm,public."ssSoftwareComplaint" sc,public."ssComplaintMaster" scm,public."ssStaffLogin" ss where sc."complaintTypeId"=scm."complainttypeId" and sm."moduleId"=scm."moduleId" and ss."employeecode"=scm."personalId" and scm."adminStatus"!=$1 order by scm."complaintDate" desc',["Closed"], function (err, result) {
              done();
              if (err)
                  res.send(err)
                  console.log("result ghfghfghgfhfgh: "+result);
            //  console.log("table opennnnn-----"+result.rows[0]);
            //  console.log("table open  -----"+JSON.stringify(result.rows));
             console.log("length row : "+result.rows.length);
             for(i=0;i<result.rows.length;i++)
             {
                data1=JSON.stringify(result.rows[i]["complaintDate"]);
                data1=data1.substring(1, 11);
                console.log("date "+data1);
                list1={
                  "complaintId":result.rows[i]["complaintId"],
                  "module_type":result.rows[i]["moduleType"],
                  "complaint_type":result.rows[i]["complaintType"],
                  "comp_others":result.rows[i]["complaintothers"],
                  "description":result.rows[i]["complaintDescription"],
                  "complaintDate":data1,
                  "error_path":result.rows[i]["errorPath"],
                  "remarks":result.rows[i]["remarks"],

                  "stf_status":result.rows[i]["staffStatus"]
                };
                open_list.push(list1);
             }
            // console.log("leng json : "+Object.keys(open_list));
            //  console.log("open list : "+JSON.stringify(open_list));
            res.json(open_list);
 });

 })
});
///////////////////////////////////////////////////////
 



app.listen(3000);
console.log('Listening on port 3000...');