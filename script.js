
const e = require('express');
const path = require('path')
const app = e();
const fs = require('fs');
app.set('view engine','ejs')
app.use(e.json());
app.use(e.urlencoded({extended: true }));
app.use(e.static(path.join(__dirname,'public')));

app.get("/",function(req,res){
    fs.readdir(`./files`,function(err,files){
        
        res.render("index", { files: files });

    } );
});

app.get("/edit/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            return res.send("Error reading file.");
        }
        res.render("edit", { filename: req.params.filename, filedata: filedata });
    });
});


app.get("/delete/:filename", function (req, res) {
    let filepath = `./files/${req.params.filename}`;
    fs.unlink(filepath, function (err) {
        if (err) return res.status(500).send("Error deleting file.");
        res.redirect("/");
    });
});
app.post("/update/:filename", function(req, res) {
    let oldFilename = req.params.filename;
    let newFilename = req.body.title.trim().replace(/\s+/g, '') + ".txt"; // Remove spaces
    let newContent = req.body.desc;
    let oldFilePath = `./files/${oldFilename}`;
    let newFilePath = `./files/${newFilename}`;
    fs.writeFile(oldFilePath, newContent, function(err) {
        if (err) {
            return res.send("Error updating file.");
        }
        if (oldFilename !== newFilename) {
            fs.rename(oldFilePath, newFilePath, function(err) {
                if (err) {
                    return res.send("Error renaming file.");
                }
                return res.redirect("/");
            });
        } else {
            return res.redirect("/");
        }
    });
});

app.get('/files/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render("get",{filename: req.params.filename,filedata:filedata});
    });
})

app.post("/create",function(req,res){
        fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.desc,function(err){
            res.redirect("/")
        })
});
app.listen(4000);
