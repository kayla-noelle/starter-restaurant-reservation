const knex = require("../db/connection");
//
function list() {
  return knex("reservations")
  .select("*");
}

function listByDate(reservation_date){
  return knex("reservations")
  .select("*")
  .where({reservation_date})
  .whereNot("status","finished")
  .orderBy("reservation_time","asc")
}

function listByPhone(mobile_number){
  return knex("reservations")
  .whereRaw(
    "translate(mobile_number, '() -', '') like ?",
    `%${mobile_number.replace(/\D/g, "")}%`
  )
  .orderBy("reservation_id");
}

function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning(newReservation,"*")
    .then((createdReservations) => createdReservations[0])
}

function read(reservation_id){
    return knex("reservations")
    .select("*")
    .where({"reservation_id": reservation_id})
    .first()
}

module.exports = {
  list,
  listByDate,
  listByPhone,
  create,
  read,
};