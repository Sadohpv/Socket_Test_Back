import db from "../models/index";
import { io } from "../index";
import { Op } from "sequelize";
import { cloudinary } from "./cloudinary";

const getHomePage = async (req, res) => {
  try {
    let product = await db.Product.findAll({});
    // console.log(product)
    if (product) {
      return res.status(200).json({
        EC: 0,
        product,
      });
    } else {
      return res.status(400).json({
        EC: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
const getCart = async (req, res) => {
  const data = req;

  // console.log(data);
  try {
    let product = await db.Cart.findAll({
      include: [
        {
          // attributes: ["id", "slug"],
          model: db.Product,
        },
      ],
      where: {
        status: 0,
      },
      raw: true,
      nest: true,
    });
    // console.log(product)

    if (product) {
      return res.status(200).json({
        EC: 0,
        product,
      });
    } else {
      return res.status(400).json({
        EC: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const addCart = async (req, res) => {
  const data = req.body.id;
  // console.log(data);
  try {
    let product = await db.Cart.findAll({
      include: [
        {
          attributes: ["id", "slug"],
          model: db.Product,
          where: {
            slug: data,
          },
        },
      ],
      where: {
        status: 0,
      },
      raw: true,
      nest: true,
    });
    // console.log(product)
    if (product) {
      return {
        EC: 0,
        product,
      };
    } else {
      return {
        EC: 1,
      };
    }
  } catch (e) {
    console.log(e);
  }
};

const searchItem = async (req, res) => {
  const data = req.body.key;

  // console.log(data);
  try {
    let product = await db.Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${data}%`,
            },
          },
          {
            slug: {
              [Op.like]: `%${data}%`,
            },
          },
        ],
      },
      raw: true,
      nest: true,
    });
    // console.log(product)

    if (product) {
      return res.status(200).json({
        EC: 0,
        product,
      });
    } else {
      return res.status(400).json({
        EC: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
const addToCart = async (req, res) => {
  const data = req.body.data;
  console.log(data);
  try {
    let product = await db.Product.findOne({
      // include: [
      //   {
      //     // attributes: ["id", "slug"],
      //     model: db.Product,
      //     where: {
      //       slug: data
      //     },
      //   },
      // ],
      where: {
        slug: data,
      },
      raw: true,
      nest: true,
    });
    if (product === null) {
      return res.status(200).json({
        EC: 1,
        message: "Sản phẩm không tồn tại !",
      });
    } else {
      let cart = await db.Cart.findOne({
        where: {
          id_product: product.id,
          status: 0,
        },
        raw: false,
      });
      if (cart === null) {
        if (product.quantity > 0) {
          await db.Cart.create({
            id_product: product.id,
            quantity: 1,
            status: 0,
          });
          return res.status(200).json({
            EC: 2,
            message: "Thêm sản phẩm thành công !",
          });
        } else {
          return res.status(200).json({
            EC: 1,
            message: "Hết hàng !",
          });
        }
      } else {
        
        if (product.quantity >= cart.quantity + 1) {
          cart.quantity = cart.quantity + 1;
          await cart.save();
          return res.status(200).json({
            EC: 0,
            message: "Thêm số lượng sản phẩm !",
          });
        } else {
          return res.status(200).json({
            EC: 1,
            message: "Hết hàng !",
          });
        }
      }
    }

    // if (product) {
    //   return res.status(200).json({
    //     EC: 0,
    //     product,
    //   });
    // } else {
    //   return res.status(400).json({
    //     EC: 1,
    //   });
    // }
  } catch (e) {
    console.log(e);
  }
};
const clear = async (req, res) => {
  let product = await db.Cart.findAll({
    attributes: ["id_product", "quantity"],

    where: {
      status: 0,
    },
    raw: true,
    nest: true,
  });

  if (product) {
    product.map(async (item) => {
      let up = await db.Product.findOne({
        where: {
          id: item.id_product,
        },
        raw: false,
        nest: true,
      });
      if (up) {
        if (up.quantity > 0) {
          up.quantity = up.quantity - item.quantity;
          await up.save();
        }
      }
    });
  }
  let cart = await db.Cart.update(
    { status: 1 },
    {
      where: {
        status: 0,
      },
    }
  );

  // console.log(product);
  return res.status(200).json({
    EC: 0,
    message: "Thanh toán thành công !",
    // result
  });
};
const addProduct = async (req, res) => {
  const data = req.body;
  try {
    const storageImg = await cloudinary.uploader.upload(data.image, {
      folder: "DoAn",
    });
    // console.log(storageImg);
    await db.Product.create({
      slug: data.id,
      name: data.name,
      catelogy: data.cate,
      price: data.price,
      quantity: data.quantity,
      img: storageImg.url,
    });
    return res.status(200).json({
      EC: 0,
      message: "Thêm sản phẩm thành công !",
      // result
    });
  } catch (e) {
    // console.log(e)
    return res.status(200).json({
      EC: 1,
      message: "Có lỗi gì đó xảy ra !",
      // result
    });
  }
};
const getCartCate = async (req, res) => {
  try {
    let product = await db.Product.findAll({
      where: {
        catelogy: req.params.cate,
      },
      raw: true,
      nest: true,
    });
    console.log(product);

    if (product) {
      return res.status(200).json({
        EC: 0,
        product,
      });
    } else {
      return res.status(400).json({
        EC: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
const addQuan = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    let product = await db.Product.findOne({
      where: {
        slug: data.id,
      },
      raw: false,
    
    });
    // console.log(product);

    if (product) {
      product.quantity = product.quantity + (+data.quan);
      await product.save();
      return res.status(200).json({
        EC: 0,
        message:"Nhập hàng thành công",
      });
    } else {
      return res.status(400).json({
        EC: 1,
        message:"Lỗi !",

      });
    }
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  getHomePage,
  getCart,
  addCart,
  searchItem,
  addToCart,
  clear,
  addProduct,
  getCartCate,
  addQuan
};
