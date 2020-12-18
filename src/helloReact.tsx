import * as React from "react";

import { VictoryPie, VictoryTheme } from "victory";

export interface DataTable {
    labels: string[],
    labelValues: string[]
}

export const initialState: DataTable = {
    labels: [],
    labelValues: []
}

export class HelloReact extends React.Component<{}, DataTable>{
    constructor(props: any){
        super(props);
        this.state = initialState;
    }

    render(){
        const dataTable: DataTable = this.state;
        
        const rows = [];
        let jsonArray = [];
        for (let index = 0; index < dataTable.labels.length; index++) {
            rows.push(<tr>
                    <td>{dataTable.labels[index]}</td>
                    <td>{dataTable.labelValues[index]}</td>
                </tr>);
                 jsonArray.push({ x: dataTable.labels[index], y: dataTable.labelValues[index] });
        }

        return (
            <div>
                Hello, React!
                <table>
                    <tr>
                        <th>Fiscal Month</th>
                        <th>Sales ($)</th>
                    </tr>
                    { rows }
                </table>

                <VictoryPie 
                    theme={VictoryTheme.material} 
                    startAngle={-90}
                    endAngle={90} 
                    data={jsonArray}
                    />
            </div>
        )
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: DataTable) {
        if(typeof HelloReact.updateCallback === 'function'){
            HelloReact.updateCallback(newState);
        }
    }

    public componentDidMount() {
        HelloReact.updateCallback = (newState: DataTable): void => { 
            this.setState(newState); 
        };
    }

    public componentWillUnmount() {
        HelloReact.updateCallback = null;
    }
}

export default HelloReact;