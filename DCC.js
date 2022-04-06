//ssh -i ssh-key-2022-03-22.key ubuntu@129.154.226.217 -L 8545:127.0.0.1:8545
//personal.unlockAccount(eth.accounts[0], null, 60000)
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
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "DCC"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
  })
app.use(express.static('Login.html'))
app.use(express.static(__dirname + "Register.html"));
app.use(express.static(__dirname + "Page.html"));
app.use(express.static(__dirname + "add.html"));
app.use(express.static(__dirname + "Success.html"));


app.get('/', function(req, res){
	res.sendFile('Login.html', {root:__dirname})
});
app.get('/register', function(req, res)
{
    res.sendFile(__dirname + "/Register.html");
});
app.get('/page', function(req, res){
	res.sendFile(__dirname + "/Page.html");
});
app.get('/add', function(req, res){
	res.sendFile(__dirname + "/add.html");
});
app.get('/Success', function(req, res){
	res.sendFile(__dirname + "/Success.html");
});


//Blockchain Functions
var abi = [
	{
		"inputs": [],
		"name": "getexpense",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			}
		],
		"name": "storeexpense",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


var address = '0xe35d2a19a902a373905557464fc4d0a5a152f2ec';
var cont_addr = '0xa4ab49d86FA062c8955d2a8ce11660Ac6B65d0F3';
var lsize;

async function getdetails()
{                         
                const Web3 = require('web3');
                var web3 = new Web3('http://localhost:8545')
            var MyContract = new web3.eth.Contract(abi, cont_addr);
            await MyContract.methods.getexpense().call({from: address}, function(err, res)
            {
                if(err) throw err;
                lsize = res[0].length;
                for(let i=0; i<lsize; i++)
                {
                    date[i] = res[0][i];
                    desc[i] = res[1][i];
                    amt[i] = res[2][i];
                    usnam[i] = res[3][i];
                }
            })
            .then(console.log)            
}


async function storedetails()
{           
                const Web3 = require('web3');
                var web3 = new Web3('http://localhost:8545')
            var MyContract = new web3.eth.Contract(abi, cont_addr);
            console.log(edate, edesc, eamt, eusname);
            await MyContract.methods.storeexpense(edate, edesc, eamt, eusname).send({from: address})
            .then(console.log)
}




