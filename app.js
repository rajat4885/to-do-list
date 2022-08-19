const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rajat:text123@cluster0.a2zeddy.mongodb.net/todolistDB",{useNewUrlParser: true});


const listschema = new mongoose.Schema({
  name: String,
});

const item = mongoose.model("list", listschema);
const item1 = new item({
  name: "GO TO GYM",
});

const item2 = new item({
  name: "EAT BREAKFAST",
});

const item3 = new item({
  name: "GO TO JOB",
});
var newitems = [item1, item2, item3];

app.get("/", function (req, res) {
  item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      item.insertMany(newitems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("succesfully inserted to our db");
        }
      });
      res.redirect("/");
    } else {
      res.render("app.ejs", { key: "⭐Today⭐", key2: founditems });
    }
  });
});

const customschema = new mongoose.Schema({
  name: String,
  items: [listschema],
});

const custom = mongoose.model("custom", customschema);

app.get("/:CustomListName", function (req, res) {
  const customlist = req.params.CustomListName;
  custom.findOne({ name: customlist }, function (err, foundlist) {
    if (!err) {
      if (!foundlist) {
        const custom1 = new custom({
          name: customlist,
          items: newitems,
        });
        custom1.save();
        res.redirect("/" + customlist);
      } else {
        res.render("app.ejs", { key: foundlist.name, key2: foundlist.items });
      }
    }
  });
});
app.post("/", function (req, res) {
  const newinput = req.body.input;

  const item4 = new item({
    name: newinput,
  });

  item4.save();
  res.redirect("/");
});
app.post("/delete", function (req, res) {
  const deleteItem = req.body.checkbox;
  item.findByIdAndRemove(deleteItem, function (err) {
    if (!err) {
      console.log("succesfully removed and resolved");
      res.redirect("/");
    }
  });
});
let port= process.env.PORT;
if(port==null|| port==''){
  port=3000;
}
app.listen(port, function () {
  console.log("server started at port 3000");
});
