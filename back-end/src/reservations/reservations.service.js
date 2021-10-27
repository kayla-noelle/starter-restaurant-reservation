const knex = require("../db/connection");

function list(date) {
   const query = knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc")
      return query
}

// function listByDate(reservation_date){
//   return knex("reservations")
//   .select("*")
//   .where({reservation_date})
//   .whereNot("status","finished")
//   .andWhereNot("status","cancelled")
//   .orderBy("reservation_time");
// }



function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
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
  create,
  read,
};