var express = require('express')
var mysql = require('mysql')
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
var alert = require('alert')
const e = require('express');
const { threadId } = require('worker_threads');
const { ECHILD } = require('constants');
const app = express()
const PythonShell = require('python-shell').PythonShell;

var flag;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "akashdodge",
    database: "access_control"
  });
var instancenames =[], imagenames = [],ipaddresses=[],flavours=[],keypairs=[];
var auser ="";
var apass ="";
var imagename="";
var flavour="";
var flag = 0, flag1 = 0;

var insname=[],iname=[];

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
  })
app.use(express.static('Page.html'))
app.use(express.static(__dirname + "Admin.html"));
app.use(express.static(__dirname + "User.html"));
app.use(express.static(__dirname + "Home.html"));
app.use(express.static(__dirname + "Home1.html"));
app.use(express.static(__dirname + "Register.html"));
app.use(express.static(__dirname + "AdminPage.html"));
app.use(express.static(__dirname + "CustPage.html"));
app.use(express.static(__dirname + "Admcreate.html"));
app.use(express.static(__dirname + "AdmInstance.html"));
app.use(express.static(__dirname + "Custcreate.html"));
app.use(express.static(__dirname + "CustDelete.html"));
app.use(express.static(__dirname + "Delete.html"));
app.use(express.static(__dirname + "CreateSuccessful.html"));
app.use(express.static(__dirname + "CreateSuccessfulCus.html"));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res){
	res.sendFile('Page.html', {root:__dirname})
});
app.get('/user', function(req, res)
{
    res.sendFile(__dirname + "/User.html");
});
app.get('/adpage', function(req, res)
{
    res.sendFile(__dirname + "/AdminPage.html");
});
app.get('/cuspage', function(req, res)
{
    res.sendFile(__dirname + "/CustPage.html");
});
app.get('/create', function(req, res)
{
    res.sendFile(__dirname + "/Admcreate.html");
});
app.get('/creation', function(req, res)
{
    res.sendFile(__dirname + "/Custcreate.html");
});
app.get('/deleted', function(req, res)
{
    res.sendFile(__dirname + "/Delete.html");
});
app.get('/cusdeleted', function(req, res)
{
    res.sendFile(__dirname + "/CustDelete.html");
});
app.get('/admincrete', function(req, res)
{
    res.sendFile(__dirname + "/CreateSuccessful.html");
});
app.get('/customercrete', function(req, res)
{
    res.sendFile(__dirname + "/CreateSuccessfulCus.html");
});

