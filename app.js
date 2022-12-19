const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//remove these array and add mongo database
// let itemarray = ["buy food","cook food","eat food"];
// let workarray = [];

//mongoose.connect("mongodb://localhost:27017//");

mongoose.connect("mongodb://localhost:27017/todolistDB", {

        useNewUrlParser: true});

    const itemSchema = new mongoose.Schema({

      name: String

    });
//creating mongoose model
const Item = new mongoose.model("Item",itemSchema)

//adding items
const item1 = new Item ({
	name: "Welcome to todo list",

});
//adding items
const item2 = new Item ({
	name: "Hit the + button to add a new item",

});
//adding items
const item3 = new Item ({
	name: "<-- Hit this to delete an item",

});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name : String,
    items : [itemSchema]
};

const List = mongoose.model("List", listSchema);

//---------------to insert many item at once--------------


app.set('view engine', 'ejs'); //We are telling our server to use EJS template engine in this line

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",function(req,res){
   let today = new Date();
   
   let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
   };

   let day = today.toLocaleDateString("en-US",options);

    //reading from database
    Item.find({},function(err,foundItems){
        if(foundItems.length == 0)
        {
            Item.insertMany(defaultItems, function(err){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Successfully saved all fruits");
                }
            });
            res.redirect("/");
        }
        else
        {
            res.render('list',{
                newtitle: day,
                additems: foundItems});
        }
       
      })

   
});

app.get("/:customListName", function(req, res)
{
    const customlistname = req.params.customListName;
    
    List.findOne({name: customlistname},function(err, foundList)
    {
        if(!err)
        {
            if(!foundList){
                //create a new list
                const list = new List({
                    name : customlistname,
                    items : defaultItems
                });
                list.save();
                res.redirect("/" + customlistname)
            }
            else
            {
                //show an existing list

                res.render("list", {
                    newtitle: foundList.name,
                    additems: foundList.items} )
            }
        }
    })

    
})

app.post("/",function(req,res){
    const itemname = req.body.newitem;

    const anotheritem = new Item ({
        name: itemname,
    });
    anotheritem.save();

    // if(req.body.list == "Work")
    // {
    //   workarray.push(item);
    //   res.redirect("/work");
    // }
    // else{
    //     itemarray.push(item);
    //     res.redirect("/");
    // }
    res.redirect("/");
});

app.post("/delete",function(req, res){
    const checkeditem = req.body.checkbox;
    Item.findByIdAndRemove(checkeditem,function(err){
        if(!err)
        {
            console.log("Successfully removed item");
            res.redirect("/");
        }
    })
})

app.get("/work",function(req,res){
    res.render('list',{
        newtitle: "Work List",
        additems: workarray});
});

app.post("/work",function(req,res){
    let item = req.body.newitem;
    workarray.push(item);
    res.redirect("/work");

})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})