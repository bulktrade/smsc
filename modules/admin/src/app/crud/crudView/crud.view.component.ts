import { Component } from "@angular/core";
import { TranslateService } from "ng2-translate/ng2-translate";
import { Router, ActivatedRoute } from "@angular/router";
import { CrudService } from "../crud.service";

@Component({
    selector: 'crud-view',
    template: require('./crud.view.html'),
    styles: [
        require('./crud.view.scss'),
        require('../common/grid.scss'),
        require('../common/style.scss')
    ],
    providers: [],
})

export class CrudView {
    public resolveData: any;

    constructor(public translate: TranslateService,
                public crudService: CrudService,
                public router: Router,
                public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.resolveData = this.route.snapshot.data['view'];
        this.crudService.gridOptions.columnDefs = this.resolveData;
    }

    navigateToCreate() {
        this.crudService.setModel({});
        this.router.navigate([this.crudService.parentPath, 'create', this.crudService.getClassName()]);
    }

    navigateToDelete() {
        let id = this.crudService.getSelectedRID(this.crudService.gridOptions);

        this.router.navigate([this.crudService.parentPath, 'delete',
            id.join().replace(/\[|\]/gi, '')]);
    }

    clickOnCell(event) {
        if (event.colDef.type === 'LINK' ||
            event.colDef.type === 'LINKSET') {
            this.crudService.setLinkedClass(event.colDef.linkedClass);
            this.crudService.setModifiedRecord({
                data: event.data,
                modifiedLinkset: event.colDef.field,
                type: event.colDef.type,
                from: this.route.component['name']
            });

            this.crudService.navigateToLinkset();
        }
    }
}