//adminconnect(admin launch/delete instances)
app.get('/connectto', function(req, res)
{
    var sql = "SELECT * From instance";     
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        var instancesize = resultinstance.length;
        
        if(instancesize==0)
        {
            var html = "<html>    <head>        <style>h1{    color: black;}table{    color: black;    border-color: black;    text-align: center;}.login-heading{    top: -200px;    left: 400px;     transform: translate(-50%,40%);    background-color: rgba(226, 220, 151, 0.411) ;    border: rgba(179, 176, 18, 0.137);    width: 300px;        font-family: 'Times New Roman', Times, serif;    color: black;    font-size: large;    padding: 5px;    border-radius: 5px;}body{    width: 99%;    height: 90%;     color: black;      background-image: url('https://cdn1.vectorstock.com/i/1000x1000/17/80/cloud-computing-icon-vector-361780.jpg');    background-repeat: no-repeat;    background-size: cover;    font-family: 'Times New Roman', imes, serif;    -moz-background-size: cover;    -webkit-background-size: cover;}label{    color: black;}div{    position: relative;}input{    background-color: black(255,255,255,0.2);    border-radius: 5px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: black;    opacity: 100%;.placeholder{    color: black;}input{    background-color: transparent;    color: black;}a{    color: black;   text-decoration: none;}.submit{    background-color: rgba(243, 128, 128, 0.3);    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}#image{    width: 110px;    height: 110px;}        </style>        <br/>        ";
            html = html + "<header><h2><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/adpage' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h2></header>                <h1 align='center'>No Instances are Available </h1>    </head>    <body><div align = 'center'></div><a href='/' style='color: black; text-decoration: underline; margin-left:525'><input type='button' value='Go Back to Home'></a></div><a href='/adpage' style='color: black; text-decoration: underline;'><input type='button' value='Press To Go Back'></a></div></body></html>        ";
        }

        else
        {
        for (let i=0; i<instancesize; i++)
        {
            instancenames[i]=resultinstance[i].instance_name;
            imagenames[i]=resultinstance[i].image_name;
            ipaddresses[i]=resultinstance[i].ip_address;
            flavours[i]=resultinstance[i].flavour;
            keypairs[i]=resultinstance[i].keypair;
        }
    var html = "<html>    <head>        <style>h1{    color: black;}table{    color: black;    border-color: black;    text-align: center;}.login-heading{    top: -200px;    left: 400px;     transform: translate(-50%,40%);    background-color: rgba(226, 220, 151, 0.411) ;    border: rgba(179, 176, 18, 0.137);    width: 300px;        font-family: 'Times New Roman', Times, serif;    color: black;    font-size: large;    padding: 5px;    border-radius: 5px;}body{    width: 99%;    height: 90%;     color: black;      background-image: url('https://cdn1.vectorstock.com/i/1000x1000/17/80/cloud-computing-icon-vector-361780.jpg');    background-repeat: no-repeat;    background-size: cover;    font-family: 'Times New Roman', imes, serif;    -moz-background-size: cover;    -webkit-background-size: cover;}label{    color: black;}div{    position: relative;}input{    background-color: black(255,255,255,0.2);    border-radius: 5px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: black;    opacity: 100%;.placeholder{    color: black;}input{    background-color: transparent;    color: black;}a{    color: black;   text-decoration: none;}.submit{    background-color: rgba(243, 128, 128, 0.3);    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}#image{    width: 110px;    height: 110px;}        </style>        <br/>        ";
    html = html + "<header><h2><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/adpage' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h2></header>                <h1 align='center'>Available Instances</h1>    </head>    <body>        ";
    html = html + "<form method='post'>            <div class='inp'>               <br/><table align='center' border='2px' style='border-radius: 2px; color: black; width:80%; '>                    <tr style='border: 3px solid; border-color: orange;'>                        <th>Instance Name</th>                        <th>Image Name</th><th>IP Address</th>                        <th>Flavour</th><th>Key Pair</th>                       <th>Action</th></tr>";
    for(i=0; i<instancesize; i++)
    {
        html = html + "<tr><td>"+instancenames[i]+"</td><td>"+imagenames[i]+"</td><td>"+ipaddresses[i]+"</td><td>"+flavours[i]+"</td><td>"+keypairs[i]+"</td><td>";
        //<a href='/launch"+i+"'><input type ='button' name='launch' value='Launch' style='background-color: orange; color: white;'></a>&nbsp;&nbsp;&nbsp;
        html = html + "<a href='/admdelete"+i+"'><input type ='button' name='delete' value='Delete' style='background-color: orange; color: white;'></a></td></tr>";
        insname[i]=instancenames[i];
    }
    html = html + "</table></div></form></body></html>";
}
    res.send(html);
});
});

