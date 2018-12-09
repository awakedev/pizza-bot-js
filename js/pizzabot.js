// node command line arguments
const args = process.argv;

// capturing the ‘user supplied’ argument.
let usrInput = args[2];

// global variables
let itinerary = '';
let start = [0, 0];

// mapping key:value pairs
const zone = new Map([
    ['north', 'N'],
    ['south', 'S'],
    ['west', 'W'],
    ['east', 'E'],
    ['drop', 'D']
]);

const main = (usrInput) => {
    alertInputError()

    // store user input as 'orders/coords'
    const pizzaOrders = getPizzaOrders(usrInput);
    for (let address of pizzaOrders) {
        // Mapping coordinates 
        // Start X,Y = 0
        let [startX, startY] = start,
        [addrX, addrY] = address;

        // Zone orientation
        let orientX = getOrientation('x', startX, addrX),
            orientY = getOrientation('y', startY, addrY);

        // Output journey
        outputItinerary(startX, addrX, orientX, startY, addrY, orientY)

        start = address.slice();

        dropPizza()
    }
    return itinerary;
}

function alertInputError() {
    if (!checkusrInputFormat(usrInput))
        return 'Error, Please check input:';
    else {
        console.log("\n'Slice Pizza Bot started - Below is the current itinerary:\n")
    }
}

const outputItinerary = (startX, addrX, orientX, startY, addrY, orientY) => {
    while (startX !== addrX) {
        itinerary += orientX;
        (startX < addrX) ? startX++ : startX--;
    }

    while (startY !== addrY) {
        itinerary += orientY;
        (startY < addrY) ? startY++ : startY--;
    }
}

// Drop pizza when reached target itinerary
const dropPizza = () => itinerary += 'D';

// Strip user input so that ready for mapping
const getPizzaOrders = (usrInput) => usrInput.slice(usrInput.indexOf('(') + 1, -1).split(') (').map(e => {
    return e.split(', ').map(e => Number(e))
});


const getOrientation = (axis, start, end) => {
    // local instance of 'zone'
    let navZone = zone;
    
    if (axis === 'x')

    // Navigate horizontally to reach end dest.
     return (start < end) ? navZone.get('east') : navZone.get('west');

    // Navigate vertically to reach end dest.
    return (start < end) ? navZone.get('north') : navZone.get('south');
}


const checkusrInputFormat = (usrInput) => {
    // Check bracket format
    if (usrInput.indexOf('(') < 0 || usrInput.indexOf(')') < 0)
        return false;

    checkCoordinates()
    return true;
}


// Check coordinate format
const checkCoordinates = () => {
    usrInput = usrInput.slice(4);
    if (usrInput[0] !== '(' || usrInput[usrInput.length - 1] !== ')')
        return false;
}


console.log(main(usrInput));