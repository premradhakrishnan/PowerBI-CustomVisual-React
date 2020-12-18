/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";

//base imports for constructor, update method and IVisual base class
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

//Visual Formatting classes, objects and imports
import { VisualSettings } from "./settings";
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

//Data Model
import DataView = powerbi.DataView;

//add below 3 lines
import * as React from "react";
import * as ReactDOM from "react-dom";
import HelloReact from "./helloReact";

import DataViewCategorical = powerbi.DataViewCategorical;

//All visuals start with a class that implements the IVisual interface. 
//You can name the class anything as long as there's exactly one class that implements the IVisual interface.
//The visual class name must match what's defined in the pbiviz.json file.
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;

    private reactRoot: React.ComponentElement<any, any>;

    //a standard constructor to initialize the visual's state
    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);

        this.target = options.element;
        this.updateCount = 0;

        // #2 - add below 2 lines in constructor
        this.reactRoot = React.createElement(HelloReact, {});
        ReactDOM.render(this.reactRoot, this.target);
        
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Update count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);

            const h1: HTMLElement = document.createElement("h1");
            h1.appendChild(document.createTextNode("Hello World..."));
            this.target.appendChild(h1);
        }
    }

    //to update the visual's data
    public update(options: VisualUpdateOptions) {

        const dataView: DataView = options.dataViews[0];

            const categoricalDataView: DataViewCategorical = dataView.categorical;
            
            HelloReact.update({
                labels: categoricalDataView.categories[0].values.toString().split(","),
                labelValues: categoricalDataView.values[0].values.toString().split(",")
            });
        
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    //private function not required for demo
    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    //to return objects to populate the property pane (formatting options) where you can modify them as needed
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): 
            VisualObjectInstance[] | VisualObjectInstanceEnumerationObject 
    {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}