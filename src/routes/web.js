import express from "express";
import homeController from "../controllers/homeController";

const router = express.Router();

const initWebRoutes = (app,io) => {
    router.get('', homeController.getHomePage);
    router.post('/search', homeController.searchItem);

    router.get('/cart', homeController.getCart);
    router.get('/cate/:cate', homeController.getCartCate);
    
    router.post('/addCart',async (req,res)=>{
        const result = await homeController.addCart(req,res);
        // console.log(result);
        if(result.EC === 0){
            const text = req.body.id;
            io.emit("sendDataServer", { text });
        }
        return res.status(200).json({
            EC:0,
            OK:"OK",
         
          });
    });

    router.post('/addToCart',homeController.addToCart);
    router.post('/addQuan',homeController.addQuan);

    router.post('/addProduct', homeController.addProduct);
   
    router.get('/clear',homeController.clear);
    return app.use('/', router);
};

export default initWebRoutes;
