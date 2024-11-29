const { request, response } = require("express");
const db = require("../models");
const { where } = require("sequelize");

// create main Model
const Cylinder = db.cylinders;

//main work

// 1. create cylinder

const addCylinder = async (request, response) => {
  let info = {
    id: request.body.id,
    // position: request.body.position,
    radiusTop: request.body.radiusTop,
    radiusBottom: request.body.radiusBottom,
    height: request.body.height,
    radialSegments: request.body.radialSegments,
    heightSegments: request.body.heightSegments,
  };

  const cylinder = await Cylinder.create(info);
  response.status(200).send(cylinder);
};

//2. get all cylinders

const getAllCylinders = async (request, response) => {
  let cylinders = await Cylinder.findAll({
    //here i write which ever attribute i am interested in
    // attributes: ["id", "radiusTop"],
  });
  response.status(200).send(cylinders);
};

//3. get single cylinder

const getSingleCylinder = async (request, response) => {
  let id = request.params.id;
  let cylinder = await Cylinder.findOne({
    where: { id: id },
  });
  response.status(200).send(cylinder);
};

//4. update cylinder

const updateCylinder = async (request, response) => {
  let id = request.params.id;

  const cylinder = await Cylinder.update(request.body, { where: { id: id } });
  response.status(200).send(cylinder);
};

//5. delete cylinder

const deleteCylinder = async (request, response) => {
  let id = request.params.id;
  await Cylinder.destroy({
    where: { id: id },
  });
  response.status(200).send("cylinder deleted successfully");
};

module.exports = {
  addCylinder,
  getAllCylinders,
  getSingleCylinder,
  updateCylinder,
  deleteCylinder,
};
