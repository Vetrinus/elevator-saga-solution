{
    init: function (elevators, floors) {

        let normalizeQueue = function(elevator, direction) {
            let floors = elevator.getPressedFloors();
            floors.sort(function(a, b) {
                return direction ? a-b : b-a
            });

            // elevator.destinationQueue = floors;
            // elevator.checkDestinationQueue();
        };

        let elevatorDispatcher = {
            selectElevator: function (floorNum) {

                let candidate = {
                    elevator: elevators[0],
                    howAppropriate: 0
                };

                elevators.forEach(function (elevator) {
                    let filters = [
                        function (elevator, floorNum) {
                            return elevator.loadFactor() < 1 ? 1 : 0
                        },
                        function(elevator, floorNum) {
                            if(elevator.destinationDirection() === "stopped") {
                                return 100
                            } else {
                                return 0
                            }
                        }
                    ];

                    let howAppropriate = filters.reduce(function (result, filter) {
                        return result + filter(elevator, floorNum)
                    }, 0);


                    if(howAppropriate > candidate.howAppropriate) {
                         candidate.elevator = elevator;
                         candidate.howAppropriate = howAppropriate;
                    }
                });

                return candidate.elevator
            },
        };


        elevators.forEach(function (elevator) {
            elevator.on("floor_button_pressed", function (floorNum) {
                elevator.goToFloor(floorNum);
            })
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function () {
                let elevator = elevatorDispatcher.selectElevator(floor.floorNum());
                elevator.goToFloor(floor.floorNum());
            });
            floor.on("down_button_pressed", function () {
                let elevator = elevatorDispatcher.selectElevator(floor.floorNum());
                elevator.goToFloor(floor.floorNum());
            })
        })
    },
    update: function (dt, elevators, floors) {
        // We normally don't need to do anything here
    },
}