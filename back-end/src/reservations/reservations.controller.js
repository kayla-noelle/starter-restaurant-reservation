const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
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
 async function listByPhone(req,res){
   res.json({ data: await service.listByPhone() });
 }

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function read(req, res){
  res.json({ data: res.locals.reservation });
}

///////////// CHECK IF FIELD MEETS REQUIREMENTS//////////////


///// Check to see if Data is missing///////
function hasData(req,res, next){
  const data = req.body.data
  if(data){
    next();
  }
  next({
    status: 400,
    message:"Body must have data property"
  })

}




module.exports = {
  list,
  listByDate,
  listByPhone,
  create:[hasData, asyncErrorBoundary(create)],
  read:[reservationExists, read],
};
