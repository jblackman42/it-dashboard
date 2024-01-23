export default class Column {
  constructor({
    title,
    status,
    visibilityCondition = null,
    filter = (ticket, status) => ticket.Status_ID === status,
    sortFunc = (ticketA, ticketB) =>
      parseInt(ticketA.Priority) - parseInt(ticketB.Priority),
    requiredFields = [],
    maxLength = null,
  }) {
    this.title = title;
    this.status = status;
    this.visibilityCondition = visibilityCondition;
    this.filter = (ticket) => filter(ticket, this.status);
    this.sortFunc = sortFunc;
    this.requiredFields = requiredFields;
    this.maxLength = maxLength;
  }
}
