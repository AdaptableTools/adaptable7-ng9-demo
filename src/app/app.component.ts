// app.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  GridApi,
  GridOptions,
  Module,
  ColDef,
} from '@ag-grid-community/all-modules';
import { AllEnterpriseModules } from '@ag-grid-enterprise/all-modules';
import {
  AdaptableOptions,
  AdaptableToolPanelAgGridComponent,
  PredicateDefHandlerParams,
} from '@adaptabletools/adaptable-angular-aggrid';

import { orders } from './ordersData';

const MAX_DATA_COUNT = 100;
orders.length = Math.min(MAX_DATA_COUNT, orders.length);

@Component({
  selector: 'adaptable-root',
  template: `
    <adaptable-angular-aggrid
      [adaptableOptions]="adaptableOptions"
      (adaptableReady)="adaptableReady($event)"
      [gridOptions]="gridOptions"
      [modules]="agGridModules"
    >
    </adaptable-angular-aggrid>
    <ag-grid-angular
      [gridOptions]="gridOptions"
      [rowData]="rowData"
      [modules]="agGridModules"
      style="flex: 1"
      class="ag-theme-balham"
    >
    </ag-grid-angular>
  `,
  styles: [
    `
      :host {
        height: 100vh;
        display: flex;
        flex-flow: column;
      }
    `,
  ],
})
export class AppComponent {
  public gridApi: GridApi;
  public agGridModules: Module[] = AllEnterpriseModules;
  public gridColumnApi;
  public columnDefs;
  public rowData: any[];
  public gridOptions: GridOptions;

  public adaptableOptions: AdaptableOptions = {
    primaryKey: 'OrderId',
    userName: 'demo user',
    adaptableId: 'Adaptable7 Angular9 Demo',
    userInterfaceOptions: {
      showAdaptableToolPanel: true,
    },
    customPredicateDefs: [
      {
        id: 'new_starter',
        label: 'OrderCost > 500 & PackageCost < 10',
        columnScope: { ColumnIds: ['CompanyName'] },
        functionScope: ['filter'],
        handler(params: PredicateDefHandlerParams) {
          const rowData = params.node.data;
          return rowData.OrderCost > 500 && rowData.PackageCost < 10;
        },
      },
    ],
    predefinedConfig: {
      Query: {
        Revision: 5,
        SharedQueries: [
          {
            Name: 'Employee starting with M',
            Expression: 'STARTS_WITH([Employee], "M")',
          },
          {
            Name: 'Orders greater than 500',
            Expression: '[OrderCost] > 500',
          },
        ],
      },
    },
  };

  constructor(private http: HttpClient) {
    this.http = http;

    this.columnDefs = [
      { field: 'OrderId', type: 'abColDefNumber', resizable: true },
      { field: 'CompanyName', type: 'abColDefString' },
      { field: 'ContactName', type: 'abColDefString' },
      { field: 'Employee', type: 'abColDefString' },
      { field: 'OrderCost', type: 'abColDefNumber' },
      { field: 'ItemCost', type: 'abColDefNumber' },
      { field: 'PackageCost', type: 'abColDefNumber' },
    ].map((c: ColDef) => {
      c.filter = true;
      c.floatingFilter = true;
      return c;
    });

    this.gridOptions = {
      enableRangeSelection: true,
      sideBar: true,
      components: {
        AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
      },
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      onGridReady: this.onGridReady,
    };
  }

  adaptableReady = ({ adaptableApi, vendorGrid }) => {
    console.log({ adaptableApi, vendorGrid });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    setTimeout(() => {
      this.gridApi.setRowData(orders);
    }, 500);
  };
}
