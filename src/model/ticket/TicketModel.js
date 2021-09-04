const { TicketSchema } = require("./TicketSchema");

const insertTicket = (ticketOb) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketOb)
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const getTickets = (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ clientId })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { insertTicket, getTickets };