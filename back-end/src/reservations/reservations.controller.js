const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const { as } = require("../db/connection");
/**
 * List handler for reservation resources
 */

//Check if reservation exists
async function reservationExists(req,res,next){
const { reservation_id} = req.params
const reservation = await service.read(reservation_id);
if(reservation){
  res.locals.reservation = reservation;
  return next();
}
next({ status: 404, message: `Reservation ${reservation_id} cannot be found.`});
}

//List Handler for Date
async function list(req, res) {
  const { date } = req.query;
  // console.log("***",date);
  if (date) {
    return res.json({ data: await service.list(date) });
  }
}

//  async function listByDate(req,res){
//     res.json({ data: await service.listByDate(date) });
//   }
//  async function listByPhone(req,res){
//    res.json({ data: await service.listByPhone() });
//  }

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function read(req, res){
  res.json({ data: res.locals.reservation });
}

///////////// CHECK IF FIELD MEETS REQUIREMENTS//////////////

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}
const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);



//VALIDATE IF PEOPLE IS A NUMBER
function validatePeople(req, res, next){
  const {people} = req.body.data;
  if(typeof people !== "number"){
    return next({
      status: 400,
      message: `people should be a number`
    });
  };
  next();
}
//VALIDATE RESERVATION DATE AND TIME FORMAT

function validateDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid date.",
  })
}

function validateTime(req, res, next){
  const regex = "([01]?[0-9]|2[0-3]):[0-5][0-9]";
  const time = req.body.data.reservation_time
  const timeValid = time.match(regex)

  if(timeValid){
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be valid time.",
  })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create:[
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(validatePeople),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(validateTime),
    asyncErrorBoundary(create)],
  read:[asyncErrorBoundary(reservationExists), read],
};
