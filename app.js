const express = require("express");
const app = express();

const path = require('path');

app.set("view engine", "pug");
app.set("views", "./views"); // default


const bodyParser = require("body-parser");


const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");


const errorsController = require("./controllers/errors");
const sequileze = require("./utility/database");

const Category = require('./models/category');
const Product = require('./models/product');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use(errorsController.get404Page);

// Product.hasOne(Category); Aynısı
Product.belongsTo(Category, {
    foreignKey: {
        allowNull: false
    }
});
Category.hasMany(Product)

sequileze
    // .sync({ force: true })
    .sync()
    .then(() => {
        Category.count()
            .then(count => {
                if (count === 0) {
                    Category.bulkCreate([
                        { name: 'Telefon', description: 'telefon kategorisi' },
                        { name: 'Bilgisayar', description: 'bilgisayar kategorisi' },
                        { name: 'Elektronik', description: 'elektronik kategorisi' },
                    ]);
                }
            })

    }).catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Listening on port 3000");
});