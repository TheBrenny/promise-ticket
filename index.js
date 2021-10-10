const EventEmitter = require("events");

function TicketMachine() {
    let emitter = new EventEmitter();
    let nextTicket = 0;
    let currentTicket = 0;
    let skips = [];
    let skipQueue = [];

    const promFn = (resolve) => {
        let num = currentTicket++;
        emitter.once(num, () => resolve(num));
    };
    const generator = (function* () {
        while(true) yield new Promise(promFn);
    })();

    // Someone takes a ticket from the machine
    this.queue = (resolveValue) => {
        let ticketNumber = currentTicket;
        let p = generator.next().value;
        if(resolveValue !== undefined) p = p.then(() => resolveValue);
        if(skipQueue.includes(ticketNumber)) emitter.emit(ticketNumber);
        return p;
    };
    this.take = this.queue;
    // We shout "NEXT" for the next ticket in line
    this.next = (ticketNumber) => {
        if(typeof ticketNumber === "number") skips.push(ticketNumber);
        else ticketNumber = nextTicket++;

        if(ticketNumber >= currentTicket) return false;

        // Skip over the skips
        while(skips.includes(nextTicket)) nextTicket++;
        skips = skips.filter(s => s > nextTicket);

        let didEmit = emitter.emit(ticketNumber);
        return didEmit;
    };
    this.skipQueue = (ticketNumber) => {
        ticketNumber = typeof ticketNumber === "number" ? ticketNumber : currentTicket;
        let didEmit = emitter.emit(ticketNumber);
        if(!didEmit) skipQueue.push(ticketNumber);
        skips.push(ticketNumber);
        return this;
    };

    // Remove everyone from the line by processing their tickets
    this.flush = () => {
        while(this.ticketsRemaining > 0) this.next();
    };

    // Remove everyone from the line reset any counters
    this.restart = () => {
        this.flush();
        nextTicket = 0;
        currentTicket = 0;
        skips = [];
    };

    // How many tickets are still in line?
    Object.defineProperty(this, "ticketsRemaining", {
        get: () => currentTicket - nextTicket - skips.length
    });

    return this;
}

module.exports = TicketMachine;