//Register Function
app.post('/regis',urlencodedParser,function (req,res)
{
    var reguser = req.body.username;
    var regf = req.body.fname;
    var regl = req.body.lname;
    var regpas = req.body.pass;
    var regcon = req.body.cpass;
    var pno = req.body.pno;
    var flag3=0;
    var usname = [];

    if(reguser==="" || regpas==="" || regcon==="" || regf==="" || regl==="" || pno==="")
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
                    var sql1 = "INSERT into register values('"+regf+"','"+regl+"','"+reguser+"','"+pno+"','"+regpas+"')";
                    con.query(sql1, function (err, result) {
                        if (err) throw err;
                        console.log("Customer Registered Successfully");
                            console.log("User Created Successfully with username ", reguser);
                            res.redirect("/");
                            res.end();
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

//Login Function
app.post('/login',urlencodedParser,function (req,res)
{
    var usname = req.body.name;
    eusname = usname;
    var ps = req.body.psd;
    var usern = [], userpass = [];
    var flag = 0;
    var sql = "SELECT * From register";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var size = result.length;
        for (let i=0; i<size; i++)
        {
            usern[i]=result[i].username;
            userpass[i]=result[i].password;
        }

        if(usname!=="" && ps!=="")
        {
            for(let i=0; i<size; i++)
            {
                if(usname==usern[i] && ps==userpass[i])
                {
                    res.redirect("/page");
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
var date =[], desc =[], amt=[], usnam=[];
var date1 =[], desc1 =[], amt1=[], usnam1=[];
app.get('/check',urlencodedParser,async function(req, res)
{
    await getdetails();
    for(let i=0; i<lsize; i++)
    {
        // for(let j=0; j<lsize; j++)
        // {
            if(eusname==usnam[i])
            {
                date1[i] = date[i];
                desc1[i] = desc[i];
                amt1[i] = amt[i];
                usnam1[i] = usnam[i];
                // console.log("i = ",i,date1[i], desc1[i], amt1[i], usnam1[i])
            }
        // }
    }
    lsize = date1.length;

    if(lsize!=0)
            {
                    var html = "<html>    <head>        <title>Check Expenses</title>        <style>body{    background-image: url('https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202106/MIT-Algorand-01_0.jpg?itok=kc8Jm3nW');.custom-select {background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black;height: 42px;  border: solid 2px;  border-color: black;  font-family: 'Times New Roman', Times, serif;  border-radius: 6px;  background-color: #11c7d2;;}    background-repeat: no-repeat;    background-size: cover;} select{background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black; background-color:#11c7d2;}        input{    background-color: white;    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: white;    opacity: 100%;}.placeholder{    color: white;}input{    background-color: transparent;    color: white;}.login-heading{    position: fixed;    top: 10px;    left: 50%;    transform: translate(-50%,40%);    background-color: #192a3aec ;    border: #192a3a;    width: 1000px;        text-align: center;    font-family: 'Times New Roman', Times, serif;    color: white;    font-size: large;    padding: 5px;    border-radius: 5px;}.login-heading input{    background-color: transparent;    color: rgb(10, 10, 10);}::placeholder{    color: rgb(247, 243, 243);    opacity: 100%;}table{    color: black;    border-color: black;    text-align: center;}        </style>";
                    html = html + "<br/><header><h3><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/page' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h3></header>        </head><body><form name='myform' method='post' action='month'><div class='login-heading'>";
                    html = html + "<h1>Expenses</h1><table align='center' border='2px' style='border-radius: 2px; color: white; width:900px; '><tr><th>SI No</th><th>Date</th><th>Amount</th><th>Description</th></tr>";
                    var si = 0;
                    for(let i=0; i<lsize; i++)
                    {
                        if(eusname==usnam[i])
                        {
                            si = si+1;
                            html = html + '<tr><td>'+si+'</td><td>'+date1[i]+'</td><td>'+desc1[i]+'</td><td>'+amt1[i]+'</td></tr>';
                        }
                    }
                    // html = html + "</table><div><a href='/week'><input type ='button' name='weekly' value='Weekly Wages'style='background-color: #11c7d2;'></a>";
                    html = html + "</table>";
                    // html = html + "</table><div><a href = '/week'><button name='weekly'style='background-color: #11c7d2;'>Weekly Expenditure</button><a>";
                    html = html + "<select onchange='this.form.submit()' name='month' class='custom-select' style='width:235px; border-color: black' align='center'><option  value='0'>----Select The Month to check the Expenses----</option><option  value='01'>January</option><option value='02'>February</option><option  value='03'>March</option><option  value='04'>April</option><option  value='05'>May</option><option  value='06'>June</option><option  value='07'>July</option><option  value='08'>August</option><option  value='09'>September</option><option  value='10'>October</option><option  value='11'>November</option><option  value='12'>December</option><br/></div></div></form></body></html>";
                    res.send(html);
            }
            else
            {
                var html = "<html><head><title>Check Expenses</title>        <style>body{    background-image: url('https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202106/MIT-Algorand-01_0.jpg?itok=kc8Jm3nW');.custom-select {background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black;height: 42px;  border: solid 2px;  border-color: black;  font-family: 'Times New Roman', Times, serif;  border-radius: 6px;  background-color: #11c7d2;;}    background-repeat: no-repeat;    background-size: cover;} select{background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black; background-color:#11c7d2;}        input{    background-color: white;    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: white;    opacity: 100%;}.placeholder{    color: white;}input{    background-color: transparent;    color: white;}.login-heading{    position: fixed;    top: 10px;    left: 50%;    transform: translate(-50%,40%);    background-color: #192a3aec ;    border: #192a3a;    width: 1000px;        text-align: center;    font-family: 'Times New Roman', Times, serif;    color: white;    font-size: large;    padding: 5px;    border-radius: 5px;}.login-heading input{    background-color: transparent;    color: rgb(10, 10, 10);}::placeholder{    color: rgb(247, 243, 243);    opacity: 100%;}table{    color: black;    border-color: black;    text-align: center;}        </style>";
                html = html + "<br/><header><h3><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/page' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h3></header>        </head><body><form name='myform' method='post' action='month'><div class='login-heading' style='margin-top:60px'>";
                html = html + "<h1 align='center' style='color:white;'>There are No Transactions</h1>";
                html = html + "</form></body></html>";
                res.send(html);
            }
            
});

app.post('/month',urlencodedParser,function(req, res)
{
    var cnt= [],montht=0;
    var no1;
    var count1 = [];
    var month = ['NULL','January','February','March','April','May','June','July','August','September','October','November','December']
    var mon = req.body.month;
    if(mon == 12 || mon == 11 || mon == 10)
    {
        no1 = mon;
    }
    else
    {
        no1 = mon.slice(1)
    }
    var j=0;
    for(i=0; i<lsize; i++)
    {
        cnt[i] = date[i].slice(5, -3);    
        if(cnt[i]==mon)
        {
            count1[j] = i;
            j++;
            montht = montht + parseInt(amt[i]);
        }
    }

    if(siz!=0)
    {
        var html = "<html>    <head>        <title>Check Expenses</title>        <style>body{    background-image: url('https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202106/MIT-Algorand-01_0.jpg?itok=kc8Jm3nW');.custom-select {background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black;height: 42px;  border: solid 2px;  border-color: black;  font-family: 'Times New Roman', Times, serif;  border-radius: 6px;  background-color: #11c7d2;;}    background-repeat: no-repeat;    background-size: cover;} select{background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black; background-color:#11c7d2;}        input{    background-color: white;    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: white;    opacity: 100%;}.placeholder{    color: white;}input{    background-color: transparent;    color: white;}.login-heading{    position: fixed;    top: 60px;    left: 50%;    transform: translate(-50%,40%);    background-color: #192a3aec ;    border: #192a3a;    width: 1000px;        text-align: center;    font-family: 'Times New Roman', Times, serif;    color: white;    font-size: large;    padding: 5px;    border-radius: 5px;}.login-heading input{    background-color: transparent;    color: rgb(10, 10, 10);}::placeholder{    color: rgb(247, 243, 243);    opacity: 100%;}table{    color: black;    border-color: black;    text-align: center;}        </style>";
    }
    else
    {
        var html = "<html>    <head>        <title>Check Expenses</title>        <style>body{    background-image: url('https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202106/MIT-Algorand-01_0.jpg?itok=kc8Jm3nW');.custom-select {background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black;height: 42px;  border: solid 2px;  border-color: black;  font-family: 'Times New Roman', Times, serif;  border-radius: 6px;  background-color: #11c7d2;;}    background-repeat: no-repeat;    background-size: cover;} select{background-color: white;border-radius: 10px;padding: 10px 15px;margin: 20px 10px;outline: none;border: 2px solid black; background-color:#11c7d2;}        input{    background-color: white;    border-radius: 10px;    padding: 10px 15px;    margin: 20px 10px;    outline: none;    border: 2px solid black;}::placeholder{    color: white;    opacity: 100%;}.placeholder{    color: white;}input{    background-color: transparent;    color: white;}.login-heading{    position: fixed;    top: 10px;    left: 50%;    transform: translate(-50%,40%);    background-color: #192a3aec ;    border: #192a3a;    width: 1000px;        text-align: center;    font-family: 'Times New Roman', Times, serif;    color: white;    font-size: large;    padding: 5px;    border-radius: 5px;}.login-heading input{    background-color: transparent;    color: rgb(10, 10, 10);}::placeholder{    color: rgb(247, 243, 243);    opacity: 100%;}table{    color: black;    border-color: black;    text-align: center;}        </style>";
    }
    html = html + "<br/><header><h3><a href='/' style='color: black; text-decoration: underline; margin-left: 1100px;'>Home</a>&nbsp;<a href='/check' style='color: black; text-decoration: underline; margin-left: 30px;'>Back</a></h3></header><br/><br/>        </head><body><form name='myform' method='post' action='month'><div class='login-heading'>";
    var siz = count1.length;        
    if(siz!=0)
            {
                html = html + "<h1>Expenses in "+month[no1]+"</h1><table align='center' border='2px' style='border-radius: 2px; color: white; width:900px; '><tr><th>SI No</th><th>Date</th><th>Amount</th><th>Description</th></tr>";
                    var si = 0;
                    for(let i=0; i<siz; i++)
                    {
                        if(eusname==usnam[i])
                        {
                            si = si+1;
                            html = html + '<tr><td>'+si+'</td><td>'+date[count1[i]]+'</td><td>'+desc[count1[i]]+'</td><td>'+amt[count1[i]]+'</td></tr>';
                        }
                    }
                    html = html + "</table><br/><br/><h2>Total Expenditure in "+month[no1]+" = "+montht+"</h2></div></div></form></body></html>"
            }
            else
            {
                html = html + "<h1>There are No Transaction in "+month[no1]+"</h1>";
                html = html + "</div></div></form></body></html>";
            }
            res.send(html);

});

var edate, edesc, eamt, eusname;
app.post('/commit',urlencodedParser,function(req, res)
{
    edate = req.body.edate;
    edesc = req.body.edesc;
    eamt = req.body.eamt;
    storedetails();
    res.redirect("/Success")
});

// app.get('/week',urlencodedParser,function(req, res)
// {
//     console.log("Hi");
// });


app.listen(8080, function(req, res)
{
    console.log("Running..")
});