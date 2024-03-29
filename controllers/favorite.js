import { Store } from "../models/Stores.js";

export const AddUserFav = async (req, res, next) => {
  try {
    const { userId, storeId } = req.body;

    // Find the store based on the provided storeId
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if the favorite already exists for the user
    const existingFavorite = store.favorite.find(
      (fav) => fav.user.toString() === userId
    );

    if (existingFavorite) {
      return res.status(409).json({ message: "Favorite already exists" });
    }

    // Add the new favorite
    store.favorite.push({ user: userId, store: storeId });
    await store.save();

 
    res.status(201).json({ message: "Favorite added successfully",
    "Favourite Store" : store.name,
    "Favourite StoreId":storeId,
    userId,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const UnFavorite = async(req,res)=>{
    try {
        const { userId, storeId } = req.body;
    
        // Find the store based on the provided storeId
        const store = await Store.findById(storeId);
        if (!store) {
          return res.status(404).json({ message: "Store not found" });
        }
    
        // Find the index of the favorite to remove
        const favIndex = store.favorite.findIndex(
          (fav) => fav.user.toString() === userId
        );
    
        if (favIndex === -1) {
          return res.status(404).json({ message: "Favorite not found" });
        }
    
        // Remove the favorite
        store.favorite.splice(favIndex, 1);
        await store.save();
    
      
        res.status(200).json(
          {
             message: "Favorite removed successfully",
              "Store Removed From Favourite" : store.name,
              "StoreId":storeId,
               userId, 
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
}

export const GetUserFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find the user's favorite restaurants based on their user ID
    const favorites = await Store.find({ 'favorite.user': userId });

    res.status(200).json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};