import 'dotenv/config';

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: "dxtuoottl", 
  api_key: "526664672253944", 
  api_secret:  "byIhKkuGX1UhJyRnI1_LkSPBweI",
});

export {cloudinary}