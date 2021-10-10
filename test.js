const TicketMachine = require('./index');

const cl = console.log;
let tm = new TicketMachine();

tm.queue(1).then(cl);
tm.queue(2).then(cl);
tm.queue(100).then(cl);
tm.queue(3).then(cl);
tm.queue(50).then(cl);
tm.queue("World").then(cl);
tm.queue("Hello").then(cl);
tm.queue({obj: "object"}).then(cl);
tm.queue([1, 2, 3, 4, 5]).then(cl);

cl(tm.next());
cl(tm.next());
cl(tm.next(3));
cl(tm.next(4));
cl(tm.next());
cl(tm.next(100));
cl(tm.next(6));
cl(tm.next());
cl(tm.next());
cl(tm.next());
cl(tm.next());

// Outputs:
// true
// true
// true
// true
// true
// false
// true
// true
// true
// true
// false
// 1
// 2
// 3
// 50
// 100
// "Hello"
// "World"
// {obj: "object"}
// [1, 2, 3, 4, 5]