const express = require('express');

const app = express();
const PORT = 8080;

const db = require('./connection/db.js');  //import connection db  

app.set('view engine', 'hbs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : false}));

let isLogin = true;

let blogs = [ {
    title: "Database Teknologi data tek 2022",
    content: "freeCodeCamp adalah organisasi nirlaba yang terdiri dari platform web pembelajaran interaktif",
    author: "huri saguCOde",
    postAt: "13 Januari 2022 14:30 WIB ",
    }

]


function getfullTime(time) {
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktobebr", "November", "Desember"];

    let date = time.getDate();
  
    let monthIndex = time.getMonth();
    
    let year = time.getFullYear();
   
    let hours = time.getHours();
  
    let minutes = time.getMinutes();
  
    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
  }


// funtion memiliki2 parameter
app.get('/', function(request, response){
    response.render("index")
});

app.get('/blog', function(request, response){

    // let dataBlogs = blogs.map(function(data){
    //     return {
    //         ...data,
    //         isLogin: isLogin,
    //        }
    // });

    db.connect(function(err, client, done){
        if(err) throw err;

        client.query(`SELECT * FROM tb_blog`, function(err, result){
            if(err) throw err;

            // console.log(rows);
            let data = result.rows
            response.render("blog", {isLogin : isLogin, blogs: data, getfullTime})

        } )

    })
});

app.get('/blog-detail/:id', function(request, response){
    // console.log(request.params);
    let blogId = request.params.id;

    response.render("blog-detail", {blog: {
        id: blogId,
        title: "Database Teknologi 2022",
        author: 'saguCode',
        content: 'freeCodeCamp adalah organisasi nirlaba yang terdiri dari platform web pembelajaran interaktif, forum komunitas online, ruang obrolan, publikasi online, dan organisasi lokal yang bermaksud membuat pengembangan web pembelajaran dapat diakses oleh siapa saja.'
    }});
});


app.get('/add-blog', function(request, response){
    response.render('add-blog');
});

app.post('/blog', function(request, response){
    
     let data = request.body;
    //  console.log(data);
        // console.log(data.inputTitle);
        // console.log(data.inputContent);

     data = {
            title: data.inputTitle,
            content: data.inputContent,
            author: 'huri hidayat',
            postAt: getfullTime(new Date())
        }
        console.log(data);
    
        blogs.push(data);
        console.log(data);

        response.redirect('/blog');
});

app.get('/delete-blog/:index', function(request, response){

        let index = request.params.index;

        blogs.splice(index, 1)

})

app.get('/contact', function(request, response){
    response.render("contact");
});

app.listen(PORT, function(){
    console.log(`server starting in port ${PORT}`);
});