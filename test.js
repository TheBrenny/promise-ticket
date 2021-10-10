const TicketMachine = require('./index');

let outs = [];
const expected = [
    true,
    true,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    false,
    "skipped queue",
    {obj: "object"},
    1,
    2,
    3,
    50,
    100,
    "Hello",
    "World",
    [1, 2, 3, 4, 5],
];
const cl = (str) => {
    console.log(str);
    outs.push(str);
};
let tm = new TicketMachine();

tm.queue(1).then(cl); // id=0
tm.queue(2).then(cl);
tm.queue(100).then(cl);
tm.queue(3).then(cl);
tm.queue(50).then(cl); // id=4

tm.queue("World").then(cl);
tm.queue("Hello").then(cl);

tm.queue({obj: "object"}).then(cl); // will print second
tm.queue([1, 2, 3, 4, 5]).then(cl); // id=8
tm.skipQueue().queue("skipped queue").then(cl); // will print first
tm.skipQueue(7);

// The first numbers
cl(tm.next());
cl(tm.next());
cl(tm.next(3));
cl(tm.next(4));
cl(tm.next());

// noop
cl(tm.next(100));

// Hello world
cl(tm.next(6));
cl(tm.next());

// array
cl(tm.next());

// No more tickets - false
cl(tm.next());

setTimeout(() => {
    let mismatch = [];
    function didPass() {
        let every = outs.every((v, i) => {
            let o = v;
            let e = expected[i];
            if(typeof o === "object") o = JSON.stringify(o);
            if(typeof e === "object") e = JSON.stringify(e);
            if(o !== e) mismatch.push([v, e]);
            return o === e;
        });
        return every && outs.length === expected.length;
    }

    console.log("------");
    console.log("Did pass");
    console.log(didPass());
    console.log(mismatch);
    console.log("------");
}, 200);