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
  .andWhereNot("status","cancelled")
  .orderBy("reservation_time")
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
  create,
  read,
};