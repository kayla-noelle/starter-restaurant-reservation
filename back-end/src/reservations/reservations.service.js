const knex = require("../db/connection");
//
function list() {
  return knex("reservations")
  .select("*");
}

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0])
}

function read(reservation_id){
    return knex("resevations")
    .select("*")
    .where({reservation_id: reservation_id})
    .first()
}

module.exports = {
  list,
  create,
  read,
};