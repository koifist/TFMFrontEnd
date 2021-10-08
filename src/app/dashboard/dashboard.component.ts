import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AssetsService } from '../services/assets.service';
import { DashboardService } from '../services/dashboard.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {
  Color,
  Label,
  PluginServiceGlobalRegistrationAndOptions,
} from 'ng2-charts';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public incMonthData: ChartDataSets[] = [];
  public incMonthLabels: Label[] = [];
  public incMonthOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black' },
          gridLines: { color: 'transparent' },
        },
      ],
      yAxes: [
        {
          ticks: { fontColor: 'black', maxTicksLimit: 8 },
          gridLines: { color: 'black' },
        },
      ],
    },
    plugins: {
      datalabels: {
        display: false,
        anchor: 'start',
        align: 'top',
        rotation: 320,
        clamp: true,
        font: {
          weight: 'bold',
          size: 13,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 30,
        bottom: 20,
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
  };
  public incAssetOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx?.chart?.data?.labels
            ? ctx.chart.data.labels[ctx.dataIndex]
            : '';
          return label;
        },
      },
    },
  };
  public incMonthType: ChartType = 'line';
  public incAssetType: ChartType = 'pie';
  public incMonthLegend = false;
  public incAssetLegend = true;
  public incMonthColors: Color[] = [
    {
      backgroundColor: 'transparent',
      borderColor: 'rgb(16, 2, 217)',
      pointBackgroundColor: 'rgb(16, 2, 217)',
    },
  ];
  public incAssetColors: Color[] = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.3)',
        'rgba(60,179,113,0.3)',
        'rgba(255,165,0,0.3)',
        'rgba(0,0,255,0.3)',
        'rgba(238,130,238,0.3)',
        'rgba(106,90,205,0.3)',
      ],
    },
  ];

  public incAssetData: ChartDataSets[] = [];
  public incAssetLabels: Label[] = [];

  displayedColumns: string[] = [
    'status',
    'name',
    'assetType',
    'criticality',
    'mtd',
    'rto',
  ];
  dataSource = new MatTableDataSource<Object>([]);
  private paginator!: MatPaginator;
  private sort!: MatSort;
  public user: any;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    if (this.dataSource !== undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  public assetTypes = [];
  public loading = true;
  public criticality = environment.criticality;
  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private assetService: AssetsService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Object>([]);
    this.getAssetsTypes();
    this.getDashboardInfo();
  }
  getDashboardInfo() {
    this.loading = true;
    this.dashboardService
      .getDashboardInfo()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.setIncMonthData(res.incidentesMonth);
          this.setIncAssetData(res.incidentsAssetType);
          this.setAssets(res.assetsDisabled);
          this.loading = false;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  getAssetsTypes() {
    this.assetService
      .getAssetTypes()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.assetTypes = res;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  setAssets(assets: any) {
    this.dataSource = new MatTableDataSource<Object>(assets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  setIncMonthData(data: any) {
    this.incMonthData = [{ data: _.map(data, 'value'), label: 'Amazon' }];
    this.incMonthLabels = _.map(data, (elem) => {
      return moment(elem['label']).locale(navigator.language).format('L');
    });
  }
  setIncAssetData(data: any) {
    this.incAssetData = [{ data: _.map(data, 'value'), label: 'Amazon' }];
    this.incAssetLabels = _.map(data, (data) => {
      return this.translate.instant('constants.' + data['label']);
    });
  }
}