//customerconnect(customer launc/delete instaces)
app.get('/customerconnect', function(req, res)
{
    var sql = "SELECT * From instance";     
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        var instancesize = resultinstance.length;
        
        if(instancesize==0)
        {
            var html = "<html>    <head>        <style>h1{    color: black;}table{    color: black;    border-color: black;    text-align: center;}.login-heading{    top: -200px;    left: 400px;     transform: translate(-50%,40%);    background-color: rgba(226, 220, 151, 0.411) ;    border: rgba(179, 176, 18, 0.137);    width: 300px;        font-family: 'Times New Roman', Times, serif;    color: black;    font-size: large;    padding: 5px;    border-radius: 5px;}body{    width: 99%;    height: 90%;     color: black;      background-image: url('https://cdn1.vectorstock.com/i/1000x1000/17/80/cloud-computing-icon-vector-361780.jpg');    background-repeat: no-repeat;    background-size: cover;    font-family: 'Times New Roman', imes, serif;    -moz-background-size: cover;    -webkit-background-size: cover;}label{    color: black;}div{    position: relative;}input{    background-color: black(255,255,255,0.2);    border-radius: 5px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: black;    opacity: 100%;.placeholder{    color: black;}input{    background-color: transparent;    color: black;}a{    color: black;   text-decoration: none;}.submit{    background-color: rgba(243, 128, 128, 0.3);    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}#image{    width: 110px;    height: 110px;}        </style>        <br/>        ";
            html = html + "<header><h2><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/adpage' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h2></header>                <h1 align='center'>No Instances are Available </h1>    </head>    <body><div align = 'center'></div><a href='/' style='color: black; text-decoration: underline; margin-left:525'><input type='button' value='Go Back to Home'></a></div><a href='/cuspage' style='color: black; text-decoration: underline;'><input type='button' value='Press To Go Back'></a></div></body></html>        ";
        }

        else
        {
        for (let i=0; i<instancesize; i++)
        {
            instancenames[i]=resultinstance[i].instance_name;
            imagenames[i]=resultinstance[i].image_name;
            ipaddresses[i]=resultinstance[i].ip_address;
            flavours[i]=resultinstance[i].flavour;
            keypairs[i]=resultinstance[i].keypair;
        }
    var html = "<html>    <head>        <style>h1{    color: black;}table{    color: black;    border-color: black;    text-align: center;}.login-heading{    top: -200px;    left: 400px;     transform: translate(-50%,40%);    background-color: rgba(226, 220, 151, 0.411) ;    border: rgba(179, 176, 18, 0.137);    width: 300px;        font-family: 'Times New Roman', Times, serif;    color: black;    font-size: large;    padding: 5px;    border-radius: 5px;}body{    width: 99%;    height: 90%;     color: black;      background-image: url('https://cdn1.vectorstock.com/i/1000x1000/17/80/cloud-computing-icon-vector-361780.jpg');    background-repeat: no-repeat;    background-size: cover;    font-family: 'Times New Roman', imes, serif;    -moz-background-size: cover;    -webkit-background-size: cover;}label{    color: black;}div{    position: relative;}input{    background-color: black(255,255,255,0.2);    border-radius: 5px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: black;    opacity: 100%;.placeholder{    color: black;}input{    background-color: transparent;    color: black;}a{    color: black;   text-decoration: none;}.submit{    background-color: rgba(243, 128, 128, 0.3);    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}#image{    width: 110px;    height: 110px;}        </style>        <br/>        ";
    html = html + "<header><h2><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/adpage' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h2></header>                <h1 align='center'>Available Instances</h1>    </head>    <body>        ";
    html = html + "<form method='post'>            <div class='inp'>               <br/><table align='center' border='2px' style='border-radius: 2px; color: black; width:80%; '>                    <tr style='border: 3px solid; border-color: orange;'>                        <th>Instance Name</th>                        <th>Image Name</th><th>IP Address</th>                        <th>Flavour</th><th>Key Pair</th>                       <th>Action</th></tr>";
    for(i=0; i<instancesize; i++)
    {
        html = html + "<tr><td>"+instancenames[i]+"</td><td>"+imagenames[i]+"</td><td>"+ipaddresses[i]+"</td><td>"+flavours[i]+"</td><td>"+keypairs[i]+"</td><td>";
        //<a href='/launch"+i+"'><input type ='button' name='launch' value='Launch' style='background-color: orange; color: white;'></a>&nbsp;&nbsp;&nbsp;
        html = html+"<a href='/delete"+i+"'><input type ='button' name='delete' value='Delete' style='background-color: orange; color: white;'></a></td></tr>";
        insname[i]=instancenames[i];
    }
    html = html + "</table></div></form></body></html>";
}
    res.send(html);
});
});

app.get('/admin', function(req, res)
{
    res.sendFile(__dirname + "/Admin.html");
});

app.get('/pg', function(req, res)
{
    res.sendFile(__dirname + "/Page.html");
});
app.get('/home', function(req, res)
{
    res.sendFile(__dirname + "/Home.html");
});
app.get('/details', function(req, res)
{
    res.sendFile(__dirname + "/Home1.html");
});
app.get('/register', function(req, res)
{
    res.sendFile(__dirname + "/Register.html");
});


