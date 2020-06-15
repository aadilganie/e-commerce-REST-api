require("dotenv").config({ path: "./config/config.env" });
const connectDB = require("./config/db");
const fs = require("fs");

const Shop = require("./model/Shop");
const ShopItem = require("./model/ShopItem");
const User = require("./model/User");

connectDB();

const shopData = JSON.parse(fs.readFileSync("./_data/shops.json", "utf8"));
const shopItemData = JSON.parse(
  fs.readFileSync("./_data/shopItems.json", "utf8")
);
const userData = JSON.parse(fs.readFileSync("./_data/User.json", "utf8"));
const importData = async () => {
  try {
    await Shop.create(shopData);
    await ShopItem.create(shopItemData);
    await User.create(userData);
    console.log("Data imported to database");
    process.exit();
  } catch (error) {
    console.error(error.message);
  }
};

const destroyData = async () => {
  try {
    await Shop.deleteMany();
    await ShopItem.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
} else {
  console.log("NO SUCH COMMAND");
}
