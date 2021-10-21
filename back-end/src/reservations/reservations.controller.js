const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");
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

//return date and time
 async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

 async function listByDate(req,res){
   res.json({ data: await service.listByDate() });
 }
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

module.exports = {
  list,
  listByDate,
  create:[
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(create)],
  read:[reservationExists, read],
};
