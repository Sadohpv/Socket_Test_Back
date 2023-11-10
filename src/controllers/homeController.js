import db from "../models/index";
import { io } from "../index";
import { Op } from "sequelize";
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
const addToCart = async(req,res)=>{
  const data=req.body.data;
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
        slug:data
      },
      raw: true,
      nest: true,
    });
    if(product === null){
      return res.status(200).json({
        EC:1,
        message:"Sản phẩm không tồn tại !",
      })
    }else{
      let cart = await db.Cart.findOne({
       
        where: {
          id_product:product.id,
        },
        raw: false,
        
      });
      if(cart === null ){
        await db.Cart.create({
          id_product: product.id,
          quantity:1,
          status:0,
        });
        return res.status(200).json({
          EC: 2,
          message:"Thêm sản phẩm thành công !",
        })
      }else{
          cart.quantity = cart.quantity + 1;
          await cart.save();
          return res.status(200).json({
            EC: 0,
            message:"Thêm số lượng sản phẩm !",
          })
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
}
module.exports = {
  getHomePage,
  getCart,
  addCart,
  searchItem,
  addToCart
};
