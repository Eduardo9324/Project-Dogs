const axios = require('axios');
const express = require('express');
require('dotenv').config();
const router = express.Router();
const { Temper } = require('../db.js');
const { API_KEY } = process.env;


// INSTANCIA DE RUTA (AXIOS)
const dogs = axios.create({
  baseURL: "https://api.thedogapi.com/v1",
});
dogs.defaults.headers.common["api-key"] = API_KEY;


// RUTA GET/temperaments
router.get("/", async (req, res) => {

  try {
    const temp = await dogs.get(`/breeds?api_key=${API_KEY}`);
    const resTemp = await temp.data;
    const temps = resTemp.map((e) => ({ name: e.temperament }));
    const dbTemps = await Temper.bulkCreate(temps);
    res.status(200).json(dbTemps);

  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});



module.exports = router;