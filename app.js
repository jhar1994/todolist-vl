const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
// const date = require(__dirname + "/date.js");


const app = express();
// let items=["Buy Food","Cook Food","Eat Food"];
// let workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extend: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true })
const itemsSchema = {
  name:String,
};

const Item = mongoose.model("Item",itemsSchema);
const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit the + button to aff a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];
const listSchema ={
  name: String,
  items: [itemsSchema]
};

const List =mongoose.model("List",listSchema);

app.get("/", function(req, res) {
  // res.render("list", {ListTitle: date.getDate(), NewListItems: items});
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else{
          console.log("Successfully insert on the document")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {ListTitle: "Today", NewListItems: foundItems});
    }

  });

});



app.post("/",function(req, res){
  const item= new Item ({
    name:req.body.newItem
  });
  const listName=req.body.list;
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name:listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }

});

app.post("/delete",function(req, res){
  const checkedItemId= req.body.checkbox;
  const listName=req.body.listName;
   if(listName === "Today"){
     Item.findByIdAndRemove(checkedItemId,function(err){
       if(err){
         console.log(err);
       } else {
         console.log("Successfully delete on the database")
         res.redirect("/")
       }
     });

   } else {
     List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}, function(err,foundList){
       if(!err){
         res.redirect("/"+listName);
       }

     });
   }

});


app.get("/:customListName",function(req, res){

   const customListName = _.capitalize(req.params.customListName);

   List.findOne({name: customListName},function(err,foundList){
     if(!err){
       if (!foundList){
         const list = new List({
            name:customListName,
            items: defaultItems
         });

         list.save();
         res.redirect("/"+customListName);
       } else {
         res.render("list",{ListTitle: foundList.name, NewListItems: foundList.items});
         // res.redirect("/:customListName")
     }
    }
   });

   // res.redirect("/:customListName");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
