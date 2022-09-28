const axios = require("axios");
const express = require("express");
require("dotenv").config();
const router = express.Router();
const { Dog } = require("../db.js"); //importo la relacion de la tabla
const { API_KEY } = process.env;

//MIDDLEWARES
//router.use(express.json());
// INSTANCIA DE AXIOS
const dogs = axios.create({
  baseURL: "https://api.thedogapi.com/v1",
});
dogs.defaults.headers.common["api-key"] = API_KEY;

// RUTA /DOGS
router.get("/", (req, res) => {
  dogs
    .get(`/breeds?api_key=${API_KEY}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(404).json(error.toString()));
});

// RUTA /DOGS/search
router.get("/search", async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const res1 = await dogs.get(`/breeds?api_key=${API_KEY}`);
      const myData1 = await res1.data;
      const dataName1 = myData1.filter((e) => e.name === name);
      return res.status(200).send(dataName1);
    } else {
      return res.status(404).json({ error: "Informacion no encontrada." });
    }
  } catch (err) {
    res.status(404).json({ err: err.toString() });
  }

  /* const res1 = await dogs.get(`/breeds?api_key=${API_KEY}`);
  const myData = await res1.data;
  const dataName = myData.filter((e) => e.name === name);
  return dataName.length > 0 ? res.status(200).send(dataName) : res.status(404).json({ error: "Data no encontrada"}) */
});


// RUTA/dogs/{idRaza}
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const res2 = await dogs.get(`/breeds?api_key=${API_KEY}`);
    const myData2 = await res2.data;
    const dataId = myData2.filter((e) => e.id === parseInt(id)).map((item) => ({
      image: item.image,
      name: item.name,
      temperament: item.temperament,
      height: item.height,
      weight: item.weight,
      life_span: item.life_span,
    }));
    res.status(200).send(dataId);

  } catch (err) {
    res.status(404).json({ err: err.toString() });
  }
  }
);


//RUTA POST/DOGS
router.post("/", async (req, res) => {
  const { name, height, weight, life_span } = req.body;

  try {
    const newDog = await Dog.create({
      name,
      height,
      weight,
      life_span
    })
    res.status(200).json(newDog);

  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});




module.exports = router;