//admincreate(admin instance creation)
app.post('/admcreate',function (req,res)
{
    var radflag = 0;
    var admres = req.body.admresname;
    var admkey = req.body.admkeyname;
    var radflav1 = req.body.admflavour;
    console.log(admres,admkey,radflav1);
    if(admres==="" || admkey==="")
    {
        radflag = 1;
    }
    else
    {
        if(radflav1==="cirros and f1")
        {
            console.log(radflav1, "= cirros and f1");
            imagename='cirros';
            flavour='f1';
           var options = { args:[imagename,flavour,admres,admkey]};
           PythonShell.run('new.py',options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);});
            var ip="192.168.31.51";
            var sqlsend = "INSERT into instance values('"+admres+"','"+imagename+"','"+ip+"','"+flavour+"','"+admkey+"')";
            con.query(sqlsend, function (err, result) { 
                res.redirect("/admincrete");
                res.end();
            });
        }
        else if(radflav1==="ubuntu and hdp")
        {
            console.log(radflav1, "= ubuntu and hdp");
            imagename='ubuntu';
            flavour='hdp';
           // const python = spawn('python', ['script1.py'], 'ubuntu', 'hdp', admres, admkey);
           var options = { args:[imagename,flavour,admres,admkey]}; 
           PythonShell.run('new.py',options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);});
           
            var ip="192.168.31.51";
            var sqlsend = "INSERT into instance values('"+admres+"','"+imagename+"','"+ip+"','"+flavour+"','"+admkey+"')";
            con.query(sqlsend, function (err, result) {
                res.redirect("/admincrete");
                res.end();
            });
        }
        else
        {
            radflag = 1;
        }
    }
    if(radflag===1)
    {
        alert("All Fields are Mandatory");
    }
});

// app.post('/cusconnect',function (req,res)
// {
//     var crrpair = req.body.crrpair;
//     var crrkey = req.body.crrkeyname;
//     var radflag3;
//     if(crrpair==="" || crrkey==="")
//     {
//         radflag3 = 1;
//     }
//     else
//     {
//         res.redirect("/");
//         res.end();
//     }
//     if(radflag3===1)
//     {
//         alert("All Fields are Mandatory");
//     }
// });


//cuscreate(Customer Instance Creation)
app.post('/cuscreate',function (req,res)
{
    var cusres = req.body.cusresname;
    var cuskey = req.body.cuskeyname;
    var radflav = req.body.cusflavour;
    console.log(cuskey, cusres, radflav);
    var radflag2;
    if(cusres==="" || cuskey==="")
    {
        radflag2 = 1;
    }
    else
    {
        if(radflav==="cirros and f1")
        {
            console.log(radflav, "= cirros and f1");
            imagename="cirros";
            flavour="f1";
            //const python = spawn('python', ['script1.py'], imagename, flavour, cusres, cuskey);
            var options = { args:[imagename,flavour,cusres,cuskey]};
            PythonShell.run('new.py',options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);});
            var ip="192.168.31.51";
            var sqlsend = "INSERT into instance values('"+cusres+"','"+imagename+"','"+ip+"','"+flavour+"','"+cuskey+"')";
            con.query(sqlsend, function (err, result) {
                res.redirect("/customercrete");
                res.end();
            });
        }
        else if(radflav==="ubuntu and hdp")
        {
            console.log(radflav, "= ubuntu and hdp");
            imagename="ubuntu";
            flavour="hdp";
            //const python = spawn('python', ['script1.py'], imagename, flavour, cusres, cuskey);
            var options = { args:[imagename,flavour,cusres,cuskey]};
            PythonShell.run('new.py',options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);});
                var ip="192.168.31.51";            
                var sqlsend = "INSERT into instance values('"+cusres+"','"+imagename+"','"+ip+"','"+flavour+"','"+cuskey+"')";
            con.query(sqlsend, function (err, result) {
                res.redirect("/customercrete");
                res.end();
            });
        }
        else
        {
            radflag2 = 1;
        }
    }
    if(radflag2===1)
    {
        alert("All Fields are Mandatory");
    }
});

//Register Function
app.post('/regis',function (req,res)
{
    var reguser = req.body.reg_username;
    var regf = req.body.reg_fname;
    var regl = req.body.reg_lname;
    var regpas = req.body.reg_pass;
    var regcon = req.body.reg_cpass;
    var dep = req.body.dept;
    var flag3=0;
    var usname = [];

    if(reguser==="" || regpas==="" || regcon==="" || regf==="" || regl==="" || dep==="")
    {
        //app.use(flash("All Fields are Mandatory"));
        alert("All Fields are Mandatory");
    }
    else
    {
        if(regpas===regcon)
        {
            var sql = "SELECT username From register";     
            con.query(sql, function (err, result) {
                if (err) throw err;
                var size = result.length;
                for (let i=0; i<size; i++)
                {
                    usname[i] = result[i].username;
                }
                for (let i=0; i<size; i++)
                {
                    if(reguser===usname[i])
                    {
                        flag3=1;
                        alert("User already exist with same username");
                    }
                    else
                    {
                        flag3=0;
                    }
                }
                if(flag3===0)
                {
                    var sql1 = "INSERT into register values('"+regf+"','"+regl+"','"+reguser+"','"+regpas+"','"+dep+"')";
                    con.query(sql1, function (err, result) {
                        if (err) throw err;
                        console.log("Customer Registered Successfully");
                        var sql2 = "INSERT into user values('"+reguser+"','"+regpas+"')";
                        con.query(sql2, function (err, result) {
                            if (err) throw err;
                            console.log("User Created Successfully");
                            console.log(result);
                            res.redirect("/");
                            res.end();
                        });
                    });
                }
            });
        }
        else
        {
            alert("Password Does Not Match");
        }
    }
});


