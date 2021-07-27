import React from 'react';

class Test extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    calculateMines = arr => {
        const resultArr = [];
        for (let i=0, x=arr.length; i<x; i++) {
            let row = arr[i].split(",");
            let resultRowArr = [];
            console.log("row to sort", row, arr[i]);
            for (let j=0, y=row.length; j<y; j++) {
                const hPoint =  j;
                const vPoint = i;

                let mines = 0;
                if (row[j-1] && row[j-1] === "X") mines++;

                if (row[j+1] && row[j+1] === "X") mines++;

                if (arr[i-1]) {
                    const rowA = arr[i-1].split(",");
                    if (rowA[j] && rowA[j] === "X") mines++;
                    if (rowA[j-1] && rowA[j-1] === "X") mines++;
                    if (rowA[j+1] && rowA[j+1] === "X") mines++;    
                }

                if (arr[i+1]) {
                    const rowB = arr[i+1].split(",");
                    if (rowB[j] && rowB[j] === "X") mines++;
                    if (rowB[j-1] && rowB[j-1] === "X") mines++;
                    if (rowB[j+1] && rowB[j+1] === "X") mines++;  
                }
                console.log("mines found", mines);
                resultRowArr.push(mines);
            }
            console.log("resulted array", resultRowArr);
            resultArr.push(resultRowArr.toString());
        }
        console.log("result string array", resultArr);
    };

    render() {
        const input = ["XOO", "OOO", "XXO"];
        return (
            <div>
                <button onClick={() => this.calculateMines(input)}>Calculate</button>
            </div>
        )
    }
}

export default Test;