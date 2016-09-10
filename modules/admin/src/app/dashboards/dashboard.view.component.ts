import { Component, ViewEncapsulation, Input } from "@angular/core";
import { TranslatePipe, TranslateService } from "ng2-translate/ng2-translate";
import { CORE_DIRECTIVES } from "@angular/common";
import { ROUTER_DIRECTIVES, ActivatedRoute } from "@angular/router";
import { Breadcrumb } from "../breadcrumb/breadcrumb.component";
import { Dragula, DragulaService } from "ng2-dragula/ng2-dragula";
import { DropdownDirective } from "ng2-bootstrap/components/dropdown";
import { DashboardService } from "./dashboardService";
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

@Component({
    selector: 'dashboard-view',
    providers: [Breadcrumb],
    template: require('./dashboard.view.html'),
    styles: [
        require('./dashboard.view.scss')
    ],
    directives: [
        ROUTER_DIRECTIVES,
        CORE_DIRECTIVES,
        Breadcrumb,
        Dragula,
        DropdownDirective
    ],
    viewProviders: [
        DragulaService
    ],
    pipes: [TranslatePipe]
})
export class DashboardView {
       private drakes:Array<string> = ["status-bag", "chart-bag"];
    public boxes:Object = {};
    public boxesArr:Array<any> = new Array();
    private firstAdd:boolean = false;

    constructor(public translate:TranslateService,
                public breadcrumb:Breadcrumb,
                private dragulaService:DragulaService,
                private  dashboardService:DashboardService) {
        dragulaService.setOptions('status-bag', {
            direction: 'horizontal'
        });
        dragulaService.setOptions('chart-bag', {
            direction: 'horizontal'
        });

        dragulaService.drop.subscribe((value) => {
            console.log(value);
            this.onDrop(value.slice(1));
        });

        this.dashboardService.getDashboardBoxes().then((res) => {
            this.boxesArr = res;

            //this.updateClasses();
        });
    }

    /**
     * Update boxes order
     *
     * @param $event
     */
    onDrop($event){
        let dom:BrowserDomAdapter = new BrowserDomAdapter();

        let boxList:Array<any> = dom.querySelectorAll(dom.query('#dashboard'), 'div.box');
        let boxList_:Array<any> = Array.prototype.slice.call(boxList);

        for(let item of boxList){
            let boxRid:string = dom.getData(item, 'boxRid');

            for(let originItemKey in this.boxesArr){
                if(this.boxesArr[originItemKey]['@rid'] == boxRid){
                    let domBoxIndex:number = boxList_.indexOf(item);

                    this.boxesArr[originItemKey].order = domBoxIndex;
                }
            }
        }

            //  Update boxes order and update @version of current box array
        this.dashboardService.batchUpdate(this.boxesArr).then((res) => {
            for(let originKey in this.boxesArr){
                for(let item of res){
                    if(this.boxesArr[originKey]['@rid'] == item['@rid']){
                        console.log('Hello');
                        this.boxesArr[originKey]['@version'] = item['@version'];
                    }
                }
            }
        });
    }

    hello(a){
        if(a==true){
            this.firstAdd = true;
            this.updateClasses();
        }
    }

    /**
     * Resize box, add width class to box element, update DB and update @version boxes array
     * @param width
     * @param boxName
     * @param item
     * @param index
     */
    resizeBox(val:Object, boxName:string, item:any, index:number){
        let dom:BrowserDomAdapter = new BrowserDomAdapter();
        let box = dom.query('#dashboard div.box[data-boxrid="'+ this.boxesArr[index]['@rid'] +'"]');
        console.log(box);
        dom.removeAttribute(box, 'class');

        let widthClass, heightClass:string;

        if(val.type == 'width'){
            widthClass = this.getBoxClass(val.width, val.type);
            heightClass = this.getBoxClass(val.height, 'height');
        }

        if(val.type == 'height'){
            heightClass = this.getBoxClass(val.height, val.type);
            widthClass = this.getBoxClass(val.width, 'width');
        }

        this.boxes[boxName] = `${widthClass} ${heightClass}`;

        if(item != undefined){
            this.dashboardService.updateBoxSize({width: val.width, height: val.height}, item).then((res) => {
                this.boxesArr[index]['@version'] = res['@version'];
            });
        }
    }

    getBoxClass(val:number, type:string){
        switch(val){
            case 25:
                return type + '-0';

                break;
            case 50:
                return type + '-1';

                break;
            case 75:
                return type + '-2';

                break;
            case 100:
                return type + '-3';

                break;
        }
    }

    updateClasses(){
        let dom:BrowserDomAdapter = new BrowserDomAdapter();
        for(let key in this.boxesArr){
            let classes:string = '';//this.boxes['box' + key];
            let height:number = this.boxesArr[key].height;

            switch(height){
                case 25:
                    classes = 'height-0';

                    break;
                case 50:
                    classes = 'height-1';

                    break;
                case 75:
                    classes = 'height-2';

                    break;
            }

            let dom:BrowserDomAdapter = new BrowserDomAdapter();
            let box = dom.query('#dashboard div.box[data-boxrid="'+ this.boxesArr[key]['@rid'] +'"]');

            if(box != null){
                dom.addClass(box, classes);
            }
        }
    }

    addClass(currClass:string, addClass:string){
        if(currClass == undefined){
            currClass = '';
        }

        currClass += ` ${addClass}`;

        return currClass;
    }

    /**
     * Remove box from DB. Before deleting start animation
     *
     * @param rid
     */
    removeBox(rid:string, index:number, boxName:string){
        let dom:BrowserDomAdapter = new BrowserDomAdapter();
        let removedObject = dom.querySelector(dom.query('#dashboard'), 'div.box[data-boxRid="'+ rid +'"]');

        dom.on(removedObject, 'transitionend', (e) => {
            this.boxes[boxName] = '';
            this.boxesArr.splice(index, 1);
            console.log('remove');
        });
        this.boxes[boxName] = 'removeBox';

        //this.dashboardService.deleteBox(rid);
    }
}