//Admin Function
app.post('/admin',function(req, res)
{
    var rname = req.body.ruser;
    var rpas = req.body.rpass;
    auser=rname;
    apass=rpas;
    
    var sql = "SELECT * From admin";

    con.query(sql, function (err, result) {
        if (err) throw err;
        var er=err;
            console.log(result);
            var uname = [];
            var upass = [];
            console.log("Data Retrieved")
            var size = result.length;
            for (let i=0; i<size; i++)
            {
                uname[i] = result[i].username;
                upass[i] = result[i].password;
            }
            console.log(result);
            console.log(uname);
            console.log(upass);
            console.log(rpas);

            if(rname!=="" && rpas!=="")
            {
                    for(let i=0; i<size; i++)
                    {
                        console.log(rname,"=",uname[i])
                        console.log(rpas,"=",upass[i])
                        if(rname===uname[i] && rpas===upass[i])
                        {
                            res.redirect("/adpage");
                            flag = 1;
                        }
                    }        
            }
            else
            {
                alert("All fields are mandatory");
                flag=1;
            }
            if(flag===0)
            {
                alert("Invalid Credentials");
            }
        });
    
});

//User Function
app.post('/User',function(req, res)
{
    var luse = req.body.luser;
    var lpas = req.body.lpass;
    var sql = "SELECT * From user";
    var flag1=0;
    con.query(sql, function(err, data)
    {
        if(err) throw(err);
            var er = err;
            console.log(er);
            console.log(data);
            var luser = [], lpassw = [];
            var size = data.length;
            for(let i=0; i<size; i++)
            {
                luser[i] = data[i].username;
                lpassw[i] = data[i].password;
            }
                if(luse!=="" && lpas!=="")
                {
                    for(let i=0; i<size; i++)
                    {
                        if(luse===luser[i] && lpas===lpassw[i])
                        {
                            res.redirect("/cuspage");
                            res.end();
                            flag1 =1;
                        }
                    }
                }
                else
                {
                    alert("All fields are mandatory");
                    flag1 = 1;
                }
                if(flag1===0)
                {
                    alert("Invalid Credentials");
                }
    })
});

app.post('/user',function(req, res)
{
    res.redirect('/login');
    res.end();
});
app.post('/userlogin',function (req,res)
{
    res.redirect("/register");
    res.end();
});
app.post('/reg',function (req,res)
{
    res.redirect("/");
    res.end();
});
app.post('/disp',function(req, res)
{
    res.write("Hi");
});



