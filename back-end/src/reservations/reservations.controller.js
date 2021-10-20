const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */

//Check if reservation exists
async function reservationExists(req,res,next){
const reservation = await service.read(req.params.reservation_id);
if(reservation){
  res.locals.reservation = reservation;
  return next();
}
next({ status: 404, message: `Reservation ${req.params.reservation_id} cannot be found.`});
}

 async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function read(req, res){
  res.json({ data: res.locals.reservation });
}

///////////// CHECK IF FIELD MEETS REQUIREMENTS//////////////
// const VALID_PROPERTIES = [
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
//   "status",
// ];

// function hasOnlyValidProperties(req, res, next) {
//   const { data = {} } = req.body;

//   const invalidFields = Object.keys(data).filter(
//     (field) => !VALID_PROPERTIES.includes(field)
//   );

//   if (invalidFields.length)
//     return next({
//       status: 400,
//       message: `Invalid field(s): ${invalidFields.join(", ")}`,
//     });
//   next();
// }





module.exports = {
  list,
  create:[asyncErrorBoundary(create)],
  read:[reservationExists, read],
};