var isname='', iname='', iflavour='',ikey='';
//Launch Functions
app.get('/launch0',function (req,res)
{
    insname = instancenames[0];
    iname=imagenames[0];
    iflavour=flavours[0];
    ikey=keypairs[0];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch1',function (req,res)
{
    insname = instancenames[1];
    iname=imagenames[1];
    iflavour=flavours[1];
    ikey=keypairs[1];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch2',function (req,res)
{
    insname = instancenames[2];
    iname=imagenames[2];
    iflavour=flavours[2];
    ikey=keypairs[2];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch3',function (req,res)
{
    insname = instancenames[3];
    iname=imagenames[3];
    iflavour=flavours[3];
    ikey=keypairs[3];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch4',function (req,res)
{
    insname = instancenames[4];
    iname=imagenames[4];
    iflavour=flavours[4];
    ikey=keypairs[4];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch5',function (req,res)
{
    insname = instancenames[5];
    iname=imagenames[5];
    iflavour=flavours[5];
    ikey=keypairs[5];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch6',function (req,res)
{
    insname = instancenames[6];
    iname=imagenames[6];
    iflavour=flavours[6];
    ikey=keypairs[6];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch7',function (req,res)
{
    insname = instancenames[7];
    iname=imagenames[7];
    iflavour=flavours[7];
    ikey=keypairs[7];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch8',function (req,res)
{
    insname = instancenames[8];
    iname=imagenames[8];
    iflavour=flavours[8];
    ikey=keypairs[8];
    res.redirect("/deleted");
    res.end();
});
app.get('/launch9',function (req,res)
{
    insname = instancenames[9];
    iname=imagenames[9];
    iflavour=flavours[9];
    ikey=keypairs[9];
    res.redirect("/deleted");
    res.end();
});


//AdminDelete

app.get('/admdelete0',function (req,res)
{
    insname = instancenames[0];
    iname=imagenames[0];
    iflavour=flavours[0];
    ikey=keypairs[0];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});

app.get('/admdelete1',function (req,res)
{
    insname = instancenames[1];
    iname=imagenames[1];
    iflavour=flavours[1];
    ikey=keypairs[1];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete2',function (req,res)
{
    insname = instancenames[2];
    iname=imagenames[2];
    iflavour=flavours[2];
    ikey=keypairs[2];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete3',function (req,res)
{
    insname = instancenames[3];
    iname=imagenames[3];
    iflavour=flavours[3];
    ikey=keypairs[3];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete4',function (req,res)
{
    insname = instancenames[4];
    iname=imagenames[4];
    iflavour=flavours[4];
    ikey=keypairs[4];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete5',function (req,res)
{
    insname = instancenames[5];
    iname=imagenames[5];
    iflavour=flavours[5];
    ikey=keypairs[5];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete6',function (req,res)
{
    insname = instancenames[6];
    iname=imagenames[6];
    iflavour=flavours[6];
    ikey=keypairs[6];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete7',function (req,res)
{
    insname = instancenames[7];
    iname=imagenames[7];
    iflavour=flavours[7];
    ikey=keypairs[7];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});
app.get('/admdelete8',function (req,res)
{
    insname = instancenames[8];
    iname=imagenames[8];
    iflavour=flavours[8];
    ikey=keypairs[8];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});

app.get('/admdelete9',function (req,res)
{
    insname = instancenames[9];
    iname=imagenames[9];
    iflavour=flavours[9];
    ikey=keypairs[9];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/deleted");
        res.end();
    });
});



//CustomerDelete Functions
app.get('/delete0',function (req,res)
{
    insname = instancenames[0];
    iname=imagenames[0];
    iflavour=flavours[0];
    ikey=keypairs[0];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});

app.get('/delete1',function (req,res)
{
    insname = instancenames[1];
    iname=imagenames[1];
    iflavour=flavours[1];
    ikey=keypairs[1];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete2',function (req,res)
{
    insname = instancenames[2];
    iname=imagenames[2];
    iflavour=flavours[2];
    ikey=keypairs[2];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete3',function (req,res)
{
    insname = instancenames[3];
    iname=imagenames[3];
    iflavour=flavours[3];
    ikey=keypairs[3];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete4',function (req,res)
{
    insname = instancenames[4];
    iname=imagenames[4];
    iflavour=flavours[4];
    ikey=keypairs[4];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete5',function (req,res)
{
    insname = instancenames[5];
    iname=imagenames[5];
    iflavour=flavours[5];
    ikey=keypairs[5];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete6',function (req,res)
{
    insname = instancenames[6];
    iname=imagenames[6];
    iflavour=flavours[6];
    ikey=keypairs[6];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete7',function (req,res)
{
    insname = instancenames[7];
    iname=imagenames[7];
    iflavour=flavours[7];
    ikey=keypairs[7];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});
app.get('/delete8',function (req,res)
{
    insname = instancenames[8];
    iname=imagenames[8];
    iflavour=flavours[8];
    ikey=keypairs[8];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});

app.get('/delete9',function (req,res)
{
    insname = instancenames[9];
    iname=imagenames[9];
    iflavour=flavours[9];
    ikey=keypairs[9];
    var sql = "DELETE from instance where instance_name='"+insname+"' AND image_name='"+iname+"' AND flavour='"+iflavour+"' AND keypair='"+ikey+"'";
    con.query(sql, function (err, resultinstance) {
        if (err) throw err;
        res.redirect("/cusdeleted");
        res.end();
    });
});



app.listen(8080, function(req, res)
{
    console.log("Running..")
});